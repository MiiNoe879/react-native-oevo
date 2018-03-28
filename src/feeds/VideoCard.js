//import libray
import React, {Component} from 'react';
import { View, Text, Image, TouchableOpacity,Modal, TouchableWithoutFeedback, Alert,ActivityIndicator } from 'react-native';
import {Actions} from 'react-native-router-flux';

import ModalSelector from './../common/ModalSelector';
import styles from './../style';
import Video from 'react-native-video';

import {appEngine,gStorage} from './../common/Config';

import axios from 'axios';
import Spinner from './../common/Spinner';
import Share from 'react-native-share';
var tPress=[];
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFI from 'react-native-vector-icons/Ionicons';
import IconFM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFM2 from 'react-native-vector-icons/MaterialIcons';
import IconFE from 'react-native-vector-icons/Entypo';
import IconFS from 'react-native-vector-icons/SimpleLineIcons';
import TimerMixin from 'react-timer-mixin';

import {db,firebase,getFile,addNotifications}  from './../db/DbConfig';
import {tagsAnalysis} from './../common/Video';
import FastImage from 'react-native-fast-image';


var isCalled=false;
//create componet
class VideoCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
          username: this.props.username,
          alreadyViews:[],
          addShare:true,

          tagFollowers:[],
        };
    }
    updateVideos(param1,param2,param3,param4){ this.props.updateVideos(param1,param2,param3,param4); }
    
    componentWillMount(){ var thisClass=this;
        
    }

    onEnd(video){ var thisClass=this; var videoId=video.videoId;
        var alreadyViews=thisClass.props.checkViewsDone(videoId); alreadyViews=Number(alreadyViews);
        if(alreadyViews < 21){
            db.child('videos').child(videoId).once('value',snap=>{
                if(snap.val()){ var videoData=snap.val();
                    var newViews=parseInt(videoData.views) + 1;
                    db.child('videos').child(videoId).update({views:newViews});
                }
            });

            db.child('users').orderByChild('username').equalTo(video.username).once('child_added',snap=>{
                if(snap.val()){ var userData=snap.val();
                    var newViews2=parseInt(userData.views) + 1;
                    db.child('users').child(snap.key).update({views:newViews2});
                }
            });

            var now = new Date(); var created_at=now.toJSON();
           
            db.child('views').child('NaN').remove();
            db.child('views').limitToLast(1).once('child_added',lastRow=>{
                var primaryKey=parseInt(lastRow.key) + 1;
                db.child('views').child(primaryKey).once('value',isExits=>{
                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                    var created_at=new Date().toJSON();
                    
                    var insertObject={};
                    insertObject.creator=video.username;
                    insertObject.username=thisClass.state.username;
                    insertObject.videoId=video.videoId;
                    insertObject.created_at=created_at;
                    db.child('views').child(primaryKey).set(insertObject);
                });
            });
        }


    }

    tagsAnalysis(tag,mentioned){
        return tagsAnalysis(tag,mentioned);
    }

    renderTagsLoop(tags){
        var thisClass=this;
        if(tags && tags.length>0){
            return tags.map(function(tag, i){
                if(tag.type=='tag'){
                    return(<Text key={i} onPress={()=>[thisClass.updateVideos('mute','all',false,null), Actions.query({tags:tag.val})]} style={[styles.single_tag_d,styles.single_tag_d_tga]}>#{tag.val}</Text>);
                }else if(tag.type=='link'){
                    return(<Text key={i} onPress={()=>[thisClass.updateVideos('mute','all',false,null), Linking.openURL(tag.val)]} style={[styles.single_tag_d,styles.single_tag_d_link]}>{tag.val}</Text>);
                }else if(tag.type=='follower'){
                    return(<Text key={i} onPress={()=>[thisClass.updateVideos('mute','all',false,null), Actions.profile({username:tag.val})]} style={[styles.single_tag_d,styles.single_tag_d__fol]}>@{tag.val}</Text>);
                }else if(tag.type=='non_follower'){
                    return(<Text key={i} style={styles.single_tag_d}>@{tag.val}</Text>);
                }else{
                    return(<Text key={i} style={styles.single_tag_d_t}>{tag.val}</Text>);
                }
                
            });
        }
    }


    renderTags(video){
        if(video){
            var mentioned=[];
            if(video.mentioned){mentioned=video.mentioned;}
            var tags=this.tagsAnalysis(video.tags,mentioned);
            return(
                <Text style={styles.single_tag_m_con}>
                    <Text style={styles.single_tag_d_t}>{this.renderTagsLoop(tags)}</Text>
                </Text>
            );
        }
    }


    hitLikes(video){ var thisClass=this;
        thisClass.updateVideos('likeLoading',video.videoId,null,null);

        var shouldAdd=true;
        if(video.isLiked=='yes'){ var shouldAdd=false;  }
        if(shouldAdd==true){
            var newLikes=parseInt(video.likes) + 1; var shouldAdded='yes';
        }else{
            var newLikes=parseInt(video.likes) - 1; var shouldAdded='no';
        }
        if(newLikes < 0){newLikes=0;}
        setTimeout(function(){
            thisClass.updateVideos('like',video.videoId,shouldAdded, newLikes);
        },500);
        db.child('videos').child(video.videoId).update({likes:newLikes});


        if(shouldAdd==true){
            db.child('likes').child('NaN').remove();
            db.child('likes').limitToLast(1).once('child_added',lastRow=>{
                var primaryKey=parseInt(lastRow.key) + 1;
                db.child('likes').child(primaryKey).once('value',isExits=>{
                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                    var created_at=new Date().toJSON();
                    
                    var insertObject={};
                    insertObject.username=thisClass.props.username;
                    insertObject.videoId=video.videoId;
                    insertObject.creator =video.username;
                    insertObject.created_at=created_at;
                    db.child('likes').child(primaryKey).set(insertObject);

                    addNotifications(video.username,video.videoId,thisClass.props.username,'like',null);
                });
            });
        }else{
            db.child('likes').orderByChild('videoId').equalTo(video.videoId).once('value',snap=>{
                if(snap.val()){
                    snap.forEach(function(data){
                        if(data.val() && data.val().username==thisClass.props.username){
                            db.child('likes').child(data.key).remove(); 
                        }
                    });
                }
            });
        }
        
    }




    soundPress(){
        this.updateVideos('mute','all','alert',null);
    }

    unMountPage(){
        this.updateVideos('pause','all','alert',null);
    }


    resetAction(key, video){
        var videoId=video.videoId;
        var user=video.user;
        var thisClass=this;

        if(key=='delete_action'){
            setTimeout(function(){
                Alert.alert( 'Confirmation', 'Want to delete video?', 
                    [ 
                        {text: 'Cancel', onPress: () => console.log(), style: 'cancel'},
                        {text: 'Delete', onPress: () => thisClass.deleteVideo(videoId) },
                    ], 
                    { cancelable: false } 
                );
            }, 100);
        }else if(key=='donate_action'){
            this.props.giftModlaChange(true,user.username);
        }else if(key=='edit_action'){
            thisClass.updateVideos('mute','all',false,null);
            Actions.updatepost({video:video,isEdit:true});
        }else{
            var username=thisClass.props.username;
            db.child('reports').orderByChild('video_cmnts_Id').equalTo(videoId).once('value',snap=>{
                var addTrue=true;
                if(snap.val()){
                    snap.forEach(function(data){
                        if(data.val()){ var singleDta=data.val();
                            if(singleDta.username==username){
                                addTrue=false;
                            }
                        }
                    });
                }
                if(addTrue==true){
                    db.child('reports').child('NaN').remove();
                    db.child('reports').limitToLast(1).once('child_added',lastRow=>{
                        var primaryKey=parseInt(lastRow.key) + 1;
                        db.child('reports').child(primaryKey).once('value',isExits=>{
                            if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                            var created_at=new Date().toJSON();
                            
                            var insertObject={};
                            insertObject.video_cmnts_Id=videoId;
                            insertObject.username=username;
                            insertObject.type='video';
                            insertObject.created_at=created_at;

                            db.child('reports').child(primaryKey).set(insertObject);
                            Alert.alert( 'Confirmation', 'Video has been reported successfully!');
                        });
                    });
                }else{
                    Alert.alert( 'Confirmation', 'You have already reported this video!');
                }
            });
        }
    }




    deleteVideo(videoId){ var thisClass=this;
        db.child('videos').child(videoId).once('value',snap=>{
            if(snap.val()){ var vieoD=snap.val();
                if(vieoD.username==thisClass.props.username){
                    db.child('videos').child(snap.key).remove();

                    //update user data 
                    db.child('users').orderByChild('username').equalTo(thisClass.state.username).once('child_added',snap=>{
                        if(snap.val()){ var userData=snap.val();
                            var newVideos=parseInt(userData.videos) - 1; 
                            if(newVideos<0){newVideos=0;}
                            db.child('users').child(snap.key).update({videos:newVideos});
                        }
                    });
                    thisClass.updateVideos('delete',videoId,null,null);    

                    db.child('likes').orderByChild('videoId').equalTo(videoId).once('value',snap=>{
                        if(snap.val()){
                            snap.forEach(function(data){
                                if(data.key){
                                    db.child('likes').child(data.key).remove(); 
                                }
                            });
                        }
                    });


                    db.child('notifications').orderByChild('videoId').equalTo(videoId).once('value',snap3=>{
                        if(snap3.val()){
                            snap3.forEach(function(data3){
                                if(data3.key){
                                    db.child('notifications').child(data3.key).remove(); 
                                }
                            });
                        }
                    });

                }
            }
        });
    }


    subscribe(username, isFollowed){ var thisClass=this;
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
            thisClass.updateVideos('follow',username,null,resValue);   

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


    commentsActions(videoId,muted){
        this.updateVideos('mute','all',false,null);
        Actions.comments({videoId:videoId,thisClass:this});
    }



    socialShare(video){
        this.unMountPage();
        var videoUrl = 'https://oevo.com/video/'+video.videoId; var thisClass=this;
        var shareOptions = {
          title: "Oevo - Create 7 Second Videos",
          message: '',
          url: videoUrl,
          subject: "Oevo - Create 7 Second Videos",
        };
        Share.open(shareOptions).catch((err) => { thisClass.onShareError(err) });
        setTimeout(function(){ if(thisClass.state.addShare){ thisClass.addShare(video.videoId); } }, 10000);
    }

    addShare(videoId){
        db.child('videos').child(videoId).once('value',snap=>{
            if(snap.val()){ var videoData=snap.val();
                var newShares=parseInt(videoData.shares) + 1;
                db.child('videos').child(videoId).update({shares:newShares});
            }
        });
    }

    onShareError(err){
        this.setState({addShare:false});
    }

    renderLocations(location){
        if(location){
            return(<TouchableOpacity onPress={()=>[this.updateVideos('mute','all',false,null), Actions.query({locations:location})]}><Text style={styles.video_location}>{location}</Text></TouchableOpacity>);
        }
    }

    renderFolowbtuons(video){
        var thisClass=this; var isSubscribed=null;
        if(video.username!=this.state.username){
            if(video.isFollowed=='yes'){
                var isSubscribed = require('./../images/sucess_addd.png'); 
            }else{
                var isSubscribed = require('./../images/small_add_circle.png'); 
            }
        }

        if(this.props.followButton){

        }else if(isSubscribed){
            return(<TouchableOpacity style={styles.listing_user_add} onPress={()=>thisClass.subscribe(video.username,video.isFollowed)}>
                <Image  style={styles.listing_user_add_img} source={isSubscribed}/>
            </TouchableOpacity>);
        }
    }

    videoPress(video){ var thisClass=this;
        tPress.push(video.videoId);
        setTimeout(function(){
            if(tPress.length==3){
                if(video.username!=thisClass.state.username){
                    thisClass.props.giftModlaChange(true,video.user.username);
                }
            }else if(tPress.length==2){
                if(video.isLiked=='no'){
                    thisClass.hitLikes(video);
                }
            }else if(tPress.length==1){
                thisClass.soundPress();
            }
            tPress=[];
        }, 600);
    }


    removeFollow(video){
        if(this.props.isHome=='yes'){}else{
            return(
                this.renderFolowbtuons(video)
            );
        }
    }

    profileActions(username){
        if(this.props.profile && this.props.profile==username){

        }else{
            this.updateVideos('mute','all',false,null);
            Actions.profile({username:username});
        }
    }


    loadStart(getTime,video){  var thisClass=this;
        if(getTime && video.loading==true){
            thisClass.updateVideos('loading',video.videoId,null,null); 
        }
        var currentTime=parseInt(getTime.currentTime);
        if(currentTime!=0 || currentTime!='0'){
            if(isCalled==false){
                isCalled=true;
                thisClass.onEnd(video);
            }
        }else{
            isCalled=false;
        }
    }

    getUserData(username){
        var getUsers=this.props.users;
        if(getUsers.length>0){
            for(index in getUsers){
                var getNow=getUsers[index];
                if(getNow.username==username){
                    return getNow;
                }
            }
        }
    }


    render() {
        var thisClass= this;
        var video = thisClass.props.video;
        var userData=thisClass.getUserData(video.username);
        if(userData){
            video.user=userData;
            var userImage = gStorage+'/profile_thumbs/'+video.user.profilePic;
            
            if(video.isLiked=='yes'){
                var isLiked = <Image  style={styles.single_listing_middle_b_single_i} source={require('./../images/new_likes_ds_actve.png')}/> ; 
            }else{
                var isLiked = <Image  style={styles.single_listing_middle_b_single_i} source={require('./../images/new_likes_ds.png')}/> ;
            } 
            
            var getModaldata = [{ key: 'donate_action', label: 'Gift Coins' },{ key: 'report_action', label: 'Report' }];
            if(thisClass.props.username==video.username){
                if(video.isEditable==true){
                    var getModaldata = [{ key: 'edit_action', label: 'Edit' },{ key: 'delete_action', label: 'Delete' } ];
                }else{
                    var getModaldata = [{ key: 'delete_action', label: 'Delete' } ];
                }
                
            }
            const data = getModaldata;
            var thumbnailUrl = gStorage+'/thumbnails/'+video.thumbnail;
            
            var finalMuted= video.muted; var videoPlayer=null; var videoThumbnail=null; var videoLoadingSign=null;
            var videoUrl=gStorage+'/videos/'+video.video;

            if (video.isFocused) {
                //console.log(videoUrl);
                if(video.loading){
                    videoLoadingSign = (
                        <View style={styles.ds_video_loading}><Spinner/></View>
                    );
                }
                videoPlayer=(
                    <TouchableWithoutFeedback style={styles.preview} onPress={() => thisClass.videoPress(video)}>
                        <Video
                            source={{uri: videoUrl}}
                            style={styles.list_preview}
                            ref={(ref) => {
                             thisClass.player = ref;
                            }} 
                            rate={1.0}
                            playInBackground={false}  
                            muted={finalMuted}
                            ignoreSilentSwitch={"ignore"} 
                            paused={false}
                            volume={1.0}
                            resizeMode="cover"
                            playWhenInactive={false}   
                            //onEnd={()=>thisClass.onEnd(video)}
                            progressUpdateInterval={50}
                            onProgress={(getTime)=>thisClass.loadStart(getTime,video)}
                            repeat={true}
                            />
                    </TouchableWithoutFeedback>
                );
            }else{
                var videoThumbnail=(
                    <TouchableWithoutFeedback style={styles.preview} onPress={() => thisClass.videoPress(video)}>
                        <FastImage
                            style={styles.player_area}
                            source={{
                              uri: thumbnailUrl,
                              priority: FastImage.priority.high,
                            }}
                        />
                    </TouchableWithoutFeedback>
                );
            }

            var likedHover=null;
            if(video.likeLoading){
                likedHover=(<View style={styles.heart_hover_area}><IconFI name="md-heart" style={[styles.heart_hover_area_icons]}/></View>);
            }

            if(finalMuted==true){
                var isMuted = 'md-volume-off'; 
            }else{
                var isMuted = 'md-volume-up';
            }



            var verifiedIcons=null;
            if(video.user.ac_type=='celebrity'){
                verifiedIcons=(<IconF name="check-circle" style={[styles.video_verified_icon,styles.video_verified_icon56]}/>);
            }

            return(
                <View style={[styles.single_listing]} onLayout={thisClass.props.onLayout}>
                    <View style={styles.single_listing_top}>
                        <View style={styles.single_listing_top_left}>
                            <View style={styles.single_listing_top_left_left}>
                                <TouchableOpacity onPress={()=>this.profileActions(video.username)} style={styles.listing_user_img_t}>
                                    <Image  style={styles.listing_user_img}  source={{uri : userImage }}/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.single_listing_top_left_right}>
                                <TouchableOpacity style={styles.username_top_video} onPress={()=>this.profileActions(video.username)}>
                                <Text style={styles.user_name}>{video.user.name}</Text>{verifiedIcons}</TouchableOpacity>
                                <View style={styles.single_listing_top_left_right_area}>
                                    <IconFI name="md-time" style={[styles.clock_icon_video]}/>
                                    <Text style={styles.user_name_hours}>{video.created_at}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.single_listing_top_right}>
                            <View style={styles.single_listing_top_right_left}>
                            {this.removeFollow(video)}
                            </View>
                            <View style={styles.single_listing_top_right_right}>
                                <Text style={styles.listing_user_add_txtb}>{video.views}</Text>
                                <Text style={styles.listing_user_add_txts}>CIRCLES</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.single_listing_middle}>
                        <View style={styles.player_area}>
                            {videoPlayer}{videoLoadingSign}{videoThumbnail}{likedHover}
                        </View>

                        <TouchableOpacity onPress={()=>thisClass.soundPress()} style={styles.player_sound}>
                            <IconFI name={isMuted} style={[styles.single_listing_middle_b_single_i45]}/> 
                        </TouchableOpacity>
                    </View>

                    <View style={styles.single_listing_bottom}>
                        <View style={styles.single_listing_bottom_bottom}>
                            <View style={styles.video_tags_area}>
                                {thisClass.renderTags(video)}
                            </View>
                            {this.renderLocations(video.location)}
                        </View>
                    </View>

                    <View style={styles.single_listing_middle_b}>
                        <View style={styles.single_listing_middle_b_single}>
                            <View style={styles.single_listing_middle_b_single_area}>
                                <TouchableOpacity onPress={()=>thisClass.hitLikes(video)} style={styles.listing_menu_t_area}>
                                    <View style={styles.single_listing_middle_b_single_touch}>
                                        {isLiked}
                                    </View>
                                    <Text style={styles.single_listing_middle_b_single_txt}>{video.likes} Likes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={styles.single_listing_middle_b_single}>
                            <View style={styles.single_listing_middle_b_single_area}>
                                <TouchableOpacity onPress={()=>thisClass.socialShare(video)} style={styles.listing_menu_t_area}>
                                    <View style={styles.single_listing_middle_b_single_touch}>
                                        <Image  style={styles.single_listing_middle_b_single_i2} source={require('./../images/new_share_ds.png')}/> 
                                    </View>
                                    <Text style={styles.single_listing_middle_b_single_txt}>{video.shares} Shares</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ModalSelector data={data} style={styles.video_edit_btn}
                              onChange={(option)=>{ thisClass.resetAction(option.key,video) }}>
                            <IconFM name="dots-horizontal" style={[styles.home_mneu_more_img]}/> 
                        </ModalSelector>

                    </View>

                    <View style={styles.new_video_cmnts}>
                        <View style={[styles.new_video_cmnts_left]}>
                            <Text onPress={()=>thisClass.commentsActions(video.videoId,video.muted) } style={styles.new_video_cmnts_left_txt}>Add your comment...</Text>
                        </View>
                        <View style={[styles.new_video_cmnts_right]}>
                            <View style={styles.new_video_cmnts_right_main}>
                                <Text onPress={()=>thisClass.commentsActions(video.videoId,video.muted) } style={styles.new_video_cmnts_right_txt}>{video.comments} Comments</Text>
                                <IconFI name="ios-arrow-down" style={[styles.ew_video_c_comments_down]}/>
                            </View>
                        </View>
                    </View>


                </View>
            );
        }else{
            return(
                <View></View>
            );
        }
    }
}


//export components
export default VideoCard;
