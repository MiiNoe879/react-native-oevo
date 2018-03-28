'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Modal,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ViewPropTypes as RNViewPropTypes,
} from 'react-native';

import ModalComponent from './ModalComponent';

const ViewPropTypes = RNViewPropTypes || View.propTypes;

let componentIndex = 0;

const propTypes = {
    data:                      PropTypes.array,
    onChange:                  PropTypes.func,
    initValue:                 PropTypes.string,
    animationType:             Modal.propTypes.animationType,
    style:                     ViewPropTypes.style,
    selectStyle:               ViewPropTypes.style,
    selectTextStyle:           Text.propTypes.style,
    optionStyle:               ViewPropTypes.style,
    optionTextStyle:           Text.propTypes.style,
    optionContainerStyle:      ViewPropTypes.style,
    sectionStyle:              ViewPropTypes.style,
    sectionTextStyle:          Text.propTypes.style,
    cancelStyle:               ViewPropTypes.style,
    cancelTextStyle:           Text.propTypes.style,
    overlayStyle:              ViewPropTypes.style,
    cancelText:                PropTypes.string,
    disabled:                  PropTypes.bool,
    supportedOrientations:     PropTypes.arrayOf(PropTypes.oneOf(['portrait', 'landscape', 'portrait-upside-down', 'landscape-left', 'landscape-right'])),
    keyboardShouldPersistTaps: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    backdropPressToClose:      PropTypes.bool,
};

const defaultProps = {
    data:                      [],
    onChange:                  () => {},
    initValue:                 'Select me!',
    animationType:             'slide',
    style:                     {},
    selectStyle:               {},
    selectTextStyle:           {},
    optionStyle:               {},
    optionTextStyle:           {},
    optionContainerStyle:      {},
    sectionStyle:              {},
    sectionTextStyle:          {},
    cancelStyle:               {},
    cancelTextStyle:           {},
    overlayStyle:              {},
    cancelText:                'Cancel',
    disabled:                  false,
    supportedOrientations:     ['portrait', 'landscape'],
    keyboardShouldPersistTaps: 'always',
    backdropPressToClose:      false,
};

export default class ModalSelector extends ModalComponent {

    constructor() {

        super();

        this._bind(
            'onChange',
            'open',
            'close',
            'renderChildren'
        );

        this.state = {
            modalVisible:  false,
            transparent:   false,
            selected:      'please select',
        };
    }

    componentDidMount() {
        this.setState({selected: this.props.initValue});
        this.setState({cancelText: this.props.cancelText});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initValue !== this.props.initValue) {
            this.setState({selected: nextProps.initValue});
        }
    }

    onChange(item) {
        this.props.onChange(item);
        this.setState({selected: item.label});
        this.close();
    }

    close() {
        this.setState({
            modalVisible: false,
        });
    }

    open() {
        this.setState({
            modalVisible: true,
        });
    }

    renderSection(section) {
        return (
            <View key={section.key} style={[styles.sectionStyle,this.props.sectionStyle]}>
                <Text style={[styles.sectionTextStyle,this.props.sectionTextStyle]}>{section.label}</Text>
            </View>
        );
    }

    renderOption(option, isLast) {
        var getClass=[styles.optionStyle, this.props.optionStyle];
        if(isLast=='yes'){
            getClass=[styles.optionStyle, this.props.optionStyle, styles.no_bodrClass];
        }
        return (
            <TouchableOpacity key={option.key} onPress={() => this.onChange(option)}>
                <View style={getClass}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle]}>{option.label}</Text>
                </View>
            </TouchableOpacity>);
    }

    renderOptionList() {
        let options = this.props.data.map((item,i) => {
            var isLast='no';
            if(i === this.props.data.length - 1){
                isLast='yes';
            }
            if (item.section) {
                return this.renderSection(item,isLast);
            }
            return this.renderOption(item,isLast);

        });

        const closeOverlay = this.props.backdropPressToClose;

        return (
            <TouchableWithoutFeedback key={'modalSelector' + (componentIndex++)} onPress={this.close}>
                <View style={[styles.overlayStyle, this.props.overlayStyle]}>
                    <View style={[styles.optionContainer, this.props.optionContainerStyle]}>
                        <View keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}>
                            <View style={{paddingHorizontal: 0}}>
                                {options}
                            </View>
                        </View>
                    </View>
                    <View style={styles.cancelContainer}>
                        <TouchableOpacity onPress={this.close}>
                            <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                                <Text style={[styles.cancelTextStyle,this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>);
    }

    renderChildren() {

        if(this.props.children) {
            return this.props.children;
        }
        return (
            <View style={[styles.selectStyle, this.props.selectStyle]}>
                <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>{this.state.selected}</Text>
            </View>
        );
    }

    render() {

        const dp = (
            <Modal
                transparent={true}
                ref={element => this.model = element}
                supportedOrientations={this.props.supportedOrientations}
                visible={this.state.modalVisible}
                onRequestClose={this.close}
                animationType={this.props.animationType}
            >
                {this.renderOptionList()}
            </Modal>
        );

        return (
            <View style={this.props.style}>
                {dp}
                <TouchableOpacity onPress={this.open} disabled={this.props.disabled}>
                    <View pointerEvents="none">
                        {this.renderChildren()}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const PADDING = 8;
const BORDER_RADIUS = 5;
const FONT_SIZE = 16;
const HIGHLIGHT_COLOR = 'transparent';

const styles=StyleSheet.create({

    overlayStyle: {
        flex:            1,
        padding:         '5%',
        justifyContent:  'flex-end',
        backgroundColor: 'transparent',
    },

    optionContainer: {
        borderRadius:    BORDER_RADIUS,
        flexShrink:      1,
        marginBottom:    0,
        padding:         0,
        backgroundColor: '#fff',
        overflow:'hidden'
    },

    cancelContainer: {
        flexGrow:  1,
        maxHeight: 30,
        alignSelf: 'stretch',
        marginTop:10,
        marginBottom:15
    },

    selectStyle: {

    },

    selectTextStyle: {
        textAlign: 'center',
        color:     '#333',
        fontSize:  FONT_SIZE,

    },

    cancelStyle: {
        borderRadius:    BORDER_RADIUS,
        padding:         PADDING,
        opacity:1, backgroundColor:'#fff'
    },

    cancelTextStyle: {
        textAlign: 'center',
        paddingTop:5, paddingBottom:5, color:'#057bf9',fontFamily:'Calibri-Bold',fontSize:18,
    },

    optionStyle: {
        margin:0, padding:0, borderBottomWidth:1, borderBottomColor:'#868686',
    },

    optionTextStyle: {
        color:'#057bf9', padding:15, fontSize:18,fontFamily:'Calibri',textAlign:'center', 
        backgroundColor:'#fff'
    },

    sectionStyle: {
        
    },

    no_bodrClass:{borderBottomWidth:0},

    sectionTextStyle: {
        textAlign: 'center',
        fontSize:  FONT_SIZE,
    },
});


ModalSelector.propTypes = propTypes;
ModalSelector.defaultProps = defaultProps;