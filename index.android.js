//import libray 
import React, {Component} from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';

//create compoent
class oevo extends Component{
    render(){
        return (
            <App/>
        );
    }
}


AppRegistry.registerComponent('oevo', () => oevo);
