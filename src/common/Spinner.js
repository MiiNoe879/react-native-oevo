//import libray
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';


//create component
const Spinner = (props) =>{
    var size =props.size;
    return (
        <View style={styles.spinner_style}>
            <ActivityIndicator size={size || 'large'}/>
        </View>
    );
}

const styles=StyleSheet.create({
    spinner_style:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        margin:15
    }
});


//export
export default Spinner;