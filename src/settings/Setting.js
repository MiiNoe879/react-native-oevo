//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, NativeModules,AsyncStorage, ScrollView, Switch,StatusBar, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';


import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import SpinnerBig from './../common/SpinnerBig';
import styles from './../style';
import IconF from 'react-native-vector-icons/FontAwesome';

var DeviceInfo = require('react-native-device-info');
var deviceId=DeviceInfo.getUniqueID();

import {db,userData,firebase,saveDeviceType}  from './../db/DbConfig';
//create componet
class Setting extends Component{

    constructor(props) {
        super(props);
        this.state = {
            facebook:false,
            twitter:false,
            contacts:false, 
            language:'English', 
            error:'',
            username:'',
            pageLoading:false
      };
    }

    async saveItem(item, selectedValue) {try {await AsyncStorage.setItem(item, selectedValue); } catch (error) {  } }

    componentWillMount(){ var thisClass=this;
        StatusBar.setHidden(false);  StatusBar.setBarStyle('dark-content', true);
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ this.setState({username:username}); 
                db.child('settings').orderByChild('username').equalTo(username).on('value',setData=>{
                    setData.forEach(function(setting) {
                        if(setting.val() && setting.val().deviceId==deviceId){
                            var settings=setting.val();
                            if(settings.facebook && settings.facebook!=null){ thisClass.setState({facebook:true}); }
                            if(settings.twitter && settings.twitter!=null){ thisClass.setState({twitter:true}); }
                            if(settings.contacts && settings.contacts=='yes'){ thisClass.setState({contacts:true}); }
                        }
                    });
                });
            }else{ Actions.signin(); }
        });
    }


    changeContacts(val){ var thisClass=this;
        
        db.child('settings').orderByChild('username').equalTo(thisClass.state.username).once('value',setData=>{
            setData.forEach(function(setting) {
                if(setting.val() && setting.val().deviceId==deviceId){
                    db.child('settings').child(setting.key).update({contacts:val});
                }
            });
        });
    }



    logoutAction(){ var thisClass=this; thisClass.setState({pageLoading:true});
        db.child('settings').orderByChild('username').equalTo(thisClass.state.username).once('value',setData=>{
            setData.forEach(function(setting) {
                if(setting.val() && setting.val().deviceId==deviceId){
                    db.child('settings').child(setting.key).update({username:null});
                }
            });
        });
        firebase.auth().signOut().then(function() {
        }).catch(function(error) {});

        
        setTimeout(function(){
            AsyncStorage.removeItem('deviceId'); AsyncStorage.removeItem('deviceToken');
            AsyncStorage.removeItem('username');
            thisClass.saveItem('totalNoti','0');
            Actions.signin();
        },1500);
    }


    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }



    connectContracts(value){
        this.setState({contacts: value});
        if(value==true){
            this.changeContacts('yes');
        }else{
            Alert.alert( 'Confirmation', 'Want to disconect contacts?', 
                [ 
                    {text: 'Cancel', onPress: () => console.log('cancel') , style: 'cancel'},
                    {text: 'Disconnect', onPress: () => this.changeContacts('no') },
                ], 
                { cancelable: false } 
            );
        }
    }


    render(){
        return(
            <View style={styles.setting_container}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.edit_profile}>
                    <View style={styles.reg_heading}>
                        <Text style={[styles.profile_s_t]}>SETTING</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.profile()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>

                <ScrollView style={styles.setting_scroll}>
                    <View style={styles.extra_title_page}>
                        <Text style={styles.extra_title_page_tx}>DRAFT POSTS</Text>
                    </View>
                    <View style={styles.login_page}>
                        <View style={styles.login_form}>
                            <View style={styles.s_form_row_main}>
                                <TouchableOpacity onPress={()=>Actions.draftposts()} style={styles.s_form_row}>
                                    <Text style={styles.s_label}>Draft Posts</Text>
                                    <View style={styles.right_arrow_main}>
                                        <IconF name="angle-right" style={[styles.right_vator]}/>   
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.extra_title_page}>
                        <Text style={styles.extra_title_page_tx}>CARDS</Text>
                    </View>
                    <View style={styles.login_page}>
                        <View style={styles.login_form}>
                            
                            <View style={styles.s_form_row_main}>
                                <TouchableOpacity onPress={()=>Actions.card()} style={styles.s_form_row}>
                                    <Text style={styles.s_label}>+ Add Card</Text>
                                    <View style={styles.right_arrow_main}><IconF name="angle-right" style={[styles.right_vator]}/></View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.s_form_row_main}>
                                <TouchableOpacity onPress={()=>Actions.cards()} style={styles.s_form_row}>
                                    <Text style={styles.s_label}>Linked Cards</Text>
                                    <View style={styles.right_arrow_main}><IconF name="angle-right" style={[styles.right_vator]}/></View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                    <View style={styles.extra_title_page}>
                        <Text style={styles.extra_title_page_tx}>PRIVACY</Text>
                    </View>
                    <View style={styles.login_page}>
                        <View style={styles.login_form}>
                            <View style={styles.s_form_row_main}>
                                <TouchableOpacity onPress={()=>Actions.blockUsers()} style={styles.s_form_row}>
                                    <Text style={styles.s_label}>Blocked Users</Text>
                                    <View style={styles.right_arrow_main}><IconF name="angle-right" style={[styles.right_vator]}/></View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                    <View style={styles.login_page}>
                        <View style={styles.login_form}>
                            <View style={styles.s_form_row_main}>
                                <TouchableOpacity onPress={()=>Actions.accountLinked({fb_link:this.state.facebook,twitter_link:this.state.twitter })}style={styles.s_form_row}>
                                    <Text style={styles.s_label}>Accounts Linked</Text>
                                    <View style={styles.right_arrow_main}><IconF name="angle-right" style={[styles.right_vator]}/></View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.s_form_row}>
                                <Text style={styles.s_label}>Connect Contacts</Text>
                                <Switch
                                  onValueChange={(value) => this.connectContracts(value)}
                                  style={styles.ds_switcher}
                                  thumbTintColor="#ddd"
                                  onTintColor="#5BDA4D"
                                  tintColor="#969696"
                                  value={this.state.contacts}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.extra_title_page}>
                        <Text style={styles.extra_title_page_tx}>ABOUT</Text>
                    </View>

                    <View style={styles.login_page}>
                        <View style={styles.login_form}>
                            <View style={styles.s_form_row_main}>
                                <TouchableOpacity onPress={()=>Actions.termsofUse()} style={styles.s_form_row}>
                                    <Text style={styles.s_label}>Terms of Use</Text>
                                    <View style={styles.right_arrow_main}><IconF name="angle-right" style={[styles.right_vator]}/></View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.s_form_row_main}>
                                <TouchableOpacity onPress={()=>Actions.privacyPolicy()} style={styles.s_form_row}>
                                    <Text style={styles.s_label}>Privacy Policy</Text>
                                    <View style={styles.right_arrow_main}><IconF name="angle-right" style={[styles.right_vator]}/></View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.s_form_row_main}>
                                <TouchableOpacity onPress={()=>Actions.helpCenter()} style={styles.s_form_row}>
                                    <Text style={styles.s_label}>Help Center</Text>
                                    <View style={styles.right_arrow_main}><IconF name="angle-right" style={[styles.right_vator]}/></View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>


                    

                    <View style={styles.logout_final_text}>
                        <Text  style={styles.logout_final_text2} onPress={()=>this.logoutAction()}>Switch account? <Text style={styles.logout_final_text3} >logout</Text></Text>
                    </View>
                </ScrollView>

                {this.renderLoading()}
            </View>
        );
    }
}

//export to other parts
export default Setting;