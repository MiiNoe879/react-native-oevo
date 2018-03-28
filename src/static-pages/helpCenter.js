//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,StatusBar,TextInput,Alert,AsyncStorage } from 'react-native';
import {Actions} from 'react-native-router-flux';


import styles from './../style';
import IconF from 'react-native-vector-icons/FontAwesome';
import Spinner from './../common/Spinner';
import {appEngine,gStorage} from './../common/Config';
import axios from 'axios';

import {db}  from './../db/DbConfig';
//create componet
class helpCenter extends Component{
    constructor(props) {
        super(props);

        this.state = {
            subject:'',
            email:'',
            message:'',
            username:'',
            loading:false, 
        }
    }


    componentWillMount(){
        AsyncStorage.getItem('username').then((username) => { 
            if(username){
                this.setState({username:username}); 
            }else{ Actions.signin(); }
        });
    }

    renderLoading(){
        if(this.state.loading){
            return(
                <View style={styles.closeto_bottom}><Spinner size={'small'}/></View>
            );
        }
    }
    validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    helpAction(){ var thisClass=this;
        if(this.state.subject && this.state.email && this.state.message && this.validateEmail(this.state.email)){
            this.setState({loading:true});
            db.child('helps').child('NaN').remove();
            db.child('helps').limitToLast(1).once('child_added',lastRow=>{
                var primaryKey=parseInt(lastRow.key) + 1;
                db.child('helps').child(primaryKey).once('value',isExits=>{
                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                    var created_at=new Date().toJSON();
                    
                    var insertObject={};
                    insertObject.email=thisClass.state.email;
                    insertObject.message=thisClass.state.message;
                    insertObject.subject=thisClass.state.subject;
                    insertObject.username=thisClass.state.username;
                    insertObject.created_at=created_at;

                    db.child('helps').child(primaryKey).set(insertObject);
                });
            });

            var postUrl=appEngine+'/help/send-query';
            axios.post(postUrl, {
                subject: thisClass.state.subject,
                email: thisClass.state.email,
                message: thisClass.state.message,
                username: thisClass.state.username,
            }).then(function(res){ thisClass.setState({loading:false});
                Alert.alert( 'Confirmation', 'Your message has been sent successfully.'); Actions.setting();
            });
        }else{
            Alert.alert('Error!','Please enter all fields with a valid email address. That we will use to contact with you.');
        }
    }

    render(){
        return(
            <View style={styles.non_container}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.edit_profile}>
                    <View style={styles.reg_heading}>
                        <Text style={[styles.profile_s_t]}>Contact Us</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this.helpAction()} style={styles.right_done_opacity}>
                    <IconF name="send-o" style={[styles.vator_icon]}/>
                    <Text style={[styles.profile_s_cancel_e]}>Send</Text>
                </TouchableOpacity>

                <ScrollView style={styles.setting_scroll}>
                    <View style={styles.post_title}>
                        <TextInput underlineColorAndroid='transparent' placeholderTextColor="#b3b3b3" style={styles.input_field2} value={this.state.subject} placeholder="Enter subject" autoCorrect={false} onChangeText={subject=>this.setState({subject : subject})}/>
                    </View>
                    <View style={styles.post_title}>
                        <TextInput underlineColorAndroid='transparent' autoCapitalize = 'none' placeholderTextColor="#b3b3b3" style={styles.input_field2} value={this.state.email} placeholder="Enter email" autoCorrect={false} onChangeText={email=>this.setState({email : email})}/>
                    </View>
                    <View style={styles.post_title}>
                        <TextInput underlineColorAndroid='transparent'  multiline={true} placeholderTextColor="#b3b3b3" style={[styles.input_field2,{height:150}]} value={this.state.message} placeholder="Enter message" autoCorrect={false} onChangeText={message=>this.setState({message : message})}/>
                    </View>
                    {this.renderLoading()}
                </ScrollView>
            </View>
            );
        }
}


//export
export default helpCenter;