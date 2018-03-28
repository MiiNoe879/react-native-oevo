//import
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
  ScrollView,
  StatusBar,AsyncStorage,Keyboard,CameraRoll
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import RNFetchBlob from 'react-native-fetch-blob';

import {appEngine,gStorage} from './../common/Config';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFI from 'react-native-vector-icons/Ionicons';
import IconFM from 'react-native-vector-icons/MaterialIcons';
import IconFMM from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';

import Loading from './../common/Loading';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import KeyboardAwareScrollView from './../common/KeyboardAwareScrollView';
import styles from './../style';
import SpinnerBig from './../common/SpinnerBig';
import TimerMixin from 'react-timer-mixin';

import RNVideoEditor from 'react-native-video-editor';
import {db,firebase,nFormat,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';
//create components
class Post extends Component {
    constructor(props) {
        super(props);
        var allSegments = this.props.segments;
        console.log(allSegments);

        this.state = {
            error:'', 
            paused: true,
            muted:true,
            status:'public',
            tags:'',
            location:'', 
            video : allSegments[0].url,
            thumbnail : allSegments[0].thumbnail,
            //thumbnail : 'https://storage.googleapis.com/oevo-api-bucket/thumbnails/XSFrcqhHhnbdaJzPIEFvfYMcFisIPACm.jpeg',
            //video : 'https://storage.googleapis.com/oevo-api-bucket/videos/CJWeTpGfelYRlBhwopTwEGaXiiruyBxy.mp4',
            segments:this.props.segments,
            //segments:[],
            selectedSegmentIndex:0,
            selectedThumbnailIndex:0,
            categories:[],
            selectedCat:'Comedy',
            pageLoading:false,
            username:'',

            followers:null,
            filterFollowers:null,
            showSuggest:false,
            isMentioned:'no',
            actionType:'public',

            users:[],
            tagsFollowers:[],
        };
    }

    renderLoading(){if(this.state.pageLoading){return <SpinnerBig/>; } }

    componentWillMount(){ var thisClass=this;
        StatusBar.setBarStyle('dark-content', true);
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
              this.setState({username:username}); 

              getUsers().then(snap=>{
                thisClass.setState({users:snap}); 
                db.child('subscribers').orderByChild('following').equalTo(username).once('value',snap2=>{
                    var followers=[]; var tagsFollowers=[];
                    if(snap2.val()){
                        snap2.forEach(function(data){ var ff=data.val();
                            var myObject=thisClass.getUserData2(snap,ff.followed_by);tagsFollowers.push(ff.followed_by);
                            if(myObject){ followers.push(myObject); }
                        });
                    }
                    thisClass.setState({followers:followers,tagsFollowers:tagsFollowers});
                });
              });
              db.child('categories').once('value',snap3=>{
                if(snap3.val()){
                    var categories=[];
                    snap3.forEach(function(cat) {
                        var catObject=cat.val();catObject.categoryId=cat.key;
                        categories.push(catObject);
                    });
                    thisClass.setState({categories:categories});
                }
              });

            }else{ Actions.signin(); }
        });

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

    async saveItem(item, selectedValue) {try {await AsyncStorage.setItem(item, selectedValue); } catch (error) {  } }


    uploadVideos(staticData){ var thisClass=this;
        var finalVideoSrc=null;
        if(this.state.segments){
            var getSegments = this.state.segments; 
            if(getSegments.length>0){
                var getNewFSources=null;
                RNVideoEditor.merge(getSegments,
                  (results) => {
                    console.log('Error: ' + results);
                  },
                  (results, file) => {
                      getNewFSources=file; var allSources=[];


                      var postedThumbnails=[];
                      if(thisClass.state.segments){
                        var getSources = thisClass.state.segments;
                        for(index in getSources){
                           var singleSrc = getSources[index]; postedThumbnails.push(singleSrc.thumbnail);
                           var postData1 = {};
                           postData1.name = 'thumbnail_'+index;
                           postData1.filename = 'thumbnail_'+index+'.png';
                           var blobSrc2 = singleSrc.thumbnail.replace("file://", "");
                           postData1.data = RNFetchBlob.wrap(blobSrc2);
                           allSources.push(postData1);
                        }
                      }
                       
                      var ExtraData1={}; ExtraData1.name='length'; ExtraData1.data=String(this.state.segments.length);  
                      allSources.push(ExtraData1);

                       
                      var finalPostData = staticData;
                      if(getNewFSources && thisClass.state.actionType=='public'){

                           var blobSrc = getNewFSources;
                           var postData = {};
                           postData.name = 'videosrc';
                           postData.filename = 'get-video.mp4';
                           postData.data = RNFetchBlob.wrap(blobSrc);
                           allSources.push(postData);

                           //console.log(allSources);

                           if(allSources.length > 0){
                               thisClass.setState({pageLoading:true});
                                setTimeout(function(){
                                    thisClass.setState({pageLoading:false});
                                    Actions.home();
                                }, 1000);
                              
                               RNFetchBlob.fetch('POST', appEngine+'/encode/upload-encoding2', {
                                                 'Content-Type' : 'octet-stream'
                                                 },allSources)
                               .uploadProgress({ interval : 500 },(written, total) => {
                                     var getPercentage=(written / total)*100;
                                     getPercentage=parseInt(getPercentage);
                                     getPercentage=getPercentage.toString();
                                     thisClass.saveItem('videoUploadP',getPercentage);
                                })
                               .progress({ count : 10 }, (received, total) => {})
                               .then((resp) => { console.log(resp.data);
                                      if(resp.data){
                                         var res = JSON.parse(resp.data);
                                         if(res.status=='true'){
                                            thisClass.saveItem('videoUploadP','sucess');
                                            thisClass.saveToFireBase(res.res,finalPostData);
                                            ManualFocusManager.requestReviewAfter3Sec();
                                            setTimeout(function(){ ManualFocusManager.reset(); }, 0);
                                         }else{
                                            thisClass.saveItem('videoUploadP','error');thisClass.saveToDraft(getNewFSources,postedThumbnails, finalPostData);
                                            setTimeout(function(){ ManualFocusManager.reset(); }, 0);
                                         }
                                     }else{
                                         thisClass.saveItem('videoUploadP','error');thisClass.saveToDraft(getNewFSources,postedThumbnails,finalPostData);
                                         setTimeout(function(){ ManualFocusManager.reset(); }, 0);
                                     }
                                }).catch((err) => {
                                      console.log(err); thisClass.saveToDraft(getNewFSources,postedThumbnails,finalPostData);
                                });
                           }
                         
                      }else if(getNewFSources){ //save to phone
                        thisClass.setState({pageLoading:true});
                        thisClass.saveToDraft(getNewFSources,postedThumbnails,finalPostData);
                      }



              });
            



            }
        }
    }

    saveToDraft(videoSrc,thumbnails,allData){ var thisClass=this;
        CameraRoll.saveToCameraRoll(videoSrc);

        AsyncStorage.getItem('videos').then((videos) => { 
            var newVideos=[];
            if(videos){ newVideos=JSON.parse(videos); }
            
            var created_at=new Date().toJSON();
            var insertObject={};
            insertObject.username=thisClass.state.username;
            insertObject.video=videoSrc;
            insertObject.thumbnail=thisClass.state.selectedThumbnailIndex;
            insertObject.thumbnails=thumbnails;
            
            insertObject.tags=allData.tags;
            insertObject.category=allData.category;
            insertObject.location=allData.location;
            insertObject.created_at=created_at;

            newVideos.push(insertObject);
            thisClass.saveItem('videos',JSON.stringify(newVideos));

            thisClass.setState({pageLoading:false}); Alert.alert('Success!','Video has been drafted!'); Actions.home();
        });
    }



    saveToFireBase(res,allData){ var thisClass=this;
      db.child('videos').child('NaN').remove();
      db.child('videos').limitToLast(1).once('child_added',lastRow=>{
          var primaryKey=parseInt(lastRow.key) + 1;
          db.child('videos').child(primaryKey).once('value',isExits=>{
              if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
              var created_at=new Date().toJSON();



              var globalMentioned=[];
              var regexp2 = /@\w\w+\b/g; var getMentioned = allData.tags.match(regexp2);
              if(getMentioned && getMentioned.length>0){
                  for(inm in getMentioned){ var getNowF=getMentioned[inm].replace('@','');
                      globalMentioned.push(getNowF);
                  }
              }
              
              var insertObject={};
              insertObject.username=thisClass.state.username;
              insertObject.video=res.video;
              insertObject.thumbnail=res.thumbnail;
              insertObject.thumbnails=res.thumbnails;
              
              insertObject.tags=allData.tags;
              insertObject.category=allData.category;
              insertObject.location=allData.location;
              insertObject.views=0;
              insertObject.comments=0;
              insertObject.likes=0;
              insertObject.shares=0;
              insertObject.mentioned=globalMentioned;
              insertObject.status='public';

              insertObject.created_at=created_at;
              db.child('videos').child(primaryKey).set(insertObject);

              //add notifications
              addNotifications(thisClass.state.username,primaryKey,'system','upload','public');
              var followers=thisClass.state.followers;
              if(followers.length){
                for(index in followers){
                  var getNow=followers[index];
                  if(getNow.username && getNow.username!=thisClass.state.username){
                    var indexVal=Number(index)*5;
                    thisClass.sendMutitpleNotifications(indexVal,getNow.username,primaryKey,thisClass.state.username,'follow_noti','public');
                  }
                }
              }

              //update user data 
              db.child('users').orderByChild('username').equalTo(thisClass.state.username).once('child_added',snap=>{
                  if(snap.val()){ var userData=snap.val();
                      var newVideos=parseInt(userData.videos) + 1; 
                      if(newVideos<0){newVideos=0;}
                      db.child('users').child(snap.key).update({videos:newVideos});
                  }
              });


              if(globalMentioned && globalMentioned.length > 0){
                  for(indexF in globalMentioned){
                      var getNow3=globalMentioned[indexF];
                      thisClass.sendMutitpleNotifications(indexF,getNow3,primaryKey,thisClass.state.username,'mentioned','video');
                  }
              }

          });
      });
    }



    sendMutitpleNotifications(index,param1,param2,param3,param4,param5){
      var getDuration=Number(index)*3000;
      setTimeout(function(){
        addNotifications(param1,param2,param3,param4,param5);
      },getDuration);
    }





    backToCamera(){
        this.setState({paused: true});
        Actions.preview({segments:this.state.segments});
    }

    postAction(actionType){ Keyboard.dismiss();
        this.setState({actionType:actionType});
        if(actionType=='public' && !this.state.tags){Alert.alert('Error!','Please enter description.');}
        
        var staticData={};
        staticData.tags=this.state.tags;
        staticData.location=this.state.location;
        staticData.thumbnail=this.state.thumbnail;
        staticData.category=this.state.selectedCat;
        staticData.status=actionType;

        if(actionType=='public'){
          if(this.state.tags){
              this.uploadVideos(staticData);
          }
        }else{
              this.uploadVideos(staticData);
        }
    }



    renderRegmnets(e){
        var segments= this.state.segments; var thisClass= this;
        return segments.map(function(segment, i){
          var imagePath='file://'+segment.thumbnail;
          if(i==thisClass.state.selectedThumbnailIndex){
            return( <TouchableOpacity key={i} style={styles.single_segment_txt1} onPress={() => thisClass.segmentPressReal(i)}><Image style={[styles.single_segment_img1, styles.single_segment_img_active1]} source={{uri : imagePath }}/></TouchableOpacity> );
          }else{
            return( <TouchableOpacity key={i} style={styles.single_segment_txt1} onPress={() => thisClass.segmentPressReal(i)}><Image style={[styles.single_segment_img1]} source={{uri : imagePath }}/></TouchableOpacity> );
          }
          
        });
    }


    renderCategories(e){
        var categories= this.state.categories; var thisClass= this;

        return categories.map(function(category, i){
          var thumbnailUrl = gStorage+'/cat_thumbs/'+category.thumbnail;
          
          if(category.name==thisClass.state.selectedCat){
            return (
                <View style={styles.single_cat} key={i}>
                    <TouchableOpacity onPress={() => thisClass.selectCategory(category.name)} style={[styles.cat_touch,styles.cat_touch2]}>
                        <Image style={styles.single_creator_img} source={{uri : thumbnailUrl }}/>
                        <Text style={[styles.single_category_txt,styles.single_category_txt2]}>{category.name}</Text>
                        <View style={[styles.check_marks_icons2,styles.check_marks_icons22]}>
                            <IconFI name="ios-checkmark" style={styles.check_marks_icons}/>
                        </View>
                    </TouchableOpacity>
                </View>
            );
          }else{
            return (
                <View style={styles.single_cat} key={i}>
                    <TouchableOpacity onPress={() => thisClass.selectCategory(category.name)} style={[styles.cat_touch,styles.cat_touch2]}>
                        <Image style={styles.single_creator_img} source={{uri : thumbnailUrl }}/>
                        <Text style={[styles.single_category_txt,styles.single_category_txt2]}>{category.name}</Text>
                        <View style={styles.check_marks_icons2}></View>
                    </TouchableOpacity>
                </View>
            );
          }
        });
    }

    selectCategory(category){
        this.setState({selectedCat:category});
    }


    segmentPressReal(index){
        this.setState({selectedThumbnailIndex:index});
    }


    onEnd(){
        var totalSeg = (this.state.segments.length) - 1;
        if(this.state.selectedSegmentIndex!=totalSeg){
            var newSeg = this.state.selectedSegmentIndex+1;
            this.segmentPress(newSeg);
        }else{
            this.setState({paused:true});
        }
    }

    segmentPress(index){
        var segments= this.state.segments;
        var selectedSegment=segments[index];
        if(selectedSegment.sound=='yes'){
          this.setState({muted:true});
        }else{
          this.setState({muted:false});
        }
        //this.setState({selectedSegmentIndex:index, selectedSegment:selectedSegment, video:selectedSegment.url}); 
        this.setState({selectedSegmentIndex:index, selectedSegment:selectedSegment, }); 
        this.startPlayer(); this.setState({paused: false});
    }

    loadStart(){}
    renderPlayButton(){
        if(this.state.paused){
          return (
            <TouchableOpacity onPress={() => this.playerPress()} style={{backgroundColor:'transparent', position:'relative',zIndex:99}}>
                <IconF name="play" style={styles.playicons}/>
            </TouchableOpacity>
            );
        }
    }

    startPlayer(){
        this.player.seek(0);
    }

    playerPress(e){
        if(this.state.paused){
          this.segmentPress(0);
          this.setState({paused: false});
        }else{
          this.setState({paused: true});
        }
    }









    pickUpName(username){
        var currentTags=this.state.tags;
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
        this.setState({tags:newComment,filterFollowers:null,showSuggest:false,isFocused:true,isMentioned:'yes'});
    }

    renderFollwLoops(){
        if(this.state.filterFollowers){var filterFollowers=this.state.filterFollowers; }else{var filterFollowers=this.state.followers; }

        if(filterFollowers){
            var thisClass= this;
            return filterFollowers.map(function(follower, i){
                var userImage = gStorage+'/profile_thumbs/'+follower.profilePic;
                return(
                    <TouchableOpacity onPress={()=>thisClass.pickUpName(follower.username)} key={i} style={styles.pick_follers_single_to}>
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
                <ScrollView style={[styles.pick_follers,styles.pick_follers_post]} keyboardShouldPersistTaps="always">
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
    onchangeTags(tags){
        var getExplode=tags.split('@');
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

        tags = tags.replace(/(\r\n|\n|\r)/gm,"");
        this.setState({tags : tags});
    }

    
    render(){
        return (
            <View style={styles.post_container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                
                <View style={styles.post_heading}>
                    <View style={styles.post_heading_left}>
                        <TouchableOpacity onPress={this.backToCamera.bind(this)}>
                            <IconF name="angle-left" style={[styles.back_vator,styles.back_vator_posing]}/>    
                        </TouchableOpacity>
                    </View>
                    <View style={styles.post_heading_right}>
                        <TouchableOpacity style={styles.post_share} onPress={()=>this.postAction('draft')}>
                            <IconF name="save" style={[styles.vator_icon,styles.vator_icon67]}/>
                            <Text style={styles.share_text}>Draft</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.post_share} onPress={()=>this.postAction('public')}>
                            <IconF name="send-o" style={[styles.vator_icon,styles.vator_icon2,styles.vator_icon67]}/>
                            <Text style={[styles.share_text,styles.vator_icon2]}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardAwareScrollView style={{flex:1, marginTop:45}} extraScrollHeight={100} keyboardShouldPersistTaps={'always'}>
                    
                    
                    <View style={styles.post_player_area}>
                        <View style={styles.post_player}>
                            <Image style={[styles.psoting_bg_image]} source={{uri : this.state.thumbnail }}/>
                            <TouchableWithoutFeedback style={styles.preview} onPress={() => this.playerPress()}>
                              <Video
                                source={{uri: this.state.video}}
                                style={styles.preview}
                                ref={(ref) => {
                                 this.player = ref
                                }} 
                                rate={1.0}
                                muted={this.state.muted}
                                volume={1.0}
                                resizeMode="cover"
                                paused={this.state.paused}
                                onEnd={this.onEnd.bind(this)}
                                onLoadStart={this.loadStart.bind(this)} 
                                repeat={false}/>
                            </TouchableWithoutFeedback>
                            {this.renderPlayButton()}
                        </View>
                        <View style={styles.post_thumbnails}>
                            <ScrollView style={styles.thumbnails_con}>
                                {this.renderRegmnets()}
                            </ScrollView>
                        </View>
                        {this.renderFollowers()}
                    </View>
                    

                    

                    <View style={styles.post_title}>
                        
                        <IconFM name="edit" style={[styles.filed_cions_previous]}/>
                        <TextInput underlineColorAndroid='transparent'  maxLength={70} placeholderTextColor="#b3b3b3" style={styles.input_field2} value={this.state.tags} 
                        placeholder="Add a description with #tags" autoCorrect={false} 
                        multiline={true}
                        onChangeText={tags=>this.onchangeTags(tags)}/>
                    </View>
                    <View style={[styles.post_location]}>
                        <GooglePlacesAutocomplete
                          placeholder='Enter location'
                          minLength={2}
                          autoFocus={false}
                          returnKeyType={'search'}
                          listViewDisplayed='auto' 
                          fetchDetails={true}
                          renderDescription={row => row.description} 
                          onPress={(data, details = null) => { 
                            this.setState({location:data.description});
                          }}
                          getDefaultValue={() => ''}
                          query={{
                            key: 'AIzaSyBS0nXWqIDMnGGSTQAIdaVVv2uKQ86Ib_M',
                            language: 'en',
                            types: '(cities)'
                          }}
                          currentLocation={false}
                          GoogleReverseGeocodingQuery={{}}
                          GooglePlacesSearchQuery={{
                            rankby: 'distance',
                            types: 'food'
                          }}
                          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} 
                          debounce={200}
                          renderLeftButton={()  => <IconF name="map-marker" style={styles.filed_cions_previous}/>}
                        />
                    </View>

                    <View style={styles.post_category}>
                        <View style={styles.post_category_cats}>
                            <ScrollView horizontal= {true} decelerationRate={0} snapToInterval={200}  snapToAlignment={"center"}>
                            {this.renderCategories()}
                            </ScrollView>
                        </View>
                    </View>
                    
                </KeyboardAwareScrollView>

                {this.renderLoading()}
            </View>
        );
    }
}

//export component
export default Post;