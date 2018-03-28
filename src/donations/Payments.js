//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, NativeModules,AsyncStorage, ScrollView,Switch,StatusBar } from 'react-native';
import {Actions} from 'react-native-router-flux';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import styles from './../style';
import Spinner from './../common/Spinner';
import SpinnerBig from './../common/SpinnerBig';
import IconF from 'react-native-vector-icons/FontAwesome';

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
//create componet
class Payments extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            offsetY: 0,
            scrollViewY: 0,
            scrollViewHeight: 0,
            closeToBottom:false,
            page:1,
            wPage:1,
            pageLoading:false,
            isEnded:false,
            isRunning:'',
            allpayments:[],
            payments:[],
            isCheck:false
        };
    }


    componentWillMount(){
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ this.setState({username:username}); 
                this.loadPayments(1);
        }else{ Actions.signin(); }
            
        });
    }


    loadPayments(page){ var thisClass=this;
        shouldTake=page*10000;
        db.child('payments').orderByChild('username').equalTo(thisClass.state.username).limitToLast(shouldTake).once('value',snap=>{
            if(snap.val()){
                var allpayments=[];
                snap.forEach(function(data){ var payment=data.val();
                    payment.paymentId=data.key;
                    var readAbleDate=new Date(payment.created_at).toDateString();
                    payment.created_at=readAbleDate;
                    allpayments.push(payment);
                });
                allpayments.sort(function(a,b) {
                  return Number(b.paymentId) - Number(a.paymentId);
                });
                
                thisClass.setState({allpayments:allpayments,isCheck:true});
                thisClass.realloadPayments(thisClass.state.page);
            }
        });
    }

    realloadPayments(page){ var thisClass=this;
        var allpayments=thisClass.state.allpayments;
        if(allpayments.length>0){
            var shouldTake=parseInt(page*10);
            if(allpayments.length > 9999 && shouldTake>allpayments.length){
                var newPage=thisClass.state.page+1; var newWpage=thisClass.state.wPage+1;
                thisClass.setState({page:newPage,wPage:newWpage});thisClass.loadPayments(newWpage);
            }else{
               var payments=allpayments.slice(0, shouldTake);
                thisClass.setState({payments:payments,isCheck:true,closeToBottom:false}); 
                if(allpayments.length < shouldTake){
                    thisClass.setState({isEnded:true});
                }
            }
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

    enableSomeButton(){
        if(this.state.isEnded==false && this.state.closeToBottom==false){
            var getPage = this.state.page + 1;
            this.setState({closeToBottom:true, page : getPage});
            this.realloadPayments(getPage);
        }
        
    }

    renderLoading(){ if(this.state.pageLoading){return <SpinnerBig/>; } }

    renderPayments(){

        var thisClass= this;
        if(this.state.payments.length==0 && this.state.isCheck){
            return(
                <View style={styles.not_found_single}><Text style={styles.not_found_single_txt}>Nothing found!</Text></View>
            );
        }else{
            return this.state.payments.map(function(payment, i){   
                return(
                    <View key={i} style={styles.follow_channel_list_single34}>
                        <View style={styles.payment_row_v}>
                            <Text style={styles.payment_row}>{payment.created_at}</Text>
                        </View>
                        <View style={styles.payment_row_v}>
                            <Text style={styles.payment_row}>{payment.paypal}</Text>
                        </View>
                        <View style={styles.payment_row_v}>
                            <Text style={[styles.payment_row,styles.payment_row2]}>{payment.amount} ({payment.status})</Text>
                        </View>
                    </View>
                );
            });
        }
    }

    render(){
        return(
            <View style={styles.container_followers}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.header_area}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t]}>EXCHANGE HISTORY</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>

                <ScrollView style={{flex:1,marginTop:40}} onScroll={({nativeEvent}) =>this.handleScroll(nativeEvent)} scrollEventThrottle={2000} >
                    {this.renderPayments()}
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
export default Payments;