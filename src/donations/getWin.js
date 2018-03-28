//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage,Switch, ScrollView,StatusBar,Picker, Alert, TextInput,Keyboard } from 'react-native';

import styles from './../style';
import Spinner from './../common/Spinner';
import axios from 'axios';

import {appEngine,gStorage}  from './../common/Config';
import {Actions} from 'react-native-router-flux';
import IconF from 'react-native-vector-icons/FontAwesome';
import SpinnerBig from './../common/SpinnerBig';
import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
import FastImage from 'react-native-fast-image';
class getWin extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            pageLoading: true,
            wininngUser:{},
            winAmount:'',
            winningdate:"You are Today's Winner",
            isChecked:false,
            winningData:{}
        };
    }

    async componentWillMount(){ var thisClass=this;
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
                db.child('winningmsg').orderByChild('username').equalTo(username).limitToLast(1).once('child_added',snap=>{
                    if(snap.val()){ var winningData=snap.val();winningData.id=snap.key;
                        thisClass.setState({winningData:winningData});
                        
                        db.child('users').orderByChild('username').equalTo(username).limitToLast(1).once('child_added',snap2=>{
                            if(snap2.val()){ var userData=snap2.val();
                                thisClass.setState({wininngUser:userData, username:username,winAmount:winningData.winAmount,isChecked:true, pageLoading:false});
                                var selecetdDate=new Date(winningData.created_at);
                                var nowTime = new Date();
                                var getDifference=nowTime-selecetdDate; getDifference=(getDifference/(1000*60*60));
                                if(getDifference>10){
                                    var date=selecetdDate.toDateString().split(' ').slice(1).join(' ');
                                    var finalDate='You are the winner on '+date;
                                    thisClass.setState({winningdate:finalDate});
                                }
                            }
                        });
                    }
                });
            }else{ Actions.signin(); }
        });
    }


    getImageOfWinner(userData,winningData){
        
    }

    winshareRedirect(){ var thisClass=this;
        if(thisClass.state.isChecked==true){
            
            var userData=thisClass.state.wininngUser; winningData=thisClass.state.winningData;
            if(winningData.id){
                db.child('winningmsg').child(winningData.id).update({status:'read'});
            }

            if(winningData.winningImage){
                var imagePath=gStorage+'/winImages/'+winningData.winningImage;
                Actions.winShare({winningData:thisClass.state.winningData, wininngUser:thisClass.state.wininngUser,shareImage:imagePath});
            }else{
                thisClass.setState({pageLoading:true});
                var formUrl=appEngine+'/winner-share?id='+winningData.id+'&username='+userData.username+'&name='+userData.name+'&image='+userData.profilePic+'&amount='+winningData.winAmount;
                axios.get(formUrl).then(function (response) {
                    if(response.data){
                        db.child('winningmsg').child(winningData.id).update({winningImage:response.data});
                        var imagePath=gStorage+'/winImages/'+response.data;
                        
                        thisClass.setState({pageLoading:false});

                        Actions.winShare({winningData:thisClass.state.winningData, wininngUser:thisClass.state.wininngUser,shareImage:imagePath});
                    }
                }).catch(function (error) { console.log(error); });
            }  
        }
    }

    renderLoading(){ if(this.state.pageLoading){return <SpinnerBig/>; } }

    renderContents(){ var thisClass=this;
        if(thisClass.state.isChecked==true){
            var userData=thisClass.state.wininngUser;
            var userImage = gStorage+'/profile_thumbs/'+userData.profilePic;
            return(
                <View style={styles.winP_area_user_extra}>
                    <View style={styles.winP_area_user}>
                        <Image  style={styles.winer_ppic_c}   source={{uri : userImage }}/>
                    </View>
                    <View style={styles.winP_area_txt}>
                        <Text style={styles.congrats}>CONGRATS!</Text>
                        <Text style={styles.congrats_user}>{userData.name}</Text>
                        <Text style={styles.congrats_winn}>{thisClass.state.winningdate}</Text>
                        <Text style={styles.congrats_amoun}>${thisClass.state.winAmount}</Text>
                        <TouchableOpacity style={styles.congrats_clm_t} onPress={()=>thisClass.winshareRedirect()}><Text style={styles.congrats_cliam}>CLAIM PRIZE</Text></TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    render(){
        return(
            <View style={[styles.container_followers, styles.container_followers23]}>
                <Image style={styles.winner_background} source={require('./../images/winBg.jpg')}/>
                <View style={styles.winP_area}>
                    <View style={styles.winP_area_logo}>
                        <Image style={styles.login_logo} source={require('./../images/login_logo.png')}/>
                    </View>
                    {this.renderContents()}
                </View>
                {this.renderLoading()}
            </View>
        );
    }
}


//export components
export default  getWin;