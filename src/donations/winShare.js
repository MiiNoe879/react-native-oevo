//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,CameraRoll, AsyncStorage,Switch, ScrollView,StatusBar,Picker, Alert, TextInput,Keyboard } from 'react-native';

import styles from './../style';
import Spinner from './../common/Spinner';
import axios from 'axios';
import SpinnerBig from './../common/SpinnerBig';
import {appEngine,gStorage}  from './../common/Config';
import {Actions} from 'react-native-router-flux';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFI from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'react-native-fetch-blob';

class winShare extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            loading: false,
            isChecked:false,
            pageLoading:false,
            
            wininngUser:this.props.wininngUser,
            winningData:this.props.winningData,
            userBalance:0,
            shareImage:this.props.shareImage,
        };
    }

    async componentWillMount(){ var thisClass=this;
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
                thisClass.setState({username:username});
                if(thisClass.state.wininngUser && thisClass.state.winningData){
                    var userData=thisClass.state.wininngUser; var winningData=thisClass.state.winningData;
                    thisClass.setState({winningData:winningData,userBalance:userData.balance,isChecked:true});
                }
            }else{ Actions.signin(); }
        });
    }

    renderContents(){ var thisClass=this;
        if(thisClass.state.isChecked){
            return(
                <TouchableOpacity onPress={()=>Actions.withdraw({shouldWithdraw:thisClass.state.userBalance})} style={styles.win_share_bottom_tch}>
                    <Text style={styles.win_share_bottom_tttx}>WITHDRAWAL</Text>
                </TouchableOpacity>
            );
        }
    }

    renderLoading(){ if(this.state.pageLoading){return <SpinnerBig/>; } }

    socialShare(){
        var thisClass=this;
        if(thisClass.state.shareImage){
            thisClass.saveImageToPhone(thisClass.state.shareImage);
        }
    }

    saveImageToPhone(imagePath){ var thisClass=this;
        var imagePathEx=imagePath.split('/');
        var fileName=imagePathEx[imagePathEx.length - 1];
        thisClass.setState({pageLoading:true});
        let dirs = RNFetchBlob.fs.dirs
        RNFetchBlob .config({fileCache : true,path : dirs.DocumentDir + '/'+fileName})
        .fetch('GET', imagePath, {})
        .then((res) => {
            thisClass.setState({pageLoading:false});
            var path = res.path();
            CameraRoll.saveToCameraRoll(path);
            Alert.alert('Image is saved','You can now upload the image on facebook and twitter and tag us to win 100 coins.');
        })

    }

    render(){
        return(
            <View style={styles.container}>
                <StatusBar backgroundColor="#56d1aa" barStyle="dark-content" />
                <View style={[styles.header_area,{backgroundColor:'#56d1aa', borderBottomColor:'#56d1aa'}]}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t,styles.setp_to_follow]}>Setps to follow</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator,{color:'#fff'}]}/>   
                </TouchableOpacity>
                <ScrollView extraScrollHeight={100} style={[styles.withdrawlScroll,styles.withdrawlScroll45]} keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>
                    <View style={styles.win_share_top}>
                        <View style={styles.win_share_top_top}>
                            <View style={styles.win_share_top_left}>
                                <Text style={styles.win_share_top_top_txt}>1</Text>
                            </View>
                            <View style={[styles.win_share_top_right,styles.win_share_top_right2]}>
                                <Text style={styles.win_share_top_top_txt2}>
                                    Earn <Text style={styles.font_bold}>100 coins</Text> just sharing. Post the winnings picture on your twitter and facebook, tagging us using @oevoapp 
                                </Text>
                                <TouchableOpacity onPress={()=>this.socialShare()} style={styles.share_touch_btn}>
                                    <Text style={styles.share_touch_btn_txt}>Share <IconFI name="ios-share-alt" style={styles.ios_share_win}/></Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.win_share_top_right_right}>
                                <Image style={styles.win_share_top_right_right_img} source={{uri : this.state.shareImage }}/>
                            </View>
                        </View>
                        <View style={[styles.win_share_top_top,styles.win_share_top_top2]}>
                            <View style={styles.win_share_top_left}>
                                <Text style={[styles.win_share_top_top_txt,styles.win_share_top_top_txt22]}>2</Text>
                            </View>
                            <View style={styles.win_share_top_right}>
                                <Text style={styles.win_share_top_top_txt2}>
                                    For a chance to  <Text style={styles.font_bold}>win $100 cash</Text> make a youtube video about your winnings and on how to use Oevo to win. Send us the link on twitter or facebook. You can complete this at anytime!
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.win_share_bottom}>
                        {this.renderContents()}
                        <TouchableOpacity onPress={()=>Actions.home()}><Text style={[styles.back_to_home,styles.back_to_home78]}>Back To Home</Text></TouchableOpacity>
                        <Text style={styles.win_share_bottom_mtxt}>On the next page, you can enter your paypal address to take out your funds. Please contact us if you don't have a paypal <Text style={styles.font_bold}>team@oevo.com</Text></Text>
                    </View>
                </ScrollView>
                {this.renderLoading()}
            </View>
        );
    }
}


//export components
export default  winShare;