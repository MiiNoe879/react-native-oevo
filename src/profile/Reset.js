//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, AsyncStorage, ScrollView, StatusBar, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';
import Spinner from './../common/Spinner';
import axios from 'axios';


import {appEngine,gStorage} from './../common/Config';
import styles from './../style';
import IconF from 'react-native-vector-icons/FontAwesome';


import {db,userData,firebase,saveDeviceType,scorePassword}  from './../db/DbConfig';
//create componet
class Reset extends Component{
  constructor(props) {
    super(props);
    this.state = {
      curpassword:'',conpassword:'', pageLoading:false, username:''
    };
  }



    componentWillMount(){
        StatusBar.setHidden(false);  StatusBar.setBarStyle('dark-content', true);
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ this.setState({username:username});
            }else{ Actions.signin(); }
        });
    }

  resetSubmit(){ var thisClass=this;
        if(thisClass.state.curpassword && thisClass.state.curpassword.length > 4 && thisClass.state.conpassword && thisClass.state.conpassword.length > 4){
            if(scorePassword(thisClass.state.conpassword) > 45){
                thisClass.setState({pageLoading:true});
                userData('username',thisClass.state.username).then((res)=>{
                    if(res==false){}else{

                        firebase.auth().signInWithEmailAndPassword(res.email, thisClass.state.curpassword).then(function(gRes){
                            var user = firebase.auth().currentUser;
                            user.updatePassword(thisClass.state.conpassword).then(function() {
                                firebase.auth().signOut().then(function() {
                                }).catch(function(error) {});

                                thisClass.setState({pageLoading:false}); AsyncStorage.removeItem('username'); Actions.signin();
                            }).catch(function(error) {
                              Alert.alert('Error!','Enter a more secured password!');thisClass.setState({pageLoading:false});
                            });

                        }).catch(function(error) {
                          Alert.alert('Error!','Current password did not match!'); thisClass.setState({pageLoading:false});
                        });
                        
                    }
                });

            }else{
                Alert.alert('Error!','Enter a secured password!');
            }
        }else{
            Alert.alert('Error!','Please enter current and new password!');
        }

   }



    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }

  render(){
      return (
          <View style={styles.container_rest}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.header_area}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t]}>RESET PASS</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={styles.back_vator}/>    
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.resetSubmit()} style={styles.right_done_opacity}>
                    <IconF name="save" style={[styles.vator_icon]}/>
                    <Text style={[styles.profile_s_cancel_e]}>Save</Text>
                </TouchableOpacity>


              <ScrollView style={styles.scroll_view}>
                <View style={styles.login_page}>
                    <View style={styles.login_form}>
                        <View style={styles.form_row}>
                            <Text style={styles.label}>Current Password</Text>
                            <TextInput autoCapitalize = 'none' placeholderTextColor="#bbb" style={styles.input_field} value={this.state.curpassword} placeholder="current password" autoCorrect={false} onChangeText={curpassword=>this.setState({curpassword})} secureTextEntry={true}/>
                        </View>
                        <View style={styles.form_row}>
                            <Text style={styles.label}>New Password</Text>
                            <TextInput autoCapitalize = 'none' placeholderTextColor="#bbb" style={styles.input_field} value={this.state.conpassword} placeholder="new password" autoCorrect={false} onChangeText={conpassword=>this.setState({conpassword})} secureTextEntry={true}/>
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
export default Reset;
