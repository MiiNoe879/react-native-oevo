//import libray
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


//create component
const Spinner = (props) =>{
    var percentage =props.percentage;
    return (
        <View style={styles.loading_area_p}>
            <View style={styles.loading_area_pp}><Text style={styles.loading_area_ppp}>{percentage}%</Text></View>
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
        backgroundColor:'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
    },
    loading_area_pp:{
        borderColor:'#5EC6CF',
        borderWidth:1,
        borderRadius:30,
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:15,
        paddingRight:15,
        alignItems: 'center',
        shadowOpacity: 0.75,
        shadowRadius: 5,
        shadowColor: '#5EC6CF',
        shadowOffset: { height: 0, width: 0 },
    },
    loading_area_ppp:{
        color:'#5EC6CF',
        fontSize:16
    }
});


//export
export default Spinner;