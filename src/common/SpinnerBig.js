//import libray
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';


//create component
const SpinnerBig = (props) =>{
    var percentage =props.percentage;
    return (
        <View style={styles.loading_area_p}>
            <ActivityIndicator size={'large'}/>
        </View>
    );
}

const styles=StyleSheet.create({
    loading_area_p:{
        flex:1,
        justifyContent:'center',
        position:'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0,
        backgroundColor:'rgba(0,0,0,.5)',
        alignItems: 'center',
        zIndex:9
    }
});


//export
export default SpinnerBig;