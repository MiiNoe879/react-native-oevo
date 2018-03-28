//import libray to create component
import React,{ Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity,StatusBar, AsyncStorage, Alert, ScrollView, NativeModules} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from './../common/Spinner';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import styles from './../style';
import IconFE from 'react-native-vector-icons/Entypo';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFZ from 'react-native-vector-icons/Zocial';

import {db,userData,firebase,saveDeviceType}  from './../db/DbConfig';

const FBSDK = require('react-native-fbsdk');
const {LoginManager,AccessToken } = FBSDK;
const { RNTwitterSignIn } = NativeModules
const Constants = {
  TWITTER_COMSUMER_KEY: 'GfDBo0NL17GvdMoPOQoW5kYZY',
  TWITTER_CONSUMER_SECRET: 'QOJ6dB3UaXR4cQRnq2ttg0TtBA9Onjh7EvPlcHQRLwKViXe1hp',
}
import twitter, {auth} from 'react-native-twitter';
import {get,post} from './../twitter/raw';

//create componet
class LoginForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
        };
    }

    componentWillMount(){
        
    }


    fb_click(){
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
                                thisClass.userCheck('email',result.email,result,'fb');
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
    }

    twitter_click(){ var thisClass=this;
        var twitter = RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET);

        RNTwitterSignIn.logIn().then(result => {
            if(result.email){
                result.profile_image_url='https://twitter.com/'+result.userName+'/profile_image?size=bigger';
                thisClass.userCheck('email',result.email,result,'tw');
            }
        }).catch(error => {
            console.log(error)
        });
    }   

    


    userCheck(type,value,result,social){
        var thisClass=this; thisClass.setState({loading:true});
        userData(type,value).then((res)=>{
            thisClass.setState({loading:false});
            if(res==false){
                if(social=='tw'){
                    Actions.signup({fname:result.name, email:result.email, twid:result.id, photo:result.profile_image_url});
                }else{
                    Actions.signup({fname:result.name, email:result.email, fbid:result.id, photo:result.picture.data.url});
                }
            }else{
                Actions.signin({username:res.username});
            }
        });
    }

    renderLoading(){
        if(this.state.loading){
            return(
                <View style={styles.connect_loading}>
                    <Spinner size="small"/>
                </View>
            );
        }
    }
    

    render(){ var thisClass=this;
        return(
            <View style={styles.sign_ucontainer}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <ScrollView style={{flex:1}}>
                    <View style={styles.signip_login_page34}>
                        <View style={[styles.login_logo_area,styles.login_logo_area_new]}>
                            <Image style={styles.sign_logo}  source={require('./../images/login_logo.png')}/>
                            <Text style={styles.pronounced_as}>Pronounced as O-E-VO</Text>
                        </View>
                        <View style={styles.sign_login_form}>
                            <View style={styles.login_form_row}>
                                <View style={styles.login_form_row_middle}>
                                    <View style={styles.login_form_row_social}>
                                        <TouchableOpacity onPress={()=>thisClass.fb_click()} style={styles.signup_connect_touch} >
                                            <View style={styles.signup_connect_touch_a}>
                                                <IconF name="facebook" style={[styles.signup_connect_img2]}/>   
                                                <Text style={styles.signup_connect_txt}>Sign Up With Facebook</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>thisClass.twitter_click()} style={[styles.signup_connect_touch,styles.signup_connect_touch2]} >
                                            <View style={styles.signup_connect_touch_a}>
                                            <IconFE name="twitter" style={[styles.signup_connect_img2]}/>   
                                            <Text style={styles.signup_connect_txt}>Sign Up With Twitter</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>Actions.signup()} style={[styles.signup_connect_touch,styles.signup_connect_touch2,styles.signup_connect_touch256]} >
                                            <View style={styles.signup_connect_touch_a}>
                                            <IconFZ name="email" style={[styles.signup_connect_img21]}/>   
                                            <Text style={styles.signup_connect_txt}>Sign Up With E-mail</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    
                </ScrollView>
                {this.renderLoading()}
                <TouchableOpacity onPress={()=>Actions.realsignin()} style={styles.signip_login_page_hav34}>
                    <Text style={styles.signip_login_page_ha_txt56}>Sign In</Text>
                </TouchableOpacity>
                <Text style={styles.privacy_terms}>By using oevo you agree to our Terms & Privacy policy</Text>
                
            </View>
        );
    }
}

//export to other parts
export default LoginForm;