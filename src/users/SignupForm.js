//import libray to create component
import React,{ Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, AsyncStorage, StatusBar, Keyboard, Alert, DatePickerIOS, Picker, Switch, DatePickerAndroid } from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from './../common/Spinner';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import styles from './../style';
import KeyboardAwareScrollView from './../common/KeyboardAwareScrollView';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFI from 'react-native-vector-icons/Ionicons';
var DeviceInfo = require('react-native-device-info');
var deviceId=DeviceInfo.getUniqueID();

import {db,userData,firebase,saveDeviceType,scorePassword}  from './../db/DbConfig';
//create componet
class SignupForm extends Component{
    constructor(props) {
        super(props);
        var name,email='';
        var step='step1';
        if(this.props.fname){
            name=this.props.fname;
            step='step2';
        }
        if(this.props.email){
            email=this.props.email;
            step='step3';
        }

        this.state = {
            name:name, email:email,username:'', password:'',
            birthdate:new Date("January 1, 2001"),
            gender:'female',loading:false,
            step:step,
            returnKey:'go',
            camera:true,
            contacts:true,
            microphone:true,
            library:true,
        };
    }
    
    async saveItem(item, selectedValue) {try {await AsyncStorage.setItem(item, selectedValue); } catch (error) {  } }
    
    validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }


    regsiterSubmit(){
        var thisClass=this; thisClass.setState({loading:true});
        var d = thisClass.state.birthdate;
        var iso_date_string = d.toJSON();

        userData('email',thisClass.state.email).then((res)=>{
            if(res==false){
                userData('username',thisClass.state.username).then((res)=>{
                    if(res==false){
                        //create user account
                        firebase.auth().createUserWithEmailAndPassword(thisClass.state.email, thisClass.state.password).then(function(res){
                            db.child('users').child('NaN').remove();
                            db.child('users').limitToLast(1).once('child_added',lastRow=>{
                                var primaryKey=parseInt(lastRow.key) + 1;
                                db.child('users').child(primaryKey).once('value',isExits=>{
                                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                                    var created_at=new Date().toJSON();

                                    //save to users db
                                    db.child('users').child(primaryKey).set({
                                        name:thisClass.state.name,
                                        username:thisClass.state.username,
                                        email:thisClass.state.email,
                                        gender:thisClass.state.gender,
                                        birthdate:iso_date_string,
                                        smsTotal:0,
                                        balance:0,
                                        type:'user',
                                        language:'English',
                                        subscribers:0,
                                        profilePic:'default.png',
                                        views:0,
                                        videos:0,

                                        created_at:created_at
                                    });

                                    
                                    //save to settings 
                                    var extraData={};
                                    var facebook=null;var twitter=null;var contacts='no';
                                    if(thisClass.props.fbid){facebook=thisClass.props.fbid; }
                                    if(thisClass.props.twid){twitter=thisClass.props.twid; }
                                    if(thisClass.state.contacts){contacts='yes'; }
                                    extraData.facebook=facebook;extraData.twitter=twitter;extraData.contacts=contacts;
                                    saveDeviceType(thisClass.state.username,'ios',deviceId,extraData);
                                    

                                    //login user
                                    firebase.auth().signInWithEmailAndPassword(thisClass.state.email, thisClass.state.password).then(function(gRes){
                                        thisClass.saveItem('username', thisClass.state.username); thisClass.setState({loading:false}); Actions.invite();
                                    }).catch(function(error) {});

                                    //add subscription
                                    db.child('subscribers').child('NaN').remove();
                                    db.child('subscribers').limitToLast(1).once('child_added',lastRow=>{
                                        var primaryKey=parseInt(lastRow.key) + 1;
                                        db.child('subscribers').child(primaryKey).once('value',isExits=>{
                                            if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                                            var created_at=new Date().toJSON();
                                            
                                            var insertObject={};
                                            insertObject.following='oevo';
                                            insertObject.followed_by=thisClass.state.username;
                                            insertObject.created_at=created_at;
                                            db.child('subscribers').child(primaryKey).set(insertObject);


                                            //add subscription
                                            db.child('subscribers').limitToLast(1).once('child_added',lastRow=>{
                                                var primaryKey=parseInt(lastRow.key) + 1;
                                                db.child('subscribers').child(primaryKey).once('value',isExits=>{
                                                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                                                    var created_at=new Date().toJSON();
                                                    
                                                    var insertObject={};
                                                    insertObject.following='momo_mukati';
                                                    insertObject.followed_by=thisClass.state.username;
                                                    insertObject.created_at=created_at;
                                                    db.child('subscribers').child(primaryKey).set(insertObject);

                                                    //add subscription
                                            db.child('subscribers').limitToLast(1).once('child_added',lastRow=>{
                                                var primaryKey=parseInt(lastRow.key) + 1;
                                                db.child('subscribers').child(primaryKey).once('value',isExits=>{
                                                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                                                    var created_at=new Date().toJSON();
                                                    
                                                    var insertObject={};
                                                    insertObject.following='vincentmarcus';
                                                    insertObject.followed_by=thisClass.state.username;
                                                    insertObject.created_at=created_at;
                                                    db.child('subscribers').child(primaryKey).set(insertObject);


                                                    //add subscription
                                            db.child('subscribers').limitToLast(1).once('child_added',lastRow=>{
                                                var primaryKey=parseInt(lastRow.key) + 1;
                                                db.child('subscribers').child(primaryKey).once('value',isExits=>{
                                                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                                                    var created_at=new Date().toJSON();
                                                    
                                                    var insertObject={};
                                                    insertObject.following='jasonnash';
                                                    insertObject.followed_by=thisClass.state.username;
                                                    insertObject.created_at=created_at;
                                                    db.child('subscribers').child(primaryKey).set(insertObject);

                                                    //add subscription
                                            db.child('subscribers').limitToLast(1).once('child_added',lastRow=>{
                                                var primaryKey=parseInt(lastRow.key) + 1;
                                                db.child('subscribers').child(primaryKey).once('value',isExits=>{
                                                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                                                    var created_at=new Date().toJSON();
                                                    
                                                    var insertObject={};
                                                    insertObject.following='hassassin';
                                                    insertObject.followed_by=thisClass.state.username;
                                                    insertObject.created_at=created_at;
                                                    db.child('subscribers').child(primaryKey).set(insertObject);


                                                    //add subscription
                                            db.child('subscribers').limitToLast(1).once('child_added',lastRow=>{
                                                var primaryKey=parseInt(lastRow.key) + 1;
                                                db.child('subscribers').child(primaryKey).once('value',isExits=>{
                                                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                                                    var created_at=new Date().toJSON();
                                                    
                                                    var insertObject={};
                                                    insertObject.following='izzaz';
                                                    insertObject.followed_by=thisClass.state.username;
                                                    insertObject.created_at=created_at;
                                                    db.child('subscribers').child(primaryKey).set(insertObject);

                                                    //add subscription
                                            db.child('subscribers').limitToLast(1).once('child_added',lastRow=>{
                                                var primaryKey=parseInt(lastRow.key) + 1;
                                                db.child('subscribers').child(primaryKey).once('value',isExits=>{
                                                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                                                    var created_at=new Date().toJSON();
                                                    
                                                    var insertObject={};
                                                    insertObject.following='nicholasmegalis';
                                                    insertObject.followed_by=thisClass.state.username;
                                                    insertObject.created_at=created_at;
                                                    db.child('subscribers').child(primaryKey).set(insertObject);
                                                });
                                            });


                                                });
                                            });


                                                });
                                            });


                                                });
                                            });


                                                });
                                            });



                                                });
                                            });

                                    
                                        });
                                    });

                                    //update user data 
                                    db.child('users').orderByChild('username').equalTo('oevo').once('child_added',snap5=>{
                                        if(snap5.val()){ var userData=snap5.val();
                                            var newSubcribers=parseInt(userData.subscribers)+1;
                                            db.child('users').child(snap5.key).update({subscribers:newSubcribers});
                                        }
                                    });


                                    

                                    //update user data 
                                    db.child('users').orderByChild('username').equalTo('momo_mukati').once('child_added',snap5=>{
                                        if(snap5.val()){ var userData=snap5.val();
                                            var newSubcribers=parseInt(userData.subscribers)+1;
                                            db.child('users').child(snap5.key).update({subscribers:newSubcribers});
                                        }
                                    });





                                });
                            });

                            

                        }).catch(function(error) {
                            Alert.alert('Error!',error.message)
                        });
                    }
                });
            }
        });
        
    }



    async openDatePicker(){ var thisClass=this;
        var maximumDate= new Date("January 1, 2015");
        try {
          const {action, year, month, day} = await DatePickerAndroid.open({
            date: new Date(this.state.birthdate),
            maxDate:maximumDate
          });
          if (action !== DatePickerAndroid.dismissedAction) {
            var newdate=new Date(year, month, day);
            thisClass.setState({birthdate:newdate});
          }
        } catch ({code, message}) {
          
        }
    }


    renderBackButtons(){
        var step=null;
        if(this.state.step=='step2'){
            step = 'step1';
        }else if(this.state.step=='step3'){
            step = 'step2';
        }else if(this.state.step=='step4'){
            step = 'step3';
        }else if(this.state.step=='step5'){
            step = 'step4';
        }else if(this.state.step=='step6'){
            step = 'step5';
        }else if(this.state.step=='step7'){
            step = 'step6';
        }

        if(step){
            return(
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>this.setState({step:step})}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>
            );
        }else{
            return(
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>
            );
        }
        
    }

    nameChange(name){
        this.setState({name : name});
    }

    userCheck(type,value){
        var thisClass=this; thisClass.setState({loading:true});
        userData(type,value).then((res)=>{
            thisClass.setState({loading:false});
            if(res==false){
                if(type=='email'){
                    thisClass.setState({step:'step3'});
                }else{
                    thisClass.setState({step:'step4'});
                }
            }else{
                if(type=='email'){
                    Alert.alert('Error!','Email address already exits!');
                }else{
                    Alert.alert('Error!','UserName already exits!');
                }
            }
        });
    }

    submitSignup(step){
        if(step=='step1'){
            if(this.state.name){
                this.setState({step:'step2'});
            }else{
                Alert.alert('Error!','Enter your full name!');
            }
        }else if(step=='step2'){
            if(this.state.email && this.validateEmail(this.state.email)){
                this.userCheck('email',this.state.email);
            }else{
                Alert.alert('Error!','Enter a valid email!');
            }
        }else if(step=='step3'){
            if (/\s/.test(this.state.username)) {
                Alert.alert('Error!','User name can\'t have any space!');
            }else if(this.state.username){
                this.userCheck('username',this.state.username);
            }else{
                Alert.alert('Error!','Enter a Username!');
            }
        }else if(step=='step4'){
            if(this.state.password && this.state.password.length > 4 && scorePassword(this.state.password) >= 35){
                this.setState({step:'step5'});
            }else{
                Alert.alert('Error!','Enter a secured password! Min charcaters:5');
            }
        }else if(step=='step5'){
            this.setState({step:'step6'});
        }else if(step=='step6'){
            this.setState({step:'step7'});
        }else if(step=='step7'){
           this.regsiterSubmit();
        }

    }


    userNameTrigger(username){
      var username=(username.trim()).toLowerCase(); username=username.replace(/[^a-zA-Z0-9_-]/g, '');
      this.setState({username:username})
    }

    renderSteps(){
        var getBithdate=this.state.birthdate;
        getBithdate=getBithdate.toDateString();

        if(this.state.step=='step1'){
            return(
                <View style={styles.login_form_row}>
                    <View style={styles.login_form_row_top}>
                        <Text style={styles.login_form_label}>What is Your Full Name?</Text>
                    </View>
                    <View style={styles.login_form_row_middle}>
                        <TextInput  underlineColorAndroid='transparent' returnKeyType={this.state.returnKey} onSubmitEditing={()=>this.submitSignup('step1')}  onBlur={()=>this.blurAction()} placeholderTextColor="#262626" style={styles.input_field_signup} value={this.state.name} 
                        placeholder="Full Name" autoCorrect={false} onChangeText={name=>this.setState({name:name})}/>
                    </View>
                </View>
            );
        }else if(this.state.step=='step2'){
            return(
                <View style={styles.login_form_row}>
                    <View style={styles.login_form_row_top}>
                        <Text style={styles.login_form_label}>What is Your E-mail Address?</Text>
                    </View>
                    <View style={styles.login_form_row_middle}></View>
                    <View style={styles.login_form_row_middle}>
                        <TextInput  underlineColorAndroid='transparent'  autoCapitalize = 'none' returnKeyType={this.state.returnKey} keyboardType={'email-address'}  onSubmitEditing={()=>this.submitSignup('step2')}  onBlur={()=>this.blurAction()} placeholderTextColor="#262626" style={styles.input_field_signup} value={this.state.email} 
                        placeholder="Email Address" autoCorrect={false} onChangeText={email=>this.setState({email:(email.trim()).toLowerCase()})}/>
                    </View>
                </View>
            );
        }else if(this.state.step=='step3'){
            return(
                <View style={styles.login_form_row}>
                    <View style={styles.login_form_row_top}>
                        <Text style={styles.login_form_label}>Enter a Username</Text>
                    </View>
                    <View style={styles.login_form_row_middle}>
                        <TextInput  underlineColorAndroid='transparent'  autoCapitalize = 'none' returnKeyType={this.state.returnKey} onSubmitEditing={()=>this.submitSignup('step3')}  onBlur={()=>this.blurAction()} placeholderTextColor="#262626" style={styles.input_field_signup} value={this.state.username} 
                        placeholder="Username" autoCorrect={false} onChangeText={username=>this.userNameTrigger(username)}/>
                    </View>
                </View>
            );
        }else if(this.state.step=='step4'){
            return(
                <View style={styles.login_form_row}>
                    <View style={styles.login_form_row_top}>
                        <Text style={styles.login_form_label}>Enter Secured Password.</Text>
                    </View>
                    <View style={styles.login_form_row_middle}>
                        <TextInput  underlineColorAndroid='transparent'  autoCapitalize = 'none' returnKeyType={this.state.returnKey} onSubmitEditing={()=>this.submitSignup('step4')}  onBlur={()=>this.blurAction()} placeholderTextColor="#262626" style={styles.input_field_signup} value={this.state.password} 
                        placeholder="Secured Password" autoCorrect={false} secureTextEntry={true} onChangeText={password=>this.setState({password:password})}/>
                    </View>
                </View>
            );
        }else if(this.state.step=='step5'){
            return(
                <View style={styles.login_form_row}>
                    <View style={styles.login_form_row_top}>
                        <Text style={styles.login_form_label}>Pick Your Birth Date.</Text>
                    </View>
                    <View style={styles.login_form_row_middle}>
                        <View style={styles.login_form_row_picker}>
                            <TouchableOpacity onPress={()=>this.openDatePicker()}><Text style={styles.input_field_signup}>{getBithdate}</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.login_form_row_bottom}>
                        <TouchableOpacity onPress={()=>this.submitSignup('step5')} style={styles.extra_submit_btn}>
                            <Text style={styles.extra_submit_btn_txt}>Go</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }else if(this.state.step=='step6'){
            return(
                <View style={styles.login_form_row}>
                    <View style={styles.login_form_row_top}>
                        <Text style={[styles.login_form_label,{marginBottom:0}]}>Gender</Text>
                    </View>
                    <View style={styles.login_form_row_middle}>
                        <View style={[styles.login_form_row_picker,styles.login_form_row_picker23]}>
                            <Picker selectedValue={this.state.gender} onValueChange={(gender) => this.setState({gender: gender})}> 
                                <Picker.Item label="Male" value="male" /> 
                                <Picker.Item label="Female" value="female" /> 
                                <Picker.Item label="Unspecified" value="unspecified" /> 
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.login_form_row_bottom}>
                        <TouchableOpacity onPress={()=>this.submitSignup('step6')} style={styles.extra_submit_btn}>
                            <Text style={styles.extra_submit_btn_txt}>Go</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }else{
            return(
                <View style={styles.login_form_row}>
                    <View style={styles.login_form_row_top}>
                        <Text style={styles.login_form_label}>Enable following to continue</Text>
                    </View>
                    <View style={styles.login_form_row_middle}>
                        <View style={styles.login_form_row_features}>
                            <View style={styles.device_single}>
                                <View style={[styles.device_single_left, styles.device_single_left2]}>
                                    <IconF name="camera" style={[styles.enable_f_icons]}/>   
                                    <Text style={styles.device_single_left_tx}>Enable Camera</Text>
                                </View>
                                <View style={styles.device_single_left,{alignItems:'flex-end'}}>
                                    <Switch
                                      onValueChange={(value) => this.setState({camera: value}) }
                                      style={styles.ds_switcher2}
                                      thumbTintColor="#ddd"
                                      onTintColor="#5BDA4D"
                                      tintColor="#969696"
                                      value={this.state.camera}
                                    />
                                </View>
                            </View>
                            <View style={styles.device_single}>
                                <View style={[styles.device_single_left, styles.device_single_left2]}>
                                    <IconF name="file-photo-o" style={[styles.enable_f_icons]}/>   
                                    <Text style={styles.device_single_left_tx}>Enable Library</Text>
                                </View>
                                <View style={styles.device_single_left,{alignItems:'flex-end'}}>
                                    <Switch
                                      onValueChange={(value) => this.setState({library: value}) }
                                      style={styles.ds_switcher2}
                                      thumbTintColor="#ddd"
                                      onTintColor="#5BDA4D"
                                      tintColor="#969696"
                                      value={this.state.library}
                                    />
                                </View>
                            </View>
                            <View style={styles.device_single}>
                                <View style={[styles.device_single_left, styles.device_single_left2]}>
                                    <IconFI name="md-contacts" style={[styles.enable_f_icons]}/>   
                                    <Text style={styles.device_single_left_tx}>Enable Contacts</Text>
                                </View>
                                <View style={styles.device_single_left,{alignItems:'flex-end'}}>
                                    <Switch
                                      onValueChange={(value) => this.setState({contacts: value}) }
                                      style={styles.ds_switcher2}
                                      thumbTintColor="#ddd"
                                      onTintColor="#5BDA4D"
                                      tintColor="#969696"
                                      value={this.state.contacts}
                                    />
                                </View>
                            </View>
                            <View style={styles.device_single}>
                                <View style={[styles.device_single_left, styles.device_single_left2]}>
                                    <IconF name="microphone" style={[styles.enable_f_icons]}/>   
                                    <Text style={styles.device_single_left_tx}>Enable Mircrophone</Text>
                                </View>
                                <View style={styles.device_single_left,{alignItems:'flex-end'}}>
                                    <Switch
                                      onValueChange={(value) => this.setState({microphone: value}) }
                                      style={styles.ds_switcher2}
                                      thumbTintColor="#ddd"
                                      onTintColor="#5BDA4D"
                                      tintColor="#969696"
                                      value={this.state.microphone}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.login_form_row_bottom}>
                        <TouchableOpacity onPress={()=>this.submitSignup('step7')} style={styles.extra_submit_btn}>
                            <Text style={styles.extra_submit_btn_txt}>Join</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }




    blurAction(){Keyboard.dismiss(); }
    renderLoading(){
        if(this.state.loading){
            return(
                <View style={styles.signup_loading}>
                    <Spinner size="small"/>
                </View>
            );
        }
    }
    render(){
        return(
            <View style={styles.sign_ucontainer}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                {this.renderBackButtons()}
                <KeyboardAwareScrollView extraHeight={70} enableOnAndroid={true} style={{flex:1}} keyboardShouldPersistTaps='always'>
                    <View style={styles.signip_login_page}>
                        <View style={styles.login_logo_area}>
                            <Image style={styles.sign_logo}  source={require('./../images/login_logo.png')}/>
                        </View>
                        <View style={styles.sign_login_form}>
                            {this.renderSteps()}
                            {this.renderLoading()}
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <TouchableOpacity onPress={()=>Actions.realsign()} style={styles.signip_login_page_hav}>
                    <Text style={styles.signip_login_page_ha_txt}>Already have an account?</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

//export to other parts
export default SignupForm;