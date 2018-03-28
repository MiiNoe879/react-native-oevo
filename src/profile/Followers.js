//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity,StatusBar, NativeModules,AsyncStorage, ScrollView,Switch } from 'react-native';
import {Actions} from 'react-native-router-flux';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import styles from './../style';
import Spinner from './../common/Spinner';
import SpinnerBig from './../common/SpinnerBig';
import IconF from 'react-native-vector-icons/FontAwesome';

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';
import FastImage from 'react-native-fast-image';

//create componet
class Followers extends Component{
    constructor(props) {
        super(props);
        this.state = {
            type_tx:'',
            s_type:'',
            username:'',
            offsetY: 0,
            scrollViewY: 0,
            scrollViewHeight: 0,
            closeToBottom:false,
            wPage:1,
            page:1,
            pageLoading:true,
            isEnded:false,
            creators:[],
            allcreators:[],
            loggedUser:'',

            users:[],
            following:[],
        };
    }


    componentWillMount(){ var thisClass=this;
        AsyncStorage.getItem('username').then((username) => { 
            if(username){
                getUsers().then(snap=>{thisClass.setState({users:snap}); });
                getFollowing(username,'following').then(res=>{
                    res.push(username);thisClass.setState({following:res}); 

                    thisClass.setState({loggedUser:username,username:thisClass.props.username},()=>thisClass.loadCreators(1));
                });
            }else{ Actions.signin(); }
        });
    }


    loadCreators(page){ var thisClass=this;
        if(thisClass.props.s_type=='followers'){
            db.child('subscribers').orderByChild('following').equalTo(thisClass.state.username).once('value',snapData=>{
                var following=thisClass.state.following;
                if(snapData.val()){
                    var resData=[];
                    snapData.forEach(function(data) {
                        if(data.val()){ var getData=data.val();
                            var creator={};
                            if(getData.followed_by && getData.followed_by!=thisClass.state.loggedUser){
                                creator=thisClass.getUserData(getData.followed_by);
                                if(creator){
                                    creator.followed_by=getData.followed_by;
                                    creator.following=getData.following;
                                    creator.isFollowing='no';
                                    if(following.indexOf(creator.username) != -1){
                                        creator.isFollowing='yes';
                                    }
                                    resData.push(creator);
                                }
                            }
                            
                        }
                    });
                }
                resData=thisClass.arrayUnique(resData);
                thisClass.setState({allcreators:resData, pageLoading:false});
                thisClass.loadRealCreators(thisClass.state.page);
            });
        }else{
            db.child('subscribers').orderByChild('followed_by').equalTo(thisClass.state.username).once('value',snapData=>{
                var following=thisClass.state.following;

                if(snapData.val()){
                    var resData=[];
                    snapData.forEach(function(data) {
                        if(data.val()){ var getData=data.val();
                            var creator={};
                            if(getData.following && getData.following!=thisClass.state.loggedUser){
                                creator=thisClass.getUserData(getData.following);
                                if(creator){
                                    creator.followed_by=getData.followed_by;
                                    creator.following=getData.following;
                                    creator.isFollowing='no';
                                    if(following.indexOf(creator.username) != -1){
                                        creator.isFollowing='yes';
                                    }
                                    resData.push(creator);
                                }
                            }
                            
                        }
                    });
                    resData=thisClass.arrayUnique(resData);
                    thisClass.setState({allcreators:resData, pageLoading:false});
                    thisClass.loadRealCreators(thisClass.state.page);
                }
            });
        }
    }


    loadRealCreators(page){ var thisClass=this;
        var allcreators=thisClass.state.allcreators;
        if(allcreators.length>0){
            var shouldTake=parseInt(page)*15;
            if(allcreators.length > 9999 && shouldTake>allcreators.length){
                var newPage=thisClass.state.page+1; var newWpage=thisClass.state.wPage+1;
                thisClass.setState({page:newPage,wPage:newWpage});thisClass.loadCreators(newWpage);
            }else{
                var creators=allcreators.slice(0, shouldTake);
                thisClass.setState({creators:creators,isCheck:true,closeToBottom:false}); 
                if(allcreators.length < shouldTake){
                    thisClass.setState({isEnded:true});
                }
            }
        }
    }

    arrayUnique(resData){
        var myRes=[]; var makeUnique=[];
        if(resData.length>0){
            for(index in resData){ var getNow=resData[index];
                if(makeUnique.indexOf(getNow.username) != -1){}else{
                    makeUnique.push(getNow.username);
                    myRes.push(getNow);
                }
            }
        }
        return myRes;
    }

    getUserData(username){
        var res=null;
        var getUsers=this.state.users;
        if(getUsers.length>0){
            for(index in getUsers){
                var getNow=getUsers[index];
                if(getNow.username==username){
                    res=getNow;
                }
            }
        }
        return res;
    }


    handleScroll(nativeEvent) {
        if (isCloseToBottom(nativeEvent)) {this.enableSomeButton(); }
    }


    renderCloseLoading(){
        if(this.state.closeToBottom){
            return(
                <View style={styles.closeto_bottom}><Spinner size={'small'}/></View>
            );
        }
    }


    enableSomeButton(){
        if(this.state.isEnded==false && this.state.closeToBottom==false){
            var getPage = this.state.page + 1;
            this.setState({closeToBottom:true, page : getPage});
            this.loadCreators(getPage);
        }
        
    }


