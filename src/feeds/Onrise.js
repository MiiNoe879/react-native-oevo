//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';


import styles from './../style';
import Listing from './../feeds/Listing';
import Menu from './../common/Menu';
import {Actions} from 'react-native-router-flux';
import IconF from 'react-native-vector-icons/FontAwesome';
import {renderUploadsLoadings,renderLoadingPercenatge}  from './../common/Video';
console.disableYellowBox = true;
//create componet
class Onrise extends Component{
    constructor(props) {
        super(props);
        this.state = {
            uploadPercentage:0,
        };
    }

    componentWillMount(){
        renderUploadsLoadings(this);
    }
    

    render(){
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                {renderLoadingPercenatge(this,'cat')}
                <View style={styles.header_area}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t]}>On The Rise</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>
                <Listing type={'page'} page={'onrise'}/>
            </View>
        );
    }

}
//export to other parts
export default Onrise;
