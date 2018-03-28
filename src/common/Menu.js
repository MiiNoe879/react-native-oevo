//import elements
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, AppState } from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from './../style';

import {appEngine,gStorage} from './../common/Config';
import axios from 'axios';
import PushService from './PushService';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFI from 'react-native-vector-icons/Ionicons';
import IconFM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFF from 'react-native-vector-icons/Feather';

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';

//create componet
class Menu extends Component{
    state = {activeMenu:''}

    constructor(props) {
        super(props);
        this.state = {
          activeMenu: this.props.activeMenu,
          totalNoti:0,
          username:''
        };
    }

    updateVideos(param1,param2,param3,param4){ 
        if(this.props.updateVideos){
            console.log(333);
            this.props.updateVideos(param1,param2,param3,param4); 
        }
    }

    componentWillMount(){
        var thisClass=this;
        
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ this.setState({username:username}); 

                db.child('notifications').orderByChild('userFor').equalTo(username).once('value',snap=>{
                    if(snap.val()){
                        var notiDatas=[];
                        snap.forEach(function(data){ var noti=data.val();
                            if(noti.status=='unread'){
                                notiDatas.push(noti);
                            }
                        });
                        var getNotifications=(notiDatas.length).toString();
                        thisClass.saveItem('totalNoti',getNotifications);
                        thisClass.setState({totalNoti:getNotifications});
                    }
                });
            }
        });

    }



    async saveItem(item, selectedValue) {try {await AsyncStorage.setItem(item, selectedValue); } catch (error) {  } }

    homeMenu(){ 
        if(this.props.activeMenu=='home'){ 
            return <Image style={[styles.menu_icons,styles.menu_icons_home]} source={require('./../images/m_home_a.png')}/>;
        }else{ 
            return <Image style={[styles.menu_icons,styles.menu_icons_home]} source={require('./../images/m_home.png')}/>;
        } 
    }


    profileMenu(){ 
        if(this.props.activeMenu=='profile'){ 
            return <Image style={[styles.menu_icons,styles.menu_icons_prifile]} source={require('./../images/m_profile_a.png')}/>;
        }else{ 
            return <Image style={[styles.menu_icons,styles.menu_icons_prifile]} source={require('./../images/m_profile.png')}/>;
        } 
    }

    searchMenu(){ 
        if(this.props.activeMenu=='search'){ 
            return <Image style={[styles.menu_icons,styles.menu_icons_search]} source={require('./../images/m_search_a.png')}/>;
        }else{ 
            return <Image style={[styles.menu_icons,styles.menu_icons_search]} source={require('./../images/m_search.png')}/>;
        } 
    }


    notificationsMenu(){ 
        if(this.props.activeMenu=='notifications'){ 
            return <Image style={[styles.menu_icons,styles.menu_icons_notifications]} source={require('./../images/m_noti_a.png')}/>;
        }else{ 
            return <Image style={[styles.menu_icons,styles.menu_icons_notifications]} source={require('./../images/m_noti.png')}/>;
        } 
    }


    renderRecord(){
        return <Image style={[styles.menu_icons,styles.menu_icons_record]} source={require('./../images/m_record.png')}/>;
    }



    renderNotifications(){
        if(this.state.totalNoti>0){
            var getTotalN=this.state.totalNoti;
            if(getTotalN.indexOf("-")>=0){getTotalN=0;}
            
            return(<Text style={styles.menu_text_extra}>{getTotalN}</Text>);
        }  
    }

    

    switchMenu(key){
        this.updateVideos('pause','all',false,null);
        if(key=='home'){
            Actions.home({type:'replace'});
        }else if(key=='explore'){
            Actions.explore({type:'replace'});
        }else if(key=='record'){
            Actions.record({type:'replace'});
        }else if(key=='notifications'){
            Actions.notifications({type:'replace'});
        }else if(key=='profile'){
            Actions.profile({type:'replace'});
        }
    }

    render(){
        return(
            <View style={styles.menu_area}>
                <View style={styles.menu_area_main}>
                    <View style={styles.single_menu}>
                        <TouchableOpacity onPress={()=>this.switchMenu('home')}   style={styles.menu_text}>{this.homeMenu()}</TouchableOpacity>
                    </View>
                    <View style={styles.single_menu}>
                        <TouchableOpacity onPress={()=>this.switchMenu('explore')} style={styles.menu_text}>{this.searchMenu()}</TouchableOpacity>
                    </View>
                    <View style={styles.single_menu}>
                        <TouchableOpacity onPress={()=>this.switchMenu('record')} style={styles.menu_text}>{this.renderRecord()}</TouchableOpacity>
                    </View>
                    <View style={styles.single_menu}>
                        <TouchableOpacity onPress={()=>this.switchMenu('notifications')} style={styles.menu_text}>{this.notificationsMenu()}{this.renderNotifications()}</TouchableOpacity>
                    </View>
                    <View style={styles.single_menu}>
                        <TouchableOpacity onPress={()=>this.switchMenu('profile')} style={styles.menu_text}>{this.profileMenu()}</TouchableOpacity>
                    </View>
                </View>
                <PushService/>
            </View>
        );
    }
}


//export to other parts
export default Menu;
