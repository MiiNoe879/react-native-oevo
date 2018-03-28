//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage,Switch, ScrollView,StatusBar,Picker, Alert, TextInput,Keyboard } from 'react-native';

import styles from './../style';
import Spinner from './../common/Spinner';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import {Actions} from 'react-native-router-flux';

import IconF from 'react-native-vector-icons/FontAwesome';
import KeyboardAwareScrollView from './../common/KeyboardAwareScrollView';

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
class Withdraw extends Component{
    constructor(props) {
        super(props);
        
        var amount=null; var curretBalance=this.props.balance;
        if(this.props.shouldWithdraw){
            amount=(this.props.shouldWithdraw).toString()+'.00';
            curretBalance=this.props.shouldWithdraw;
        }
        this.state = {
            username:'',
            amount:amount,
            loading: false,
            paypal:'',
            balance:curretBalance+'.00'
        };
    }

    async componentWillMount(){
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
                this.setState({username:username});
            }else{ Actions.signin(); }
        });
    }



    renderLoading(){
        if(this.state.loading){
            return <Spinner/>;
        }
    }

    validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }


    withdrawAction(){ var thisClass=this;
        var isSuccess=false;
        var getAmount=Number(thisClass.state.amount);
        var balance=Number(thisClass.state.balance);
        if(getAmount!='0' && getAmount!=0 && balance >= getAmount && getAmount >=100){
            isSuccess=true;
        }

        if(isSuccess && thisClass.state.paypal && this.validateEmail(thisClass.state.paypal)){
            Keyboard.dismiss();
            db.child('payments').orderByChild('username').equalTo().once('value',snap=>{
                var shouldAdd=true;
                if(snap.val()){
                   snap.forEach(function(data){ var payment=data.val();
                        if(payment.status=='pending'){
                            shouldAdd=false;
                        }
                   }); 
                }

                if(shouldAdd==true){
                    db.child('payments').child('NaN').remove();
                    db.child('payments').limitToLast(1).once('child_added',lastRow=>{
                        var primaryKey=parseInt(lastRow.key) + 1;
                        db.child('payments').child(primaryKey).once('value',isExits=>{
                            if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                            var created_at=new Date().toJSON();
                            
                            var insertObject={};
                            insertObject.username=thisClass.state.username;
                            insertObject.amount=thisClass.state.amount;
                            insertObject.paypal=thisClass.state.paypal;
                            insertObject.status='pending';
                            
                            insertObject.created_at=created_at;
                            db.child('payments').child(primaryKey).set(insertObject);


                            db.child('users').orderByChild('username').equalTo(thisClass.state.username).once('child_added',snap=>{
                                if(snap.val()){ var userData=snap.val();
                                    var newBalance=parseInt(userData.balance) - thisClass.state.amount; 
                                    if(newBalance<0){newBalance=0}
                                    db.child('users').child(snap.key).update({balance:newBalance});
                                }
                            });

                            Alert.alert('Success','Your exchange request has been sent. Will inform you soon about status.');
                            Actions.mydonations();
                        });
                    });
                }else{
                    Alert.alert('Error!','You already have a pending request.');
                }

            });
        }else{
            Alert.alert('Error!','Please enter fields properly.');
        }
    }


    onChanged (amount) {
        this.setState({
            amount: amount.replace(/[^0-9]/g, ''),
        });
    }


    render(){
        return(
            <View style={[styles.container_followers, styles.container_followers23]}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />               
                <View style={styles.header_area}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t]}>EXCHANGE COINS</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={styles.back_vator}/>    
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.withdrawAction()} style={styles.right_done_opacity}>
                    <Text style={[styles.profile_s_cancel_e]}>SUBMIT</Text>
                </TouchableOpacity>

                <KeyboardAwareScrollView extraScrollHeight={100} style={{flex:1,marginTop:70}} keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>
                    <View style={[styles.donat_user_data2,styles.donat_user_data245]}>
                        <View style={styles.donat_user_data22}   keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>
                            <View style={styles.apple_pay_container}>
                                <TextInput  underlineColorAndroid='transparent' keyboardType = 'numeric' 
                                autoCapitalize = 'none' placeholderTextColor="#ddd" 
                                style={[styles.input_field222]} value={this.state.amount} placeholder="100" 
                                autoCorrect={false} onChangeText={amount=>this.onChanged(amount)}/>
                                
                                <TextInput  underlineColorAndroid='transparent'  returnKeyType={'send'} onSubmitEditing={()=>this.withdrawAction()}  autoCapitalize = 'none'  placeholderTextColor="#bbb" 
                                style={[styles.input_field, styles.input_fiepaypal]} value={this.state.paypal} 
                                placeholder="Enter paypal email address" 
                                onChangeText={paypal=>this.setState({paypal : paypal})}/>
                            </View>
                        </View>
                        
                        <Text style={styles.current_lab}>Your current Blanace : {this.state.balance} Coins</Text>

                        <Text style={styles.current_lab_lib}>It will take 24-48 hours to receive payments.</Text>
                        <TouchableOpacity onPress={()=>Actions.home()}><Text style={styles.back_to_home}>Back To Home</Text></TouchableOpacity>
                    

                    </View>

                </KeyboardAwareScrollView>
                {this.renderLoading()}
            </View>
        );
    }
}


//export components
export default  Withdraw;