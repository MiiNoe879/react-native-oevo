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
class Category extends Component{
    constructor(props) {
        super(props);
        this.state = {
            category:this.props.category,
            uploadPercentage:0,
        };
    }

    componentWillMount(){
        renderUploadsLoadings(this);
    }

    render(){
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={this.state.category.bgColor} barStyle="dark-content" />
                {renderLoadingPercenatge(this,'cat')}
                <View style={[styles.header_area,{backgroundColor:this.state.category.bgColor, borderBottomColor:this.state.category.bgColor}]}>
                    <View style={styles.header_area_main}>
                        <View style={styles.single_eidt_top}>
                            <Text style={[styles.profile_s_t,{color:'#fff',fontSize:18}]}>{this.state.category.name}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator,{color:'#fff'}]}/>   
                </TouchableOpacity>
                <Listing type={'category'} category={this.state.category.name}/>
            </View>
        );
    }

}
//export to other parts
export default Category;
