//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';

import styles from './../style';
import SpinnerBig from './../common/SpinnerBig';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';

var isRunning, isEnded=false;
console.disableYellowBox = true;
import Spinner from './../common/Spinner';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFI from 'react-native-vector-icons/Ionicons';
import IconFS from 'react-native-vector-icons/SimpleLineIcons';
import IconFF from 'react-native-vector-icons/Feather';

import {renderUploadsLoadings,renderLoadingPercenatge}  from './../common/Video';
import TimerMixin from 'react-timer-mixin';
import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';
import FastImage from 'react-native-fast-image';


//create componet
class Notifications extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            pageLoading:true,
            page:1,
            wPage:1,
            allnotifications:[],
            notifications:[],
            closeToBottom:false,
            isCheck:false,
            totalNoti:0,
            uploadPercentage:0,
            isEnded:false,
            users:[],
            following:[],
        };
    }

    async saveItem(item, selectedValue) {try {await AsyncStorage.setItem(item, selectedValue); } catch (error) {  } }

    componentWillMount(){ var thisClass=this;
        StatusBar.setHidden(false); StatusBar.setBarStyle('dark-content', true);
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
                renderUploadsLoadings(thisClass,username);
                getFollowing(username,'following').then(res=>{res.push(username);thisClass.setState({following:res}); 
                    getUsers().then(snap=>{thisClass.setState({users:snap});
                        thisClass.setState({username:username},()=>thisClass.loadNotifications(1)); 
                    });
                });
            }else{ Actions.signin(); } 
        });

        AsyncStorage.getItem('totalNoti').then((totalNoti) => { 
            if(totalNoti){
                this.setState({totalNoti:totalNoti});
            }
        });
    }


    loadNotifications(page){ var thisClass=this;
        var shouldTake=page*10000;
        db.child('videos').limitToLast(shouldTake).once('value',snapnM=>{
            var videos=[];
            if(snapnM.val()){
                snapnM.forEach(function(video){ var shouldPush=video.val(); shouldPush.videoId=video.key; videos.push(shouldPush); });
            }

            db.child('notifications').orderByChild('userFor').equalTo(thisClass.state.username).once('value',snap=>{
                var following=this.state.following;
                var notifications=[];

                if(snap.val()){
                    snap.forEach(function(notiT){
                        if(notiT.val() && notiT.val().username){
                            var noti=notiT.val();
                            noti.notiId=notiT.key;
                            if(noti.username){
                                noti.user=thisClass.getUserData(noti.username);
                            }else{noti.user=null;}
                            
                            if(noti.videoId){
                                noti.video=thisClass.getVideoData(videos,noti.videoId);
                            }else{noti.video=null;}

                            if(noti.type && noti.type=='subscribe'){
                                noti.isFollwong='no';
                                if(following.indexOf(noti.username) != -1){
                                    noti.isFollwong='yes';
                                }    
                            }

                            if(noti.dataVal=='public' || noti.dataVal=='draft' || noti.dataVal=='comment' || noti.dataVal=='video'){
                                noti.dataVal=noti.dataVal;
                            }else{
                                noti.dataVal=nFormat(noti.dataVal);
                            }
                            if(noti.user){
                                notifications.push(noti);
                            }
                        }
                    });

                    notifications.sort(function(a,b) {
                      return Number(b.notiId) - Number(a.notiId);
                    });  
                }

                thisClass.setState({allnotifications:notifications,pageLoading:false});
                if(notifications.length==0){
                    thisClass.setState({isCheck:true});
                }
                thisClass.realNotifications(thisClass.state.page);
            });

        });

        setTimeout(function(){ thisClass.readNewNotifications() }, 3000);
    }

    realNotifications(page){ var thisClass=this;
        var allnotifications=thisClass.state.allnotifications;
        if(allnotifications.length>0){
            var shouldTake=parseInt(page)*15;
            if(allnotifications.length > 9999 && shouldTake>allnotifications.length){
                var newPage=thisClass.state.page+1; var newWpage=thisClass.state.wPage+1;
                thisClass.setState({page:newPage,wPage:newWpage});thisClass.loadNotifications(newWpage);
            }else{
                var notifications=allnotifications.slice(0, shouldTake);
                thisClass.setState({notifications:notifications,isCheck:true,closeToBottom:false}); 
                if(allnotifications.length < shouldTake){
                    thisClass.setState({isEnded:true});
                }
            }
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

    getVideoData(videos,videoId){
        if(videos.length>0){
            for(index in videos){
                var getNow=videos[index];
                if(getNow.videoId==videoId){
                    return getNow;
                }
            }
        }
    }


    renderLoading(){if(this.state.pageLoading){return <SpinnerBig/>; }}

    subscribe(noti, isFollowed){ var thisClass=this;
        var username=noti.username; var notificationId=noti.notificationId;

        db.child('subscribers').orderByChild('followed_by').equalTo(thisClass.state.username).once('value',snap=>{
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
                        insertObject.followed_by=thisClass.state.username;
                        insertObject.created_at=created_at;
                        db.child('subscribers').child(primaryKey).set(insertObject);
                    });
                });
            }else{
                var resValue='no';
            }

            thisClass.deleteNotifications(noti);
            thisClass.updateNotificationsData(noti);

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
                        if(noti.userFor==username && noti.username==thisClass.state.username && noti.type=='subscribe'){
                            db.child('notifications').child(noti.key).remove();
                        }
                    });
                }
                if(shouldAdd==true){
                    addNotifications(username,null,thisClass.state.username,'subscribe',null);
                }

            });


        });
    }


    readNewNotifications(){ var thisClass=this;
        db.child('notifications').orderByChild('userFor').equalTo(thisClass.state.username).once('value',snap=>{
            if(snap.val()){
                snap.forEach(function(notiT){ var noti=notiT.val();
                    if(noti.status=='unread'){
                        db.child('notifications').child(notiT.key).update({status:'read'});
                    }
                });
                thisClass.updateNotifications(); thisClass.updateTotanNoti();
            }
        });
    }


    deleteNotifications(noti){ var thisClass=this;
        var type=noti.type;
        if(type=='comment' || type=='reply'){
            Actions.comments({videoId:noti.videoId});
        }else if(type=='like' || type=='upload' || type=='follow_noti'){
            if(noti.videoId){
                Actions.query({videoId:noti.videoId});
            }
        }else if(type=='donation'){
            Actions.profile({username:noti.username});
        }else if(type=='subscribe'){
            Actions.profile({username:noti.username});
        }else if(type=='mentioned'){
            if(noti.dataVal=='comment'){
                Actions.comments({videoId:noti.videoId});
            }else{
                Actions.query({videoId:noti.videoId});
            }
        }
    }


    updateNotificationsData(noti){ var thisClass=this;
        var notifications=this.state.notifications; var newNotifications=[];
        for(index in notifications){
            var getNow=notifications[index];
            if(getNow.notificationId==noti.notificationId){
                getNow.isFollwong='yes';
            }
            newNotifications.push(getNow);
        }
        thisClass.setState({notifications:newNotifications});
    }


    updateTotanNoti(){
        var thisClass=this;
        AsyncStorage.getItem('totalNoti').then((totalNoti) => { 
            if(totalNoti){ 
                var newNoti=0;
                newNoti=newNoti.toString();
                thisClass.saveItem('totalNoti',newNoti);
                thisClass.setState({totalNoti:newNoti});
            }
        });
    }


    updateNotifications(){
        var getNotifications = this.state.notifications;
        var neNotifications=[];
        for(index in getNotifications){
            var getNoti = getNotifications[index];
            getNoti.status='read';
            neNotifications.push(getNoti);
        }
        this.setState({notifications:neNotifications});
    }
    


    renderNotifications(){
        var thisClass= this;
        return this.state.notifications.map(function(notification, i){
            var notificationsClass=[styles.single_notification];
            if(notification.status=='unread'){
                notificationsClass=[styles.single_notification,styles.single_notification24];
            }
            var getCretDta=new Date(notification.created_at);


            if(notification.username=='system'){
                var rightContent=null;
                if(notification.video){
                    var thumbnailUrl = gStorage+'/thumbnails/'+notification.video.thumbnail;
                    rightContent=(
                        <FastImage
                            style={styles.notification_v_thumb}
                            source={{
                              uri: thumbnailUrl,
                              priority: FastImage.priority.high,
                            }}
                        />
                    );
                }

                if(notification.type=='upload'){
                    var getText='Your video has been approved.';
                }
                if(notification.type=='widraw_cleared'){
                    var getText='Your recent withdrawal request has been cleared.';
                }

                if(notification.type=='winner'){
                    var getText='You have won $'+notification.dataVal;
                }

                return(
                    <TouchableOpacity key={i} onPress={()=>thisClass.deleteNotifications(notification)}>
                        <View style={notificationsClass}>
                            <View style={styles.single_notificationleft}>
                            </View>
                            <View style={styles.single_notificationmiddle}>
                                <Text style={styles.noti_text_top}>{getText}</Text>
                                <View style={styles.noti_text_duration_con}>
                                    <IconFI name="md-time" style={[styles.clock_icon_video, styles.clock_icon_video_noti]}/>
                                    <Text style={styles.noti_text_duration}>{agoFunction(getCretDta)}</Text>
                                </View>
                            </View>
                            <View style={styles.single_notificationright}>
                                {rightContent}
                            </View>
                        </View>
                    </TouchableOpacity>
                );

            }else{
                var userImage = gStorage+'/profile_thumbs/'+notification.user.profilePic;
                var rightContent=null;
                if(notification.video){
                    var thumbnailUrl = gStorage+'/thumbnails/'+notification.video.thumbnail;
                    rightContent=(
                        <FastImage
                            style={styles.notification_v_thumb}
                            source={{
                              uri: thumbnailUrl,
                              priority: FastImage.priority.high,
                            }}
                        />
                    );
                }
                if(notification.type=='subscribe'){
                    if(notification.isFollwong && notification.isFollwong=='no'){
                        rightContent=(
                            <TouchableOpacity onPress={()=>thisClass.subscribe(notification,'no')}><Text style={styles.noti_follow_text}>FOLLOW</Text></TouchableOpacity>
                        );
                    }
                }
                if(notification.type=='donation'){
                    rightContent=(
                        <Text style={[styles.noti_donation_text]}>{notification.dataVal} Coins</Text>
                    );
                }
                var getText=null;
                if(notification.type=='like'){
                    getText='liked your video.';
                }
                if(notification.type=='follow_noti'){
                    getText='uploaded a new video.';
                }
                if(notification.type=='comment'){
                    getText='commented on your video.';
                }
                if(notification.type=='reply'){
                    getText='replied in your comments.';
                }
                if(notification.type=='subscribe'){
                    getText='is now following you!';
                }
                if(notification.type=='donation'){
                    getText='has sent you!';
                }

                if(notification.type=='mentioned'){
                    if(notification.dataVal=='comment'){
                        getText='has mentioned you in a comment';
                    }else{
                        getText='has mentioned you in a video';
                    }
                }


                var verifiedIcons=null;
                if(notification.user.ac_type=='celebrity'){
                    verifiedIcons=(<IconF name="check-circle" style={[styles.video_verified_icon]}/>);
                }

                return(
                    <TouchableOpacity key={i} onPress={()=>thisClass.deleteNotifications(notification)}>
                        <View style={notificationsClass}>
                            <View style={styles.single_notificationleft}>
                                <TouchableOpacity onPress={()=>Actions.profile({username:notification.username})}>
                                    <Image  style={styles.notification_image} source={{uri : userImage }}/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.single_notificationmiddle}>
                                <Text style={styles.noti_text_top}><Text style={styles.font_bold_2}>{notification.user.name} {verifiedIcons}</Text>{getText}</Text>
                                <View style={styles.noti_text_duration_con}>
                                    <IconFI name="md-time" style={[styles.clock_icon_video, styles.clock_icon_video_noti]}/>
                                    <Text style={styles.noti_text_duration}>{agoFunction(getCretDta)}</Text>
                                </View>
                            </View>
                            <View style={styles.single_notificationright}>
                                {rightContent}
                            </View>
                        </View>
                    </TouchableOpacity>
                );

            }


        });
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
            this.realNotifications(getPage);
        }
        
    }

    renderNotiArea(){
        if(this.state.isCheck){
            if(this.state.notifications.length>0){
                return this.renderNotifications();
            }else{
                return(<Text style={styles.no_notifications_at}>You have no new notifications at this time.</Text>);
            }
        }
    }

    totalNotiFunction(){
        if(this.state.totalNoti && this.state.totalNoti!=0){
            var getTotalN=this.state.totalNoti;
            if(getTotalN.indexOf("-")>=0){getTotalN=0;}
            return(<Text style={styles.menu_text_extra}>{getTotalN}</Text>);
        }
    }


    render(){
        return (
            <View style={styles.container_notif}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                {renderLoadingPercenatge(this,'explore')}
                <View style={styles.notification_header}>
                    <View style={styles.notification_header_left}>
                        <TouchableOpacity><Text style={[styles.notification_btn, styles.notification_btn_active]}>NOTIFICATIONS</Text></TouchableOpacity>
                    </View>
                    <View style={[styles.notification_header_left,styles.notification_header_left2]}>
                        <TouchableOpacity onPress={()=>Actions.mydonations()}><Text style={styles.notification_btn}>OEVO COINS</Text></TouchableOpacity>
                    </View>
                </View>

                <ScrollView onScroll={({nativeEvent}) =>this.handleScroll(nativeEvent)}  
                scrollEventThrottle={2000}  
                style={styles.notification_sctoll}>
                    <View style={styles.notifications_list_con}>
                        {this.renderNotiArea()}
                    </View>
                    {this.renderCloseLoading()}
                </ScrollView>

                {this.renderLoading()}

                <View style={styles.menu_area}>
                    <View style={styles.menu_area_main}>
                        <View style={styles.single_menu}>
                            <TouchableOpacity onPress={()=>Actions.home()}  style={styles.menu_text}><Image style={[styles.menu_icons,styles.menu_icons_home]} source={require('./../images/m_home.png')}/></TouchableOpacity>
                        </View>
                        <View style={styles.single_menu}>
                            <TouchableOpacity onPress={()=>Actions.explore()}  style={styles.menu_text}><Image style={[styles.menu_icons,styles.menu_icons_search]} source={require('./../images/m_search.png')}/></TouchableOpacity>
                        </View>
                        <View style={styles.single_menu}>
                            <TouchableOpacity onPress={()=>Actions.record()}  style={styles.menu_text}><Image style={[styles.menu_icons,styles.menu_icons_record]} source={require('./../images/m_record.png')}/></TouchableOpacity>
                        </View>
                        <View style={styles.single_menu}>
                            <TouchableOpacity onPress={()=>Actions.notifications()}  style={styles.menu_text}><Image style={[styles.menu_icons,styles.menu_icons_notifications]} source={require('./../images/m_noti_a.png')}/>{this.totalNotiFunction()}</TouchableOpacity>
                        </View>
                        <View style={styles.single_menu}>
                            <TouchableOpacity onPress={()=>Actions.profile()}  style={styles.menu_text} ><Image style={[styles.menu_icons,styles.menu_icons_prifile]} source={require('./../images/m_profile.png')}/></TouchableOpacity>
                        </View>
                    </View>
                </View>

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
export default Notifications;