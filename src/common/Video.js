import React, {Component} from 'react';
import {appEngine,gStorage} from './../common/Config';
import { View, Text, StyleSheet, Image, TouchableOpacity,Animated, Modal,AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from './../style';
import axios from 'axios';

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';


export function updateVideos(thisClass, param1,param2,param3,param4){  
    var getVideos=thisClass.state.videos; var myNewVideos = [];
    var getCurrentMute='yes';
    if(param3=='alert'){
        getCurrentMute=thisClass.state.isMuted;
    }


    for(index in getVideos){
        var getVideo = getVideos[index];

        if(param1=='follow'){
            if(getVideo.username==param2){
                if(param4=='yes'){
                    getVideo.isFollowed='yes';
                }else{
                    getVideo.isFollowed='no';
                }
            }
            myNewVideos.push(getVideo);
        }

        if(param1=='delete'){
            if(getVideo.videoId==param2){}else{
                myNewVideos.push(getVideo);
            }
        }

        if(param1=='mute'){
            if(param2=='all'){
                if(param3=='alert'){
                    if(getCurrentMute=='yes'){
                        getVideo.muted=false;
                    }else{
                        getVideo.muted=true;
                    }
                }else{
                    getVideo.muted=true;
                    getVideo.isFocused=false;
                }
            }
            myNewVideos.push(getVideo);
        }

        if(param1=='pause'){
            getVideo.isFocused=false;
            myNewVideos.push(getVideo);
        }


        if(param1=='like'){
            getVideo.likeLoading=false;
            if(getVideo.videoId==param2){
                if(param3=='yes'){
                    getVideo.isLiked='yes';
                }else{
                    getVideo.isLiked='no';
                }
                getVideo.likes=param4;
            }
            myNewVideos.push(getVideo);
        }

        if(param1=='likeLoading'){
            if(getVideo.videoId==param2){
                getVideo.likeLoading=true;
            }
            myNewVideos.push(getVideo);
        }


        if(param1=='focus'){
            if(getVideo.videoId==param2){
                thisClass.setState({focusedVideo:param2});
                getVideo.isFocused=true;
            }else{
                getVideo.isFocused=false;
            }
            myNewVideos.push(getVideo);
        }

        if(param1=='loading'){
            if(getVideo.videoId==param2){
                getVideo.loading=false;
            }else{
                getVideo.loading=true;
            }
            myNewVideos.push(getVideo);
        }

        if(param1=='update_src'){
            if(getVideo.videoId==param2){
                getVideo.videoUrl=param3;
            }else{
                getVideo.videoUrl=null;
            }
            myNewVideos.push(getVideo);
        }


        if(param1=='comment_number'){
            if(getVideo.videoId==param2){
                getVideo.comments=param3;
            }
            myNewVideos.push(getVideo);
        }

    }
    thisClass.setState({videos:myNewVideos});
    if(param1=='mute'){
        if(param2=='all'){
            if(param3=='alert'){
                if(getCurrentMute=='yes'){
                    thisClass.setState({isMuted:'no'});
                    dssaveItem('isMuted','no');
                }else{
                    thisClass.setState({isMuted:'yes'});
                    dssaveItem('isMuted','yes');
                }
            }else{
                thisClass.setState({isMuted:'yes'});
                dssaveItem('isMuted','yes');
            }
        }
    }


}


export function makeFocus(thisClass,currentPostion,page) {
    if(currentPostion < 0){ currentPostion=1; }
    var currentCenter = Math.abs( (thisClass.state.scrollViewHeight/2) + currentPostion);
    currentCenter=parseInt(currentCenter);

    var allItems=thisClass.state.allItems;

    if(allItems && allItems.length>0){
        for(index in allItems){
            var getVal = allItems[index];
            // if(page=='profile'){
            //     var getPositoon=parseInt(getVal.y) + parseInt(getVal.height/2);
            // }else{
                var getPositoon=parseInt(getVal.y) + parseInt(getVal.height/2) + parseInt(thisClass.state.extraTop);
            //}
            
            var getDitansce = getPositoon - currentCenter;
            if(-150 < getDitansce && getDitansce < 150){
                thisClass.updateVideos('focus',getVal.videoId,null,null);
            }
        }
    }
}


export function renderCategories(thisClass){
    return thisClass.state.categories.map(function(category, i){
        if(category.categoryId==1){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/talents_i.png')}/>);}
        if(category.categoryId==2){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/animals.png')}/>);}
        if(category.categoryId==3){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/commedy.png')}/>);}
        if(category.categoryId==4){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/foods.png')}/>);}
        if(category.categoryId==5){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/style_i_new.png')}/>);}
        if(category.categoryId==6){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/fitness_i.png')}/>);}
        if(category.categoryId==7){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/gaming_i_new.png')}/>);}
        if(category.categoryId==8){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/rants_i.png')}/>);}
        if(category.categoryId==9){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/sports_i.png')}/>);}
        if(category.categoryId==10){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/random_i.png')}/>);}
        if(category.categoryId==11){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/culture_icons.png')}/>);}
        if(category.categoryId==12){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/life_style.png')}/>);}

        return(
            <TouchableOpacity key={i} style={styles.single_category} onPress={()=>{thisClass.unMountPage(),Actions.category({category:category})}}>
                {thumbnail}
                <Text style={styles.single_category_txt}>{category.name}</Text>
            </TouchableOpacity>
        );
    });
}



export function renderCreators(thisClass){
    return thisClass.state.creators.map(function(creator, i){
        var userImage = gStorage+'/profile_thumbs/'+creator.profilePic;        
        return(
            <TouchableOpacity key={i} style={styles.single_creator} onPress={()=>Actions.profile({username:creator.username})}>
                <Image style={styles.single_creator_img} source={{uri : userImage }}/>
            </TouchableOpacity>
        );
    });
}


function dssaveItem(item, selectedValue) { AsyncStorage.setItem(item, selectedValue); }

export function renderUploadsLoadings(thisClass,myUserName){
    var handle = setInterval(function(){
        AsyncStorage.getItem('videoUploadP').then((videoUploadP)=>{
            if(videoUploadP){
                if(videoUploadP=='expired'){
                    whenComele(thisClass,handle);
                }else if(videoUploadP=='sucess'){
                    whenComele(thisClass,handle);
                    Alert.alert( 'Success!', 'Successfully upoaded.');  
                    
                }else if(videoUploadP=='error'){
                    whenComele(thisClass,handle);
                    Alert.alert( 'Error!', 'Upload failed due to connection error. Video has been saved in your phone.');  
                }else{
                    var getPercentage=Number(videoUploadP);
                    if(getPercentage<100){
                        thisClass.setState({uploadPercentage:videoUploadP});
                    }
                }
            }else{
                whenComele(thisClass,handle);
            }
        }); 
    }, 2500);

    db.child('winningmsg').orderByChild('username').equalTo(myUserName).limitToLast(1).once('child_added',snap=>{
        if(snap.val()){ var winnerData=snap.val();
            if(winnerData.status=='unread'){
                if (typeof thisClass.unMountPage !== "undefined") { 
                    thisClass.unMountPage();
                }
                Actions.getWin();
            }
        }
    });
}
function whenComele(thisClass,handle){
    clearInterval(handle);handle = 0; dssaveItem('videoUploadP','expired');
    thisClass.setState({uploadPercentage:0});
}
export function renderLoadingPercenatge(thisClass,page){
    if(thisClass.state.uploadPercentage){
        var getPercentage=thisClass.state.uploadPercentage+'%';
        var commonClass=[styles.uploadBar];
        if(page=='home'){
            commonClass=[styles.uploadBar,styles.uploadBar_home];
        }
        if(page=='explore'){
            commonClass=[styles.uploadBar,styles.uploadBar_explore];
        }
        if(page=='cat'){
            commonClass=[styles.uploadBar,styles.uploadBar_cat];
        }
        if(page=='profile'){
            commonClass=[styles.uploadBar,styles.uploadBar_profile];
        }

        console.log(getPercentage);

        return (
          <View style={commonClass}>
            <Animated.View style={[styles.uploadBarGauge, {width: getPercentage}]}/>
          </View>
        );
    }
}



function donateActionsSet(thisClass,donatedTo,amount,donatedBy){
    thisClass.setState({giftModal:false});
    
    db.child('users').orderByChild('username').equalTo(donatedBy).once('child_added',snap=>{
        if(snap.val()){ var userData=snap.val();
            if(userData){
                var getCBalance=Number(userData.balance);
                var getAmount2=Number(amount);
                
                if(getCBalance >= getAmount2){
                    thisClass.setState({pageLoading:true});
                    db.child('donations').orderByChild('donatedBy').equalTo(donatedBy).once('value',snap2=>{
                        
                        //donations
                        var isFound=false; var previosAmount=0;
                        if(snap2.val()){
                            snap2.forEach(function(data){ var donationData=data.val();
                                if(donationData.donatedTo==donatedTo){
                                    isFound=data.key; previosAmount=Number(donationData.amount);
                                }
                            });
                        }
                        // console.log('======');
                        // console.log(previosAmount);
                        // console.log(isFound);
                        // console.log(snap2.val());
                        //return;


                        if(isFound){
                            var newAmount=previosAmount+Number(getAmount2);
                            db.child('donations').child(isFound).update({amount:newAmount});
                        }else{
                            db.child('donations').child('NaN').remove();
                            db.child('donations').limitToLast(1).once('child_added',lastRow=>{
                                var primaryKey=parseInt(lastRow.key) + 1;
                                db.child('donations').child(primaryKey).once('value',isExits=>{
                                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                                    var created_at=new Date().toJSON();
                                    
                                    var insertObject={};
                                    insertObject.amount=getAmount2;
                                    insertObject.donatedTo=donatedTo;
                                    insertObject.donatedBy=donatedBy;

                                    insertObject.created_at=created_at;
                                    db.child('donations').child(primaryKey).set(insertObject);
                                });
                            });
                        }


                        //records
                        db.child('drecords').child('NaN').remove();
                        db.child('drecords').limitToLast(1).once('child_added',lastRow=>{
                            var primaryKey=parseInt(lastRow.key) + 1;
                            db.child('drecords').child(primaryKey).once('value',isExits=>{
                                if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                                var created_at=new Date().toJSON();
                                
                                var insertObject={};
                                insertObject.amount=getAmount2;
                                insertObject.donatedTo=donatedTo;
                                insertObject.donatedBy=donatedBy;

                                insertObject.created_at=created_at;
                                db.child('drecords').child(primaryKey).set(insertObject);
                            });
                        });

                        //update balance 
                        db.child('users').orderByChild('username').equalTo(donatedTo).once('child_added',snap3=>{
                            if(snap3.val()){ var userData=snap3.val();
                                var newBalance=parseInt(userData.balance) + getAmount2; 
                                if(newBalance<0){newBalance=0}
                                db.child('users').child(snap3.key).update({balance:newBalance});
                            }
                        });


                        db.child('users').orderByChild('username').equalTo(donatedBy).once('child_added',snap3=>{
                            if(snap3.val()){ var userData=snap3.val();
                                var newBalance=parseInt(userData.balance) - getAmount2; 
                                if(newBalance<0){newBalance=0}
                                db.child('users').child(snap3.key).update({balance:newBalance});
                            }
                        });


                        //add notifiications
                        addNotifications(donatedTo,null,donatedBy,'donation',getAmount2);

                        Alert.alert('Success','You have sent coins successfully. Thanks for using OEVO.');

                        thisClass.setState({pageLoading:false});
                    });

                }else{
                    Alert.alert('Error!','You don\'t have enough coins to gift. Purchase OEVO Coins');
                    Actions.purchase_coins();
                }
            }
        }
    });;

}

export function exgiftModal(thisClass,username){
    if(thisClass.state.giftUser && thisClass.state.giftModal){
        var getUser=thisClass.state.giftUser;
        return(
            <Modal transparent={true}  animationType="slide" visible={true} onRequestClose={() => { console.log(1111) }} > 
                <TouchableWithoutFeedback  onPress={() => thisClass.setState({ giftModal: false,giftUser:null })}>
                    <View style={styles.gift_modal_area}> 
                        <View style={styles.gift_modal}> 
                            <View style={styles.gift_modal_top}> 
                                <Text style={styles.gift_modal_top_txt1}>Gift OEVO Coins</Text>
                                <Text style={styles.gift_modal_top_txt2}>Send to {getUser}</Text>
                            </View> 
                            <View style={styles.gift_modal_middle}> 
                                <TextInput underlineColorAndroid='transparent' keyboardType = 'numeric' autoCapitalize = 'none' placeholderTextColor="#868686" 
                                style={styles.gift_modal_middle_input} value={thisClass.state.gft_amount} placeholder="Enter amount of coins" 
                                autoCorrect={false} onChangeText={gft_amount=>thisClass.onChanged(gft_amount)}/>
                            </View>
                            <View style={styles.gift_modal_bottom}> 
                                <View style={[styles.gift_modal_bottom_left,styles.gift_modal_bottom_left2]}> 
                                    <TouchableOpacity onPress={() => thisClass.setState({ giftModal: false,giftUser:null })}><Text style={styles.gift_modal_bottom_left_ctxt}>Cancel</Text></TouchableOpacity>
                                </View>
                                <View style={styles.gift_modal_bottom_left}> 
                                    <TouchableOpacity onPress={()=>donateActionsSet(thisClass,thisClass.state.giftUser,thisClass.state.gft_amount,username)}><Text style={styles.gift_modal_bottom_left_ctxt2}>Send</Text></TouchableOpacity>
                                </View>
                            </View>
                        </View> 
                    </View> 
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
    
}


export function tagsAnalysis(tag,tagFollowers){
    var response=[]; 
    if(tag){
        var getFollowers=['http://','https://'];
        if(tag.indexOf("#")>=0 || tag.indexOf("@")>=0 || tag.indexOf("http")>=0){
            if(tag){ var myString="&&#@#@#@#@%@@%@==%=#=%$@!";
                var regexp = /#\w\w+\b/g;  var hashresult = tag.match(regexp); getFollowers=getFollowers.concat(hashresult);
                var regexp2 = /@\w\w+\b/g; var hashresult2 = tag.match(regexp2); getFollowers=getFollowers.concat(hashresult2);
                if(getFollowers && getFollowers.length>0){
                    for(index in getFollowers){
                        var getNow=getFollowers[index];
                        tag=tag.replace(getNow,myString+getNow);
                    }
                }
                var tagExplode=tag.split(myString);
                if(tagExplode.length>0){
                    for(index in tagExplode){
                        var getNow=tagExplode[index];
                        var hashresult = getNow.match(regexp); var hashresult2 = getNow.match(regexp2);
                        var regexp3 = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi; 
                        var hashresult3 = getNow.match(regexp3);

                        if(hashresult){
                            var myObject={};myObject.type='tag'; myObject.val=hashresult[0].replace('#',''); response.push(myObject);
                            var txtpart=getNow.replace(hashresult[0],'');
                            if(txtpart){var myObject={};myObject.type='txt'; myObject.val=txtpart; response.push(myObject);}
                        }else if(hashresult2){ var thisTag=hashresult2[0].replace('@','');
                            if(tagFollowers.indexOf(thisTag) != -1){
                                var myObject={};myObject.type='follower'; myObject.val=thisTag; response.push(myObject);
                            }else{
                                var myObject={};myObject.type='non_follower'; myObject.val=thisTag; response.push(myObject);
                            }
                            var txtpart=getNow.replace(hashresult2[0],'');
                            if(txtpart){var myObject={};myObject.type='txt'; myObject.val=txtpart;response.push(myObject);} 
                        }else if(hashresult3){
                            var myObject={};myObject.type='link'; myObject.val=hashresult3[0]; response.push(myObject);
                            var txtpart=getNow.replace(hashresult3[0],'');
                            if(txtpart){var myObject={};myObject.type='txt'; myObject.val=txtpart; response.push(myObject);}
                        }else{
                            var myObject={};myObject.type='txt'; myObject.val=getNow; response.push(myObject);
                        }
                        
                    }
                }
                
                
            }
        }else{
            var txtObject={};
            txtObject.type='txt';
            txtObject.val=tag; response.push(txtObject);
        } 
    }
    return response;
}