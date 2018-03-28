//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';


import styles from './../style';
import Listing from './../feeds/Listing';
import Menu from './../common/Menu';
import {Actions} from 'react-native-router-flux';
import IconF from 'react-native-vector-icons/FontAwesome';

//create componet
class Query extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tags:this.props.tags,
            locations:this.props.locations,
            videoId:this.props.videoId
        };
    }

    render(){
        var getTitle=null;
        if(this.props.tags){
            getTitle=this.props.tags;
        }
        if(this.props.locations){
            getTitle=this.props.locations;
        }

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.header_area}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t]}>{getTitle}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>
                <Listing tags={this.state.tags} locations={this.state.locations} videoId={this.state.videoId}/>
            </View>
        );
    }

}
//export to other parts
export default Query;
