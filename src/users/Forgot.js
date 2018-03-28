//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity,StatusBar, ScrollView, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from './../common/Spinner';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import IconF from 'react-native-vector-icons/FontAwesome';
import { ifIphoneX } from './../common/isIphoneX';


import {db,userData,firebase,saveDeviceType}  from './../db/DbConfig';

//create componet
class LoginForm extends Component{
    state = { email:'', loading:false,   token:'', getToken:'', isToken : false, hideEmail:false};

    validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }


    forgotSubmit(){
        var thisClass=this; var getEmail=(thisClass.state.email).trim();
        if(getEmail &&  thisClass.validateEmail(getEmail)){
            thisClass.setState({loading:true,email:getEmail});
            userData('email',getEmail).then((res)=>{
                if(res==false){ Alert.alert('Error!','Email address did not match with our records!!'); thisClass.setState({loading:false});}else{
                    firebase.auth().sendPasswordResetEmail(getEmail).then(function() {
                      Alert.alert('Success!','Check your inbox to reset password on Oevo.');Actions.signin();
                    }).catch(function(error) {});
                }
            });
        }else{
            Alert.alert('Error!','Please enter valid email address!');
        }

   }

    renderButton(){
        if(this.state.loading){ return <Spinner size="small"/> }
        return (<TouchableOpacity onPress={()=>this.forgotSubmit()}>
            <Text style={[styles.input_field_signup,styles.signin_btn_btn]}>CONTINUE</Text></TouchableOpacity>);
    }


    render(){
      return (
          <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>
              <View style={{flex:1}}>
                  <View style={styles.container2}>
                      <View style={styles.login_page}>
                            <View style={styles.login_logo_area}>
                                <Image style={styles.login_logo} source={require('./../images/login_logo.png')}/>
                            </View>
                            <View style={styles.login_form}>
                                <View style={styles.form_row}>
                                    <TextInput underlineColorAndroid='transparent' returnKeyType='go' keyboardType={'email-address'}  onSubmitEditing={()=>this.forgotSubmit()}  autoCapitalize = 'none' 
                                    placeholderTextColor="#868686" style={styles.input_field_signup} 
                                    value={this.state.email} placeholder="user@gmail.com" autoCorrect={false} 
                                    onChangeText={email=>this.setState({email : email})}/>
                                </View>
                                <View style={styles.form_row}>
                                    {this.renderButton()}
                                </View>
                            </View>
                      </View>
                  </View>
              </View>
                <TouchableOpacity onPress={()=>Actions.social_connect()} style={styles.signip_login_page_hav}>
                    <Text style={styles.signip_login_page_ha_txt}>Don't have an account?</Text>
                </TouchableOpacity>

          </View>

      );
    }
}


const styles=StyleSheet.create({
    container:{
        backgroundColor : '#fff',
        flex:1,
    },
    container2:{
        flex:1,
        justifyContent: 'center'
    },
    login_logo_area:{
        alignItems: 'center',
        marginBottom:20
    },
    login_form:{
        alignItems: 'center',
    },
    signip_login_page_ha_txt:{textAlign:'center',fontFamily:'Calibri', fontSize:18, padding:15, 
    paddingTop:20,
    ...ifIphoneX({
            paddingBottom:20
        }, {
            
        })
    },
    form_row:{
        marginTop:10,
        alignSelf : 'stretch',
        position:'relative'
    },
    login_logo:{
        width:200,height:62,
    },
    label:{
        color:'#262626',
        fontSize:18,
        marginBottom:5,
        fontFamily:'Calibri-Bold',
        textAlign:'center',
        marginBottom:15
    },
    left_image_rrow:{
        width:16,
        height:20
    },
    input_field_signup:{borderWidth:1, borderColor:'#ebf2f5', borderRadius:25, fontFamily:'Calibri',
    backgroundColor:'#ebf2f5', padding:10,width:'80%',textAlign:'center', marginLeft:'10%',overflow:'hidden', fontSize:18, color:'#000'},
    link_btn:{
        color :'#fff',
        fontSize:16,
        padding:10,
        fontWeight:'bold'
    },
    ds_button:{
        backgroundColor:'#3D0C59',
        color : '#fff',
        paddingTop:10,
        paddingBottom:10,
        textAlign:'center',
        fontSize:18
    },
    forgot_pass:{
        position:'absolute',
        right:0,
        bottom:5,
        color:'#fff',
        fontSize:13
    },
    signip_login_page_hav:{position:'absolute', bottom:0, right:0, left:0, zIndex:99, backgroundColor:'transparent'},
    single_error:{
        color:'red',
        fontSize:13,
        paddingLeft:20
    },
    login_form1:{
        display:'none'
    },
    reg_heading:{
        position:'relative',
        paddingTop:15,
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    signup_cross:{
        width:20,
        height:20,
        marginTop:15,
        marginLeft:15
    },
    signup_cross_txt:{
        color:'#fff',
        padding:15,
        paddingTop:10
    },
    signin_btn_btn:{
        fontFamily:'Calibri-Bold',
        paddingTop:12,
        paddingBottom:12,
        color:'#000'
    },
    heading_area_back:{position:'absolute', left:0, top:0, zIndex:99, paddingRight:70,  },
    back_vator:{color:'#262626',fontSize:30,paddingBottom:10, paddingLeft:15,backgroundColor:'transparent',paddingRight:70,...ifIphoneX({
        paddingTop:5,
        paddingBottom:9
    }, {
        paddingTop:5,
    })},

});


//export to other parts
export default LoginForm;
