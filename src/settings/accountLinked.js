//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, NativeModules,AsyncStorage, ScrollView, Switch,StatusBar, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';


import axios from 'axios';
import {appEngine,gStorage} from './../common/Config';
import SpinnerBig from './../common/SpinnerBig';
import styles from './../style';
import IconF from 'react-native-vector-icons/FontAwesome';

const FBSDK = require('react-native-fbsdk');
const {LoginManager,AccessToken } = FBSDK;
const { RNTwitterSignIn } = NativeModules
const Constants = {
  TWITTER_COMSUMER_KEY: 'GfDBo0NL17GvdMoPOQoW5kYZY',
  TWITTER_CONSUMER_SECRET: 'QOJ6dB3UaXR4cQRnq2ttg0TtBA9Onjh7EvPlcHQRLwKViXe1hp',
}
import twitter, {auth} from 'react-native-twitter';
import {get,post} from './../twitter/raw';


var DeviceInfo = require('react-native-device-info');
var deviceId=DeviceInfo.getUniqueID();

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
//create componet
class Setting extends Component{

    constructor(props) {
        super(props);
        this.state = {
            fb_link:false,
            twitter_link:false,
            pageLoading:false, username:''
      };
    }



    handleClick(event) {
        Actions.signin();
    }

    componentWillMount(){
        StatusBar.setHidden(false);  StatusBar.setBarStyle('dark-content', true);

        if(this.props.fb_link){ this.setState({fb_link:this.props.fb_link}); }
        if(this.props.twitter_link){ this.setState({twitter_link:this.props.twitter_link}); }

        AsyncStorage.getItem('username').then((username) => { 
            if(username){
                this.setState({username:username});
            }else{ Actions.signin(); }
        });
    }



    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }

    fbConnect(value){
        if(value==true){
            var thisClass=this;
            LoginManager.logInWithReadPermissions(['email','public_profile']).then(
              function(resultdata) {
                if (resultdata.isCancelled) {
                  console.log('Login was cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then(function(res){
                        if(res.accessToken){
                            fetch('https://graph.facebook.com/me?fields=id,name,email,gender,picture&access_token='+res.accessToken).then(function(snap){
                                snap.json().then(function(result){
                                    thisClass.disconnectSocial('connect','fb',result.id);
                                });
                            });
                        }
                    });
                }
              },
              function(error) {
                console.log('Login failed with error: ' + error);
              }
            );
        }else{
            Alert.alert( 'Confirmation', 'Want to disconnect facebook?', 
                [ 
                    {text: 'No', onPress: () => console.log('cancel') , style: 'cancel'},
                    {text: 'OK', onPress: () => this.disconnectSocial('disconnect','fb',null) },
                ], 
                { cancelable: false } 
            );
        }
    }

    disconnectSocial(type,social,value){ var thisClass=this;
       db.child('settings').orderByChild('username').equalTo(thisClass.state.username).once('value',snap=>{
        if(snap.val()){
            snap.forEach(function(setMa){ var setting=setMa.val();
                if(setting.deviceId==deviceId){
                    if(type=='connect'){
                        if(social=='fb'){
                            db.child('settings').child(setMa.key).update({facebook:value});
                            thisClass.setState({fb_link: true});
                        }else if(social=='tw'){
                            db.child('settings').child(setMa.key).update({twitter:value});
                            thisClass.setState({twitter_link: true});
                        }
                    }else{
                        if(social=='fb'){
                            db.child('settings').child(setMa.key).update({facebook:null});
                            thisClass.setState({fb_link: false});
                        }else if(social=='tw'){
                            db.child('settings').child(setMa.key).update({twitter:null});
                            thisClass.setState({twitter_link: false});
                        }
                    }
                }
            });
        }
       });
    }


    twConnect(value){
        if(value==true){
            var thisClass=this;
            var twitter = RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET);
            RNTwitterSignIn.logIn().then(result => {
                if(result.email){
                    result.profile_image_url='https://twitter.com/'+result.userName+'/profile_image?size=bigger';
                    thisClass.disconnectSocial('connect','tw',result.id);
                }
            }).catch(error => {
                console.log(error)
            });
        }else{
            Alert.alert('Confirmation','Want to disconnect twitter?', 
                [ 
                    {text: 'No', onPress: () => console.log('cancel') , style: 'cancel'},
                    {text: 'OK', onPress: () => this.disconnectSocial('disconnect','tw',null) },
                ], 
                { cancelable: false } 
            );
        }
    }

    render(){
        return(
            <View style={styles.setting_container}>
                <View style={styles.edit_profile}>
                    <View style={styles.reg_heading}>
                        <Text style={[styles.profile_s_t]}>Accounts Linked</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>


                <ScrollView style={styles.setting_scroll}>
                    
                    <View style={styles.login_page}>
                        <View style={styles.login_form}>
                            
                            <View style={styles.single_language}>
                                <IconF name="facebook-f" style={[styles.vator_icon,styles.vator_icon_s]}/>
                                <Text style={styles.label_language}>Facebook</Text>
                                <Switch
                                  onValueChange={(value) =>this.fbConnect(value)}
                                  style={styles.ds_switcher_lan}
                                  thumbTintColor="#ddd"
                                  tintColor="#969696"
                                  onTintColor="#5BDA4D"
                                  value={this.state.fb_link}
                                />
                            </View>
                            <View style={styles.single_language}>
                                <IconF name="twitter" style={[styles.vator_icon,styles.vator_icon_s]}/>
                                <Text style={styles.label_language}>Twitter</Text>
                                <Switch
                                  onValueChange={(value) => this.twConnect(value)}
                                  style={styles.ds_switcher_lan}
                                  thumbTintColor="#ddd"
                                  tintColor="#969696"
                                  onTintColor="#5BDA4D"
                                  value={this.state.twitter_link}
                                />
                            </View>

                        </View>
                    </View>

                </ScrollView>

                {this.renderLoading()}
            </View>
        );
    }
}
//export to other parts
export default Setting;