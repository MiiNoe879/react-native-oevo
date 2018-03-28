//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';

import styles from './../style';
import SpinnerBig from './../common/SpinnerBig';
import axios from 'axios';

import {appEngine,gStorage} from './../common/Config';
import {Actions} from 'react-native-router-flux';
import stripe from 'tipsi-stripe'
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFE from 'react-native-vector-icons/Feather';

import {db,userData,firebase,saveDeviceType,nFormat,getFollowing,getLikes,agoFunction,getUsers}  from './../db/DbConfig';
//create componet
class Cards extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            pageLoading:false,
            cards:[]
        };
    }

    componentWillMount(){ var thisClass=this;
        AsyncStorage.getItem('username').then((username) => { 
            if(username){  this.setState({ username:username});
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

            }else{ Actions.signin(); }
        });
    }


    renderLoading(){ if(this.state.pageLoading){return <SpinnerBig/>; } }

    deleteCard(cardRowId, cardNumber){
        var thisClass=this;
        Alert.alert( 'Confirmation', 'Want to delete card : ' + cardNumber, 
            [ 
                {text: 'Cancel', onPress: () => console.log('cancel') , style: 'cancel'},
                {text: 'Delete', onPress: () => thisClass.deleteCardFinal(cardRowId) },
            ], 
            { cancelable: false } 
        );
    }

    deleteCardFinal(cardRowId){ var thisClass=this;
        if(cardRowId){
            var cardRowId=cardRowId.toString();
            db.child('cards').child(cardRowId).once('value',snap=>{
                if(snap.val()){ var cardData=snap.val();
                    db.child('cards').child(cardRowId).remove();
                    thisClass.updateCards(cardRowId);   
                }
            });
        }
    }

    updateCards(cardRowId){
        var getCards = this.state.cards; var newCards = [];
        for(index in getCards){
            var getCard = getCards[index];
            if(getCard.cardRowId!=cardRowId){
                newCards.push(getCard);
            }
        }

        this.setState({cards:newCards});
    }

    renderCards(){
        var thisClass= this;
        return this.state.cards.map(function(card, i){    
            return(
                <View key={i} style={[styles.follow_channel_list_single2]}>
                    <View style={styles.follow_channel_list_single_left_main}>
                        <TouchableOpacity style={styles.follow_channel_list_single_left}>
                            <View style={styles.follow_channel_list_single_left_left}>
                                <IconF name="credit-card" style={[styles.vator_icon_big]}/>
                            </View>
                            <View style={styles.follow_channel_list_single_left_right}>
                                <Text style={styles.channel_list_text}>{card.cardNumber}</Text>
                                <Text style={styles.channel_list_text2}>{card.exp_month}/{card.exp_year}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.draft_single_action}>
                        <TouchableOpacity onPress={()=>Actions.card({cardRowId:card.cardRowId})} style={styles.draft_single_action_t}>
                            <IconF name="edit" style={[styles.vector_edit,styles.vector_edit2]}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>thisClass.deleteCard(card.cardRowId, card.cardNumber)} style={styles.draft_single_action_t}>
                            <IconF name="trash-o" style={[styles.vector_edit]}/>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        });
    }

    render(){
        return(
            <View style={styles.container_followers}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.header_area}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t]}>Linked Cards</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.setting()}>
                    <IconF name="angle-left" style={styles.back_vator}/>    
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>Actions.card()} style={styles.right_done_opacity}>
                    <IconFE name="plus" style={[styles.vator_icon, styles.vator_icon23]}/>
                </TouchableOpacity>

                <ScrollView style={styles.setting_scroll}>
                    {this.renderCards()}
                </ScrollView>
                {this.renderLoading()}
            </View>
        );
    }


}


//export components
export default  Cards;