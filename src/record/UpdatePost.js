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
  StatusBar,AsyncStorage,Keyboard
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

import {db,firebase,nFormat,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';
//create components
class UpdatePost extends Component {
    constructor(props) {
        super(props);

        if(this.props.video){
            var videoD=this.props.video;
            console.log(videoD);

            if(this.props.isEdit){
                var videoSrc=gStorage+'/videos/'+videoD.video;
            }else{
                var videoSrc=videoD.video;
            }
        }else{
            Actions.draftposts();
        }
        var getLocation= '';
        if(videoD.location){
            getLocation=videoD.location;
        }

        var getThumbnails= [];
        if(videoD.thumbnails){
            getThumbnails=videoD.thumbnails;
        }

        var selectedThumbnailIndex=Number(videoD.thumbnail);
        if(this.props.isEdit){
            selectedThumbnailIndex=videoD.thumbnail;
        }

        this.state = {
            videoD:videoD, 
            paused: false,
            muted:true,
            status:'public',
            title:videoD.title, 
            tags:videoD.tags,
            isTitle:false, 
            location:getLocation, 
            video :videoSrc,
            selectedThumbnailIndex:selectedThumbnailIndex,
            categories:[],
            selectedCat:videoD.category,
            pageLoading:false,
            username:'',
            thumbnails:getThumbnails,

            followers:null,
            filterFollowers:null,
            showSuggest:false,

            users:[],
            actionType:'public',
            tagsFollowers:[],
        };
    }

    async saveItem(item, selectedValue) {try {await AsyncStorage.setItem(item, selectedValue); } catch (error) {  } }

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
                            var myObject=thisClass.getUserData2(snap,ff.followed_by); tagsFollowers.push(ff.followed_by);
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

    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }

    uploadVideos(staticData){var thisClass=this;
        if(thisClass.state.thumbnails){
            if(thisClass.state.video){
                    getNewFSources=thisClass.state.video; var allSources=[];
                    
                    var postedThumbnails=[];
                    if(thisClass.state.thumbnails){
                      var getSources = thisClass.state.thumbnails;
                      for(index in getSources){
                         var singleSrc = getSources[index]; postedThumbnails.push(singleSrc);
                         var postData1 = {};
                         postData1.name = 'thumbnail_'+index;
                         postData1.filename = 'thumbnail_'+index+'.png';
                         var blobSrc2 = singleSrc.replace("file://", "");
                         postData1.data = RNFetchBlob.wrap(blobSrc2);
                         allSources.push(postData1);
                      }
                    }
                     
                     var ExtraData1={}; ExtraData1.name='length'; ExtraData1.data=(this.state.thumbnails.length).toString();  allSources.push(ExtraData1);

                     
                    var finalPostData = staticData;
                    if(getNewFSources && thisClass.state.actionType=='public'){

                         var blobSrc = getNewFSources.replace("file://", "");
                         var postData = {};
                         postData.name = 'videosrc';
                         postData.filename = 'get-video.mp4';
                         postData.data = RNFetchBlob.wrap(blobSrc);
                         allSources.push(postData);


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
                                       }else{
                                          thisClass.saveItem('videoUploadP','error');thisClass.saveToDraft(getNewFSources,postedThumbnails, finalPostData);
                                       }
                                   }else{
                                       thisClass.saveItem('videoUploadP','error');thisClass.saveToDraft(getNewFSources,postedThumbnails,finalPostData);
                                   }
                              }).catch((err) => {
                                    console.log(err); thisClass.saveToDraft(getNewFSources,postedThumbnails,finalPostData);
                              });
                         }
                       
                    }else if(getNewFSources){ //save to phone
                      thisClass.setState({pageLoading:true});
                      thisClass.saveToDraft(getNewFSources,postedThumbnails,finalPostData);
                    }
              
            }
        }
    }

    removeVideoData(newVideos){ var thisClass=this;
        if(newVideos){
            var myRes=[];
            if(newVideos.length>0){
                for(index in newVideos){
                    var getNow=newVideos[index];
                    if(getNow.created_at==thisClass.props.video.created_at){}else{
                        myRes.push(getNow);
                    }
                }
            }
            return myRes;
        }else{
            AsyncStorage.getItem('videos').then((videos) => {
                if(videos){ 
                    var newVideos=JSON.parse(videos);
                    var myRes=[];
                    if(newVideos.length>0){
                        for(index in newVideos){
                            var getNow=newVideos[index];
                            if(getNow.created_at==thisClass.props.video.created_at){}else{
                                myRes.push(getNow);
                            }
                        }
                    }
                    thisClass.saveItem('videos',JSON.stringify(myRes));
                }
            });
        }

        
    }

    saveToDraft(videoSrc,thumbnails,allData){ var thisClass=this;

        AsyncStorage.getItem('videos').then((videos) => { 
            var newVideos=[];
            if(videos){ newVideos=JSON.parse(videos); }
            
            newVideos=thisClass.removeVideoData(newVideos);

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
              thisClass.removeVideoData(null);


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


    tryAgain(){
        Alert.alert( 'Error!', 'Something went wrong in uploading server!', 
            [ 
                {text: 'Try again', onPress: () => this.postAction(this.state.status) },
            ], 
            { cancelable: false } 
        );
    }


    postAction(actionType){ Keyboard.dismiss(); var thisClass=this;
        Keyboard.dismiss();
        if(actionType=='public' && !this.state.tags){Alert.alert('Error!','Please enter description.');}
        
        var staticData={};
        staticData.tags=this.state.tags;
        staticData.location=this.state.location;
        staticData.thumbnail=this.state.thumbnail;
        staticData.category=this.state.selectedCat;
        staticData.status=actionType;

        if(actionType=='public'){
          if(this.state.tags){
              if(thisClass.props.isEdit){
                      var insertObject={};
                      insertObject.thumbnail=thisClass.state.selectedThumbnailIndex;
                      
                      insertObject.tags=thisClass.state.tags;
                      insertObject.category=thisClass.state.selectedCat;
                      insertObject.location=thisClass.state.location;
                      db.child('videos').child(thisClass.props.video.videoId).update(insertObject);
                      Actions.home();

              }else{
                    this.uploadVideos(staticData);
              } 
          }
        }else{
            thisClass.setState({actionType:actionType},()=>{ this.uploadVideos(staticData); });
        }
    }



    renderRegmnets(e){
        var thisClass= this;
        return this.state.thumbnails.map(function(thumbnail, i){
          if(thisClass.props.isEdit){
                var imagePath=gStorage+'/thumbnails/'+thumbnail;
          }else{
            var imagePath=thumbnail;
          }
          if(i==thisClass.state.selectedThumbnailIndex || thisClass.state.selectedThumbnailIndex==thumbnail){
            return( <TouchableOpacity key={i} style={styles.single_segment_txt1} onPress={() => thisClass.segmentPressReal(thumbnail)}><Image style={[styles.single_segment_img1, styles.single_segment_img_active1]} source={{uri : imagePath }}/></TouchableOpacity> );
          }else{
            return( <TouchableOpacity key={i} style={styles.single_segment_txt1} onPress={() => thisClass.segmentPressReal(thumbnail)}><Image style={[styles.single_segment_img1]} source={{uri : imagePath }}/></TouchableOpacity> );
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


    onEnd(){ this.setState({paused:true}); }


    loadStart(){}
    renderPlayButton(){
        if(this.state.paused){
          return (
            <Text onPress={() => this.playerPress()} style={{backgroundColor:'transparent'}}>
                <IconF name="play" style={styles.playicons}/>
            </Text>
            );
        }
    }

    startPlayer(){
        this.player.seek(0);
    }

    playerPress(e){
        if(this.state.paused){
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
                        <TouchableOpacity onPress={()=>Actions.pop()}>
                            <IconF name="angle-left" style={styles.back_vator}/>    
                        </TouchableOpacity>
                    </View>
                    <View style={styles.post_heading_right}>
                        <TouchableOpacity style={styles.post_share} onPress={()=>this.postAction('draft')}>
                            <IconF name="save" style={styles.vator_icon}/>
                            <Text style={styles.share_text}>Draft</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.post_share} onPress={()=>this.postAction('public')}>
                            <IconF name="share-alt" style={[styles.vator_icon,styles.vator_icon2]}/>
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
                        <TextInput underlineColorAndroid='transparent' multiline={true}  maxLength={70} 
                        placeholderTextColor="#b3b3b3" style={styles.input_field2} value={this.state.tags} placeholder="Enter tags here" autoCorrect={false} 
                        onChangeText={tags=>this.onchangeTags(tags)}/>
                    </View>
                    <View style={[styles.post_location]}>
                        <GooglePlacesAutocomplete
                          placeholder='Enter location'
                          minLength={2}
                          autoFocus={false}
                          returnKeyType={'search'}
                          listViewDisplayed='false' 
                          fetchDetails={true}
                          renderDescription={row => row.description} 
                          onPress={(data, details = null) => { 
                            this.setState({location:data.description});
                          }}
                          getDefaultValue={() => this.state.location}
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
export default UpdatePost;