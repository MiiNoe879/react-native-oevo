//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput,StatusBar, TouchableOpacity, AsyncStorage, ScrollView, Alert, Keyboard } from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from './../common/Spinner';
import axios from 'axios';
var screen = require('Dimensions').get('window');

import {appEngine,gStorage} from './../common/Config';
import { ifIphoneX } from './../common/isIphoneX';
var DeviceInfo = require('react-native-device-info');
var deviceId=DeviceInfo.getUniqueID();
import PushService from './../common/PushService';

import {db,userData,firebase,saveDeviceType,scorePassword}  from './../db/DbConfig';
import TimerMixin from 'react-timer-mixin';

//create componet
class RealSignIn extends Component{
    
    constructor(props) {
        super(props);
        var username='';
        if(this.props.username){
            username=this.props.username;
        }
        this.state = {
            username:username,
            password:'',
            loading:false,
            extraMargin:0,
            isKeyboardOpened:false,
        };
    }

  componentWillMount(){
    if(this.props.username){
        Alert.alert('Error!','You are already registered, please enter password!');
    }
  }



  async saveItem(item, selectedValue) {try {await AsyncStorage.setItem(item, selectedValue); } catch (error) {  } }

  loginSubmit(){
        var thisClass=this;
        if(thisClass.state.username && thisClass.state.password){ thisClass.setState({loading:true});
            Keyboard.dismiss();
            
            db.child('users').orderByChild('username').equalTo(thisClass.state.username).limitToLast(1).once('child_added',snap=>{
                if(snap.val()){ var userData=snap.val();
                    var userEmail=userData.email;
                    firebase.auth().signInWithEmailAndPassword(userEmail, thisClass.state.password).then(function(gRes){
                        thisClass.saveItem('username',thisClass.state.username); thisClass.setState({loading:false}); saveDeviceType(thisClass.state.username,'ios',deviceId,null); Actions.home();
                    }).catch(function(error) {
                      Alert.alert('Error!','Invalid username or password!'); thisClass.setState({loading:false});
                    });
                }
            });
        }else{
            Alert.alert('Error!','Please enter email and password properly!');
        }
   }

    renderButton(){
        if(this.state.loading){ return <Spinner size="small"/> }
        return (
            <TouchableOpacity onPress={()=>this.loginSubmit()}>
                <Text style={[styles.input_field_signup,styles.signin_btn_btn]}>SIGN IN</Text>
            </TouchableOpacity>
        );
    }



    onBlurHide(){ var thisClass=this;
        this.setState({isKeyboardOpened:false});
        TimerMixin.setTimeout(function(){
            if(thisClass.state.isKeyboardOpened==false){
                thisClass.setState({extraMargin:0});
            }
        },50);
    }

    render(){
      return (
          <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
               <ScrollView  extraHeight={this.state.extraHeight} enableOnAndroid={true} 
               style={{flex:1}} keyboardShouldPersistTaps='always' >
                   
                   <View style={[styles.login_page]}>
                        <View style={[styles.login_page_area,{marginBottom:this.state.extraMargin}]}>
                            <View style={styles.login_logo_area}>
                                <Image style={styles.login_logo} source={require('./../images/login_logo.png')}/>
                            </View>
                            <View style={styles.login_form}>
                                <View style={styles.form_row}>
                                    <TextInput 
                                    onFocus={()=>this.setState({extraMargin:250,isKeyboardOpened:true})}
                                    onBlur={()=>this.onBlurHide()}
                                    underlineColorAndroid='transparent' autoCapitalize = 'none' 
                                    placeholderTextColor="#868686" style={styles.input_field_signup} value={this.state.username} 
                                    placeholder="Username" autoCorrect={false} 
                                    onChangeText={username=>this.setState({username : username.trim()})}/>
                                </View>
                                <View style={styles.form_row}>
                                    <TextInput 
                                    onFocus={()=>this.setState({extraMargin:250,isKeyboardOpened:true})}
                                    onBlur={()=>this.onBlurHide()}
                                    underlineColorAndroid='transparent'  returnKeyType='go'  onSubmitEditing={()=>this.loginSubmit()}  autoCapitalize = 'none' placeholderTextColor="#868686" style={styles.input_field_signup} value={this.state.password} placeholder="Password" autoCorrect={false} onChangeText={password=>this.setState({ password: password.trim() })} secureTextEntry={true}/>
                                </View>
                                <View style={styles.form_row}>
                                    <TouchableOpacity>
                                        {this.renderButton()}
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={()=>Actions.forgot()}><Text style={styles.forgot_pass}>Forgot Password?</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </ScrollView>
                <View style={styles.form_row_submit}>
                    <View style={styles.form_row_extra}>
                        <View style={styles.form_row_extra_single1}></View>
                        <View style={styles.form_row_extra_single2}></View>
                        <View style={styles.form_row_extra_single3}></View>
                        <View style={styles.form_row_extra_single4}></View>
                    </View>
                    <TouchableOpacity onPress={()=>Actions.signin()}>
                        <Text style={[styles.ds_button, styles.ds_button2]}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
                <PushService/>


          </View>

      );
    }
}


