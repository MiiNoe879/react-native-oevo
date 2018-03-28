//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView,StatusBar, NativeModules,TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';

import Menu from './../common/Menu';
import styles from './../style';

import SpinnerBig from './../common/SpinnerBig';
import axios from 'axios';
import Spinner from './../common/Spinner';
import {appEngine,gStorage} from './../common/Config';
import VideoCard from './../feeds/VideoCard';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFO from 'react-native-vector-icons/Octicons';
import IconFE from 'react-native-vector-icons/EvilIcons';


import { updateVideos,makeFocus,renderCategories,exgiftModal } from './../common/Video';
import {renderUploadsLoadings,renderLoadingPercenatge}  from './../common/Video';

import TimerMixin from 'react-timer-mixin';
import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';



const { RNTwitterSignIn } = NativeModules;


var startScroll=false;
//create componet
class Index extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'', pageLoading:true, following:[], allVideos:[], videos:[], categories:[],likes:[],users:[],
            isEnded:false,
            isCheck:false,

            scrollViewHeight:'',
            allItems:[],
            extraTop:0,
            wPage:1,
            page:1,
            isMuted:'yes',
            closeToBottom:false,

            uploadPercentage:0,
            alreadyViews:[],

            giftModal:false,
            gft_amount:null,
            giftUser:null,

            lastVideoId:null,
            focusedVideo:null,
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

    componentWillMount(){ var thisClass=this;
        AsyncStorage.getItem('isMuted').then((isMuted)=>{
            thisClass.setState({isMuted:isMuted});
        });
        
        StatusBar.setBarStyle('dark-content', true);
        AsyncStorage.getItem('username').then((username)=>{
            renderUploadsLoadings(thisClass,username);
            if(username){
                thisClass.getTemFiles(username);
                renderUploadsLoadings(thisClass,username);
                getFollowing(username,'following').then(res=>{
                    res.push(username);thisClass.setState({following:res}); 
                    getLikes(username).then(res=>{thisClass.setState({likes:res}); 

                        getUsers().then(snap=>{thisClass.setState({users:snap}); 
                            thisClass.setState({username:username});thisClass.loadCtegories(username); thisClass.loadVideos(1);
                        });
                    });
                });
            }else{
                Actions.signin();
            }
        });
    }


    getTemFiles(username){ var thisClass=this;
        var myFiles=[];
        AsyncStorage.getItem('videos').then((videos) => { 
            if(videos){ var videos=JSON.parse(videos);
                if(videos.length>0){
                    for(ind in videos){
                        var getNow=videos[ind];
                        if(getNow.username==username){
                            if(getNow.thumbnails.length>0){
                                for(infex2 in getNow.thumbnails){
                                    var getNow2=getNow.thumbnails[infex2];
                                    getNow2Ex=getNow2.split('/');
                                    myFiles.push(getNow2Ex[getNow2Ex.length-1]);
                                }
                            }
                            var videoPath=(getNow.video).split('/');
                            myFiles.push(videoPath[videoPath.length-1]);
                        }
                    }
                    thisClass.deleteTemFiles(myFiles);
                }
            }else{
                thisClass.deleteTemFiles(myFiles);
            }
        });
    }


    
    deleteTemFiles(saveFiles){
         RNTwitterSignIn.getTemFiles('/data/user/0/com.oevo/cache/').then(function(res){
            res=Object.keys(res).map(key => res[key]);
            if(res.length>0){
                for(index in res){
                    var getNow=res[index];
                    if(saveFiles.indexOf(getNow) != -1){}else if(getNow.indexOf('.') != -1){
                        RNTwitterSignIn.deleteTempFile('/data/user/0/com.oevo/cache/',getNow).then(function(res){});
                    }
                }
            }
        });
    }





    unMountPage(){this.updateVideos('pause','all',false,null); }

    onChanged (gft_amount) {this.setState({gft_amount: gft_amount.replace(/[^0-9]/g, ''), }); }
    giftModal(){ return exgiftModal(this,this.state.username); }
    giftModlaChange(giftModal,giftUser){this.unMountPage(); this.setState({giftModal:giftModal,giftUser:giftUser}); }
    renderLoading(){if(this.state.pageLoading){return <SpinnerBig/>; } }
    renderCategories(){ return renderCategories(this); }
    updateVideos(param1,param2,param3,param4){ updateVideos(this,param1,param2,param3,param4); }

    renderVideos(){
        var thisClass=this;
        if(this.state.users.length > 0 ){
            return thisClass.state.videos.map(function(video, i){
                return(
                    <VideoCard key={i} index={i} video={video}  username={thisClass.state.username} 
                    updateVideos={thisClass.updateVideos.bind(thisClass)} 
                    checkViewsDone={thisClass.checkViewsDone.bind(thisClass)}
                    giftModlaChange={thisClass.giftModlaChange.bind(thisClass)}
                    onLayout={thisClass.getDisplaySize(video.videoId)}
                    users={thisClass.state.users}
                    isHome={'yes'}/>
                );
            });
        }
    }

    loadCtegories(username){ var thisClass=this;
        db.child('categories').once('value',snap=>{
            if(snap.val()){
                var categories=[];
                snap.forEach(function(cat) {
                    var catObject=cat.val();catObject.categoryId=cat.key;
                    categories.push(catObject);
                });
                thisClass.setState({categories:categories});
            }
        });
    }


    loadVideos(page){ var thisClass=this;
        console.log('000');
        var shouldTake=page*10000;
        db.child('videos').limitToLast(shouldTake).once('value',data=>{
            var getVideos=[]; 
            if(data.val()){
                var following=this.state.following;

                var likes=this.state.likes;
                var now = new Date();var minusDate=new Date(now.getTime() - (24*1000*60*60));

                data.forEach(function(video) {
                    var newObject=video.val();
                    if(following.indexOf(newObject.username) != -1){
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
                        getVideos.push(newObject); 

                    }
                });
                getVideos.sort(function(a,b) {
                  return parseInt(b.videoId) - parseInt(a.videoId);
                });
                //console.log(getVideos);
                thisClass.setState({allVideos:getVideos,isCheck:true,pageLoading:false},()=>thisClass.realLoadVideos(thisClass.state.page));
            }
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
                thisClass.setState({videos:newGetVideos,closeToBottom:false}); 
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

    makeFocus(currentPostion) {makeFocus(this,currentPostion,'home'); }


    handleScroll2(currentPostion) {
        var thisClass=this;
        startScroll=true;
        TimerMixin.setTimeout(()=>{
            if(startScroll==true){
                thisClass.updateVideos('focus',null,null,null); 
            }
        }, 1000);
    }


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
        if(thisClass.state.isEnded==false && thisClass.state.closeToBottom==false && thisClass.state.videos.length > 0){
            var getPage = thisClass.state.page + 1;
            thisClass.setState({closeToBottom:true, page : getPage});
            setTimeout(function(){
                thisClass.realLoadVideos(getPage);
            },1000);
        } 
    }


    renderHome(){
        if(this.state.allVideos.length==0 && this.state.isCheck==true){
            return(
            <View style={styles.home_not_found}>
                <TouchableOpacity onPress={()=>Actions.invite()} style={styles.home_not_found_main}>
                    <View style={styles.home_not_found_main_m}>
                        <IconF name="users" style={[styles.notfound_h_txt]}/> 
                        <Text style={styles.home_not_found_txt}>Find and Invite friends</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>Actions.explore()} style={[styles.home_not_found_main,styles.home_not_found_main2]}>
                    <View style={styles.home_not_found_main_m}>
                        <IconF name="search-plus" style={[styles.notfound_h_txt]}/> 
                        <Text style={styles.home_not_found_txt}>Go to Explore</Text>
                    </View>
                </TouchableOpacity>
            </View>
            );
        }else{
            return(
                <View>
                    {this.renderVideos()}
                </View>
            );
        }

    }

    renderContents(){
        return(
            <View style={{flex:1}}>
            <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
            <ScrollView 
            onScrollBeginDrag={({nativeEvent}) =>this.handleScroll2(nativeEvent)} 
            onMomentumScrollEnd={({nativeEvent}) =>this.handleScroll(nativeEvent)} 
            onScrollEndDrag={({nativeEvent}) =>this.handleScroll(nativeEvent)} 
            onLayout={this.getScrollViewSize.bind(this)} 
            scrollEventThrottle={2000} style={styles.homeSCrollView}>
                <View onLayout={(event) => this.measureView(event)}>
                    <View style={[styles.top_creators_win]}>
                        <Text style={styles.win_heading}>WIN <Text style={styles.win_heading2}>$100</Text> DAILY!</Text>
                        <TouchableOpacity style={styles.learn_more_t} onPress={()=>{this.unMountPage(), Actions.LearnMore()}}>
                            <Text style={styles.learn_more_txt}>LEARN MORE</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.categories_area,{marginTop:10, marginBottom:10}]}>
                        <View style={styles.categories_area_bottom}>
                            <ScrollView horizontal= {true} decelerationRate={0} snapToInterval={200}  snapToAlignment={"center"}>
                                {this.renderCategories()}
                            </ScrollView>
                        </View>
                    </View>
                </View>
                {this.renderTrendingIcons()}

                {this.renderHome()}
                {this.renderCloseLoading()}
            </ScrollView>
            {this.renderLoading()}
            </View>
        );
    }


    renderTrendingIcons(){
        if(this.state.isCheck){
            return(
                <View style={styles.new_trending_top}>
                    <View style={[styles.new_trending_top_left]}>
                        <TouchableOpacity onPress={()=>{this.unMountPage(),Actions.trending()}} style={styles.new_trending_top_left_tou}>
                            <Image  style={styles.new_trending_top_leftimg} source={require('./../images/trending_icons1.png')}/> 
                            <Text style={styles.new_trending_top_txt}>Trending Now</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.new_trending_top_left}>
                        <TouchableOpacity onPress={()=>{this.unMountPage(),Actions.onrise()}} style={styles.new_trending_top_left_tou}>
                            <Image  style={styles.new_trending_top_leftimg} source={require('./../images/trending_icons.png')}/> 
                            <Text style={styles.new_trending_top_txt}>On The Rise</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }



    render(){
        var thisClass=this;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                {renderLoadingPercenatge(thisClass,'home')}
                <View style={styles.home_header_r}>
                    <Image  style={styles.home_logo_im} source={require('./../images/page_logo2.png')}/>
                    
                    <TouchableOpacity style={[styles.winners_menu_new]} onPress={()=>Actions.winners()}>
                        <Image  style={[styles.winners_top_troppy_new,styles.winners_top_troppy_new45]} source={require('./../images/new_tttrpy.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.invite()}>
                        <IconF name="user-plus" style={[styles.back_vator,styles.profile_user_plus,styles.profile_user_plus34]}/>    
                    </TouchableOpacity>

                </View>


                {this.renderContents()}
                <Menu activeMenu="home" updateVideos={thisClass.updateVideos.bind(thisClass)}/>
                {this.giftModal()}
            </View>
        );
    }

}



const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 200;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

//export to other parts
export default Index;
