//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput,Linking, TouchableOpacity, TouchableHighlight,ActivityIndicator, NativeModules,AsyncStorage,Keyboard, ScrollView, Switch,StatusBar, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';


import axios from 'axios';

import SpinnerBig from './../common/SpinnerBig';
import styles from './../style';
import KeyboardAwareScrollView from './../common/KeyboardAwareScrollView';
import ModalSelector from './../common/ModalSelector';
import Spinner from './../common/Spinner';


import {appEngine,gStorage}  from './../common/Config';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFM from 'react-native-vector-icons/MaterialCommunityIcons';
import { isIphoneX } from './../common/isIphoneX';

import {db,firebase,nFormat,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';
import {tagsAnalysis} from './../common/Video';

//create componet
class Comments extends Component{
    constructor(props) {
        super(props);
        console.log(this.props.videoId);
        this.state = {
          videoId: Number(this.props.videoId),
          //videoId: 68,
          allcomments:[],
          comments:[],
          followers:null,
          filterFollowers:null,
          comment:'',
          username:'',
          userData:'',
          pageLoading:false,
          isFocused:false,
          page:1,
          wPage:1,
          parentId:null,
          replyingto:null,
          isChild:false,

          boxBottom:0,
          boxHeight:0,
          showSuggest:false,
          isMentioned:'no',
          closeToBottom:false,
          allItems:[],
          isEnded:false,

          users:[],
          tagsFollowers:[],
          allMentioned:[],
        };
    }


    componentWillMount(){ var thisClass=this;
        StatusBar.setHidden(false); 
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ this.setState({username:username}); 

//get user data
db.child('users').orderByChild('username').equalTo(username).once('child_added',snapUser=>{
    if(snapUser.val()){ thisClass.setState({userData:snapUser.val()}); }
});

                getUsers().then(snap=>{
                    thisClass.setState({users:snap},()=>this.loadCommments(1));

                    db.child('subscribers').orderByChild('following').equalTo(username).once('value',snap2=>{
                        var followers=[]; var tagsFollowers=[];
                        if(snap2.val()){
                            snap2.forEach(function(data){ var ff=data.val();
                                var myObject=thisClass.getUserData2(snap,ff.followed_by); tagsFollowers.push(ff.followed_by);
                                if(myObject) {followers.push(myObject); }
                            });
                        }
                        thisClass.setState({followers:followers,tagsFollowers:tagsFollowers});
                    });

                });

                
                
            }else{ Actions.signin(); }
        }); 
    }


    tagsAnalysis(tag,mentioned){
        return tagsAnalysis(tag,mentioned);
    }



    getUserData2(getUsers,username){
        var res=null;
        if(getUsers.length>0){
            for(index in getUsers){
                var getNow=getUsers[index];
                if(getNow.username==username){
                    res={};
                    res.name=getNow.name;
                    res.username=getNow.username;
                    res.profilePic=getNow.profilePic;
                }
            }
        }
        return res;
    }



    loadCommments(page){ var thisClass=this;
        shouldTake=parseInt(page)*1000;
        db.child('comments').orderByChild('videoId').equalTo(thisClass.state.videoId).limitToLast(shouldTake).once('value',snap=>{
            if(snap.val()){
                var allcomments=[];
                
                snap.forEach(function(data){ var comment=data.val();
                    comment.commentId=data.key;
                    comment.load=3;
                    if(!comment.childs){
                        comment.childs=[];
                    }else{
                        //console.log(comment.childs);
                        var getChilds=comment.childs; var mainChilds=[];
                        Object.keys(getChilds).forEach(function(key) {
                            var singleChild=getChilds[key]; singleChild.commentId=key;
                            mainChilds.push(singleChild);
                        });

                        //console.log(mainChilds);
                        
                        mainChilds.sort(function(a,b) {
                          return parseInt(a.commentId) - parseInt(b.commentId);
                        });
                        comment.childs=mainChilds;
                    }
                    allcomments.push(comment);
                });
                allcomments.sort(function(a,b) {
                  return parseInt(a.commentId) - parseInt(b.commentId);
                });

                thisClass.setState({allcomments:allcomments},()=>thisClass.realloadCommments(thisClass.state.page));
            }
        });
    }


    realloadCommments(page){ var thisClass=this;
        var allcomments=thisClass.state.allcomments;
        if(allcomments.length>0){
            var shouldTake=parseInt(page*15);
            if(allcomments.length > 9999 && shouldTake>allcomments.length){
                var newPage=thisClass.state.page+1; var newWpage=thisClass.state.wPage+1;
                thisClass.setState({page:newPage,wPage:newWpage});thisClass.loadCommments(newWpage);
            }else{
                if(allcomments.length > shouldTake){
                    var comments=allcomments.slice(1).slice(-shouldTake);
                }else{
                    var comments=allcomments
                }
                thisClass.setState({comments:comments,isCheck:true,closeToBottom:false}); 
                if(allcomments.length < shouldTake){
                    thisClass.setState({isEnded:true});
                }
            }
        }
    }


    commentSubmit(){ var thisClass=this;
        db.child('comments').child('NaN').remove();
        var thisClass=this;
        var getComment = thisClass.state.comment.trim();
        if(getComment.length<1){
            Alert.alert('Warning!','Please type something and click post!');
        }else{
            var globalMentioned=[];
            var regexp2 = /@\w\w+\b/g; var getMentioned = getComment.match(regexp2);
            if(getMentioned && getMentioned.length>0){
                for(inm in getMentioned){ var getNowF=getMentioned[inm].replace('@','');
                    globalMentioned.push(getNowF);
                }
            }

            var parentId=thisClass.state.parentId; 
            Keyboard.dismiss(); 
            var getComment=thisClass.state.comment;

            if(parentId){
                db.child('comments').child(parentId).once('value',lastRow=>{
                    if(lastRow.val().childs){
                        var primaryKey=null;
                        var getChilds=lastRow.val().childs;
                        Object.keys(getChilds).forEach(function(key) {
                            primaryKey=key;
                        });
                        primaryKey=parseInt(primaryKey) + 1; 
                    }else{var primaryKey=5; }


                    if(primaryKey==5){
                        var created_at=new Date().toJSON();
                        var insertObject={};
                        insertObject.videoId=thisClass.state.videoId;
                        insertObject.username=thisClass.state.username;
                        insertObject.comment=getComment;
                        insertObject.parentId=parentId;
                        insertObject.mentioned=globalMentioned;
                        insertObject.created_at=created_at;
                        db.child('comments').child(parentId).child('childs').child(6).set(insertObject);
                        thisClass.loadCommments(thisClass.state.wPage); thisClass.setState({isFocused:false, parentId:null,replyingto:null,isChild:false});
                    
                        thisClass.comnstNotifications(parentId,getComment);
                        thisClass.setState({comment:''});
                    }else{
                        db.child('comments').child(parentId).child('childs').child(primaryKey).once('value',isExits=>{
                            if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                            var created_at=new Date().toJSON();
                            
                            var insertObject={};
                            insertObject.videoId=thisClass.state.videoId;
                            insertObject.username=thisClass.state.username;
                            insertObject.comment=getComment;
                            insertObject.parentId=parentId;
                            insertObject.mentioned=globalMentioned;

                            insertObject.created_at=created_at;

                            db.child('comments').child(parentId).child('childs').child(primaryKey).set(insertObject);
                            thisClass.loadCommments(thisClass.state.wPage); thisClass.setState({isFocused:false, parentId:null,replyingto:null,isChild:false});
                            thisClass.comnstNotifications(parentId,getComment);
                            thisClass.setState({comment:''});
                        });
                    }
                });
            }else{
                db.child('comments').limitToLast(1).once('child_added',lastRow=>{
                    var primaryKey=parseInt(lastRow.key) + 1;
                    db.child('comments').child(primaryKey).once('value',isExits=>{
                        if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                        var created_at=new Date().toJSON();
                        
                        var insertObject={};
                        insertObject.videoId=thisClass.state.videoId;
                        insertObject.username=thisClass.state.username;
                        insertObject.comment=getComment;
                        insertObject.parentId=null;
                        insertObject.mentioned=globalMentioned;

                        insertObject.created_at=created_at;
                        db.child('comments').child(primaryKey).set(insertObject);

                        thisClass.loadCommments(thisClass.state.wPage); thisClass.setState({isFocused:false, parentId:null,replyingto:null,isChild:false});
                        thisClass.comnstNotifications(null,getComment);
                        thisClass.setState({comment:''});

                    });
                });
            }

            //increase video comments count
            db.child('videos').child(thisClass.state.videoId).once('value',snap=>{
                if(snap.val()){ var videoData=snap.val();
                    if(videoData.comments){ var newComments=Number(videoData.comments) + 1; }else{var newComments=1;}
                    if(newComments<0){ newComments=0;}
                    db.child('videos').child(snap.key).update({comments:newComments});
                    //increase comments
                    if(thisClass.props.thisClass){
                        var thisClassExternal=thisClass.props.thisClass;
                        thisClassExternal.updateVideos('comment_number',thisClass.state.videoId,newComments,null);
                    }

                }
            });

            if(globalMentioned && globalMentioned.length > 0){
                for(indexF in globalMentioned){
                    var getNow3=globalMentioned[indexF];
                    thisClass.sendMutitpleNotifications(indexF,getNow3,thisClass.state.videoId,thisClass.state.username,'mentioned','comment');
                }
            }

        }
    }


    sendMutitpleNotifications(index,param1,param2,param3,param4,param5){
      var getDuration=Number(index)*3000;
      setTimeout(function(){
        addNotifications(param1,param2,param3,param4,param5);
      },getDuration);
    }


    comnstNotifications(parentId,getComment){ var thisClass=this;

        if(parentId){
            db.child('comments').child(parentId).once('child_added',snap=>{
                if(snap.val()){
                    snap.forEach(function(singleComment){ var comment=singleComment.val();
                        if(comment.username!=thisClass.state.username){
                            var userFor = comment.username;
                            //notifications 
                            db.child('notifications').orderByChild('userFor').equalTo(userFor).once('value',snap=>{
                                var shouldAdd=true;
                                if(snap.val()){
                                    snap.forEach(function(data){ var noti=data.val();
                                        if(noti.userFor==userFor && noti.username==thisClass.state.username && noti.type=='reply'){
                                            db.child('notifications').child(noti.key).remove();
                                        }
                                    });
                                }
                                if(shouldAdd==true){
                                    addNotifications(userFor,thisClass.state.videoId,thisClass.state.username,'reply',null);
                                }
                            });

                        }
                    });
                }
            });


            db.child('videos').child(thisClass.state.videoId).once('value',snap=>{
                if(snap.val()){ var videodata=snap.val();
                    if(videodata.username!=thisClass.state.username){
                        var userFor = videodata.username;

                        //notifications 
                        db.child('notifications').orderByChild('userFor').equalTo(userFor).once('value',snap=>{
                            var shouldAdd=true;
                            if(snap.val()){
                                snap.forEach(function(data){ var noti=data.val();
                                    if(noti.userFor==userFor && noti.username==thisClass.state.username && noti.type=='reply'){
                                        db.child('notifications').child(noti.key).remove();
                                    }
                                });
                            }
                            if(shouldAdd==true){
                                addNotifications(userFor,thisClass.state.videoId,thisClass.state.username,'reply',null);
                            }
                        });

                    }
                }
            });

        }else{
            db.child('videos').child(thisClass.state.videoId).once('value',snap=>{
                if(snap.val()){ var videodata=snap.val();
                    if(videodata.username!=thisClass.state.username){
                        var userFor = videodata.username;

                        //notifications 
                        db.child('notifications').orderByChild('userFor').equalTo(userFor).once('value',snap=>{
                            var shouldAdd=true;
                            if(snap.val()){
                                snap.forEach(function(data){ var noti=data.val();
                                    if(noti.userFor==userFor && noti.username==thisClass.state.username && noti.type=='comment'){
                                        db.child('notifications').child(noti.key).remove();
                                    }
                                });
                            }
                            if(shouldAdd==true){
                                addNotifications(userFor,thisClass.state.videoId,thisClass.state.username,'comment',null);
                            }
                        });

                    }
                }
            });
        }
    }


    resetAction(key, comment,type, parentId){
        var commentId=comment.commentId;

        var thisClass=this;
        if(key=='c_reply'){
            
            if(type=='child'){
                this.replyPress(parentId);
                this.setState({isChild:true});
            }else{
                this.replyPress(comment.commentId);
            }
            this.setState({replyingto:comment.user.username});
        }else if(key=='delete_action'){
            setTimeout(function(){
                Alert.alert( 'Confirmation', 'Want to delete comment ', 
                    [ 
                        {text: 'Cancel', onPress: () => console.log('cancel') , style: 'cancel'},
                        {text: 'Delete', onPress: () => thisClass.deleteComment(commentId,type,parentId,comment) },
                    ], 
                    { cancelable: false } 
                );
            }, 100)
        }else{
            
            var username=thisClass.state.username;
            db.child('reports').orderByChild('video_cmnts_Id').equalTo(comment.commentId).once('value',snap=>{
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
                    db.child('reports').limitToLast(1).once('child_added',lastRow=>{
                        var primaryKey=parseInt(lastRow.key) + 1;
                        db.child('reports').child(primaryKey).once('value',isExits=>{
                            if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                            var created_at=new Date().toJSON();
                            
                            var insertObject={};
                            insertObject.video_cmnts_Id=comment.commentId;
                            insertObject.username=username;
                            insertObject.type='comment';
                            insertObject.created_at=created_at;

                            db.child('reports').child(primaryKey).set(insertObject);
                            Alert.alert( 'Confirmation', 'Comment has been reported successfully!');
                        });
                    });
                }else{
                    Alert.alert( 'Confirmation', 'You have already reported this comment!');
                }
            });
        }
    }

    deleteComment(commentId, type, parentId,comment){ var thisClass=this;
        if(type=='child'){
            db.child('comments').child(parentId).child(commentId).remove();
            
            db.child('videos').child(comment.videoId).once('value',snap=>{
                if(snap.val()){ var videoData=snap.val();
                    if(videoData.comments){ var newComments=Number(videoData.comments) - 1; }
                    if(newComments<0){ newComments=0;}
                    db.child('videos').child(comment.videoId).update({comments:newComments});

                    if(thisClass.props.thisClass){
                        var thisClassExternal=thisClass.props.thisClass;
                        thisClassExternal.updateVideos('comment_number',thisClass.state.videoId,newComments,null);
                    }
                }
            });
        }else{
            db.child('comments').child(commentId).once('value',snap=>{
                var countChilds=0;
                if(snap.val()){ var getVal=snap.val();
                    if(getVal.childs){
                        countChilds=Object.keys(getVal.childs).length;
                    }

                }
                var shouldDelete=1+Number(countChilds);
                db.child('videos').child(comment.videoId).once('value',snap=>{
                    if(snap.val()){ var videoData=snap.val();
                        if(videoData.comments){ var newComments=Number(videoData.comments) - shouldDelete; }
                        if(newComments<0){ newComments=0;}
                        db.child('videos').child(comment.videoId).update({comments:newComments});

                        if(thisClass.props.thisClass){
                            var thisClassExternal=thisClass.props.thisClass;
                            thisClassExternal.updateVideos('comment_number',thisClass.state.videoId,newComments,null);
                        }
                    }
                });
                db.child('comments').child(commentId).remove();
            });

        }
        thisClass.updateComments(commentId, type, parentId);
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

    updateComments(commentId, type, parentId){
        var getComments = this.state.comments; var myNewComments = [];
        for(index in getComments){
            var getComment = getComments[index];
            
            if(type=='parent'){
                if(getComment.commentId==commentId){
                }else{
                    myNewComments.push(getComment);
                }
            }else{
                if(getComment.commentId==parentId){
                    var getcurrentChilds=getComment.childs;
                    var getChildComments=[];
                    for(index2 in getcurrentChilds){
                        var getChildSIngle = getcurrentChilds[index2];
                        if(getChildSIngle.commentId==commentId){

                        }else{
                            getChildComments.push(getChildSIngle);
                        }
                    }

                    getComment.childs=getChildComments;
                }
                myNewComments.push(getComment);
            }
            
        }
        this.setState({comments:myNewComments});
    }

    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }

    replyPress(commentId){ var thisClass=this;
        thisClass.setState({parentId:commentId});
        setTimeout(function(){ thisClass.myInput.focus();}, 1000);
    }

    
    renderChildComments(comments, limit){
        if(comments.length>limit){
            var comments = comments.slice(1).slice(-limit);
        }
        var thisClass= this;
        return comments.map(function(comment, i){
            if(comment){
                comment.user=thisClass.getUserData(comment.username);
                var userImage = gStorage+'/profile_thumbs/'+comment.user.profilePic;

                var getModaldata = [{ key: 'c_reply', label: 'Reply' },{ key: 'report_action', label: 'Report' }];
                if(thisClass.state.username==comment.username){
                    var getModaldata = [{ key: 'c_reply', label: 'Reply' },{ key: 'delete_action', label: 'Delete' } ];
                }
                const data = getModaldata;

                var commentsOwner = [styles.commnets_owner];
                if(thisClass.isEmoji(comment.comment)){
                    var commentsOwner = [styles.commnets_owner,styles.commnets_owner2];
                }

                var created_at=new Date(comment.created_at);

                var verifiedIcons=null;
                if(comment.user.ac_type=='celebrity'){
                    verifiedIcons=(<IconF name="check-circle" style={[styles.video_verified_icon,styles.video_verified_icon_small]}/>);
                }
                return(
                    <View style={styles.single_comments_child} key={i}>
                        <View style={[styles.single_comments_left,styles.single_comments_left2]}>
                            <TouchableOpacity onPress={()=>Actions.profile({username:comment.user.username})}>
                                <Image style={commentsOwner}  source={{uri : userImage }}/>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.single_comments_right,styles.single_comments_right2]}>
                            <Text style={[styles.single_comments_right_top, styles.single_comments_right_top2]}>
                            <Text style={styles.font_bold} onPress={()=>Actions.profile({username:comment.user.username})}>{comment.user.name} {verifiedIcons} </Text> {thisClass.renderCommentsLoop(comment)}</Text>
                            <View style={styles.single_comments_right_bottom}>
                                <Text style={[styles.single_comments_right_time, styles.single_comments_right_time2]}>{agoFunction(created_at)}</Text>
                                <TouchableOpacity onPress={()=>{thisClass.setState({isChild:true,replyingto:comment.user.username}),thisClass.replyPress(comment.parentId)}}>
                                    <Text style={styles.commnets_reply}>Reply</Text></TouchableOpacity>
                            </View>
                        </View>
                        <ModalSelector  style={styles.commnets_dots_area} data={data}
                              onChange={(option)=>{ thisClass.resetAction(option.key,comment,'child',comment.parentId) }}>
                            <IconFM name="dots-horizontal" style={[styles.commnets_dots_icons]}/> 
                        </ModalSelector>
                    </View>
                );
            }
        });

    }

    isEmoji(commentArra) {
        var str='';
        for(index in commentArra){
            var getNow=commentArra[index].val;
            str=str+getNow+' ';
        }
        var ranges = [
            '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
            '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
            '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
        ];
        if (str.match(ranges.join('|'))) {
            return true;
        } else {
            return false;
        }
    }


    loadmoreChilds(commentId){
        var currentComments = this.state.comments; var myNewComments = [];

        for(index in currentComments){
            var getComment = currentComments[index];

            if(getComment.commentId==commentId){
                var getCurrentLoad=getComment.load;
                if(getCurrentLoad==3){
                    getComment.load=15
                }
                if(getCurrentLoad==15){
                    getComment.load=30
                }
                if(getCurrentLoad==30){
                    getComment.load=50
                }
                if(getCurrentLoad==50){
                    getComment.load=100
                }
            }
            myNewComments.push(getComment);
        }

        this.setState({comments:myNewComments});
    }

    renderComments(){
        var thisClass= this;
        return this.state.comments.map(function(comment, i){
            comment.user=thisClass.getUserData(comment.username);
            var userImage = gStorage+'/profile_thumbs/'+comment.user.profilePic;

            var getModaldata = [{ key: 'c_reply', label: 'Reply' }, { key: 'report_action', label: 'Report' }];
            if(thisClass.state.username==comment.username){
                var getModaldata = [{ key: 'c_reply', label: 'Reply' },{ key: 'delete_action', label: 'Delete' } ];
            }
            const data = getModaldata;


            var cmntsLoading=null;
            var totalChild = comment.childs.length;
            if(totalChild > comment.load){
                cmntsLoading=(
                    <View style={styles.load_cmnts_area}><TouchableOpacity onPress={()=>thisClass.loadmoreChilds(comment.commentId)}><Text style={styles.load_cmnts_area_txt}>more replies</Text></TouchableOpacity></View>
                );
            }

            var commentsOwner = [styles.commnets_owner];
            if(thisClass.isEmoji(comment.comment)){
                var commentsOwner = [styles.commnets_owner,styles.commnets_owner2];
            }

            var created_at=new Date(comment.created_at);

            var renderChilds=null;
            if(comment.childs.length>0){
                renderChilds=(<View style={styles.single_comments_bottom}>{cmntsLoading}{thisClass.renderChildComments(comment.childs, comment.load)}</View>);
            }

            var verifiedIcons=null;
            if(comment.user.ac_type=='celebrity'){
                verifiedIcons=(<IconF name="check-circle" style={[styles.video_verified_icon,styles.video_verified_icon_small]}/>);
            }
            return(
                <View style={styles.single_comments} key={i}>
                    <View style={styles.single_comments_top}>
                        <View style={styles.single_comments_left}>
                            <TouchableOpacity onPress={()=>Actions.profile({username:comment.user.username})}>
                                <Image style={commentsOwner}  source={{uri : userImage }}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.single_comments_right}>
                            <Text style={styles.single_comments_right_top}>
                                <Text style={styles.font_bold} onPress={()=>Actions.profile({username:comment.user.username})}>{comment.user.name} {verifiedIcons}</Text> {thisClass.renderCommentsLoop(comment)}
                            </Text>
                            <View style={styles.single_comments_right_bottom}>
                                <Text style={styles.single_comments_right_time}>{agoFunction(created_at)}</Text>
                                <TouchableOpacity onPress={()=>{thisClass.setState({replyingto:comment.user.username}),thisClass.replyPress(comment.commentId)}}>
                                    <Text style={styles.commnets_reply}>Reply</Text></TouchableOpacity>
                            </View>
                        </View>
                        <ModalSelector  style={styles.commnets_dots_area} data={data}
                              onChange={(option)=>{ thisClass.resetAction(option.key,comment,'parent',null) }}>
                                <IconFM name="dots-horizontal" style={[styles.commnets_dots_icons]}/> 
                        </ModalSelector>
                    </View>
                    {renderChilds}
                </View>
            );
        });
    }


    renderCommentsLoop(comment){ var comments=comment.comment;
        var thisClass=this; var mentioned=[];
        if(comment.mentioned){ mentioned=comment.mentioned;}
        var comments=thisClass.tagsAnalysis(comments,mentioned);
        if(comments && comments.length>0){
            return comments.map(function(comment, i){
                if(comment.val){
                    if(comment.type=='follower'){
                        return(<Text key={i} onPress={()=>[Actions.profile({username:comment.val})]} 
                            style={[styles.single_cmnt_raw_pro,styles.single_cmnt_raw_pro_follow]}>@{comment.val}</Text>);
                    }if(comment.type=='tag'){
                        return(<Text key={i} onPress={()=>[Actions.query({tags:comment.val})]} 
                            style={[styles.single_cmnt_raw_pro,styles.single_cmnt_raw_pro_tag]}>#{comment.val}</Text>);
                    }else if(comment.type=='link'){
                        return(<Text key={i} onPress={()=>[Linking.openURL(comment.val)]} 
                            style={[styles.single_cmnt_raw_pro,styles.single_cmnt_raw_pro_lunk]}>{comment.val}</Text>);
                    }else if(comment.type=='non_follower'){
                        return(<Text key={i}
                            style={styles.single_cmnt_raw_pro}>@{comment.val}</Text>);
                    }else{
                        return(<Text key={i} style={styles.single_cmnt_raw_pro}>{comment.val}</Text>);
                    }
                }
                
            });
        }
    }

    handleScroll(nativeEvent) {
        var sjdhfghjds = isCloseToBottom(nativeEvent);
        if (isCloseToBottom(nativeEvent)) {this.enableSomeButton(); }
    }

    renderCloseLoading(){
        if(this.state.closeToBottom){
            return(
                <View style={[styles.closeto_bottom,styles.closeto_bottom_cmnts]}><ActivityIndicator size={'small'}/></View>
            );
        }
    }

    enableSomeButton(){ var thisClass=this;
        if(this.state.isEnded==false && this.state.closeToBottom==false){
            var getPage = this.state.page + 1;
            this.setState({closeToBottom:true, page : getPage});
            setTimeout(function(){
                thisClass.realloadCommments(getPage);
            },1500);
            
        }
        
    }

    removereply(){
        this.setState({parentId:null,replyingto:null});
    }


    renderreplyTo(){
        if(this.state.replyingto){
            return(
                <View style={styles.commnte_box_replyto}>
                    <Text style={styles.commnte_box_replyto_txt}>Replying to {this.state.replyingto}</Text>
                    <TouchableOpacity style={styles.commnte_box_replyto_txt56} onPress={()=>this.removereply()}>
                    <Text style={styles.commnte_box_replyto_txtcc}>x</Text></TouchableOpacity>
                </View>
            );
        }
    }

    

    





    pickUpName(username){
        var currentTags=this.state.comment;
        var currentTagsRx=' '+currentTags;
        var getExplode=currentTagsRx.split('@');
        var newComment='';
        for(index in getExplode){
            var currentVal=getExplode[index];
            if(index == (getExplode.length - 1)){
                    if(newComment){
                        newComment=newComment+username+' ';
                    }else{
                        newComment=newComment+'@'+username+' ';
                    }
            }else{
               if(currentVal){
                    newComment=newComment+currentVal+'@'; 
               }
           }
        }
        newComment=newComment.trimLeft();
        this.setState({comment:newComment,filterFollowers:null,showSuggest:false,isFocused:true,isMentioned:'yes'});


        if(username){
            var allMentioned=this.state.allMentioned;
            allMentioned.push(username);
            this.setState({allMentioned:allMentioned});
        }
    }

    renderFollwLoops(){ var thisClass= this;
        if(this.state.filterFollowers){var filterFollowers=this.state.filterFollowers; }else{var filterFollowers=this.state.followers; }

        if(filterFollowers){
            filterFollowers=filterFollowers.slice(0,10);
            return filterFollowers.map(function(follower, i){
                var userImage = gStorage+'/profile_thumbs/'+follower.profilePic;
                var normalClass=[styles.pick_follers_single_to];
                if(thisClass.state.allMentioned){
                    if(thisClass.state.allMentioned.indexOf(follower.username) != -1){
                        normalClass=[styles.pick_follers_single_to, styles.pick_follers_single_to2];
                    }
                }
                return(
                    <TouchableOpacity onPress={()=>thisClass.pickUpName(follower.username)} key={i} style={normalClass}>
                        <Image  style={styles.pick_follers_single_img} source={{uri : userImage }}/> 
                        <View style={styles.pick_follers_single_area}>
                            <Text style={styles.pick_follers_single_txt}>{follower.username}</Text>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
        
    }

    renderFollowers(){
        if(this.state.filterFollowers){var filterFollowers=this.state.filterFollowers; }else{var filterFollowers=this.state.followers; }

        if(this.state.showSuggest==true && filterFollowers && filterFollowers.length>0){
            return(
                <ScrollView style={styles.pick_follers} keyboardShouldPersistTaps="always">
                    {this.renderFollwLoops()}
                </ScrollView>
            );
        } 
    }

    filterFollowersFun(getlastElement,getLength){
        var getFollowers=this.state.followers;
        if(getFollowers){
            var getFilters=[];
            for(index in getFollowers){
                var getNow=getFollowers[index];
                getNowU=(getNow.username).substring(0,getLength);
                if(getNowU==getlastElement){
                    getFilters.push(getNow);
                }
            }
            this.setState({filterFollowers:getFilters});
        }
    }
    onchangeComments(comment){
        var getExplode=comment.split('@');
        if(getExplode.length>1){
            var getlastElement=getExplode.slice(-1)[0];
            var getLength=getlastElement.length;
            if(getLength>0){
                this.filterFollowersFun(getlastElement,getLength);
            }else{
                this.setState({filterFollowers:null});
            }
            this.setState({showSuggest:true});
        }else{
            this.setState({showSuggest:false});
        }
        this.setState({comment : comment});
    }












    statusChange(status){
        this.setState({isFocused:status});
        // if(status==true){
        //     if (isIphoneX()) {
        //         this.setState({boxBottom:280});
        //     }else{
        //         this.setState({boxBottom:210});
        //     }
        // }else{
        //     this.setState({boxBottom:0});
        // }
    }

    onContentSizeChange(event){
        var getBoxHeight=event.nativeEvent.contentSize.height;
        getBoxHeight=getBoxHeight+50;
        this.setState({ boxHeight: getBoxHeight });
    }

    onContentSizeChange2(shouldGo){
        if(this.state.page==1){
            this.scrollView.scrollToEnd({animated: true});
        }else{
            if(shouldGo==true){
                this.scrollView.scrollToEnd({animated: true});
            }
        }
    }


    renderUserPhoto(){ var thisClass=this;
        if(thisClass.state.userData){
            var profilePic=gStorage + '/profile_thumbs/' + thisClass.state.userData.profilePic;
            return(
                <Image style={styles.commnets_plane} source={{uri : profilePic }}/>
            );
        }
    }

    render(){
        return(
            <View style={styles.setting_container}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.edit_profile}>
                    <View style={styles.reg_heading}>
                        <Text style={[styles.profile_s_t]}>Comments</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>




                <ScrollView  ref={ref => this.scrollView = ref}
    onContentSizeChange={(contentWidth, contentHeight)=>{        
        this.onContentSizeChange2(false);
    }} onScroll={({nativeEvent}) =>this.handleScroll(nativeEvent)} 
                scrollEventThrottle={2000} style={styles.commentsSCroll}>
                    {this.renderCloseLoading()}
                    <View style={[styles.comments_area_page]}>
                        {this.renderComments()}
                    </View>
                </ScrollView>

                {this.renderLoading()}
                
                <View style={[styles.commnte_box,{bottom:this.state.boxBottom}]}>
                    {this.renderreplyTo()}
                    {this.renderFollowers()}
                    <View style={[styles.commnte_box_area,{height:this.state.boxHeight}]}>
                        <View style={styles.commnte_box_left}>
                            {this.renderUserPhoto()}
                        </View>
                        <View style={styles.commnte_box_middle}>
                            <TextInput 
                            //autoFocus={true}
                            ref={(node) => { this.myInput = node }}
                            onFocus={()=>this.statusChange(true)}  
                            onBlur={()=>this.statusChange(false)}  
                            multiline={true}
                            placeholderTextColor="#b3b3b3" 
                            style={[styles.input_field, styles.input_field_textarea2]} 
                            value={this.state.comment} placeholder="Add a comment" 
                            autoCorrect={true} 
                            underlineColorAndroid='transparent'
                            onChangeText={comment=>this.onchangeComments(comment)}
                            onContentSizeChange={(event) =>this.onContentSizeChange(event)}
                            />
                        </View>
                        <TouchableOpacity style={styles.commnte_box_right} onPress={()=>this.commentSubmit()}>
                            <Text style={styles.comment_post}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                

            </View>
            );
    }
}

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  if(contentOffset.y<0){
    return true;
  }else{
    return false;
  }
};


//export to other parts
export default Comments;