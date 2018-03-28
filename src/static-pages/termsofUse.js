//import libray to create component
import React,{ Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,StatusBar,WebView } from 'react-native';
import {Actions} from 'react-native-router-flux';


import styles from './../style';
import IconF from 'react-native-vector-icons/FontAwesome';
import SpinnerBig from './../common/SpinnerBig';
import TimerMixin from 'react-timer-mixin';
//create componet
class termsofUse extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pageLoading:true,
        }
    }

    componentWillMount(){
        var thisClass=this;
        TimerMixin.setTimeout(()=>{ thisClass.setState({pageLoading:false}); }, 3000);
    }

    renderLoading(){if(this.state.pageLoading){return <SpinnerBig/>; } }

    render(){
        return(
            <View style={styles.non_container}>
                
                <View style={styles.edit_profile}>
                    <View style={styles.reg_heading}>
                        <Text style={[styles.profile_s_t]}>Terms of Use</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.pop()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>

                <WebView style={{flex:1, marginTop:70}}
                    source={{uri: 'http://104.196.148.36/app/terms-of-use'}}
                />
                {this.renderLoading()}
            </View>
        );
    }
}

//export
export default termsofUse;