//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage,Switch, ScrollView,StatusBar,Picker, Alert, TextInput,Keyboard } from 'react-native';

import styles from './../style';
import SpinnerBig from './../common/SpinnerBig';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import {Actions} from 'react-native-router-flux';
import IconF from 'react-native-vector-icons/FontAwesome';

import stripe from 'tipsi-stripe';

stripe.init({
  publishableKey: 'pk_test_N82tntsf90pgTDQqbqmJWrxL',
  merchantId: 'merchant.oevo-apple-pay',
  androidPayMode: 'test',
})
import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';



//create class
class PurchaseCoins extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pageLoading:false,
            username:'',
            products:[],
            cards:[],
            isCard:false,
            selectedProduct:null
        };
    }

    componentWillMount(){ var thisClass=this;
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ thisClass.setState({ username:username});  
                db.child('products').once('value',snap=>{
                    var products=[];
                    snap.forEach(function(data){ var produtctD=data.val();
                        produtctD.productId=data.key;
                        products.push(produtctD);
                    });
                    thisClass.setState({ products:products});  

                    db.child('cards').orderByChild('username').equalTo(username).once('value',snap2=>{
                        var cards=[];
                        if(snap2.val()){
                            snap2.forEach(function(data2){ var cardD=data2.val();
                                cardD.cardRowId=data2.key;
                                cards.push(cardD);
                            });
                        }
                        thisClass.setState({cards:cards});
                    });
                });
            }else{ Actions.signin(); }

        });


    }


    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }



    buyCoins(product){ var thisClass=this;
        if(this.state.cards.length>0){
            thisClass.setState({selectedProduct:product,isCard:true});
        }else{
            Actions.card({shouldReturn:true});
        }
        
    }




    renderProducts(){
        var thisClass=this;
        if(thisClass.state.products.length>0){
            var getProducts=thisClass.state.products;
            getProducts.sort(function(a,b) {
                return (a.price)-(b.price);
            });
            return thisClass.state.products.map(function(product, i){
                return(
                    <View key={i} style={styles.purchase_coins_row}>
                        <TouchableOpacity onPress={()=>thisClass.buyCoins(product)} style={styles.purchase_coins_touch}>
                            <Text style={styles.purchase_coins_txt}>{product.title}</Text>
                            <Text style={styles.purchase_coins_txt}>${product.price}</Text>
                            <Text style={[styles.purchase_coins_txt,styles.purchase_coins_txt2]}>Purchase</Text>
                        </TouchableOpacity>
                    </View>
                );
            });
        }
    }


    renderCardsMain(){
        var thisClass= this;
        return this.state.cards.map(function(card, i){    
            return(
                <View key={i} style={styles.pop_card_selction_single}>
                    <View style={styles.pop_card_selction_single_area}>
                        <TouchableOpacity onPress={()=>thisClass.selectCardAction(card.cardRowId)} style={styles.pop_card_selction_aa3}>
                            <Text style={styles.s_label33}>{card.cardNumber}</Text>
                            <Text style={styles.s_label334}>{card.exp_month}/{card.exp_year}</Text>
                            <Image  style={styles.right_arrow_img2} source={require('./../images/right_arrow.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        });
    }

    selectCardAction(cardRowId){
        this.setState({isCard:false});

        var thisClass=this;
        var card={};
        var getCards=this.state.cards;
        for(index in getCards){
            var getCard = getCards[index];
            if(getCard.cardRowId==cardRowId){ card=getCard; }
        }
        if(card){
            thisClass.cardChargeActions(cardRowId);
        }

    }

    cardChargeActions(cardRowId){ var thisClass=this;
        thisClass.setState({pageLoading:true,isCard:false});
        var product=thisClass.state.selectedProduct;
        db.child('users').orderByChild('username').equalTo(thisClass.state.username).once('child_added',snap=>{
            if(snap.val()){ var userdata=snap.val();
                var postUrl=appEngine+'/donation/charge-action-card';
                axios.post(postUrl, {
                    strupeId : userdata.stripeId,
                    price:product.price,
                    receipt_email:userdata.email
                }).then(function(res){ var data=res.data;
                    thisClass.setState({pageLoading:false});
                    if(data.status=='true'){
                        thisClass.updateCoints(product,data.transactionId);
                    }else{
                        Alert.alert('Warning!','Something wrong with your card data! Choose another card or add new!');
                        thisClass.setState({isCard:true});
                    }
                })
                .catch(function(error){
                    Alert.alert('Warning!','Something wrong with your card information! Choose another card or add new!');
                    thisClass.setState({pageLoading:false,isCard:true});
                });
            }
        });
    }

    updateCoints(product,transactionId){ var thisClass=this;
        db.child('purchases').child('NaN').remove();
        db.child('purchases').limitToLast(1).once('child_added',lastRow=>{
            var primaryKey=parseInt(lastRow.key) + 1;
            db.child('purchases').child(primaryKey).once('value',isExits=>{
                if(isExits._value){ primaryKey=parseInt(isExits.key) + 1; }
                var created_at=new Date().toJSON();
                
                var insertObject={};
                insertObject.username=thisClass.state.username;
                insertObject.coins=product.coins;
                insertObject.method='apple';
                insertObject.transId=transactionId;

                insertObject.created_at=created_at;
                db.child('purchases').child(primaryKey).set(insertObject);

                db.child('users').orderByChild('username').equalTo(thisClass.state.username).once('child_added',snap=>{
                    if(snap.val()){ var userData=snap.val();
                        var newBalance=parseInt(userData.balance) + parseInt(product.coins); 
                        if(newBalance<0){newBalance=0}
                        db.child('users').child(snap.key).update({balance:newBalance});
                    }
                });

                Alert.alert('Purchase Successful', 'Your Transaction ID is ' + transactionId);
                Actions.mydonations();
            });
        });
    }

    newCradExtra(){
        Keyboard.dismiss();  Actions.card({shouldReturn:true});
    }


    renderCards(){
        if(this.state.isCard){
            return(
                <View style={styles.card_selection_area}>
                    <View style={styles.card_selection_area_top}>
                        <View style={styles.card_selection_area_top_left}>
                            <Text style={styles.card_selection_area_top_select}>Select Cards</Text>
                        </View>
                        <View style={styles.card_selection_area_top_left}>
                            <TouchableOpacity onPress={()=>this.setState({isCard:false})} style={styles.card_selection_area_top_cancel}><Text style={styles.card_selection_area_top_cancel_tx}>Cancel</Text></TouchableOpacity>
                        </View>
                    </View>
                    {this.renderCardsMain()}
                    <View  style={styles.pop_card_selction_single}>
                        <TouchableOpacity onPress={()=>this.newCradExtra()} style={styles.pop_card_selction_aa34}>
                            <Text style={styles.s_label3345}>+ Add New Card</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
            
        }
    }

    render(){
        return(
            <View style={[styles.container_followers, styles.container_followers23]}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.edit_profile}>
                    <View style={styles.reg_heading}>
                        <Text style={[styles.profile_s_t,{textAlign:'center', fontSize:18}]}>Purchase OEVO Coins</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>

                <ScrollView style={styles.tokenScroll}>
                    <View style={styles.purchase_coins}>
                        {this.renderProducts()}
                    </View>
                </ScrollView>

                {this.renderLoading()}
                {this.renderCards()}
            </View>
        );
    }
}


//export components
export default  PurchaseCoins;