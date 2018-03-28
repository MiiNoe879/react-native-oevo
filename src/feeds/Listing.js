//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';

import Menu from './../common/Menu';
import styles from './../style';
import SpinnerBig from './../common/SpinnerBig';
import axios from 'axios';

import VideoCard from './VideoCard';
import {appEngine,gStorage} from './../common/Config';
import Spinner from './../common/Spinner';
import {Actions} from 'react-native-router-flux';
import IconF from 'react-native-vector-icons/FontAwesome';

import { updateVideos,makeFocus,renderCategories,renderVideos,exgiftModal } from './../common/Video';
var startScroll=false;
import TimerMixin from 'react-timer-mixin';
import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
console.disableYellowBox = true;
//create componet
class Listing extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            pageLoading:false,
            page:1,
            videos:[],
            offsetY: 0,
            scrollViewY: 0,
            scrollViewHeight: 0,
            closeToBottom:false,
            isEnded:false,
            isChecked:false,

            scrollViewHeight:'',
            allItems:[],
            extraTop:0,
            isMuted:'yes',
            alreadyViews:[],

            giftModal:false,
            gft_amount:null,
            giftUser:null,

            following:[], allVideos:[],likes:[],users:[],
            wPage:1,

            lastVideoId:null,
            focusedVideo:null,

            picks:[],
            laugh:[],
            userLikes:[],
        };
    }

    unMountPage(){this.updateVideos('pause','all',false,null); }


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

    componentWillMount(){ var thisClass=this;
        AsyncStorage.getItem('isMuted').then((isMuted)=>{
            thisClass.setState({isMuted:isMuted});
        });

        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
                getFollowing(username,'following').then(res=>{res.push(username);thisClass.setState({following:res}); });
                getLikes(username).then(res=>{thisClass.setState({likes:res}); });
                //likes by any user profile
                if(thisClass.props.page && thisClass.props.page=='likes'){
                    if(thisClass.props.usernameP){
                        getLikes(thisClass.props.usernameP).then(res=>{thisClass.setState({userLikes:res}); });
                    }
                }

                getUsers().then(snap=>{thisClass.setState({users:snap}); });
                thisClass.setState({username:username});  thisClass.loadVideos(1);
            }else{ Actions.signin(); }
        });

    }


    onChanged (gft_amount) {this.setState({gft_amount: gft_amount.replace(/[^0-9]/g, ''), }); }
    giftModal(){ return exgiftModal(this,this.state.username); }
    giftModlaChange(giftModal,giftUser){this.setState({giftModal:giftModal,giftUser:giftUser}); }


    loadVideos(page){ var thisClass=this;
        var shouldTake=page*10000; const videoRef=db.child('videos');
        if(thisClass.props.category){
            videoRef.orderByChild('category').equalTo(thisClass.props.category).limitToLast(shouldTake).once('value',data=>{
                thisClass.setState({refreshing: false});
                thisClass.orderQuery(data,page);
            });
        }

        if(thisClass.props.videoId){
            videoRef.child(thisClass.props.videoId).once('value',data=>{
                thisClass.orderQuery(data,page);
            });
        }

        if(thisClass.props.tags || thisClass.props.locations || (thisClass.props.page && thisClass.props.page=='likes') 
            || (thisClass.props.page && thisClass.props.page=='onrise')){
            videoRef.limitToLast(shouldTake).once('value',data=>{
                thisClass.orderQuery(data,page);
            });
        }


        if((thisClass.props.page && thisClass.props.page=='picks') || (thisClass.props.page && thisClass.props.page=='laugh')){
           db.child('admin').child(1).once('value',snap=>{
                if(snap.val()){ var snapData=snap.val();
                    if(snapData.picks){
                        picks=snapData.picks.split(',');
                        thisClass.setState({picks:picks});
                    }
                    if(snapData.laugh){
                        laugh=snapData.laugh.split(',');
                        thisClass.setState({laugh:laugh});
                    }
                }
                videoRef.limitToLast(shouldTake).once('value',data=>{
                    thisClass.orderQuery(data,page);
                });
            });
        }

        if(thisClass.props.page && thisClass.props.page=='trending'){
            videoRef.limitToLast(shouldTake).once('value',data=>{
                thisClass.orderQuery(data,page);
            });
        }


    }


    riseUsers(){
        var users=this.state.users; var resUsers=[];
        var now = new Date(); var last24Hours=new Date(now.getTime() - (168*1000*60*60));
        if(users.length > 0){
            for(index in users){
                var getNow=users[index]; var created_at=new Date(getNow.created_at);
                if(created_at > last24Hours){
                    resUsers.push(getNow.username);
                }
            }
        }
        return resUsers;
    }


    orderQuery(data,page){ var thisClass=this;
        var getVideos=[]; 
        var userLikes=thisClass.state.userLikes; var now = new Date(); var last24Hours=new Date(now.getTime() - (24*1000*60*60));
        console.log(userLikes);

        if(data.val()){
            if(thisClass.props.videoId){
                var video=data;
                var newObject=thisClass.singleVideo(video);
                getVideos.push(newObject);
            }else{
                data.forEach(function(video) {
                    var videodata=video.val(); var shouldRead=false;
                    videodata.videoId=video.key;

                    if(thisClass.props.tags){
                        if(videodata.tags){
                            var tag='#'+((thisClass.props.tags).trim()).toString();
                            var videotags=(videodata.tags).toString();
                            if(videotags.indexOf(tag)>=0){
                                shouldRead=true;
                            }
                        }
                    }else if(thisClass.props.locations){
                        if(videodata.location){
                            var location=((thisClass.props.locations).trim()).toString();
                            var videoLocations=(videodata.location).toString();
                            if(videoLocations.indexOf(location)>=0){
                                shouldRead=true;
                            }
                        }
                    }else if(thisClass.props.page){
                        if(thisClass.props.page=='likes'){
                            var getVideoId= Number(videodata.videoId);
                            if(userLikes.indexOf(getVideoId) != -1){
                                shouldRead=true;
                            }
                        }

                        if(thisClass.props.page=='trending'){
                            var now = new Date(); var last24Hours=new Date(now.getTime() - (24*1000*60*60));
                            var created_at=new Date(videodata.created_at);
                            if(created_at > last24Hours){
                                shouldRead=true;
                            }
                        }

                        if(thisClass.props.page=='laugh'){
                            if(thisClass.state.laugh && laugh.indexOf(videodata.videoId) != -1){
                                shouldRead=true;
                            }
                        }


                        if(thisClass.props.page=='picks'){
                            if(thisClass.state.picks && picks.indexOf(videodata.videoId) != -1){
                                shouldRead=true;
                            }
                        }

                        if(thisClass.props.page=='onrise'){
                            var videoUsername=videodata.username;
                            var riseUsers=thisClass.riseUsers();
                            
                            if(riseUsers.length > 0 && riseUsers.indexOf(videoUsername) != -1){
                                var getUserData=thisClass.getUserData(videodata.username);
                                if(getUserData.profilePic && getUserData.profilePic!='default.png'){
                                    shouldRead=true;
                                } 
                            }
                            
                        }

                    }else{
                        shouldRead=true;
                    }


                    if(shouldRead==true){
                        var newObject=thisClass.singleVideo(video);
                        getVideos.push(newObject); 
                    }
                });
            }


            
            if(thisClass.props.page && thisClass.props.page=='trending'){
                getVideos.sort(function(a,b) {
                  return parseInt(b.views) - parseInt(a.views);
                });
            }else if(thisClass.props.page && thisClass.props.page=='onrise'){
                getVideos.sort(function(a,b) {
                  return parseInt(b.views) - parseInt(a.views);
                });
            }else{
                getVideos.sort(function(a,b) {
                  return parseInt(b.videoId) - parseInt(a.videoId);
                });
            }

            var getFinalVideos=this.makeFirstPlay(page,getVideos);
            thisClass.setState({allVideos:getVideos},()=>thisClass.realLoadVideos(thisClass.state.page));
        }
    }


    makeFirstPlay(page,getVideos){
        var nwVideos=[];
        if(getVideos.length > 0){
            for(index in getVideos){
                var getNow=getVideos[index];
                if(index==0){
                    getNow.isFocused=true;
                }
                nwVideos.push(getNow);
            }
        }
        return nwVideos;
    }


    singleVideo(video){ var thisClass=this;
        var following=thisClass.state.following;
        var likes=thisClass.state.likes;
        var now = new Date();var minusDate=new Date(now.getTime() - (24*1000*60*60));

        if(video.val()){
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

            var getUploadedTime=new Date(newObject.created_at);
            newObject.created_at=agoFunction(getUploadedTime);

            //editable
            newObject.isEditable=false;
            if(minusDate < getUploadedTime && newObject.username==thisClass.state.username){
                newObject.isEditable=true;
            }

            return newObject;
        }
        
    }



    realLoadVideos(page){ var thisClass=this;
        var allVideos=thisClass.state.allVideos;
        if(allVideos.length>0){
            var shouldTake=parseInt(page*10);
            if(allVideos.length > 9999 && shouldTake>allVideos.length){
                var newPage=thisClass.state.page+1; var newWpage=thisClass.state.wPage+1;
                thisClass.setState({page:newPage,wPage:newWpage});
                thisClass.loadVideos(newWpage);
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


    renderLoading(){ if(this.state.pageLoading){return <SpinnerBig/>; } }
    updateVideos(param1,param2,param3,param4){ updateVideos(this,param1,param2,param3,param4); }


    handleScroll2(currentPostion) {
        var thisClass=this;
        startScroll=true;
        TimerMixin.setTimeout(()=>{
            if(startScroll==true){
                thisClass.updateVideos('focus',null,null,null); 
            }
        }, 1000);
    }

    renderVideos(){
        var thisClass= this;
        return this.state.videos.map(function(video, i){
            return(
                <VideoCard key={i} index={i} video={video} username={thisClass.state.username} 
                updateVideos={thisClass.updateVideos.bind(thisClass)} 
                checkViewsDone={thisClass.checkViewsDone.bind(thisClass)}
                giftModlaChange={thisClass.giftModlaChange.bind(thisClass)}
                users={thisClass.state.users}
                onLayout={thisClass.getDisplaySize(video.videoId)}/>
            );
        });
    }



    

    getScrollViewSize(event) {
        const {x, y, width, height} = event.nativeEvent.layout;
        this.setState({scrollViewHeight: height });
    }

    handleScroll(nativeEvent) {
        startScroll=false;
        this.makeFocus(nativeEvent.contentOffset.y);
        if (isCloseToBottom(nativeEvent)) {this.enableSomeButton(); }
    }

    makeFocus(currentPostion) {makeFocus(this,currentPostion,'listing'); }


    getDisplaySize(index) {
        var allItems=this.state.allItems;
        return (event) => {
            const {y,height } = event.nativeEvent.layout;
            let payload = {};
            payload.videoId=index;
            payload.y=y;
            payload.height=height;
            allItems.push(payload);
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
        if(thisClass.props.videoId){}else{
            if(thisClass.state.isEnded==false && thisClass.state.closeToBottom==false && thisClass.state.videos.length > 0){
                var getPage = thisClass.state.page + 1;
                thisClass.setState({closeToBottom:true, page : getPage});
                setTimeout(function(){
                    thisClass.realLoadVideos(getPage);
                },1000);
            } 
        }
    }

    renderGoback(){
        if(this.props.query && this.state.pageLoading==false){
            if(this.state.videos.length==0 && this.state.creators.length==0){
                return(<View style={styles.search_not_found}><Text style={styles.go_back_ds2}>Nothing Found!</Text><TouchableOpacity onPress={()=>Actions.search()}><Text style={styles.go_back_ds}>Go Back</Text></TouchableOpacity></View>);
            }
        }
    }

    renderCreators(){return renderCreators(this);}



    render(){
        var thisClass=this;
        return (
            <View style={styles.listing_container}>
                <View style={styles.cat_SCroll}>
                    <ScrollView  
                    onScrollBeginDrag={({nativeEvent}) =>this.handleScroll2(nativeEvent)} 
            onMomentumScrollEnd={({nativeEvent}) =>this.handleScroll(nativeEvent)} 
            onScrollEndDrag={({nativeEvent}) =>this.handleScroll(nativeEvent)} 

                    onLayout={this.getScrollViewSize.bind(this)} scrollEventThrottle={2000} style={{flex:1}}>
                        {this.renderVideos()}
                        {this.renderGoback()}
                        {this.renderCloseLoading()}
                    </ScrollView>
                    {this.renderLoading()}
                </View>
                <Menu updateVideos={thisClass.updateVideos.bind(thisClass)}/>
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
export default Listing;