    profile_subscribe(username, isFollowed){ var thisClass=this;
        db.child('subscribers').orderByChild('followed_by').equalTo(thisClass.state.loggedUser).once('value',snap=>{
            var shouldAdd=true;
            if(snap.val()){
                snap.forEach(function(data){ var getData=data.val();
                    if(getData.following==username){
                        shouldAdd=false; db.child('subscribers').child(data.key).remove();
                    }
                });
            }

            if(shouldAdd==true){
                var resValue='yes';
                db.child('subscribers').child('NaN').remove();
                db.child('subscribers').limitToLast(1).once('child_added',lastRow=>{
                    var primaryKey=parseInt(lastRow.key) + 1;
                    db.child('subscribers').child(primaryKey).once('value',isExits=>{
                        if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                        var created_at=new Date().toJSON();
                        
                        var insertObject={};
                        insertObject.following=username;
                        insertObject.followed_by=thisClass.state.loggedUser;
                        insertObject.created_at=created_at;
                        db.child('subscribers').child(primaryKey).set(insertObject);
                    });
                });
            }else{
                var resValue='no';
            }
            

            //update current following
            var allcreators=thisClass.state.allcreators;
            var newCreators=[];
            if(allcreators.length>0){
                for(index in allcreators){
                    var getNow=allcreators[index];
                    if(thisClass.props.s_type=='followers'){
                        if(getNow.followed_by==username){
                            if(isFollowed=='yes'){getNow.isFollowing='no';}else{getNow.isFollowing='yes';}
                        }
                    }else{
                        if(getNow.following==username){
                            if(isFollowed=='yes'){getNow.isFollowing='no';}else{getNow.isFollowing='yes';}
                        }
                    }
                    newCreators.push(getNow);
                }
            }
            allcreators=newCreators;
            thisClass.setState({allcreators:allcreators});

            //update user data 
            db.child('users').orderByChild('username').equalTo(username).once('child_added',snap=>{
                if(snap.val()){ var userData=snap.val();
                    if(shouldAdd==true){
                        var newSubcribers=parseInt(userData.subscribers)+1; 
                    }else{
                        var newSubcribers=parseInt(userData.subscribers)-1; 
                    }
                    if(newSubcribers<0){newSubcribers=0}
                    db.child('users').child(snap.key).update({subscribers:newSubcribers});
                }
            });

            //notifications 
            db.child('notifications').orderByChild('userFor').equalTo(username).once('value',snap=>{
                if(snap.val()){
                    snap.forEach(function(data){ var noti=data.val();
                        if(noti.userFor==username && noti.username==thisClass.state.loggedUser && noti.type=='subscribe'){
                            db.child('notifications').child(noti.key).remove();
                        }
                    });
                }
                if(shouldAdd==true){
                    addNotifications(username,null,thisClass.state.loggedUser,'subscribe',null);
                }

            });
        });
    }


    upadtesFolowing(username,isFollowed){
        var getCreators = this.state.creators; var newCreators = [];
        for(index in getCreators){
            var getCreator = getCreators[index];
            if(getCreator.username==username){
                if(isFollowed=='yes'){
                    getCreator.isFollowing='no';
                }else{
                    getCreator.isFollowing='yes';
                }
            }
            newCreators.push(getCreator);
        }
        this.setState({creators:newCreators});
    }

    renderLoading(){ if(this.state.pageLoading){return <SpinnerBig/>; } }

    renderFollowButtons(username, isFollowing){
        if(username!=this.state.loggedUser){
            if(isFollowing=='yes'){
                return(<TouchableOpacity onPress={()=>this.profile_subscribe(username, this.state.loggedUser,isFollowing)}><Text style={[styles.channel_follow_text,styles.channel_follow_text56,styles.channel_follow_text267]}>Following</Text></TouchableOpacity>);
            }else{
                return(<TouchableOpacity onPress={()=>this.profile_subscribe(username, this.state.loggedUser,isFollowing)}><Text style={[styles.channel_follow_text,styles.channel_follow_text56]}>Follow</Text></TouchableOpacity>);
            }
        }
    }
    renderFollowers(){
        var thisClass= this;
        return this.state.creators.map(function(creator, i){
            var userImage = gStorage+'/profile_thumbs/'+creator.profilePic;       
            var verifiedIcons=null;
            if(creator.ac_type=='celebrity'){
                verifiedIcons=(<IconF name="check-circle" style={[styles.video_verified_icon]}/>);
            }

            return(
                <View key={i} style={styles.follow_channel_list_single}>
                    <View style={styles.follow_channel_list_single_left_main2}>
                        <TouchableOpacity style={styles.follow_channel_list_single_left} onPress={()=>Actions.profile({username:creator.username})}>
                            <View style={styles.follow_channel_list_single_left_left}>
                                <Image style={styles.channel_list_pho} source={{uri : userImage }}/>
                            </View>
                            <View style={styles.follow_channel_list_single_left_right}>
                                <Text style={styles.channel_list_text}>{creator.username}  {verifiedIcons}</Text>
                                <Text style={styles.channel_list_text2}>{creator.name}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.follow_channel_list_single_right}>
                        {thisClass.renderFollowButtons(creator.username,creator.isFollowing)}
                    </View>
                </View>
            );
        });
    }

    render(){
        return(
            <View style={styles.container_followers}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.header_area}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t]}>{this.props.type_tx}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>

                <ScrollView style={{flex:1,marginTop:40}} onScroll={({nativeEvent}) =>this.handleScroll(nativeEvent)} scrollEventThrottle={2000} >
                    {this.renderFollowers()}
                    {this.renderCloseLoading()}
                </ScrollView>
                {this.renderLoading()}
            </View>
        );
    }
}


const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};


//export to other parts
export default Followers;