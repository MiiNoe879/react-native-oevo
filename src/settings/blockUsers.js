//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,StatusBar, AsyncStorage, Alert, Switch } from 'react-native';
import {Actions} from 'react-native-router-flux';


import Dimensions from 'Dimensions';
var screen = Dimensions.get('window');


import axios from 'axios';
import SpinnerBig from './../common/SpinnerBig';

import {appEngine,gStorage} from './../common/Config';
import styles from './../style';
import IconF from 'react-native-vector-icons/FontAwesome';
import TimerMixin from 'react-timer-mixin';

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
//create componet
class blockUsers extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
            blocklists:[],
            error:'',
            pageLoading:false, username:'',isCheck:false
      };
    }


    componentWillMount(){ var thisClass=this;
        StatusBar.setHidden(false);  StatusBar.setBarStyle('dark-content', true);
        if(this.props.blocklists){ this.setState({blocklists:this.props.blocklists}); }
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
                getUsers().then(snap=>{thisClass.setState({users:snap}); });
                this.setState({username:username}); 
                this.loadBlockUsers(username);
            }else{ Actions.signin(); }
        });
    }




    unblockUsers(username){ var thisClass=this;
        db.child('blocks').orderByChild('username').equalTo(thisClass.state.username).once('value',snap=>{
            if(snap.val()){
                snap.forEach(function(sDataM){ var blockData=sDataM.val();
                    if(blockData.blockedUser==username){
                        db.child('blocks').child(sDataM.key).remove();
                        thisClass.updateUnblocks(username);
                    }
                });
            }
        });
    }


    updateUnblocks(username){
        var currentUsers=this.state.blocklists;
        var newUsers=[];
        for(index in currentUsers){
            var getThis=currentUsers[index];
            if(getThis.username!=username){newUsers.push(getThis);}
        }
        this.setState({blocklists:newUsers});
    }


    loadBlockUsers(){ var thisClass=this;
        db.child('blocks').orderByChild('username').equalTo(thisClass.state.username).once('value',snap=>{
            var blocklists=[];
            if(snap.val()){
                snap.forEach(function(sDataM){ var blockData=sDataM.val();
                    if(blockData.blockedUser){
                        var getUser=thisClass.getUserData(blockData.blockedUser);
                        blocklists.push(getUser);
                    }
                });  
            }
            thisClass.setState({blocklists:blocklists,isCheck:true});
        });
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



    unblockUsersAction(username){
        Alert.alert( 'Confirmation', 'Want to unblock '+username, 
            [ 
                {text: 'Cancel', onPress: () => console.log('cancel') , style: 'cancel'},
                {text: 'Unblock', onPress: () => this.unblockUsers(username) },
            ], 
            { cancelable: false } 
        );
    }



    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }


    renderUsers(){
        if(this.state.isCheck){
            var users = this.state.blocklists;
            var thisClass = this;
            if(users && users.length>0){
                return users.map(function(user, i){
                    var userImage = gStorage+'/profile_thumbs/'+user.profilePic;

                    return(
                        <View key={i} style={styles.follow_channel_list_single}>
                            <View style={styles.follow_channel_list_single_left_main}>
                                <TouchableOpacity style={styles.follow_channel_list_single_left} onPress={()=>Actions.profile({username:user.username})}>
                                    <View style={styles.follow_channel_list_single_left_left}>
                                        <Image style={styles.channel_list_pho} source={{uri : userImage }}/>
                                    </View>
                                    <View style={styles.follow_channel_list_single_left_right}>
                                        <Text style={[styles.channel_list_text]}>{user.username}</Text>
                                        <Text style={[styles.channel_list_text,styles.channel_list_text2]}>{user.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.blocked_users_right}>
                                <Switch
                                  onValueChange={(value) => thisClass.unblockUsersAction(user.username)}
                                  style={styles.ds_switcher}
                                  thumbTintColor="#fff"
                                  tintColor="#2eff3f"
                                  onTintColor="#5BDA4D"
                                  value={true}
                                />
                            </View>
                        </View>
                    );
                });
            }else if(this.state.isCheck){
                return(
                    <View style={styles.not_found_single}><Text style={styles.not_found_single_txt}>No Users found!</Text></View>
                );
            }
        }
        
    }

    render(){
        return(
            <View style={styles.setting_container}>
               <View style={styles.edit_profile}>
                    <View style={styles.reg_heading}>
                        <Text style={[styles.profile_s_t]}>Blocked Users</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.setting()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>

                <ScrollView style={styles.setting_scroll}>
                    {this.renderUsers()}
                </ScrollView>
                {this.renderLoading()}
            </View>
        );
    }
}


//export
export default blockUsers;