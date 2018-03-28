//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput,Alert, TouchableOpacity, NativeModules,AsyncStorage,StatusBar } from 'react-native';
import {Actions} from 'react-native-router-flux';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Spinner from './../common/Spinner';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';

var radio_props = [
  {label: 'Male', value: 'male' },
  {label: 'Female', value: 'female' },
  {label: 'Unspecified', value: 'unspecified' },
];

import SpinnerBig from './../common/SpinnerBig';
import Loading from './../common/Loading';

import RNFetchBlob from 'react-native-fetch-blob';
var ImagePicker = require('react-native-image-picker');
import KeyboardAwareScrollView from './../common/KeyboardAwareScrollView';
import styles from './../style';
import IconF from 'react-native-vector-icons/FontAwesome';

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
//create componet
class SignupForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name:'', photo:'', email:'',uploadLoading:false, gender:'',error:'',
            pageLoading:false, 'username':'',website:'',phone:'',bio:'', charactercount:0
        }
    }

    componentWillMount(){ var thisClass=this;
        StatusBar.setHidden(false);  StatusBar.setBarStyle('dark-content', true);
        
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
                this.setState({username:username}); 
                db.child('users').orderByChild('username').equalTo(username).once('child_added',snap=>{
                    if(snap.val()){ var user=snap.val();
                        thisClass.setState({ 
                            name:user.name, email:user.email, gender:user.gender,website:user.website,
                            photo:user.profilePic
                            ,phone:user.phone
                            ,bio:user.bio
                        });
                    }
                });
            }else{ Actions.signin(); }
        });
    }

    resetAction(e){
        Actions.reset_pass();
    }

    hitCancel(event){
        Actions.profile();
    }


    uploadPhoto(){
        var options = {
          title: 'Select Avatar',
          storageOptions: {
            skipBackup: true,
          }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log(response);

            if(response.data){
                var resObject = {};
                if(response.fileName){
                    resObject.fileName=response.fileName;
                }else{
                    resObject.fileName='oevo_app_profile_pic.jpg';
                }
                resObject.data=response.data;
                this.uploadImageAction(resObject);
            }        
        });
    }


    uploadImageAction(response){
        var thisClass=this;

        thisClass.setState({uploadLoading:true});
        if (response.data) {
            RNFetchBlob.fetch('POST', appEngine+'/upload/upload-photo', {
              'Content-Type' : 'octet-stream'
            },[
                {name : 'image_data', filename : response.fileName, data: RNFetchBlob.wrap(response.data)},
                { name : 'username', data : thisClass.state.username}
            ])
            .uploadProgress({ interval : 250 },(written, total) => {
                var getPercentage=(written / total)*100;
                getPercentage=parseInt(getPercentage);
                if(getPercentage < 100){
                    thisClass.setState({percentage:getPercentage});
                }
            })
            .progress({ count : 10 }, (received, total) => {
               
            })
            .then((resp) => {
                  thisClass.setState({uploadLoading:false});
                  var res = JSON.parse(resp.data);
                  if(res.status=='success'){
                    thisClass.setState({photo:res.image, uploadLoading:false});

                    db.child('users').orderByChild('username').equalTo(thisClass.state.username).once('child_added',snap=>{
                        if(snap.val()){
                            db.child('users').child(snap.key).update({profilePic:res.image});
                        }
                    });

                  }else{
                    Alert.alert('Error!','Something went wrong, Please try again.');
                  }
            })
            .catch((err) => {
              thisClass.setState({uploadLoading:false});
            });

        }
    }
    

    validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }



    regsiterSubmit(event){ var thisClass=this;
        var validEmail, validName=false;
        if (this.state.email && this.validateEmail(this.state.email)) {
            var validEmail=true;
        }else{
            Alert.alert('Warning!','Please enter a valid email address.');
        }


        if(this.state.name && this.state.email && validEmail){
            db.child('users').orderByChild('email').equalTo(thisClass.state.email).once('value',snap=>{
                var shouldAllow=true;
                if(snap.val()){
                    snap.forEach(function(userDtaM){ var userData=userDtaM.val();
                        if(userData.username!=thisClass.state.username){
                            shouldAllow=false;
                        }
                    });
                }

                if(shouldAllow==true){
                    db.child('users').orderByChild('username').equalTo(thisClass.state.username).once('child_added',snap2=>{
                        if(snap2.val()){
                            db.child('users').child(snap2.key).update({
                                name: this.state.name,
                                email: this.state.email,
                                gender: this.state.gender,
                                username: this.state.username,
                                website: this.state.website,
                                phone: this.state.phone,
                                bio: this.state.bio
                            });
                            Actions.profile();
                        }
                    });
                }else{
                    Alert.alert('Error!','Email address already exits!');
                }
            });
            

        }
        
    }



    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }

    nameClass(){ if(this.state.isName){ return [styles.form_row,styles.input_error]; }else{ return [styles.form_row]; } }
    emailClass(){ if(this.state.isEmail){ return [styles.form_row,styles.input_error]; }else{ return [styles.form_row]; } }

    renderRadio(){
        if(this.state.gender=='female'){
            return <RadioForm radio_props={radio_props} initial={1} formHorizontal={true} buttonColor={'#333'} buttonSize={4} 
            buttonOuterSize={12} labelStyle={{fontSize: 16, fontFamily:'Calibri', color: '#262626', paddingRight:15}} onPress={(gender) => {this.setState({gender:gender})}} />;
        }
        
        if(this.state.gender=='male'){
            return <RadioForm radio_props={radio_props} initial={0} formHorizontal={true} buttonColor={'#333'} buttonSize={4} 
            buttonOuterSize={12} labelStyle={{fontSize: 16,fontFamily:'Calibri',color: '#262626', paddingRight:15}} onPress={(gender) => {this.setState({gender:gender})}} />;
        }

        if(this.state.gender=='unspecified'){
            return <RadioForm radio_props={radio_props} initial={0} formHorizontal={true} buttonColor={'#333'} buttonSize={4} 
            buttonOuterSize={12} labelStyle={{fontSize: 16,fontFamily:'Calibri',color: '#262626', paddingRight:15}} onPress={(gender) => {this.setState({gender:gender})}} />;
        }
        
    }


    renderUploadLoading(){
        if(this.state.uploadLoading){
            return <Loading percentage={this.state.percentage}/>;
        }
    }

    
    changeBio(bio){
        bio = bio.replace(/(\r\n|\n|\r)/gm,"");
        this.setState({bio : bio, charactercount: bio.length});
    }

    render(){
        return(
            <View style={styles.container_edit_profile}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.header_area}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t]}>EDIT PROFILE</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.profile()}>
                    <IconF name="angle-left" style={styles.back_vator}/>    
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.regsiterSubmit()} style={styles.right_done_opacity}>
                    <IconF name="save" style={[styles.vator_icon]}/>
                    <Text style={[styles.profile_s_cancel_e]}>Save</Text>
                </TouchableOpacity>



                <KeyboardAwareScrollView style={{flex:1, marginTop:40}} extraScrollHeight={100}>
                    <View style={styles.profile_user_area2}>
                        <TouchableOpacity onPress={this.uploadPhoto.bind(this)}>
                            <Image style={styles.pfile_image} source={{uri : gStorage+'/profile_thumbs/'+this.state.photo }}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.extra_title_page}>
                        <Text style={styles.extra_title_page_tx}>GENERAL</Text>
                    </View>
                    
                    <View style={styles.login_page}>
                        <View style={styles.login_form}>
                            <Text style={styles.single_error}>{this.state.error}</Text>

                            <View style={this.nameClass()}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput underlineColorAndroid='transparent'  placeholderTextColor="#bbb" style={styles.input_field} value={this.state.name} placeholder="your name" autoCorrect={false} onChangeText={name=>this.setState({name : name})}/>
                            </View>
                            <View style={this.emailClass()}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput underlineColorAndroid='transparent' autoCapitalize = 'none' placeholderTextColor="#bbb" style={styles.input_field} value={this.state.email} placeholder="user@gmail.com" autoCorrect={false} onChangeText={email=>this.setState({email : email})}/>
                            </View>
                            <View style={styles.form_row}>
                                <Text style={styles.label}>Gender {this.state.whatGender}</Text>
                                <View style={styles.form_radio}>
                                    {this.renderRadio()}
                                </View>
                            </View>
                            <View style={styles.form_row}>
                                <Text style={styles.label}>Website</Text>
                                <TextInput underlineColorAndroid='transparent' autoCapitalize = 'none' placeholderTextColor="#bbb" style={styles.input_field} value={this.state.website} placeholder="https://example.com" autoCorrect={false} onChangeText={website=>this.setState({website : website})}/>
                            </View>
                            <View style={styles.form_row}>
                                <Text style={styles.label}>Phone</Text>
                                <TextInput underlineColorAndroid='transparent' keyboardType = 'numeric' autoCapitalize = 'none' placeholderTextColor="#bbb" style={styles.input_field} value={this.state.phone} placeholder="14155552671" autoCorrect={false} onChangeText={phone=>this.setState({phone : phone})}/>
                            </View>
                            <View style={styles.form_row}>
                                <Text style={[styles.label,styles.label2]}>BIO <Text style={styles.limit_charters}>({this.state.charactercount}/140)</Text></Text>
                                <TextInput underlineColorAndroid='transparent' maxLength={70} autoCapitalize = 'none' multiline={true} numberOfLines={4} 
                                placeholderTextColor="#bbb" style={[styles.input_field, styles.input_field_textarea]} 
                                value={this.state.bio} placeholder="write your about me text." autoCorrect={false} 
                                onChangeText={ bio=>this.changeBio(bio)}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.extra_title_page}>
                        <Text style={styles.extra_title_page_tx}>PASSWORD</Text>
                    </View>
                    <View style={styles.logout_final_text}>
                        <Text  style={styles.logout_final_text2}  onPress={this.resetAction.bind(this)}>Change password? <Text style={styles.logout_final_text3}>reset now</Text></Text>
                    </View>
                </KeyboardAwareScrollView>
                {this.renderLoading()}
                {this.renderUploadLoading()}
            </View>
        );
    }
}

//export to other parts
export default SignupForm;