//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';


import styles from './../style';
import {Actions} from 'react-native-router-flux';
import IconF from 'react-native-vector-icons/FontAwesome';
import SpinnerBig from './../common/SpinnerBig';
import {appEngine,gStorage}  from './../common/Config';
import axios from 'axios';
import Spinner from './../common/Spinner';

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
import FastImage from 'react-native-fast-image';

console.disableYellowBox = true;
//create componet
class Winners extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pageLoading:true,
            username:'',
            
            allWinners:[],
            winners:[],
            topWinners:[],
            selecteddate:'',
            selectedKey:'',

            isCheck:false,
            isEnded:false,
            isRunning:false,
            page:1,
            wPage:1,
            closeToBottom:false,

            users:[],
            today:null

        };
    }

    componentWillMount(){ var thisClass=this;
        AsyncStorage.getItem('username').then((username)=>{
            if(username){
                db.child('winningmsgrecords').once('value',snap=>{
                    var winners=[];
                    if(snap.val()){
                        snap.forEach(function(data){ var getData=data.val();
                            if(getData.winAmount){ winners.push(getData);}
                        });
                    }
                    winners.sort(function(a,b) {
                      return parseInt(b.winCoins) - parseInt(a.winCoins);
                    });
                    winners=winners.slice(0,3);
                    thisClass.setState({topWinners:winners});
                });
                getUsers().then(snap=>{
                    thisClass.setState({username:username, users:snap},()=>this.loadWinners()); 
                });
            }else{
                Actions.signin();
            }
        });  
    }

    loadWinners(){ var thisClass=this;
        db.child('winners').limitToLast(100).once('value',snap=>{
            var allWinners=[];
            if(snap.val()){ 
                snap.forEach(function(data){
                    var getSingle=data.val();
                    if(getSingle.winners){
                        getSingle.winId=data.key;
                        allWinners.push(getSingle);
                    }
                });
            }

            allWinners.sort(function(a,b) {
              return parseInt(b.winId) - parseInt(a.winId);
            });

            if(allWinners[0]){
                var firtWinnersRow=allWinners[0];
                thisClass.setState({winners:firtWinnersRow.winners,isCheck:true,pageLoading:false,
                    selecteddate:firtWinnersRow.created_at,today:firtWinnersRow.created_at,selectedKey:0,allWinners:allWinners});
            }

            
        }); 
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



    renderLoading(){if(this.state.pageLoading){return <SpinnerBig/>; } }

    renderDates(){
        var thisClass=this;
        var rightEnable=null;
        var selecteddate = new Date(thisClass.state.selecteddate);
        if(thisClass.state.selecteddate==thisClass.state.today){
            var txt='Today';
        }else{
            var txt=new Date(thisClass.state.selecteddate).toDateString();
            var nextDate=new Date(selecteddate.getTime() + (24*1000*60*60));
            rightEnable=(
                <View style={styles.date_show_area_left}>
                    <TouchableOpacity onPress={()=>thisClass.changeSelectedDate(nextDate,'next')} style={styles.date_show_area_left_t2}>
                        <IconF name="angle-right" style={[styles.left_right_winners_icons]}/>
                    </TouchableOpacity>
                </View>
            );
        }
        var previousDate=new Date(selecteddate.getTime() - (24*1000*60*60));

        return(
            <View style={styles.date_show_area}>
                <View style={styles.date_show_area_left}>
                    <TouchableOpacity onPress={()=>thisClass.changeSelectedDate(previousDate,'pre')} style={styles.date_show_area_left_t1}>
                        <IconF name="angle-left" style={[styles.left_right_winners_icons]}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.date_show_area_middle}>
                    <Text style={styles.date_show_area_middle_txt}>{txt}</Text>
                </View>
                {rightEnable}
            </View>
        );

    }



    changeSelectedDate(clickDate,type){ var thisClass=this;
        var newSecleddate=clickDate.toJSON();
        thisClass.setState({pageLoading:true});
        var selectedKey=thisClass.state.selectedKey;
        if(type=='next'){
            var neyKey=Number(selectedKey)-1;
        }else{
            var neyKey=Number(selectedKey)+1;
        }

        var allWinners=thisClass.state.allWinners;
        if(allWinners[neyKey]){
            var currentWinData=allWinners[neyKey];
            if(currentWinData.winners){
                thisClass.setState({pageLoading:false,selecteddate:newSecleddate,winners:currentWinData.winners, selectedKey:neyKey});
            }
        }
    }


    renderWinners(){
        var thisClass=this;
        if(this.state.winners){
            return this.state.winners.map(function(winner, i){
                winner.user=thisClass.getUserData(winner.username);
                
                winner.winAmount=(winner.winAmount).toString();
                if(winner.winAmount.indexOf('.') != -1){}else{
                    winner.winAmount=winner.winAmount+'.00';
                }
                var userImage = gStorage+'/profile_thumbs/'+winner.user.profilePic;   
                var isLast=[styles.winners_list_single_right];
                if(i === thisClass.state.winners.length - 1){
                    isLast=[styles.winners_list_single_right,styles.winners_list_single_right_last];
                }

                var verifiedIcons=null;
                if(winner.user.ac_type=='celebrity'){
                    verifiedIcons=(<IconF name="check-circle" style={[styles.video_verified_icon]}/>);
                }

                return(
                    <View key={i} style={styles.winners_list_single}>
                        <View style={isLast}>
                            <TouchableOpacity onPress={()=>Actions.profile({username:winner.user.username})} style={styles.winners_list_single_right_left_t}>
                                <Image style={styles.winners_single_pp} source={{uri : userImage }}/> 
                                <Text style={styles.winners_single_tt}>{winner.user.name} {verifiedIcons}</Text>
                            </TouchableOpacity>
                            <Text style={styles.winners_single_tt2} >${winner.winAmount}</Text>
                        </View>
                    </View>
                );

            });
        }
    }


    winnersTop(){
        var thisClass=this;
        if(this.state.topWinners){
            var topWinners=this.state.topWinners;
            var fWinner=[]; sWinner=[]; tWinner=[];
            if(topWinners[0]){ fWinner=topWinners[0]; fWinner.user=thisClass.getUserData(fWinner.username);}
            if(topWinners[1]){ sWinner=topWinners[1]; sWinner.user=thisClass.getUserData(sWinner.username); }
            if(topWinners[2]){ tWinner=topWinners[2]; tWinner.user=thisClass.getUserData(tWinner.username); }


            var userImage1 = gStorage+'/profile_thumbs/'+fWinner.user.profilePic;   
            var verifiedIcons1=null;
            if(fWinner.user.ac_type=='celebrity'){
                verifiedIcons1=(<IconF name="check-circle" style={[styles.video_verified_icon]}/>);
            }
            var gerUserName1=fWinner.user.name;
            if(gerUserName1.length>12){
                gerUserName1=gerUserName1.substring(0,10)+'..';
            }


            var userImage2 = gStorage+'/profile_thumbs/'+sWinner.user.profilePic;   
            var verifiedIcons2=null;
            if(sWinner.user.ac_type=='celebrity'){
                verifiedIcons2=(<IconF name="check-circle" style={[styles.video_verified_icon]}/>);
            }
            var gerUserName2=sWinner.user.name;
            if(gerUserName2.length>12){
                gerUserName2=gerUserName2.substring(0,10)+'..';
            }


            var userImage3 = gStorage+'/profile_thumbs/'+tWinner.user.profilePic;   
            var verifiedIcons3=null;
            if(tWinner.user.ac_type=='celebrity'){
                verifiedIcons3=(<IconF name="check-circle" style={[styles.video_verified_icon]}/>);
            }
            var gerUserName3=tWinner.user.name;
            if(gerUserName3.length>12){
                gerUserName3=gerUserName3.substring(0,10)+'..';
            }

            fWinner.winAmount=(fWinner.winAmount).toString();
            if((fWinner.winAmount).indexOf('.') != -1){}else{
                fWinner.winAmount=fWinner.winAmount+'.00';
            }

            sWinner.winAmount=(sWinner.winAmount).toString();
            if(sWinner.winAmount.indexOf('.') != -1){}else{
                sWinner.winAmount=sWinner.winAmount+'.00';
            }

            tWinner.winAmount=(tWinner.winAmount).toString();
            if(tWinner.winAmount.indexOf('.') != -1){}else{
                tWinner.winAmount=tWinner.winAmount+'.00';
            }

            return(
                <View style={styles.winner_page_top_new}>

                    <View style={[styles.winners_top_list,styles.winners_top_list23]}>
                        <View style={styles.winners_top_list_area}>
                            <TouchableOpacity onPress={()=>Actions.profile({username:sWinner.user.username})} style={styles.winners_list_single_right_top}>
                                <Image style={[styles.winners_single_pp45]} source={{uri : userImage2 }}/> 
                                <Text style={styles.winners_single_tt}>{gerUserName2} {verifiedIcons2}</Text>
                            </TouchableOpacity>
                            <Text style={styles.winners_single_tt278}>${sWinner.winAmount}</Text>
                        </View>
                    </View>

                    <View style={styles.winners_top_list}>
                        <View style={styles.winners_top_list_area}>
                            <TouchableOpacity onPress={()=>Actions.profile({username:fWinner.user.username})} style={styles.winners_list_single_right_top}>
                                <Image style={[styles.winners_single_pp45,styles.winners_single_pp4589]}source={{uri : userImage1 }}/> 
                                <Text style={styles.winners_single_tt}>{gerUserName1} {verifiedIcons1}</Text>
                            </TouchableOpacity>
                            <Text style={styles.winners_single_tt278}>${fWinner.winAmount}</Text>
                        </View>
                    </View>

                    <View style={[styles.winners_top_list,styles.winners_top_list23]}>
                        <View style={styles.winners_top_list_area}>
                            <TouchableOpacity onPress={()=>Actions.profile({username:tWinner.user.username})} style={styles.winners_list_single_right_top}>
                                <Image style={styles.winners_single_pp45} source={{uri : userImage3 }}/> 
                                <Text style={styles.winners_single_tt}>{gerUserName3} {verifiedIcons3}</Text>
                            </TouchableOpacity>
                            <Text style={styles.winners_single_tt278}>${tWinner.winAmount}</Text>
                        </View>
                    </View>

                </View>
            );



        }
    }


    renderContents(){
        if(this.state.isCheck){
            if(this.state.winners.length>0){
                return(
                    <View>
                        <View style={styles.winners_top_always}>
                            {this.winnersTop()}
                        </View>
                        <View style={styles.winners_date_list}>
                            {this.renderDates()}
                        </View>
                        <View style={styles.winners_list}>
                            {this.renderWinners()}
                        </View>
                    </View>
                );
            }else{
                return(
                    <View style={styles.no_winners_page}>
                        <View style={styles.no_winners_page_top}>
                            <Image  style={styles.winners_dummy} source={require('./../images/winners_dummy.png')}/> 
                        </View>
                        <View style={styles.no_winners_page_bottom}>
                            <View style={styles.commmpe_going_sgg}>
                                <Text style={styles.commmpe_going_sto_start}>Coming soon on</Text>
                                <Text style={styles.commmpe_going_sto_start}>31st January</Text>
                            </View>
                        </View>
                    </View>
                    
                );
            }
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={'#333c94'} barStyle="dark-content" />
                <View style={[styles.header_area,{backgroundColor:'#333c94',borderBottomWidth:0}]}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t, styles.profile_s_t34,{color:'#fff'}]}>WINNERS</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator,{color:'#fff'}]}/>   
                </TouchableOpacity>

                <ScrollView style={[styles.cat_SCroll,styles.cat_SCroll2]}>
                    {this.renderContents()}
                </ScrollView>
                {this.renderLoading()}
            </View>
        );
    }

}



//export to other parts
export default Winners;
