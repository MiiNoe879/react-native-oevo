//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Modal, AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import RNFirebase from 'react-native-firebase';
import {appEngine,gStorage}  from './../common/Config';
import axios from 'axios';
const dbConfig={
    clientId:"463518418597-si107eg7ar1jm4so5ntdn253fke5rhse.apps.googleusercontent.com",
    appId:"1:463518418597:ios:133aee6a7d959c4f",
    apiKey:"AIzaSyDj_qjsdbzXeKmFPQBpMkJrXDHRpNXvd5I",
    databaseURL:"https://elaborate-truth-178501.firebaseio.com",
    storageBucket:"elaborate-truth-178501.appspot.com",
    messagingSenderId:"463518418597",
    projectId:"elaborate-truth-178501",
    persistance:true
}

const firebase = RNFirebase.initializeApp(dbConfig,'oevo_app');
const db = firebase.database().ref();
const storage = firebase.storage().ref();
const basePath='https://firebasestorage.googleapis.com/v0/b/elaborate-truth-178501.appspot.com/o/';

const userData = (field, value) => {
  return new Promise((resolve, reject) => {
    if(field && value){
        var getQuery=db.child('users').orderByChild(field).equalTo(value).limitToLast(1);
        getQuery.once('value',userRes=>{
            if(userRes.val()){
                userRes.forEach(function(data) {
                    if(data.val()){resolve(data.val());}
                });
            }else{
                resolve(false);
            }
        });
    }
  });
}
function saveDeviceType(username,deviceType,deviceId,extraData){
    if(username,deviceType,deviceId){
        var getQuery=db.child('settings').orderByChild('deviceId').equalTo(deviceId).limitToLast(1);
        getQuery.once('value',settingMain=>{
            if(settingMain.val()){
                settingMain.forEach(function(setting) {
                    if(setting.val()){
                        if(setting && setting._value && setting._value.username==username && setting._value.deviceType==deviceType){
                        }else{
                            var insertObject={};
                            insertObject.username=username;
                            insertObject.deviceType=deviceType;
                            if(extraData){
                                if(extraData.facebook){insertObject.facebook=extraData.facebook;}
                                if(extraData.twitter){insertObject.twitter=extraData.twitter;}
                                if(extraData.contacts){insertObject.contacts=extraData.contacts;}
                            }
                            db.child('settings').child(setting.key).update(insertObject);
                        }
                    }
                });
            }else{
                db.child('settings').child('NaN').remove();
                db.child('settings').limitToLast(1).once('child_added',lastRow=>{
                    var primaryKey=parseInt(lastRow.key) + 1;
                    db.child('settings').child(primaryKey).once('value',isExits=>{
                        if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                        var created_at=new Date().toJSON();
                        
                        var insertObject={};
                        insertObject.username=username;
                        insertObject.deviceType=deviceType;
                        insertObject.deviceId=deviceId;
                        insertObject.created_at=created_at;
                        if(extraData){
                            if(extraData.facebook){insertObject.facebook=extraData.facebook;}
                            if(extraData.twitter){insertObject.twitter=extraData.twitter;}
                            if(extraData.contacts){insertObject.contacts=extraData.contacts;}
                        }
                        db.child('settings').child(primaryKey).set(insertObject);
                    });
                });
            }
        });
    }
}



function scorePassword(pass) {
    var score = 0;
    if (!pass)
        return score;
    var letters = new Object();
    for (var i=0; i<pass.length; i++) {letters[pass[i]] = (letters[pass[i]] || 0) + 1; score += 5.0 / letters[pass[i]]; }
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    }
    variationCount = 0; for (var check in variations) {variationCount += (variations[check] == true) ? 1 : 0; } score += (variationCount - 1) * 10;
    return parseInt(score);
}

function nFormat(num) {
     if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
     }
     if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
     }
     if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
     }
     return num;
}


const getFollowing = (username,type) => {
  return new Promise((resolve, reject) => {
    if(username && type){
        if(type=='following'){
            db.child('subscribers').orderByChild('followed_by').equalTo(username).once('value',snapData=>{
                var resData=[];
                if(snapData.val()){
                    snapData.forEach(function(data) {
                        if(data.val()){
                            var userName=data.val().following;
                            if(resData.indexOf(userName) != -1){}else{
                                resData.push(userName);
                            }
                        }
                    });
                }
                resolve(resData);
            });
        }else if(type=='followers'){
            db.child('subscribers').orderByChild('following').equalTo(username).once('value',snapData=>{
                var resData=[];
                if(snapData.val()){
                    snapData.forEach(function(data) {
                        if(data.val()){
                            var userName=data.val().followed_by;
                            if(resData.indexOf(userName) != -1){}else{
                                resData.push(userName);
                            }
                        }
                    }); 
                }
                resolve(resData);
            });
        }
    }
  });
}

