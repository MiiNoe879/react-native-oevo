//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar, NativeModules,AsyncStorage, ScrollView,Switch,Alert,Keyboard } from 'react-native';
import {Actions} from 'react-native-router-flux';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Spinner from './../common/Spinner';
import SpinnerBig from './../common/SpinnerBig';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import styles from './../style';
import {PagedContacts} from 'react-native-paged-contacts';
import IconFE from 'react-native-vector-icons/Entypo';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFI from 'react-native-vector-icons/Ionicons';


var FacebookAPIManager = require('NativeModules').FacebookAPIManager;
var TwitterAPIManager = require('NativeModules').TwitterAPIManager;
var DeviceInfo = require('react-native-device-info');
var deviceId=DeviceInfo.getUniqueID();
const { RNTwitterSignIn } = NativeModules
const Constants = {
  TWITTER_COMSUMER_KEY: 'GfDBo0NL17GvdMoPOQoW5kYZY',
  TWITTER_CONSUMER_SECRET: 'QOJ6dB3UaXR4cQRnq2ttg0TtBA9Onjh7EvPlcHQRLwKViXe1hp',
}
import twitter, {auth} from 'react-native-twitter';
import {get,post} from './../twitter/raw';


import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers,addNotifications}  from './../db/DbConfig';
//create componet
class Invite extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pageLoading:false, 
            username:'',
            username2:'',
            selectTab:'contacts',
            twFriends:[],
            contacts:[],
            suggestions:[],
            isCheck:false,
            pageT:1,
            pageC:1,
            pageS:1,
            isEndedT:false,
            isEndedC:false,
            isEndedS:false,
            totalContacts:0,
            facebook:false,
            twitter:false,
            contactC:false, 
            mCheck:false,
            cCheck:false,
            contact:'',
            doneFor:[],
            isRunning:true
        }
    }


    componentWillMount(){ var thisClass=this;
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
//get user data
db.child('users').orderByChild('username').equalTo(username).once('child_added',snapUser=>{
    if(snapUser.val()){ var userDataNow=snapUser.val();
        if(userDataNow.name){ thisClass.setState({username2:userDataNow.name}); }
    }
});                
                this.setState({username:username});
                

                getUsers().then(snap=>{
                    thisClass.setState({users:snap}); 

                    getFollowing(username,'following').then(res=>{
                        res.push(username);thisClass.setState({following:res,mCheck:true},()=>this.loadData(1)); 
                    });

                    this.loadContacts(1);

                });

                db.child('settings').orderByChild('username').equalTo(username).once('value',setData=>{
                    setData.forEach(function(setting) {
                        if(setting.val() && setting.val().deviceId==deviceId){
                            var settings=setting.val();
                            if(settings.twitter && settings.twitter!=null){ thisClass.setState({twitter:true}); }
                            if(settings.contacts && settings.contacts=='yes'){ thisClass.setState({contactC:true}); }
                        }
                    });
                });

                 
            }else{ Actions.signin(); }
        });
    }

    async getContacts(skip,totalC) {
        const pagedContacts = new PagedContacts();
        const granted = await pagedContacts.requestAccess();
        var mySkip = 0
        if(skip){
            mySkip=skip;
        }
        var totalCC=25;
        if(totalC){
            totalCC=totalC;
        }
        if(granted) {
          if(this.state.totalContacts==0){
            const count = await pagedContacts.getContactsCount();
            this.setState({totalContacts:count});
          }
          
          return await pagedContacts.getContactsWithRange(mySkip, totalC, [PagedContacts.displayName,
          PagedContacts.phoneNumbers])
        }
    }





    twitter_click(){ var thisClass=this;
        var twitter = RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET);

        RNTwitterSignIn.logIn().then(result => {
            if(result.email){
                result.profile_image_url='https://twitter.com/'+result.userName+'/profile_image?size=bigger';
                thisClass.disconnectSocial('connect','tw',result);
            }
        }).catch(error => {
            console.log(error)
        });
    }



    disconnectSocial(type,social,result){ var thisClass=this;
       var value=result.id;
       db.child('settings').orderByChild('username').equalTo(thisClass.state.username).once('value',snap=>{
        if(snap.val()){
            snap.forEach(function(setMa){ var setting=setMa.val();
                if(setting.deviceId==deviceId){
                    if(type=='connect'){
                        db.child('settings').child(setMa.key).update({twitter:value});
                        thisClass.setState({twitter_link: true});
                    }else{
                        db.child('settings').child(setMa.key).update({twitter:null});
                        thisClass.setState({twitter_link: false});
                    }
                }
            });
            thisClass.getFrinedsTw(thisClass.state.pageT,result);
        }
       });
    }



    getFrinedsTw(page,session){var thisClass=this;
        var tokens={consumerKey:Constants.TWITTER_COMSUMER_KEY, consumerSecret:Constants.TWITTER_CONSUMER_SECRET, oauthToken: session.authToken, oauthTokenSecret: session.authTokenSecret, }
        get(tokens,'https://api.twitter.com/1.1/followers/list',
        {
            screen_name:session.userName,
            user_id:session.id,
            cursor:-1,
            count:200,
            skip_status:true,
            include_user_entities:false
        }).then(function(result){
            if(result.users.length>0){
                var currentFriends = thisClass.state.twFriends;
                var newFriends=currentFriends.concat(result.users);
                thisClass.setState({twFriends:newFriends,twitter:true,closeToBottom:false});
            }else{
                thisClass.setState({closeToBottom:false,isEndedT:true});
            }
        });
    }


    sendTwitterMsg(userData){ var thisClass=this;
        //console.log(userData);
        var userId=userData.id_str;
        var userName=userData.screen_name;

        RNTwitterSignIn.sendMessage(userId,userName).then(snap=>{
            thisClass.updateTwFriens(userId);
        });
    }
    

    loadContacts(page){
        var skip=0; var requiredTotal=25;
        if(page!='1'){
            var getPage=page - 1;
            skip=getPage*25;
            requiredTotal=page*25;
        }
        
        if(this.state.totalContacts!=0){
            if(this.state.totalContacts < requiredTotal){
                this.setState({closeToBottom:false,isEndedC:true});
            }else{
                this.getContacts(skip,25).then(contacts => {
                  this.updateJointContacts(contacts);
                });
            }
        }else{
            this.getContacts(skip,25).then(contacts => {
              this.updateJointContacts(contacts);
            });
        }
    }


    updateJointContacts(getcontacts){ var thisClass=this;
        var following=thisClass.state.following;
        if(getcontacts.length > 0){
            var contacts=[];
            for(index in getcontacts){
                var contact=getcontacts[index];
                contact.isInApp='no'; contact.isFollowed='no';
                
                var phoneNumber = null;
                if(contact.phoneNumbers){
                    if(contact.phoneNumbers[0].value){
                        phoneNumber=contact.phoneNumbers[0].value;
                    } 
                }
                if(phoneNumber){
                    var isFoundUser=thisClass.serachUserByPhone(isFoundUser);
                    if(isFoundUser){
                        contact.isInApp='yes';
                        contact.username=isFoundUser;
                        if(following.indexOf(isFoundUser) != -1){
                           contact.isFollowed='yes'; 
                        }
                    }
                }

                contacts.push(contact);
            }
            var cContacts = thisClass.state.contacts;
            var newContacts=cContacts.concat(contacts);

            thisClass.setState({contacts:newContacts,closeToBottom:false,cCheck:true,isRunning:false});
        }
    }

    serachUserByPhone(phoneNumber){ var thisClass=this;
        var res=null; var users=thisClass.state.users;
        if(users.length>0){
            for(index in users){
                var getNow=users[index];
                if(getNow.phone){
                    if((getNow.phone).indexOf(phoneNumber) != -1){
                        res=getNow.username;
                    }
                }
            }
        }
        return res;
    }

    loadData(page){ var thisClass=this;
        var shouldTake=page*10000;
        var following=thisClass.state.following;

        if(page==1 || page=='1'){
            db.child('users').orderByChild('ac_type').equalTo('celebrity').once('value',snap=>{
                var celebrities=[];
                snap.forEach(function(d){ var celebrity=d.val();

                    if(following.indexOf(celebrity.username) != -1){
                            celebrity.isFollowed='yes';
                         } else if(celebrity.profilePic!='default.png'){
                            celebrities.push(celebrity);
                         }
                });


                db.child('users').limitToFirst(shouldTake).once('value',snap=>{
                    var allsuggestions=[];
                    if(snap.val()){
                        snap.forEach(function(userDataT){ var userData=userDataT.val();
                            userData.isFollowed='no';
                            if(following.indexOf(userData.username) != -1){
                                userData.isFollowed='yes';
                                     } else if(userData.profilePic!='default.png'){
                                        allsuggestions.push(userData);
                                     }
                        });
                    }
                    allsuggestions=thisClass.shuffle(allsuggestions);
                    allsuggestions=celebrities.concat(allsuggestions);
                    thisClass.setState({allsuggestions:allsuggestions,isCheck:true});
                    thisClass.realLoadData(thisClass.state.pageS);
                });


            });
        }else{
            db.child('users').limitToFirst(shouldTake).once('value',snap=>{
                var allsuggestions=[];
                if(snap.val()){
                    snap.forEach(function(userDataT){ var userData=userDataT.val();
                        userData.isFollowed='no';
                        if(following.indexOf(userData.username) != -1){
                            userData.isFollowed='yes';
                                 } else if(userData.profilePic!='default.png'){
                                    allsuggestions.push(userData);
                                 }
                    });
                }
                allsuggestions=thisClass.shuffle(allsuggestions);

                thisClass.setState({allsuggestions:allsuggestions,isCheck:true});
                thisClass.realLoadData(thisClass.state.pageS);
            });
        }


        
    }


    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    realLoadData(page){ var thisClass=this;
        var allsuggestions=thisClass.state.allsuggestions;
        if(allsuggestions.length>0){
            var shouldTake=parseInt(page*15);
            if(allsuggestions.length > 9999 && shouldTake>allsuggestions.length){
                var newPage=thisClass.state.pageS+1; var newWpage=thisClass.state.wPageS+1;
                thisClass.setState({pageS:newPage,wPageS:newWpage});thisClass.loadData(newWpage);
            }else{
               var suggestions=allsuggestions.slice(0, shouldTake);
                thisClass.setState({suggestions:suggestions,isCheck:true,closeToBottom:false,isRunning:false}); 
                if(allsuggestions.length < shouldTake){
                    thisClass.setState({isEndedS:true});
                }
            }
        }
    }

    rendertabs(tabName){
        this.setState({selectTab:tabName,closeToBottom:false});
    }


    renderContents(){
        if(this.state.selectTab=='twitter'){
            return this.renderTwitterInvites();
        }else if(this.state.selectTab=='contacts'){
            return this.renderContacts();
        }else if(this.state.selectTab=='suggestions'){
            return this.renderSuggestions();
        }
    }



    

    updateTwFriens(getUserId){
        var getCFrimes=this.state.twFriends; var newFrimeds=[];
        for(index in getCFrimes){
            var getN=getCFrimes[index];
            if(getN.id_str==getUserId){
                getN.invited=true;
            }
            newFrimeds.push(getN);
        }

        this.setState({twFriends:newFrimeds});
    }


    renderTwitterInvies(friend){ var thisClass=this;
        if(friend.invited){
            return(
                <TouchableOpacity>
                    <Text style={[styles.channel_follow_text,styles.channel_follow_text2,styles.channel_follow_text267]}>Invited</Text>
                </TouchableOpacity>
            );
        }else{
            return(
                <TouchableOpacity onPress={()=>thisClass.sendTwitterMsg(friend)}>
                    <Text style={[styles.channel_follow_text,styles.channel_follow_text2]}>Invite</Text>
                </TouchableOpacity>
            );
        }
    }



    renderTwitterInvites(){
        var thisClass=this;
        if(this.state.mCheck){
            if(this.state.twitter){
                if(this.state.twFriends.length>0){
                    return this.state.twFriends.map(function(friend, i){ 
                        var userImage=friend.profile_image_url_https;
                        return(
                            <View key={i} style={styles.follow_channel_list_single}>
                                <View style={styles.follow_channel_list_single_left_main}>
                                    <TouchableOpacity style={styles.follow_channel_list_single_left}>
                                        <View style={styles.follow_channel_list_single_left_left}>
                                            <Image style={styles.channel_list_pho} source={{uri : userImage }}/>
                                        </View>
                                        <View style={styles.follow_channel_list_single_left_right}>
                                            <Text style={[styles.channel_list_text]}>@{friend.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.follow_channel_list_single_right}>
                                    {thisClass.renderTwitterInvies(friend)}
                                </View>
                            </View>
                        );
                    });
                }else{
                    return(
                        <View style={[styles.login_form_row_social,styles.login_form_row_social45]}>
                            <TouchableOpacity onPress={()=>this.twitter_click()} style={[styles.signup_connect_touch,styles.signup_connect_touch2]} >
                                <View style={styles.signup_connect_touch_a}>
                                    <IconFE name="twitter" style={[styles.signup_connect_img2]}/>   
                                    <Text style={styles.signup_connect_txt}>GET TWITTER FRIENDS</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                }
            }else{
                return(
                    <View style={[styles.login_form_row_social,styles.login_form_row_social45]}>
                        <TouchableOpacity onPress={()=>this.twitter_click()} style={[styles.signup_connect_touch,styles.signup_connect_touch2]} >
                            <View style={styles.signup_connect_touch_a}>
                                <IconFE name="twitter" style={[styles.signup_connect_img2]}/>   
                                <Text style={styles.signup_connect_txt}>CONNECT TO TWITTER</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            }
        }
    }


    sendInvitation(contact,sendText){
        if(sendText=='Invite'){
            var phoneNumber = null;
            if(contact.phoneNumbers){
                if(contact.phoneNumbers[0].value){
                    phoneNumber=contact.phoneNumbers[0].value;
                } 
                if(phoneNumber){
                    var myContacts=[];myContacts.push(contact);
                    this.sendSMS(myContacts);
                }
            }
        }
    }


    sendSMS(contacts){ var thisClass=this;
        var postUrl=appEngine+'/contacts/send-invitation';
        axios.post(postUrl, {
            contacts: contacts,
            username : thisClass.state.username2,
        }).then(function(res){
            var data=res.data;
            if(data.status=='success'){
                thisClass.updateContacts(contacts);   
                thisClass.updateTotalSms(contacts);   
            }
        })
        .catch(function(error){  });
    }

    updateTotalSms(contacts){ var thisClass=this;
        var contactsL=contacts.length;
        db.child('users').orderByChild('username').equalTo(thisClass.state.username).once('child_added',snap=>{
            if(snap.val()){ var userData=snap.val();
                var newSmsTotal=Number(userData.smsTotal) + Number(contactsL);
                db.child('users').child(snap.key).update({smsTotal:newSmsTotal});
            }
        });
    }


    updateContacts(contactData){
        var currentContacts=this.state.contacts;
        var newContacts=[];
        for(index in currentContacts){
            var getContact = currentContacts[index];
            if(contactData.length>1){
                getContact.isSent='yes';
            }else{
                var contactDataSin=contactData[0];
                if(getContact.identifier==contactDataSin.identifier){
                    getContact.isSent='yes';
                }
            }
            newContacts.push(getContact);
        }
        this.setState({contacts:newContacts});
    }

    async saveItem(item, selectedValue) {try {await AsyncStorage.setItem(item, selectedValue); } catch (error) {  } }


    contact_click(){
        var thisClass=this;
        thisClass.changeContacts('yes');
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


    renderContacts(){
        if(this.state.contactC){
            return this.renderContactsM();
        }else if(this.state.mCheck){
            return(
                <View style={[styles.login_form_row_social,styles.login_form_row_social45]}>
                    <TouchableOpacity onPress={()=>this.contact_click()} style={[styles.signup_connect_touch,styles.login_form_row_social456]} >
                        <View style={styles.signup_connect_touch_a}>
                            <IconFI name="md-contacts" style={[styles.signup_connect_img2]}/>   
                            <Text style={styles.signup_connect_txt}>CONNECT TO CONTACTS</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }


    renderContactsM(){
        var thisClass= this;
        if(this.state.contacts.length==0 && this.state.cCheck==true){
            return(
                <View style={styles.not_found_single}><Text style={styles.not_found_single_txt}>Nothing found!</Text></View>
            );
        }else{
            return(
                <View style={styles.contact_main_area}>
                    <View style={styles.contact_main_area_top}>
                        <TextInput underlineColorAndroid='transparent' returnKeyType='search' onSubmitEditing={()=>this.contactSubmit()} autoCapitalize = 'none' 
                    placeholderTextColor="#b3b3b3" style={[styles.search_form_row,styles.search_form_row2]} value={this.state.contact} placeholder="enter name..." autoCorrect={false} onChangeText={contact=>this.setState({contact : contact})}/>
                    </View>
                    <View style={styles.contact_main_area_bottom}>
                        {thisClass.renderMainContacts()}
                    </View>
                </View>
            );
        }
    }

    async getContacts2(getWord) {
        const pagedContacts = new PagedContacts(getWord);
        const count = await pagedContacts.getContactsCount();

        return await pagedContacts.getContactsWithRange(0, count, [PagedContacts.displayName,
          PagedContacts.phoneNumbers]);
    }

    contactSubmit(){
        var thisClass=this;

        var getWord=this.state.contact;
        if(getWord){
            this.getContacts2(getWord).then(contacts => {
                if(contacts.length>0){
                    thisClass.setState({contacts:[],cCheck:false},()=>thisClass.updateJointContacts(contacts));
                }else{
                    Alert.alert('Not found!','No contacts found as per your query.');
                }
            });
        }else{
            Keyboard.dismiss();
        }
    }

    renderMainContacts(){
        var thisClass= this;

        return this.state.contacts.map(function(contact, i){ 
            var phoneNumber = '';
            if(contact.phoneNumbers){
                if(contact.phoneNumbers[0].value){
                    phoneNumber=contact.phoneNumbers[0].value;
                } 
            }
            return(
                <View key={i} style={styles.follow_channel_list_single}>
                    <View style={styles.follow_channel_list_single_left_main}>
                        <TouchableOpacity style={styles.follow_channel_list_single_left}>
                            <View style={styles.follow_channel_list_single_left_right}>
                                <Text style={[styles.channel_list_text]}>{contact.displayName}</Text>
                                <Text style={styles.single_creator_txt_23}>{phoneNumber}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.follow_channel_list_single_right}>
                        {thisClass.detectInviteButton(contact)}
                    </View>
                </View>
            );
        });
    }



    detectInviteButton(contact){ var thisClass=this;
        
        var sendText='Invite';
        if(contact.isSent && contact.isSent=='yes'){
            sendText='Invited';
        }
        
        if(contact.isInApp=='yes'){
            var follwongText=<Text style={[styles.channel_follow_text,styles.channel_follow_text2]}>Follow</Text>;
            if(contact.isFollowed=='yes'){
                follwongText=<Text style={[styles.channel_follow_text,styles.channel_follow_text2, styles.channel_follow_text267]}>Following</Text>;
            }
            return(
                <TouchableOpacity onPress={()=>thisClass.subscribe2(contact.username,contact.isFollowed)}>
                    {follwongText}
                </TouchableOpacity>
            );
        }else{
            return(
                <TouchableOpacity onPress={()=>thisClass.sendInvitation(contact,sendText)}>
                    <Text style={[styles.channel_follow_text,styles.channel_follow_text2]}>{sendText}</Text>
                </TouchableOpacity>
            );
        }
    }


    updateContactsFo(username,isFollowed){
        var currentContacts=this.state.contacts;
        var newContacts=[];
        for(index in currentContacts){
            var getContact = currentContacts[index];
            if(getContact.username && getContact.username==username){
                if(isFollowed=='yes'){
                    getContact.isFollowed='no';
                }else{
                    getContact.isFollowed='yes';
                }
            }
            newContacts.push(getContact);
        }
        this.setState({contacts:newContacts});
    }


    subscribe(username, isFollowed,type){ var thisClass=this;
        db.child('subscribers').orderByChild('followed_by').equalTo(thisClass.state.username).once('value',snap=>{
            var shouldAdd=true;
            if(snap.val()){
                snap.forEach(function(data){ var getData=data.val();
                    if(getData.following==username){
                        shouldAdd=false; db.child('subscribers').child(data.key).remove();
                    }
                });
            }

            if(shouldAdd==true){
               var resValue='yes';
                db.child('subscribers').child('NaN').remove();
                db.child('subscribers').limitToLast(1).once('child_added',lastRow=>{
                    var primaryKey=parseInt(lastRow.key) + 1;
                    db.child('subscribers').child(primaryKey).once('value',isExits=>{
                        if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                        var created_at=new Date().toJSON();
                        
                        var insertObject={};
                        insertObject.following=username;
                        insertObject.followed_by=thisClass.state.username;
                        insertObject.created_at=created_at;
                        db.child('subscribers').child(primaryKey).set(insertObject);
                    });
                });
            }else{
                var resValue='no';
            }

            //update user data 
            if(type=='contacts'){
                thisClass.updateContactsFo(username,isFollowed);   
            }else{
                thisClass.updateFollowing(username,isFollowed);   
            }
            

            //notifications 
            db.child('notifications').orderByChild('userFor').equalTo(username).once('value',snap=>{
                if(snap.val()){
                    snap.forEach(function(data){ var noti=data.val();
                        if(noti.userFor==username && noti.username==thisClass.state.username && noti.type=='subscribe'){
                            db.child('notifications').child(noti.key).remove();
                        }
                    });
                }
                if(shouldAdd==true){
                    addNotifications(username,null,thisClass.state.username,'subscribe',null);
                }

            });
        });
    }

    updateFollowing(username,isFollowed){
        var currentFollowing=this.state.suggestions;
        var newSuggestions=[];
        for(index in currentFollowing){
            var getUser = currentFollowing[index];
            if(getUser.username==username){
                if(isFollowed=='yes'){
                    getUser.isFollowed='no';
                }else{
                    getUser.isFollowed='yes';
                }
            }
            newSuggestions.push(getUser);
        }

        this.setState({suggestions:newSuggestions});
    }

    isIndoneFor(value){
        var resData=false;
        var doneFor=this.state.doneFor;
        for(index in doneFor){
            var getVar=doneFor[index];
            if(getVar==value){
                resData=true; 
            }
        }

        return resData;
    }


    selectAllActionMain(){
        var isShow=false;
        if(this.state.selectTab=='facebook'){
            if(this.isIndoneFor('facebook')==true){
                isShow=true;
            }
        }else if(this.state.selectTab=='twitter'){
            if(this.isIndoneFor('twitter')==true){
                isShow=true;
            }
        }else if(this.state.selectTab=='contacts'){
            if(this.isIndoneFor('contacts')==true){
                isShow=true;
            } 
        }else if(this.state.selectTab=='suggestions'){
            if(this.isIndoneFor('suggestions')==true){
                isShow=true;
            }
        }

        if(isShow){
            return(
                <TouchableOpacity onPress={()=>Actions.home()} style={styles.invie_lfet_btn2}>
                    <Text style={[styles.invie_lfet_btn_txt,styles.invie_lfet_btn_txt2]}>DONE</Text>
                </TouchableOpacity>
            );
        }else{
            return(
                <TouchableOpacity onPress={()=>this.selectAllAction()} style={styles.invie_lfet_btn2}>
                    <Text style={[styles.invie_lfet_btn_txt,styles.invie_lfet_btn_txt2]}>SELECT ALL</Text>
                </TouchableOpacity>
            );
        }
    }


    selectAllAction(){
        if(this.state.selectTab=='suggestions'){
            Alert.alert( 'Confirmation', 'Want to follow all creators?', 
                [ 
                    {text: 'Cancel', onPress: () => console.log('cancel') , style: 'cancel'},
                    {text: 'Yes', onPress: () => this.followAllCreators() },
                ], 
                { cancelable: false } 
            );
        }else if(this.state.selectTab=='contacts'){
            Alert.alert( 'Confirmation', 'Want to send invitations to all?', 
                [ 
                    {text: 'Cancel', onPress: () => console.log('cancel') , style: 'cancel'},
                    {text: 'Yes', onPress: () => this.sendAllInvitations() },
                ], 
                { cancelable: false } 
            );
        }else if(this.state.selectTab=='twitter'){
            this.getFrinedsTwAll(); 
        }
    }

    getFrinedsTwAll(page){
        var thisClass=this;
        TwitterAPIManager.getFriends(-1,200,(result)=> {
            if(result.users.length>0){
                thisClass.setState({twFriends:result.users,twitter:true,closeToBottom:false,isEndedT:true});
           
                var getCFrimes=result.users; 
                for(index in getCFrimes){
                    var getN=getCFrimes[index];
                    this.sendTwitterMsg(getN);
                }

            }else{
                thisClass.setState({closeToBottom:false,isEndedT:true});
            }
        });
    }


    sendAllInvitations(){
        var thisClass=this;
        thisClass.setState({pageLoading:true});
        this.getContacts(0,this.state.totalContacts).then(contacts => {
            thisClass.setState({contacts:contacts,isEndedC:true});
            thisClass.sendSMS(contacts);

            var getdoneFor=thisClass.state.doneFor; getdoneFor.push('contacts'); thisClass.setState({doneFor:getdoneFor});  
        }); 

        
    }

    followAllCreators(){var thisClass=this;
        var getSuggestions=thisClass.state.allsuggestions;
        if(getSuggestions.length>0){
            for(index in getSuggestions){
                var getNow=getSuggestions[index];
                if(getNow.isFollowed=='no'){
                    thisClass.subscribeAll(index, getNow.username);
                }
                
            }
        }
    }

    subscribeAll(index, username){ var thisClass=this;
        var getDuration=Number(index)*3000;
        setTimeout(function(){

            db.child('subscribers').child('NaN').remove();
            db.child('subscribers').limitToLast(1).once('child_added',lastRow=>{
                var primaryKey=parseInt(lastRow.key) + 1;
                db.child('subscribers').child(primaryKey).once('value',isExits=>{
                    if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                    var created_at=new Date().toJSON();
                    
                    var insertObject={};
                    insertObject.following=username;
                    insertObject.followed_by=thisClass.state.username;
                    insertObject.created_at=created_at;
                    db.child('subscribers').child(primaryKey).set(insertObject);
                });
            });

        },getDuration);
    }


    uupdateFollowing2(){
        var currentFollowing=this.state.suggestions;
        var newSuggestions=[];
        for(index in currentFollowing){
            var getUser = currentFollowing[index];
            getUser.isFollowed='yes';
            newSuggestions.push(getUser);
        }

        this.setState({suggestions:newSuggestions,pageLoading:false});

        var getdoneFor=this.state.doneFor; getdoneFor.push('suggestions'); this.setState({doneFor:getdoneFor});
    }

    renderSuggestions(){
        var thisClass= this;
        if(this.state.suggestions.length==0 && this.state.isCheck==true){
            return(
                <View style={styles.not_found_single}><Text style={styles.not_found_single_txt}>Nothing found!</Text></View>
            );
        }else{
            return this.state.suggestions.map(function(creator, i){
                var userImage = gStorage+'/profile_thumbs/'+creator.profilePic;     
                var follwongText=<Text style={[styles.channel_follow_text,styles.channel_follow_text2]}>Follow</Text>;
                if(creator.isFollowed=='yes'){
                    follwongText=<Text style={[styles.channel_follow_text,styles.channel_follow_text2,styles.channel_follow_text267]}>Following</Text>;
                }

                var verifiedIcons=null;
                if(creator.ac_type=='celebrity'){
                    verifiedIcons=(<IconF name="check-circle" style={[styles.video_verified_icon]}/>);
                }

                return(
                    <View key={i} style={styles.follow_channel_list_single}>
                        <View style={styles.follow_channel_list_single_left_main}>
                            <TouchableOpacity style={styles.follow_channel_list_single_left}>
                                <View style={styles.follow_channel_list_single_left_left}>
                                    <Image style={styles.channel_list_pho} source={{uri : userImage }}/>
                                </View>
                                <View style={styles.follow_channel_list_single_left_right}>
                                    <Text style={[styles.channel_list_text]}>@{creator.username} {verifiedIcons}</Text>
                                    <Text style={styles.single_creator_txt_23}>{creator.name}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.follow_channel_list_single_right}>
                            <TouchableOpacity onPress={()=>thisClass.subscribe(creator.username,creator.isFollowed)}>
                                {follwongText}
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            });
        }
    }

    renderLoading(){if(this.state.pageLoading){return <SpinnerBig/>; } }
    
    handleScroll(nativeEvent) {
        if (isCloseToBottom(nativeEvent)) {this.enableSomeButton(); }
    }

    enableSomeButton(){
        if(this.state.selectTab=='twitter'){
            if(this.state.isEndedT==false && this.state.isRunning==false){
                var getPage = this.state.pageT + 1;
                this.setState({closeToBottom:true, pageT : getPage});
                //this.loadData(this.state.username, getPage);
            } 
        }else if(this.state.selectTab=='contacts'){
            if(this.state.isEndedC==false && this.state.isRunning==false){
                var getPage = this.state.pageC + 1;
                this.setState({closeToBottom:true, pageC : getPage});
                this.loadContacts(getPage);
            } 
        }else if(this.state.selectTab=='suggestions'){
            if(this.state.isEndedS==false && this.state.isRunning==false){
                var getPage = this.state.pageS + 1;
                this.setState({closeToBottom:true, pageS : getPage});
                this.realLoadData(getPage);
            } 
        }
        
    }

    renderCloseLoading(){
        if(this.state.closeToBottom){
            return(
                <View style={styles.closeto_bottom}><Spinner size={'small'}/></View>
            );
        }
    }

    render(){
        var twClass, conClass, sugClass; 
        var twClass1, conClass1, sugClass1; 
        twClass=conClass=sugClass=[styles.invite_heading_bottom_single];
        fbClass1=twClass1=conClass1=sugClass1=[styles.invite_heading_bottom_txt];
        if(this.state.selectTab=='twitter'){
            twClass=[styles.invite_heading_bottom_single,styles.invite_heading_bottom_single_active];
            twClass1=[styles.invite_heading_bottom_txt,styles.invite_heading_bottom_txt_active];
        }else if(this.state.selectTab=='contacts'){
            conClass=[styles.invite_heading_bottom_single,styles.invite_heading_bottom_single_active];
            conClass1=[styles.invite_heading_bottom_txt,styles.invite_heading_bottom_txt_active];
        }else if(this.state.selectTab=='suggestions'){
            sugClass=[styles.invite_heading_bottom_single,styles.invite_heading_bottom_single_active];
            sugClass1=[styles.invite_heading_bottom_txt,styles.invite_heading_bottom_txt_active];
        }

        return(
            <View style={styles.invie_container}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.invite_heading}>
                    
                    <View style={styles.invite_heading_top}>
                        <Text style={styles.invite_heading_top_txt}>DISCOVER</Text>
                    </View>
                    <TouchableOpacity onPress={()=>Actions.home()} style={styles.invie_lfet_btn}>
                        <Text style={[styles.invie_lfet_btn_txt,styles.invie_lfet_btn_txt3]}>SKIP</Text>
                    </TouchableOpacity>
                    {this.selectAllActionMain()}

                    <View style={[styles.invite_heading_bottom,styles.invite_heading_bottom2]}>
                        <TouchableOpacity  onPress={()=>this.rendertabs('contacts')} style={conClass}>
                            <Text style={conClass1}>Contacts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>this.rendertabs('suggestions')} style={sugClass}>
                            <Text style={sugClass1}>Suggestions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>this.rendertabs('twitter')} style={twClass}>
                            <Text style={twClass1}>Twitter</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <ScrollView onScroll={({nativeEvent}) =>this.handleScroll(nativeEvent)} scrollEventThrottle={2000} style={{flex:1, marginTop:80}}>
                    {this.renderContents()}
                    {this.renderCloseLoading()}
                </ScrollView>
                {this.renderLoading()}
            </View>
        );
    }
}


const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};


//export to other parts
export default Invite;