const styles=StyleSheet.create({
    container:{
        backgroundColor : '#fff',
        flex:1
    },
    login_page:{height:screen.height,justifyContent:'center'},
    login_logo_area:{
        alignItems: 'center',
    },
    login_form:{
        alignItems: 'center',
    },
    form_row:{
        marginTop:10,
        alignSelf : 'stretch',
        position:'relative'
    },
    login_logo:{
        width:200,height:62,
        marginBottom:20
    },
    label:{
        color:'#262626',
        fontSize:16,
        marginBottom:5,
        fontFamily:'Calibri'
    },
    input_field_signup:{borderWidth:1, borderColor:'#ebf2f5', borderRadius:25, fontFamily:'Calibri',
    backgroundColor:'#ebf2f5', padding:8, fontSize:16, width:'80%',textAlign:'center', marginLeft:'10%',overflow:'hidden',color:'#262626'},
    input_field:{
        borderBottomWidth:1,
        borderBottomColor:'#262626',
        paddingTop:7,
        paddingBottom:7,
        color:'#262626',
        fontSize:16,
        fontFamily:'Calibri',
    },
    form_row_extra:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems: 'center'
    },
    dont_account:{
        color :'#262626',
        fontSize:16,
        fontFamily:'Calibri'
    },
    link_btn:{
        color :'#262626',
        fontSize:16,
        paddingLeft:10,
        fontFamily:'Calibri'
    },
    ds_button:{
        backgroundColor:'#fff',
        color : '#262626',
        paddingTop:12,
        paddingBottom:12,
        textAlign:'center',
        fontSize:16,
        fontFamily:'Calibri'
    },
    ds_button2:{
        fontSize:18,
        fontFamily:'Calibri-Bold',
        ...ifIphoneX({
         paddingBottom:20   
        }, {
            
        })
    },
    forgot_pass:{
        color:'#262626',
        fontSize:16,
        fontFamily:'Calibri-Bold',
        marginTop:20
    },
    input_error:{
        borderBottomColor:'red'
    },
    form_row_extra_single1:{
        height:3,
        flex:4,
        backgroundColor:'#ff0148'
    },
    form_row_extra_single2:{
        height:3,
        flex:4,
        backgroundColor:'#f3b600'
    },
    form_row_extra_single3:{
        height:3,
        flex:4,
        backgroundColor:'#48f938'
    },
    form_row_extra_single4:{
        height:3,
        flex:4,
        backgroundColor:'#4c9bff'
    },
    form_row_submit:{
        position:'absolute',
        bottom:0,
        left:0,
        right:0
    },
    signin_btn_btn:{
        fontFamily:'Calibri-Bold',
        paddingTop:13,
        paddingBottom:13,
        fontSize:18
    }
});


//export to other parts
export default RealSignIn;