const getLikes = (username) => {
  return new Promise((resolve, reject) => {
    if(username){
        db.child('likes').orderByChild('username').equalTo(username).once('value',snapData=>{
            var resData=[];
            if(snapData.val()){
                snapData.forEach(function(data) {
                    if(data.val()){resData.push(Number(data.val().videoId));}
                });
            }
            resolve(resData);
        });
    }
  });
}
function randomString(len, charSet) {charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; var randomString = ''; for (var i = 0; i < len; i++) {var randomPoz = Math.floor(Math.random() * charSet.length); randomString += charSet.substring(randomPoz,randomPoz+1); } return randomString; }
function agoFunction(time) {
    switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = 'ago',
    list_choice = 1;

  if (seconds == 0) {
    return 'Just now'
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0,
    format;
  while (format = time_formats[i++])
    if (seconds < format[0]) {
      if (typeof format[2] == 'string')
        return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
}

const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.child('users').once('value',snap=>{
        var users=[];
        if(snap.val()){
            snap.forEach(snap2=>{
                if(snap2.val()){users.push(snap2.val());}
            });
        }
        resolve(users);
    });
  });
}

function getFile(filePath){
    return basePath+filePath+'?alt=media&token='+randomString(16);
}



function addNotifications(userFor,videoId,username,type,dataVal){
    if(userFor!=username){
        db.child('notifications').orderByChild('userFor').equalTo(userFor).limitToLast(1).once('value',snap=>{
            if(snap.val()){
                db.child('notifications').orderByChild('userFor').equalTo(userFor).limitToLast(1).once('child_added',snap=>{
                    if(snap.val()){
                        var getData=snap.val();
                        if(getData.videoId==videoId && getData.username==username && 
                            getData.type==type && getData.dataVal==dataVal){

                        }else{
                            addNotificationsMain(userFor,videoId,username,type,dataVal);
                        }
                    }
                });
            }else{
                addNotificationsMain(userFor,videoId,username,type,dataVal);
            }
        });
    }
}

function addNotificationsMain(userFor,videoId,username,type,dataVal){
    if(userFor!=username){
        db.child('notifications').child('NaN').remove();
        db.child('notifications').limitToLast(1).once('child_added',lastRow=>{
            //console.log(lastRow);
            var primaryKey=parseInt(lastRow.key) + 1;
            db.child('notifications').child(primaryKey).once('value',isExits=>{
                //console.log(isExits);

                if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                var created_at=new Date().toJSON();
                
                var insertObject={};
                insertObject.userFor=userFor;
                insertObject.videoId=videoId;
                insertObject.username=username;
                insertObject.type=type;
                insertObject.dataVal=dataVal;
                insertObject.status='unread';
                insertObject.created_at=created_at;
                
                // console.log(primaryKey);
                // console.log(insertObject);

                db.child('notifications').child(primaryKey).set(insertObject);
                insertObject.notificationId=primaryKey;
                //send push
                if(userFor){
                    var badageCountArray=[];
                    db.child('notifications').orderByChild('userFor').equalTo(userFor).once('value',snap5=>{
                        if(snap5.val()){
                            snap5.forEach(function(data){ if(data.val() && data.val().status=='unread'){ badageCountArray.push(data.val());}});
                        }
                        var badageCount=badageCountArray.length;
                        db.child('settings').orderByChild('username').equalTo(userFor).once('value',snap=>{
                            
                            if(snap.val()){
                                var settings=[];
                                snap.forEach(function(data){ var setting=data.val();
                                    setting.settingId=data.key;
                                    if(setting.deviceArn){settings.push(setting);}
                                });
                                
                                // console.log(settings);
                                // console.log(insertObject);
                                // console.log(badageCount);

                                if(settings.length > 0){
                                    var postUrl=appEngine+'/push/send-notification';
                                    axios.post(postUrl, {
                                        settings : settings,
                                        notification: insertObject,
                                        badageCount:badageCount
                                    }).then(function(res){
                                        console.log(res.data);
                                    }).catch(function(error){});
                                }
                            }
                        });
                    });
                }


            });
        });
    }
}


export {firebase,db,userData,saveDeviceType,scorePassword,nFormat,getFollowing,getLikes,agoFunction,getUsers,getFile,addNotifications};