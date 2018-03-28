//import libray
import React, {Component} from 'react';
import { View, Text,Alert,AppState,Platform,AsyncStorage} from 'react-native';
import PushNotification from 'react-native-push-notification'
import {appEngine,gStorage}  from './../common/Config';
import axios from 'axios';
import {Actions} from 'react-native-router-flux';

var DeviceInfo = require('react-native-device-info');
var deviceId=DeviceInfo.getUniqueID();

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';

//create componet
class PushService extends Component{
  constructor(props) {
    super(props);
    this.state = {
      username:''
    }
  }

  async saveItem(item, selectedValue) {try {await AsyncStorage.setItem(item, selectedValue); } catch (error) {  } }

  componentWillMount(){
    var thisClass=this;
    AsyncStorage.getItem('username').then((username) => { 
      if(username){ 
        thisClass.setState({username:username}); 

        PushNotification.configure({
            onRegister: function(token) {
                if(token){
                  var getToken = token.token;
                  thisClass.registerDevice(getToken);
                }
            },
            onNotification: function(notiData) {
                thisClass.handleNotifications(notiData);
            },
            senderID:'463518418597',
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });

        PushNotification.requestPermissions();

      }
    });

    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
      AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    if (appState === 'background') {
        AsyncStorage.getItem('totalNoti').then((totalNoti) => {
          if(getNumber){
              var getNumber = Number(totalNoti);
            PushNotification.setApplicationIconBadgeNumber(getNumber);
          }else{
            PushNotification.setApplicationIconBadgeNumber(0);
          }
        });
    }
    
  }

  registerDevice(token){ var thisClass=this; 
    AsyncStorage.getItem('deviceToken').then((deviceToken) => { 
      if(deviceToken){}else{
          
          // console.log(token);
          // console.log(deviceId);

          var postUrl=appEngine+'/push/register-device';
          axios.post(postUrl, {
              deviceToken: token,
              username : thisClass.state.username,
              type:'add',
              deviceId:deviceId,
              deviceType:'android'
          }).then(function(res){ var apidata=res.data;
              //console.log(apidata);

              thisClass.saveItem('deviceToken', token);
              if(apidata.status=='true'){
                db.child('settings').orderByChild('username').equalTo(thisClass.state.username).once('value',snap=>{
                  var shouldAdd=true;
                  if(snap.val()){
                    snap.forEach(function(data){ var setting = data.val();
                      if(setting.deviceId==deviceId){ shouldAdd=false;
                        db.child('settings').child(data.key).update({deviceToken:apidata.deviceToken,deviceArn:apidata.deviceArn,deviceType:'android'});
                      }
                    });
                  }

                  //console.log(shouldAdd);

                  //add here
                  if(shouldAdd==true){
                    db.child('settings').child('NaN').remove();
                    db.child('settings').limitToLast(1).once('child_added',lastRow=>{
                        var primaryKey=parseInt(lastRow.key) + 1;
                        db.child('settings').child(primaryKey).once('value',isExits=>{
                            if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                            var created_at=new Date().toJSON();
                            
                            var insertObject={};
                            insertObject.username=thisClass.state.username;
                            insertObject.deviceType='android';
                            insertObject.deviceToken=apidata.deviceToken;
                            insertObject.deviceArn=apidata.deviceArn;
                            insertObject.created_at=created_at;

                            db.child('settings').child(primaryKey).set(insertObject);
                        });
                    });
                  }


                });
              }
          })
          .catch(function(error){
            console.log(error );
          });
      }
    });
    
  }


  handleNotifications(notiData){
      if(notiData.foreground==false){
        if(notiData.notiData){
            var fND=JSON.parse(notiData.notiData);
            if(fND.notificationId){
                this.readNotifications(fND.notificationId);
            }
            if(fND.type=='subscribe'){
              Actions.profile({username:fND.username});
            }else if(fND.type=='like'){
              Actions.query({videoId:fND.videoId});
            }else if(fND.type=='follow_noti'){
              Actions.query({videoId:fND.videoId});
            }else if(fND.type=='comment'){
              Actions.comments({videoId:fND.videoId});
            }else if(fND.type=='reply'){
              Actions.comments({videoId:fND.videoId});
            }else if(fND.type=='donation'){
              Actions.mydonations();
            }else if(fND.type=='winner'){
              Actions.getWin();
            }
        }
        
      }

    if(notiData.badge){
        this.saveItem('totalNoti',notiData.badge);
    }
    
  }

  render(){
      return (
          <View></View>
      );
  }

  readNotifications(notificationId){
      db.child('notifications').child(notificationId).update({status:'read'});
      this.updateTotanNoti();
  }

  updateTotanNoti(){
    AsyncStorage.getItem('totalNoti').then((totalNoti) => { 
            if(totalNoti){ 
              var newNoti=totalNoti-1;
              this.setState({totalNoti:newNoti}); 
            }
    });
  }



}

export default PushService;
//PushService.init();