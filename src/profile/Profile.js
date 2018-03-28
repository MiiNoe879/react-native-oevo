//import elements
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput,TouchableWithoutFeedback, TouchableOpacity,StatusBar,Linking,Clipboard, AsyncStorage, ScrollView, Modal,Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from './../common/Spinner';
import axios from 'axios';


import Menu from './../common/Menu';
import SpinnerBig from './../common/SpinnerBig';
import styles from './../style';

import {appEngine,gStorage} from './../common/Config';
import VideoCard from './../feeds/VideoCard';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFM from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';

import RNFetchBlob from 'react-native-fetch-blob';
var ImagePicker = require('react-native-image-picker');
import Loading from './../common/Loading';

import { updateVideos,makeFocus,renderCategories,renderVideos,exgiftModal } from './../common/Video';
var startScroll=false;
import {renderUploadsLoadings,renderLoadingPercenatge}  from './../common/Video';
import TimerMixin from 'react-timer-mixin';


import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';
import FastImage from 'react-native-fast-image';

//create componet
class Profile extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pageLoading:false,
            username:this.props.username,
            name:'',
            bio:'',
            website:'',

            subscribers:0,
            followCount:0,
            videosC:0,
            likesCount:0,

            photo:'',
            pusername:'',
            videos:[],
            ac_type:'general',
            page:1,
            loggedUser:'',
            isEnded:false,
            donors:[],
            dCheck:false,
            dCheck2:false,
            modalVisible:false,
            isBlocked:'no',
            views:0,

            scrollViewHeight:'',
            allItems:[],
            extraTop:0,
            extraHeight:125,
            uploadLoading:false,
            isMuted:'yes',
            alreadyViews:[],

            giftModal:false,
            gft_amount:null,
            giftUser:null,

            lastVideoId:null,
            focusedVideo:null,


            following:[], allVideos:[],likes:[],users:[],wPage:1,
        }
    }

    checkViewsDone(videoId){ var thisClass=this;
        var alreadyViews = thisClass.state.alreadyViews;
        alreadyViews.push(videoId); thisClass.setState({alreadyViews:alreadyViews});
        var isIncluded=[];
        if(alreadyViews && alreadyViews.length > 0){
            for(index in alreadyViews){
                var getVideoId=alreadyViews[index];
                if(getVideoId==videoId){ isIncluded.push(videoId); }
            }
        }
        return isIncluded.length;
    }

    editProfile(){
        Actions.edit_profile();
    }

    componentWillMount(){ var thisClass=this;
        var thisClass = this;
        AsyncStorage.getItem('isMuted').then((isMuted)=>{
            thisClass.setState({isMuted:isMuted});
        });
        
        AsyncStorage.getItem('username').then((username) => { 
            if(username){
                renderUploadsLoadings(thisClass,username);
                
                thisClass.setState({ loggedUser:username});  
                if(!thisClass.props.username){
                    thisClass.setState({username:username});
                }
                

                getFollowing(username,'following').then(res=>{thisClass.setState({following:res});  });
                
                getFollowing(thisClass.state.username,'following').then(res=>{thisClass.setState({followCount:res.length});  });
                getFollowing(thisClass.state.username,'followers').then(res=>{thisClass.setState({subscribers:res.length});  });
                getLikes(thisClass.state.username).then(res=>{thisClass.setState({likesCount:res.length}); });
                
                getLikes(username).then(res=>{thisClass.setState({likes:res}); });
                getUsers().then(snap=>{thisClass.setState({users:snap}); });

                db.child('blocks').orderByChild('username').equalTo(username).once('value',snap=>{
                    if(snap.val()){
                        snap.forEach(function(sDataM){ var blockData=sDataM.val();
                            if(blockData.blockedUser==thisClass.state.username){
                                thisClass.setState({isBlocked:'yes'});
                            }
                        });
                    }
                });
                thisClass.loadUserData(thisClass.state.username, thisClass.state.loggedUser);
            }else{ Actions.signin(); }
            
        });

        
    }

    unMountPage(){this.updateVideos('pause','all',false,null); }

    onChanged (gft_amount) {this.setState({gft_amount: gft_amount.replace(/[^0-9]/g, ''), }); }
    giftModal(){ return exgiftModal(this,this.state.loggedUser); }
    giftModlaChange(giftModal,giftUser){this.setState({giftModal:giftModal,giftUser:giftUser}); }


    profile_subscribe(username, isFollowed){ var thisClass=this;
        var username=thisClass.state.username;
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
            var getFollowing=thisClass.state.following;
            if(isFollowed=='no'){
                getFollowing.push(username);
            }else{
                var newFollowing=[];
                if(getFollowing.length>0){
                    for(index in getFollowing){
                        var getNow=getFollowing[index];
                        if(getNow==username){}else{newFollowing.push(getNow);}
                    }
                }
                getFollowing=newFollowing;
            }
            thisClass.setState({following:getFollowing});

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



    uploadPhoto(){
        var options = {
          title: 'Select Avatar',
          storageOptions: {
            skipBackup: true,
          }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if(response.uri){

                var resObject = {};
                resObject.data=response.uri.replace("file://", "");
                if(response.fileName){
                    resObject.fileName=response.fileName;
                }else{
                    resObject.fileName='oevo_app_profile_pic.jpg';
                }
                

                this.uploadImageAction(resObject);
            }        
        });
    }


    uploadImageAction(response){
        var thisClass=this;

        thisClass.setState({uploadLoading:true});
        if (response.data) {
            RNFetchBlob.fetch('POST', appEngine+'/upload/upload-photo', {
              'Content-Type' : 'octet-stream'
            },[
                {name : 'image_data', filename : response.fileName, data: RNFetchBlob.wrap(response.data)},
                { name : 'username', data : thisClass.state.username}
            ])
            .uploadProgress({ interval : 250 },(written, total) => {
                var getPercentage=(written / total)*100;
                getPercentage=parseInt(getPercentage);
                if(getPercentage < 100){
                    thisClass.setState({percentage:getPercentage});
                }
            })
            .progress({ count : 10 }, (received, total) => {
               
            })
            .then((resp) => {
                  thisClass.setState({uploadLoading:false});
                  var res = JSON.parse(resp.data);
                  if(res.status=='success'){
                    thisClass.setState({photo:res.image, uploadLoading:false});

                    db.child('users').orderByChild('username').equalTo(thisClass.state.loggedUser).once('child_added',snap=>{
                        if(snap.val()){
                            db.child('users').child(snap.key).update({profilePic:res.image});
                        }
                    });

                  }else{
                    Alert.alert('Error!','Something went wrong, Please try again.');
                  }
            })
            .catch((err) => {
              thisClass.setState({uploadLoading:false});
            });

        }
    }


    loadUserData(username, loggedUser){ var thisClass=this;
        db.child('users').orderByChild('username').equalTo(username).once('child_added',snap=>{
            if(snap.val()){ var user=snap.val();
                thisClass.setState({ 
                    name:user.name,
                    bio:user.bio,
                    website:user.website,
                    photo:user.profilePic,
                    isFollwong:user.isFollwong,
                    ac_type:user.ac_type,
                    dCheck:true,
                    views:nFormat(user.views),
                });
            }
        });

        db.child('donations').orderByChild('donatedTo').equalTo(username).once('value',snap=>{
            if(snap.val()){
                var donors=[];
                snap.forEach(function(data){ var getVal=data.val();
                    donors.push(getVal);
                });
                donors.sort(function(a,b) {
                  return parseInt(b.amount) - parseInt(a.amount);
                });
                thisClass.setState({donors:donors});
            }
        });
        thisClass.loadVideos(1);
    }



    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }



    renderUserACtion(){
        if(this.state.username==this.state.loggedUser){
            return(
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.invite()}>
                    <IconF name="user-plus" style={[styles.back_vator,styles.back_vator_list, styles.profile_user_plus]}/>    
                </TouchableOpacity>
            );
        }else{
            return(
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>{this.unMountPage(),this.returnBackDetect()}}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>
            );
        }
    }

    returnBackDetect(){
        if(this.props.isNoti){
            Actions.notifications();
        }else{
            Actions.pop()
        }
    }

    renderUserACtion2(){
        if(this.state.username==this.state.loggedUser){
            return(
            <TouchableOpacity onPress={()=>{this.unMountPage(),Actions.setting()}} style={styles.right_done_opacity}>
                <IconF name="gear" style={[styles.vator_icon, styles.vator_icon23, styles.back_vator_profile_settings]}/>
            </TouchableOpacity>
            );
        }else{
            return(
            <TouchableOpacity onPress={()=>{this.unMountPage(),this.openUserActions()}} style={[styles.right_done_opacity,styles.right_done_opacity34]}>
                <IconFM name="dots-horizontal" style={[styles.vator_icon, styles.vator_icon78]}/>
            </TouchableOpacity>
            );
        }
    }


    openUserActions(){
        this.setState({modalVisible:true});
    }

    copyProfile(){ this.setState({modalVisible:false}); var thisClass=this;
        var shareUrl='https://oevo.com/user/'+thisClass.state.username;
        Clipboard.setString(shareUrl);
        TimerMixin.setTimeout(()=>{
            Alert.alert('Success','Profile URL has been copied to clipboard!');
        }, 1000);
    }

    shareProfile(){
        this.setState({modalVisible:false}); var thisClass=this;
        TimerMixin.setTimeout(()=>{
            var shareUrl='https://oevo.com/user/'+thisClass.state.username;

            var shareOptions = {
              title: thisClass.state.name + ' - OEVO',
              message: '',
              url: shareUrl,
              subject: "Share Link",
            };
            Share.open(shareOptions).catch((err) => {  });
        }, 1000);
    }

    profileDonate(){
        this.setState({modalVisible:false}); var thisClass=this;
        TimerMixin.setTimeout(()=>{
            Actions.donate({donatedTo:thisClass.state.username,name:thisClass.state.name});
        }, 1000);
    }

    blockUser(username){
        this.setState({modalVisible:false}); var thisClass=this;
        TimerMixin.setTimeout(()=>{
            Alert.alert( 'Confirmation', 'You want to block '+ thisClass.state.name, 
                [ 
                    {text: 'Cancel', onPress: () => console.log('cancel') , style: "cancel"},
                    {text: 'Confirm', onPress: () => thisClass.blockUserMain(username) },
                ], 
                { cancelable: false } 
            );
         }, 1000);
    }


    blockUserMain(username){ var thisClass=this;
        db.child('blocks').child('NaN').remove();
        db.child('blocks').limitToLast(1).once('child_added',lastRow=>{
            var primaryKey=parseInt(lastRow.key) + 1;
            db.child('blocks').child(primaryKey).once('value',isExits=>{
                if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                var created_at=new Date().toJSON();
                
                var insertObject={};
                insertObject.blockedUser=username;
                insertObject.username=thisClass.state.loggedUser;
                insertObject.created_at=created_at;
                db.child('blocks').child(primaryKey).set(insertObject);

                thisClass.setState({isBlocked:'yes'});
                Alert.alert(username+' Blocked','You can unblock them anytime from their profile.');

            });
        });
    }

    rederBio(){
        if(this.state.bio){
            return (<Text  style={styles.profileExtra_t}>{this.state.bio} </Text>);
        }
    }



    openlinkStrcu(link){
        if(link.indexOf("http")>=0){
            var fLink=link;
        }else{
            var fLink='http://'+link;
        }
        Linking.openURL(fLink);
    }

    rederWeb(){
        if(this.state.website){
            var getWebsite = this.state.website;
            if(getWebsite.length>15){
                getWebsite=getWebsite.substring(0,15)+'..';
            }
            return (<TouchableOpacity onPress={ ()=>this.openlinkStrcu(this.state.website)} >
                <Text  style={[styles.profileExtra_t,styles.profileExtra_t23]}>{getWebsite}</Text></TouchableOpacity>);
        }
    }

    renderUserName(){
        if(this.state.username){
            if(this.state.username.length > 20){
                return this.state.username.substring(0,20)+'..';
            }else{
                return this.state.username;
            }
        }
    }


    renderDonateIcons(){
        if(this.state.dCheck){
            if(this.state.username==this.state.loggedUser){
                return this.renderEdit();
            }else{
                var followingText = 'FOLLOW';
                var getFollowClassT=[styles.new_p_follow_m, styles.new_p_follow_m67];
                var getFollowClassI=[styles.profile_sma_cions, styles.profile_sma_cions67];
                var getFollowClass=[styles.new_p_follow, styles.profile_sma_cions67];
                
                var isFollwong='no';
                if((this.state.following).indexOf(this.state.username) != -1){
                    isFollwong='yes';
                    var followingText = 'FOLLOWING';
                    getFollowClass=[styles.new_p_follow,styles.new_p_follow1,styles.profile_sma_cions676];
                    getFollowClassI=[styles.profile_sma_cions,styles.new_p_follow1,styles.profile_sma_cions676];
                    getFollowClassT=[styles.new_p_follow_m,styles.new_p_follow_m1,styles.new_p_follow_m1676];
                }
                return(
                    <View style={styles.profile_user_area_right_top}>
                        <View style={[styles.profile_user_area_right_top_left,{marginRight:3}]}>
                            <TouchableOpacity onPress={()=>this.profile_subscribe(this.state.loggedUser,isFollwong)} 
                            style={getFollowClassT}>
                                <View style={styles.ds_follow_extra}>
                                    <IconF name="user-plus" style={getFollowClassI}/>  
                                    <Text style={getFollowClass}>{followingText}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.profile_user_area_right_top_left,{marginLeft:3}]}>
                           <TouchableOpacity onPress={()=>{this.updateVideos('mute','all',false,null), this.setState({giftModal:true,giftUser:this.state.username})} } 
                            style={[styles.new_p_follow_m, styles.new_p_follow_m2]}>
                                <View style={styles.ds_follow_extra}>
                                    <IconFM name="gift" style={[styles.profile_sma_cions,styles.profile_sma_cions23]}/>
                                    <Text style={[styles.new_p_follow, styles.new_p_follow2]}>GIFT COINS</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }
        }
    }

    renderEdit(){
        return(
            <View style={styles.profile_follow}>
                <TouchableOpacity onPress={this.editProfile.bind(this)}>
                    <Text style={styles.profile_follow_text}>EDIT PROFILE</Text>
                </TouchableOpacity>
            </View>
        );
    }



    updateVideos(param1,param2,param3,param4){ updateVideos(this,param1,param2,param3,param4); }
    renderVideos(){
        var thisClass= this;
        if(this.state.dCheck2){
            if(this.state.videos.length>0){
                return this.state.videos.map(function(video, i){
                    return(
                        <VideoCard key={i} index={i} video={video} videos={thisClass.state.videos} username={thisClass.state.loggedUser} 
                        updateVideos={thisClass.updateVideos.bind(thisClass)} 
                        checkViewsDone={thisClass.checkViewsDone.bind(thisClass)}
                        giftModlaChange={thisClass.giftModlaChange.bind(thisClass)}
                        users={thisClass.state.users}
                        onLayout={thisClass.getDisplaySize(video.videoId)} followButton={true}/>
                    );
                });
            }else{
                return(
                    <View style={styles.nopos_profile}>
                        <View style={styles.nopos_profile_top}>
                            <IconF name="file-video-o" style={[styles.nopos_profile_top_i]}/> 
                            <Text style={styles.nopos_profile_top_txt}>No Posts!</Text>
                        </View>
                    </View>
                );
            }
        }


    }


    renderNoVideos(){
        if(this.state.dCheck2){
            if(this.state.videos.length>0){

            }else if(this.state.username==this.state.loggedUser){
                return (
                    <View style={styles.nopos_profile_bottom}>
                        <Text style={styles.nopos_profile_top_txt}>Tap on the Camera</Text>
                        <Text style={styles.nopos_profile_bottom_t2}>to share your first video.</Text>
                        <IconF name="angle-down" style={[styles.nopos_profile_top_i2]}/>
                    </View>
                );
            }
        }
    }


    loadVideos(page){ var thisClass=this;
        var shouldTake=page*10000;
        db.child('videos').orderByChild('username').equalTo(thisClass.state.username).limitToLast(shouldTake).once('value',data=>{
            var getVideos=[]; 
            if(data.val()){
                var following=this.state.following;

                var likes=this.state.likes;
                var now = new Date();var minusDate=new Date(now.getTime() - (24*1000*60*60));

                data.forEach(function(video) {
                    var newObject=video.val();

                    newObject.videoId=video.key; newObject.loading=true; newObject.isFocused=false;
                    newObject.comments=nFormat(newObject.comments); newObject.likes=nFormat(newObject.likes); newObject.shares=nFormat(newObject.shares);
                    if(thisClass.state.isMuted=='yes'){
                        newObject.muted=true;
                    }else{newObject.muted=false;}

                    newObject.isFollowed='no';
                    if(following && following.length > 0){
                        if(following.indexOf(newObject.username) != -1){
                            newObject.isFollowed='yes';
                        }
                    }

                    if(thisClass.state.focusedVideo==newObject.videoId){
                        newObject.isFocused=true;
                        newObject.loading=false;
                    }
                    
                    
                    newObject.isLiked='no';
                    if(likes && likes.length > 0){
                        var videoId=Number(video.key);
                        if(likes.indexOf(videoId) != -1){
                            newObject.isLiked='yes';
                        }
                    }

                    var getUploadedTime=new Date(newObject.created_at)
                    newObject.created_at=agoFunction(getUploadedTime);

                    //editable
                    newObject.isEditable=false;
                    if(minusDate < getUploadedTime && newObject.username==thisClass.state.loggedUser){
                        newObject.isEditable=true;
                    }
                    getVideos.push(newObject); 

                    
                });

                getVideos.sort(function(a,b) {
                  return parseInt(b.videoId) - parseInt(a.videoId);
                });
                thisClass.setState({allVideos:getVideos, videosC:getVideos.length},()=>thisClass.realLoadVideos(thisClass.state.page));
            }
            thisClass.setState({dCheck2:true});
        });
    }

    realLoadVideos(page){ var thisClass=this;
        var allVideos=thisClass.state.allVideos;
        if(allVideos.length>0){
            var shouldTake=parseInt(page*10);
            if(allVideos.length > 9999 && shouldTake>allVideos.length){
                var newPage=thisClass.state.page+1; var newWpage=thisClass.state.wPage+1;
                thisClass.setState({page:newPage,wPage:newWpage});thisClass.loadVideos(newWpage);
            }else{
               var getVideos=allVideos.slice(0, shouldTake);
               var newGetVideos=[];
                if(getVideos.length>0){
                    for(index in getVideos){ var getNow=getVideos[index];
                        if(thisClass.state.isMuted=='yes'){
                            getNow.muted=true;
                        }else{getNow.muted=false;}
                        newGetVideos.push(getNow);
                    }
                }

                thisClass.setState({videos:newGetVideos,isCheck:true,closeToBottom:false}); 
                if(allVideos.length < shouldTake){
                    thisClass.setState({isEnded:true});
                }
            }
        }
    }


    getScrollViewSize(event) {
        const {x, y, width, height} = event.nativeEvent.layout;
        this.setState({scrollViewHeight: height });
    }
    measureView(event){
        const {x, y, width, height} = event.nativeEvent.layout;
        this.setState({extraTop:height});
    }


    handleScroll(nativeEvent) {
        startScroll=false;
        this.makeFocus(nativeEvent.contentOffset.y);
        if (isCloseToBottom(nativeEvent)) {this.enableSomeButton(); }
    }

    handleScroll2(currentPostion) {
        var thisClass=this;
        startScroll=true;
        TimerMixin.setTimeout(()=>{
            if(startScroll==true){
                thisClass.updateVideos('focus',null,null,null); 
            }
        }, 1000);
    }

    makeFocus(currentPostion) {makeFocus(this,currentPostion,'profile'); }


    getDisplaySize(index) {
        var allItems=this.state.allItems;
        return (event) => {
            //console.log(444);

            const {y,height } = event.nativeEvent.layout;
            let payload = {};
            payload.videoId=index;
            payload.y=y;
            payload.height=height;
            allItems.push(payload);

            // console.log(3333);
            // console.log(payload);

            this.setState({allItems:allItems});
        }
    }
    renderCloseLoading(){
        if(this.state.closeToBottom){
            return(
                <View style={styles.closeto_bottom}><Spinner size={'small'}/></View>
            );
        }
    }
    enableSomeButton(){ var thisClass=this;
        if(thisClass.state.isEnded==false && thisClass.state.closeToBottom==false && thisClass.state.videos.length > 0){
            var getPage = thisClass.state.page + 1;
            thisClass.setState({closeToBottom:true, page : getPage});
            setTimeout(function(){
                thisClass.realLoadVideos(getPage);
            },1000);
        } 
    }


    renderLikesButton(){
        if(this.state.likes.length>0){
            Actions.likes({username:this.state.username});
        }
    }


    renderFollowersButton(){
        if(this.state.subscribers>0){
            Actions.followers({username:this.state.username,s_type:'followers',type_tx:'Followers'});
        }
    }


    renderFollowingButton(){
        if(this.state.following.length>0){
            Actions.followers({username:this.state.username,s_type:'following',type_tx:'Following'});
        }
    }

    


    renderMenus(){
        var thisClass=this;
        if(this.state.username==this.state.loggedUser){
            return(<Menu  activeMenu="profile" updateVideos={thisClass.updateVideos.bind(thisClass)}/>);
        }else{
            return(<Menu updateVideos={thisClass.updateVideos.bind(thisClass)}/>);
        }
    }

    getUserData(username){
        var getUsers=this.state.users;
        if(getUsers.length>0){
            for(index in getUsers){
                var getNow=getUsers[index];
                if(getNow.username==username){
                    return getNow;
                }
            }
        }
    }


    renderDonorsMain(){
        var thisClass= this;
        if(this.state.users.length>0){
            return this.state.donors.map(function(donor, i){
                var donorD=thisClass.getUserData(donor.donatedBy);
                var userImage = gStorage+'/profile_thumbs/'+donorD.profilePic;
                return(
                    <View key={i} style={styles.donation_donars_single}>
                        <TouchableOpacity onPress={()=>{thisClass.unMountPage(),Actions.profile({username:donorD.username})}}><Image  style={styles.notification_drn_image} source={{uri : userImage }}/>
                            <Text style={styles.donate_amnt}>{nFormat(donor.amount)} Coins</Text>
                        </TouchableOpacity>
                    </View>
                );
            });
        }
    }


    renderDonors(){
        if(this.state.donors.length>0){
            return(
                <View style={styles.donation_donars_main}>
                    <View style={styles.donation_donars}>
                        <View style={styles.donation_donars_bottom}></View>
                        <Text style={styles.donation_donars_top_txt}>SUPER FANS</Text>
                    </View>
                    <View style={styles.donation_donars_list}>
                        <ScrollView horizontal= {true} decelerationRate={0} snapToInterval={200}  snapToAlignment={"center"}>
                            {this.renderDonorsMain()}
                        </ScrollView>
                    </View>
                </View>
            );
        }
    }


    renderCountings(){
        if(this.state.dCheck){
            return(
                <View style={[styles.profile_user_data]}>
                    <View style={[styles.profile_user_area_single]}>
                        <TouchableOpacity  onPress={()=>{this.unMountPage(),this.renderFollowersButton()}}  style={[styles.profile_user_area_single_area]}>
                            <Text style={styles.profile_user_area_single_text1}>{this.state.subscribers}</Text>
                            <Text style={styles.profile_user_area_single_text2}>Followers</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.profile_user_area_single]}>
                        <TouchableOpacity onPress={()=>{this.unMountPage(),this.renderFollowingButton()}} style={[styles.profile_user_area_single_area]}>
                            <Text style={styles.profile_user_area_single_text1}>{this.state.followCount}</Text>
                            <Text style={styles.profile_user_area_single_text2}>Following</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.profile_user_area_single]}>
                        <Text style={styles.profile_user_area_single_text1}>{this.state.videosC}</Text>
                        <Text style={styles.profile_user_area_single_text2}>Posts</Text>
                    </View>
                    <View style={[styles.profile_user_area_single]}>
                        <TouchableOpacity onPress={()=>{this.unMountPage(),this.renderLikesButton()}} style={[styles.profile_user_area_single_area]}>
                            <Text style={styles.profile_user_area_single_text1}>{this.state.likesCount}</Text>
                            <Text style={styles.profile_user_area_single_text2}>Likes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }


    renderUserPhoto(){
        if(this.state.photo){
            if(this.state.username==this.state.loggedUser){
                return(
                    <TouchableOpacity onPress={()=>this.uploadPhoto()}><Image style={styles.pfile_image} source={{uri : gStorage+'/profile_thumbs/'+this.state.photo }}/></TouchableOpacity>
                );
            }else{
                return(
                    <TouchableOpacity><Image style={styles.pfile_image} source={{uri : gStorage+'/profile_thumbs/'+this.state.photo }}/></TouchableOpacity>
                );
            }
        }
    }


    renderUsername2(){
        var verifiedLogo = null;
        if(this.state.ac_type=='celebrity'){
            verifiedLogo=(<Image  style={styles.profile_photo_img} source={require('./../images/verified.png')}/>);
        }

        if(this.state.dCheck){
            return(
                <Text style={styles.profile_photo_t5}>{this.state.name} {verifiedLogo}</Text>
            );
        }
    }


    unblockUsers(username){ var thisClass=this;
        thisClass.setState({modalVisible:false});

        setTimeout(function(){
            db.child('blocks').orderByChild('username').equalTo(thisClass.state.loggedUser).once('value',snap=>{
                if(snap.val()){
                    snap.forEach(function(sDataM){ var blockData=sDataM.val();
                        if(blockData.blockedUser==username){
                            db.child('blocks').child(sDataM.key).remove();
                            thisClass.setState({isBlocked:'no'});
                            Alert.alert(username+' Unblocked','You can block them anytime from their profile.');
                        }
                    });
                }
            });
        },1000);
    }


    renderBlockUnblock(){var thisClass=this;
        if(this.state.isBlocked=='yes'){
            return(
                <TouchableOpacity style={styles.ds_modal_top_row} onPress={() => { thisClass.unblockUsers(this.state.username) }}> 
                    <Text style={[styles.ds_modal_top_row_txt]}>UnBlock</Text> 
                </TouchableOpacity> 
            );
        }else{
            return(
                <TouchableOpacity style={styles.ds_modal_top_row} onPress={() => { thisClass.blockUser(this.state.username) }}> 
                    <Text style={[styles.ds_modal_top_row_txt,{color:'red'}]}>Block</Text> 
                </TouchableOpacity> 
            );
        }
    }

    rederViews(){
        //console.log(this.state.views);

        if(this.state.views){
            return(
                <Text style={styles.new_p_views}>{this.state.views} Circles</Text>
            );
        }
    }


    renderExternalModal(){
        var thisClass=this;
        if(this.state.dCheck){
            if(this.state.username==this.state.loggedUser){}else{
                return(
                    <Modal transparent={true}  animationType="slide" visible={thisClass.state.modalVisible} onRequestClose={() => {}} > 
                        <TouchableWithoutFeedback onPress={() => thisClass.setState({ modalVisible: false })}>
                        <View style={styles.ds_modal}> 
                            <View style={styles.ds_modal_top}> 
                                <TouchableOpacity style={styles.ds_modal_top_row} onPress={() => { thisClass.profileDonate(); }}> 
                                    <Text style={styles.ds_modal_top_row_txt}>Donate</Text> 
                                </TouchableOpacity> 
                                <TouchableOpacity style={styles.ds_modal_top_row} onPress={() => { thisClass.copyProfile() }}> 
                                    <Text style={styles.ds_modal_top_row_txt}>Copy Profile URL</Text> 
                                </TouchableOpacity> 
                                <TouchableOpacity style={styles.ds_modal_top_row} onPress={() => { thisClass.shareProfile() }}> 
                                    <Text style={styles.ds_modal_top_row_txt}>Share this Profile</Text> 
                                </TouchableOpacity>
                                {thisClass.renderBlockUnblock()}
                            </View> 
                            <TouchableOpacity style={styles.ds_modal_bottom} onPress={() => { thisClass.setState({modalVisible:false}) }}> 
                                <Text style={styles.ds_modal_bottom_cancel}>Cancel</Text> 
                            </TouchableOpacity> 
                        </View> 
                        </TouchableWithoutFeedback>
                    </Modal>
                );
            }
        }
    }

    renderUploadLoading(){
        if(this.state.uploadLoading){
            return <Loading percentage={this.state.percentage}/>;
        }
    }

    measureView2(event){
        const {x, y, width, height} = event.nativeEvent.layout;
        if(height<125){
            this.setState({extraHeight:125});
        }else{
            this.setState({extraHeight:height});
        }
    }

    render(){
        return(
            <View style={styles.container_profile}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                {renderLoadingPercenatge(this,'profile')}
                
                <View style={styles.profile_header_main}>
                    <Text style={styles.pro_menu_text}>{this.renderUserName()}</Text>
                </View>
                {this.renderUserACtion()}{this.renderUserACtion2()}
                <ScrollView  
                onScrollBeginDrag={({nativeEvent}) =>this.handleScroll2(nativeEvent)} 
            onMomentumScrollEnd={({nativeEvent}) =>this.handleScroll(nativeEvent)} 
            onScrollEndDrag={({nativeEvent}) =>this.handleScroll(nativeEvent)} 

                onLayout={this.getScrollViewSize.bind(this)} 
                scrollEventThrottle={2000}  style={styles.scroll_view}>
                    
                    
                    <View onLayout={(event) => this.measureView(event)}>
                        <View style={styles.profile_user_area}  onLayout={(event) => this.measureView2(event)}>
                            <View style={[styles.profile_user_area_left,{height:this.state.extraHeight}]}>
                                {this.renderUserPhoto()}
                                <View style={styles.profile_user_area_top_m}>
                                    <View style={styles.profile_name}>
                                        {this.renderUsername2()}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.profile_user_area_right}>
                                {this.renderDonateIcons()}
                                <View style={styles.profile_user_area_right_bottom}>
                                    <View  style={styles.profileExtra}>
                                        {this.rederBio()}
                                        <View style={styles.new_profile_area}>
                                            <View style={styles.new_profile_area_left}>
                                                {this.rederWeb()}
                                            </View>
                                            <View style={styles.new_profile_area_left}>
                                                {this.rederViews()}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {this.renderDonors()}
                        {this.renderCountings()}
                    </View>
                    <View style={styles.profile_videos}>
                    {this.renderVideos()}
                    </View>
                    {this.renderCloseLoading()}

                </ScrollView>
                {this.renderNoVideos()}
                {this.renderLoading()}
                {this.renderMenus()}
                {this.renderExternalModal()}
                {this.renderUploadLoading()}
                {this.giftModal()}

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
export default Profile;
