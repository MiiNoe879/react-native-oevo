//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView,StatusBar,Picker, TouchableWithoutFeedback, Alert, TextInput,Keyboard } from 'react-native';

import styles from './../style';
import SpinnerBig from './../common/SpinnerBig';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import {Actions} from 'react-native-router-flux';
import stripe from 'tipsi-stripe'
import KeyboardAwareScrollView from './../common/KeyboardAwareScrollView';
import IconF from 'react-native-vector-icons/FontAwesome';

stripe.init({
  publishableKey: 'pk_test_N82tntsf90pgTDQqbqmJWrxL',
  merchantId: 'merchant.oevo-apple-pay',
  androidPayMode: 'test',
})

var isPassed=true;
var cardLength=0;

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
//create componet
class Card extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            pageLoading:false,
            card:'',
            cvv:'',
            expire_date:'',
            name:'',
            address:'',
            city:'',
            zip:'',
            state:'',
            name:'',
            cardRowId:this.props.cardRowId,
            cardId:'',
            editable:true,

            stripeId:'',
            email:'',
            userId:'',
        };
    }

    componentWillMount(){ var thisClass=this;
        AsyncStorage.getItem('username').then((username) => { 
            if(username){  this.setState({ username:username});  
                db.child('users').orderByChild('username').equalTo(username).once('child_added',snap2=>{
                    if(snap2.val()){ var userData=snap2.val();
                        thisClass.setState({email:userData.email,userId:snap2.key});
                        if(userData.stripeId){
                            thisClass.setState({stripeId:userData.stripeId});
                        }
                    }
                });
                if(this.props.cardRowId){
                    this.setState({editable:false}); var cardRowId=this.props.cardRowId;
                    db.child('cards').child(cardRowId).once('value',snap=>{
                        if(snap.val()){ var card=snap.val();
                              thisClass.setState({
                                card:card.cardNumber, 
                                cvv:card.cvv, 
                                expire_date:card.exp_month+'/'+card.exp_year, 
                                name:card.name, 
                                address:card.address_line1, 
                                city:card.address_city, 
                                zip:card.address_zip, 
                                state:card.address_state, 
                                cardId:card.cardId, 
                                cardRowId:cardRowId, 
                            });
                        }
                    });
                }
            }else{ Actions.signin(); }
        });
    }


    renderLoading(){ if(this.state.pageLoading){return <SpinnerBig/>; } }

    cardAction(){ var thisClass=this;
        Keyboard.dismiss(); 
        if(this.state.card && this.state.cvv && this.state.cvv && this.state.expire_date && this.state.cvv && this.state.name && this.state.address && this.state.city && this.state.zip && this.state.state){
            thisClass.setState({pageLoading:true});
            var expireyear,expiremonth=null;
            if(this.state.expire_date.indexOf("/")>=0){
                var expire_date=this.state.expire_date;
                var expire_date_ex=expire_date.split('/');
                expiremonth=Number(expire_date_ex[0]);
                expireyear=Number(expire_date_ex[1]);
            }
            
            const params = {
              number: this.state.card,
              expMonth: expiremonth,
              expYear: expireyear,
              cvc: this.state.cvv,
              name: this.state.name,
              currency: 'usd',
              addressLine1: this.state.address,
              addressCity: this.state.city,
              addressState: this.state.state,
              addressZip: this.state.zip,
              username:thisClass.state.username
            }

            if(this.props.cardRowId){
                thisClass.saveCard('N/A',expiremonth,expireyear);
            }else{
                stripe.createTokenWithCard(params).then(function(res){
                   if(res.tokenId){
                        thisClass.saveCard(res.tokenId,expiremonth,expireyear);
                   }
                }).catch(function(error){
                    thisClass.setState({pageLoading:false});
                    Alert.alert('Warning!','Something wrong with your card information!');
                });
            }

        }else{
            Alert.alert('Warning!','Please fill out all fields!');
        }
    }


    saveCard(stripeToken,expiremonth,expireyear){var thisClass=this;
        var postUrl=appEngine+'/donation/card-action';
        axios.post(postUrl, {
          number: this.state.card,
          expMonth: expiremonth,
          expYear: expireyear,
          cvc: this.state.cvv,
          name: this.state.name,
          currency: 'usd',
          addressLine1: this.state.address,
          addressCity: this.state.city,
          addressState: this.state.state,
          addressZip: this.state.zip,
          username:thisClass.state.username,
          stripeId:thisClass.state.stripeId,
          email:thisClass.state.email,
          stripeToken:stripeToken,
          cardRowId:this.state.cardRowId,
          cardId:this.state.cardId
        }).then(function(res){
            thisClass.setState({pageLoading:false});
            console.log(res.data);
            var data=res.data;
            if(data.status=='true'){
                if(thisClass.state.stripeId){}else{
                    if(thisClass.state.userId && data.stripeId){
                        db.child('users').child(thisClass.state.userId).update({stripeId:data.stripeId});
                    }
                }

                var insertObject={};
                insertObject.address_city=thisClass.state.city;
                insertObject.address_line1=thisClass.state.address;
                insertObject.address_state=thisClass.state.state;
                insertObject.address_zip=thisClass.state.zip;
                insertObject.exp_month=expiremonth;
                insertObject.exp_year=expireyear;
                insertObject.name=thisClass.state.name;

                if(thisClass.props.cardRowId){
                    db.child('cards').child(thisClass.props.cardRowId).update(insertObject);
                }else{
                    db.child('cards').child('NaN').remove();
                    db.child('cards').limitToLast(1).once('child_added',lastRow=>{
                        var primaryKey=parseInt(lastRow.key) + 1;
                        db.child('cards').child(primaryKey).once('value',isExits=>{
                            if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                            var created_at=new Date().toJSON();

                            insertObject.cardNumber=thisClass.state.card;
                            insertObject.cvv=thisClass.state.cvv;
                            insertObject.cardId=data.cardId;
                            insertObject.username=thisClass.state.username;

                            insertObject.created_at=created_at;
                            db.child('cards').child(primaryKey).set(insertObject);
                        });
                    });
                }
                thisClass.cardsActionsDetect();
            }else{
                Alert.alert('Warning!','Something wrong with your card information!');
            }
        }).catch(function(error){
            thisClass.setState({pageLoading:false});
            Alert.alert('Warning!','Something wrong with your card information!');
        });
    }


    cardsActionsDetect(){
        if(this.props.cardRowId){
            setTimeout(function(){
                Actions.cards();
            },1000);
        }else{
            this.addCardReturn();
        }

    }


    setExpite_date(expire_date){
        if(expire_date.length==1){ isPassed=true; }
        if(expire_date.length==2){
            if(expire_date>12){
                var expire_date='';
            }else if(isPassed==true){
                var expire_date=expire_date+'/';
                isPassed=false;
            }
        }
        if(expire_date.indexOf("/")>=0){
            var expire_date_ex=expire_date.split('/');
            if(expire_date_ex[1] && expire_date_ex[1].length==2 && expire_date_ex[1] < 18){
                expire_date=expire_date_ex[0]+'/';
            }
            if(expire_date_ex[1] && expire_date_ex[1].length==2 && expire_date_ex[1] > 30){
                expire_date=expire_date_ex[0]+'/';
            }
        }
        this.setState({expire_date:expire_date});
    }

    addCardReturn(){
        if(this.props.shouldReturn){
            Actions.purchase_coins();
        }else{
            setTimeout(function(){
                Actions.cards();
            },1000);
        }
    }

    onCardNumberChange(card){
        var newCard =card;
        if(newCard && (cardLength < newCard.length)){
            if(newCard.length==4){
                newCard=newCard+'  ';
            }else if(newCard.length==10){
                newCard=newCard+'  ';
            }else if(newCard.length==16){
                newCard=newCard+'  ';
            }
        }
        cardLength=newCard.length;
        this.setState({card:newCard});
    }

    render(){
        return(
            <View style={styles.container_followers}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.header_area}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t]}>Card Info</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>this.addCardReturn()}>
                    <IconF name="angle-left" style={styles.back_vator}/>    
                </TouchableOpacity>
                <TouchableOpacity onPress={this.cardAction.bind(this)} style={styles.right_done_opacity}>
                    <IconF name="save" style={[styles.vator_icon]}/>
                    <Text style={[styles.profile_s_cancel_e]}>Save</Text>
                </TouchableOpacity>


                <KeyboardAwareScrollView style={styles.addCardView} extraScrollHeight={70} >
                    <View style={styles.login_page}>
                        <View style={styles.login_form}>
                            
                            
                            <View style={styles.card_top_contaner}>
                                <View style={styles.form_row_card}>
                                    <Text style={styles.card_label_ds}>CARD NUMBER</Text>
                                    <TextInput underlineColorAndroid='transparent' editable={this.state.editable} placeholderTextColor="#0395c5" maxLength={22} minLength={10} style={styles.input_field_card} value={this.state.card} placeholder="****  ****  ****  ****"  keyboardType = 'numeric' autoCorrect={false} 
                                    onChangeText={card=>this.onCardNumberChange(card)}/>
                                </View>
                                <View style={styles.form_row_card}>
                                    <Text style={styles.card_label_ds}>CARD HOLDER</Text>
                                    <TextInput underlineColorAndroid='transparent' placeholder="David Rojer" style={styles.input_field_card} placeholderTextColor="#0395c5" value={this.state.name} autoCorrect={false}  onChangeText={name=>this.setState({name})}/>
                                </View>
                                <View style={[styles.form_row_2,styles.form_row_25]}>
                                    <View style={styles.form_row_4}>
                                        <Text style={styles.card_label_ds}>EXPIRATION DATE</Text>
                                        <TextInput underlineColorAndroid='transparent' maxLength={5} keyboardType = 'numeric'   placeholderTextColor="#0395c5" style={[styles.input_field_card,styles.input_field_card3]} value={this.state.expire_date} placeholder="MM/YY" autoCorrect={false} keyboardType = 'numeric' onChangeText={expire_date=>this.setExpite_date(expire_date)}/>
                                    </View>
                                    <View style={styles.form_row_4}>
                                        <Text style={styles.card_label_ds}>CVC</Text>
                                        <TextInput underlineColorAndroid='transparent' editable={this.state.editable} placeholderTextColor="#0395c5"  maxLength={3}  style={[styles.input_field_card,styles.input_field_card45]} value={this.state.cvv}  autoCorrect={false} placeholder="***" keyboardType = 'numeric' onChangeText={cvv=>this.setState({cvv})}/>
                                    </View>
                                </View>
                            </View>

                            

                            <Text style={[styles.label,styles.label2,styles.label234]}>BILLING INFO</Text>
                            
                            <View style={styles.form_row}>
                                <TextInput multiline={true} underlineColorAndroid='transparent'  placeholderTextColor="#999" style={[styles.input_field,styles.input_field_crd_btn]} value={this.state.address} placeholder="ADDRESS" autoCorrect={false}  onChangeText={address=>this.setState({address})}/>
                            </View>
                            <View style={styles.form_row}>
                                <TextInput underlineColorAndroid='transparent'  placeholderTextColor="#999" style={[styles.input_field,styles.input_field_crd_btn]} value={this.state.city} placeholder="CITY" autoCorrect={false}  onChangeText={city=>this.setState({city})}/>
                            </View>
                            <View style={styles.form_row_2}>
                                <View style={styles.form_row_4}>
                                    <TextInput underlineColorAndroid='transparent'  placeholderTextColor="#999" style={[styles.input_field,styles.input_field_crd_btn]} value={this.state.state} placeholder="STATE" autoCorrect={false}  onChangeText={state=>this.setState({state})}/>
                                </View>
                                <View style={styles.form_row_4}>
                                    <TextInput underlineColorAndroid='transparent'  placeholderTextColor="#999" style={[styles.input_field,styles.input_field_crd_btn]} value={this.state.zip} placeholder="ZIP" autoCorrect={false} keyboardType = 'numeric' maxLength = {6} minLength = {4}  onChangeText={zip=>this.setState({zip})}/>
                                </View>
                            </View>

                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {this.renderLoading()}
            </View>
        );
    }


}


//export components
export default  Card;