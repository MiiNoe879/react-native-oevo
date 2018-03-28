//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Modal, AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';

import Menu from './../common/Menu';
import styles from './../style';
import SpinnerBig from './../common/SpinnerBig';
import axios from 'axios';

import {appEngine,gStorage}  from './../common/Config';


console.disableYellowBox = true;
import Spinner from './../common/Spinner';
import IconFM from 'react-native-vector-icons/MaterialCommunityIcons';

import {renderUploadsLoadings,renderLoadingPercenatge}  from './../common/Video';
import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
import FastImage from 'react-native-fast-image';
import IconF from 'react-native-vector-icons/FontAwesome';

//create componet
class MyDonations extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            pageLoading:false,
            page:1,
            wPage:1,
            alldonors:[],
            donors:[],
            closeToBottom:false,
            balance:0,
            isCheck:false,
            modalVisible:false,
            uploadPercentage:0,
            users:[],
            isEnded:false
        };
    }

    componentWillMount(){  var thisClass=this;
        StatusBar.setHidden(false); StatusBar.setBarStyle('dark-content', true);
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
                renderUploadsLoadings(thisClass,username);
                getUsers().then(snap=>{thisClass.setState({users:snap}); });
                this.setState({username:username},()=>this.loadDonations(1)); }else{ Actions.signin(); }
            
        });
    }


    loadDonations(page){ var thisClass=this;
        var shouldTake=page*10000;
        db.child('drecords').limitToLast(shouldTake).once('value',snap=>{
            if(snap.val()){
                var alldonors=[];
                snap.forEach(function(donationM){ var donation=donationM.val();
                    if(donation.donatedBy==thisClass.state.username || donation.donatedTo==thisClass.state.username){
                        donation.donationId=donationM.key;
                        if(donation.donatedBy=='system'){
                            donation.type='winner';
                            donation.donatedBy=null;
                        }else if(donation.donatedBy==thisClass.state.username){
                            donation.type='sent';
                            donation.donatedBy=thisClass.getUserData(donation.donatedTo);
                        }else{
                            donation.type='received';
                            donation.donatedBy=thisClass.getUserData(donation.donatedBy);
                        }
                        donation.amount=nFormat(donation.amount);
                        alldonors.push(donation);
                    } 
                });
                alldonors.sort(function(a,b) {
                  return Number(b.donationId) - Number(a.donationId);
                });
                thisClass.setState({alldonors:alldonors,isCheck:true},()=>thisClass.loadDonationsReal(1));
            }
            db.child('users').orderByChild('username').equalTo(thisClass.state.username).once('child_added',snap2=>{
                if(snap2.val()){ var userData=snap2.val();
                    if(userData.balance){
                        finalBalance=Number(userData.balance);
                        thisClass.setState({balance:finalBalance});
                    }
                }
            });
        });
    }

    loadDonationsReal(page){ var thisClass=this;
        var alldonors=thisClass.state.alldonors;
        if(alldonors.length>0){
            var shouldTake=parseInt(page)*15;
            if(alldonors.length > 9999 && shouldTake>alldonors.length){
                var newPage=thisClass.state.page+1; var newWpage=thisClass.state.wPage+1;
                thisClass.setState({page:newPage,wPage:newWpage});thisClass.loadDonations(newWpage);
            }else{
                var donors=alldonors.slice(0, shouldTake);
                thisClass.setState({donors:donors,isCheck:true,closeToBottom:false}); 
                if(alldonors.length < shouldTake){
                    thisClass.setState({isEnded:true});
                }
            }
        }
    }

    getUserData(username){
        var getUsers=this.state.users;
        if(getUsers.length>0){
            for(index in getUsers){
                var getNow=getUsers[index];
                if(getNow.username==username){
                    return getNow;
                }
            }
        }
    }


    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }



    handleScroll(nativeEvent) {
        if (isCloseToBottom(nativeEvent)) {this.enableSomeButton(); }
    }


    renderCloseLoading(){
        if(this.state.closeToBottom){
            return(
                <View style={styles.closeto_bottom}><Spinner size={'small'}/></View>
            );
        }
    }


    renderDonors(){
        if(this.state.isCheck){
            var thisClass= this;
            return this.state.donors.map(function(donor, i){
                var getdata=new Date(donor.created_at).toDateString();
                var donationType='+';
                var donationClass=[styles.donation_lists_single];
                var donationClass2=[styles.donation_lists_single_right];
                var donationClass3=[styles.donation_lists_single_right_txt];

                if(donor.type=='winner'){
                    return(
                        <View key={i} style={donationClass}>
                            <View style={styles.donation_lists_single_left}>
                                <TouchableOpacity style={styles.donation_lists_single_left_area}>
                                    <View style={styles.donation_lists_single_left_left}>
                                        
                                    </View>
                                    <View style={styles.donation_lists_single_left_right}>
                                        <Text style={[styles.no_list_text_main, styles.font_bold]}>You are the winner!</Text> 
                                        <Text style={[styles.no_list_text_main]}>{getdata} </Text> 
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={donationClass2}>
                                <Text style={donationClass3}>+{donor.amount} Coins</Text>
                            </View>
                        </View>
                    );
                }else if(donor.donatedBy){
                    var donorD=donor.donatedBy;
                    var userImage = gStorage+'/profile_thumbs/'+donorD.profilePic;

                    if(donor.type=='sent'){
                        donationType='-';
                        donationClass=[styles.donation_lists_single,styles.donation_lists_single34];
                        donationClass2=[styles.donation_lists_single_right,styles.donation_lists_single_right34];
                        var donationClass3=[styles.donation_lists_single_right_txt, styles.donation_lists_single_right_txt34];
                    }

                    var verifiedIcons=null;
                    if(donorD.ac_type=='celebrity'){
                        verifiedIcons=(<IconF name="check-circle" style={[styles.video_verified_icon]}/>);
                    }
                    return(
                        <View key={i} style={donationClass}>
                            <View style={styles.donation_lists_single_left}>
                                <TouchableOpacity style={styles.donation_lists_single_left_area} onPress={()=>Actions.profile({username:donorD.username})}>
                                    <View style={styles.donation_lists_single_left_left}>
                                        <Image  style={styles.notification_drn_image_sm} source={{uri : userImage }}/>
                                    </View>
                                    <View style={styles.donation_lists_single_left_right}>
                                        <Text style={[styles.no_list_text_main, styles.font_bold]}>{donorD.name}  {verifiedIcons}</Text> 
                                        <Text style={[styles.no_list_text_main]}>{getdata} </Text> 
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={donationClass2}>
                                <Text style={donationClass3}>{donationType}{donor.amount} Coins</Text>
                            </View>
                        </View>
                    );
                }


            });
        }
    }





    enableSomeButton(){
        if(this.state.isEnded==false && this.state.closeToBottom==false){
            var getPage = this.state.page + 1;
            this.setState({closeToBottom:true, page : getPage});
            this.loadDonationsReal(getPage);
        }
        
    }




    renderTotal(){
        if(this.state.isCheck){
            return(
                <View style={styles.donation_heading}>
                    <Text style={styles.donation_heading_b_txt}>YOUR TOTAL COINS</Text>
                    <Text style={styles.donation_heading_balance}>{(this.state.balance)}</Text>
                </View>
            );
        }
    }


    withdawctCheck(){
        this.setState({modalVisible:false});
        var cBalance = Number(this.state.balance);
        setTimeout(function(){ 
            if(true){
                Actions.withdraw({balance:cBalance});
            }else{
                Alert.alert('Info!','Minimum exchange amount 100. Your current balance '+cBalance +' Coins');
            }
        }, 2000);
        
    }

    openUserActions(){
        this.setState({modalVisible:true});
    }

    paymnetsHistory(){
        this.setState({modalVisible:false});
        Actions.payments();
    }

    render(){
        return (
            <View style={[styles.container_notif,{backgroundColor:'#fff'}]}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                {renderLoadingPercenatge(this,'explore')}
                <View style={styles.notification_header}>
                    <View style={styles.notification_header_left}>
                        <TouchableOpacity onPress={()=>Actions.notifications()}><Text style={[styles.notification_btn]}>NOTIFICATIONS</Text></TouchableOpacity>
                    </View>
                    <View style={styles.notification_header_left}>
                        <TouchableOpacity><Text style={[styles.notification_btn, styles.notification_btn_active]}>OEVO COINS</Text></TouchableOpacity>
                    </View>
                </View>


                <ScrollView onScroll={({nativeEvent}) =>this.handleScroll(nativeEvent)}  scrollEventThrottle={2000}  style={styles.notification_sctoll}>
                    
                    <TouchableOpacity onPress={()=>this.openUserActions()} style={[styles.right_done_opacity,styles.right_done_opacity345]}>
                        <IconFM name="dots-horizontal" style={[styles.vator_icon, styles.vator_icon78]}/>
                    </TouchableOpacity>

                    <View style={styles.donations_list_con}>
                        {this.renderTotal()}
                        <View style={styles.donation_lists}>
                            {this.renderDonors()}
                        </View>
                    </View>

                    {this.renderCloseLoading()}
                </ScrollView>


                <Modal transparent={true}  animationType="slide" visible={this.state.modalVisible} onRequestClose={() => {}} > 
                    <TouchableWithoutFeedback onPress={() => this.setState({ modalVisible: false })}>
                    <View style={styles.ds_modal}> 
                        <View style={styles.ds_modal_top}>
                            <TouchableOpacity style={styles.ds_modal_top_row} onPress={() => { this.withdawctCheck(); }}> 
                                <Text style={styles.ds_modal_top_row_txt}>Exchange Coins</Text> 
                            </TouchableOpacity> 
                            <TouchableOpacity style={styles.ds_modal_top_row} onPress={() => { this.paymnetsHistory() }}> 
                                <Text style={styles.ds_modal_top_row_txt}>Exchange History</Text> 
                            </TouchableOpacity>
                        </View> 
                        <TouchableOpacity style={styles.ds_modal_bottom} onPress={() => { this.setState({modalVisible:false}) }}> 
                            <Text style={styles.ds_modal_bottom_cancel}>Cancel</Text> 
                        </TouchableOpacity> 
                    </View> 
                    </TouchableWithoutFeedback>
                </Modal>


                {this.renderLoading()}
                <Menu activeMenu="notifications"/>
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
export default MyDonations;
