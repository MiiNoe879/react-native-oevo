//import
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {VideoPlayer, Trimmer, ProcessingManager } from 'react-native-video-processing';
import Dimensions from 'Dimensions';
var screen = Dimensions.get('window');
import Video from 'react-native-video';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/Entypo';
import { ifIphoneX } from './../common/isIphoneX';
import styles from './../style';
import TimerMixin from 'react-timer-mixin';
import SpinnerBig from './../common/SpinnerBig';

//create components
class Trim extends Component {
    constructor(props) {
        super(props);
        this.state = {
            video_src:this.props.video_src,
            currentTime:0,
            startTime:0,
            endTime:this.props.duration,
            limitSecond:7,
            rotate:false,
            getSelection:(this.props.duration)/1000,
            playerStyle : styles.videoPlayer_main,
            trimSrc:'',
            segments:[],
            play:true,
            isChecked:false,
            pageLoading:true,
        };
    }

    componentWillMount(){ var thisClass=this;
        StatusBar.setBarStyle('dark-content', true);
        if(thisClass.props.segments){
            thisClass.setState({segments:thisClass.props.segments});
        }
        if(thisClass.props.limitSecond){
            thisClass.setState({limitSecond:parseInt(thisClass.props.limitSecond, 10)});
        }

        setTimeout(function(){
            thisClass.setState({isChecked:true});
        },100);
        setTimeout(function(){
            thisClass.setState({pageLoading:false});
        },3000);
    }


    trimVideo() { var thisClass=this;
        if(Number(thisClass.state.getSelection) > Number(thisClass.state.limitSecond)){
            Alert.alert( 'Warning!', 'Max Duration: '+ thisClass.state.limitSecond +' seconds, You have selected '+ thisClass.state.getSelection.toFixed(2) + ' seconds. ');
        }else{
            if(thisClass.state.startTime==0 && thisClass.state.endTime==thisClass.props.duration){
                thisClass.finalAction(thisClass.state.video_src);
            }else{
                const options = {
                    startTime: thisClass.state.startTime,
                    endTime: thisClass.state.endTime,
                };
                thisClass.videoPlayerRef.trim(options)
                .then((newSource) =>{
                    thisClass.finalAction(newSource);
                })
                .catch((er)=>{
                    console.log(er);
                });
            }
        }
    }

    renderLoading(){if(this.state.pageLoading){return <SpinnerBig/>; } }


    finalAction(source){ var thisClass=this;
        thisClass.setState({trimSrc:source});
        const maximumSize = { width: 1080, height: 1080 };
        ProcessingManager.getPreviewForSecond(source,0,maximumSize,'JPEG')
        .then((data) =>{
            if(data.uri){
                thisClass.finalAction2(data);
            }
        });
    }

    finalAction2(image){
        var videoData={};
        videoData.url=this.state.trimSrc;
        videoData.thumbnail=image.uri;
        videoData.duration=(this.state.getSelection)*1000;
        videoData.sound='no';
        var segments =this.state.segments;
        segments.push(videoData);
        
        Actions.preview({segments:segments});
    }



    backRecodring(){
        this.setState({play:false});
        Actions.record();
    }

    setDuration(e){
        var startTime=Number(e.startTime)*1000;
        var endTime=Number(e.endTime)*1000;
        var getSelection = (endTime - startTime);

        this.setState({startTime:startTime, endTime:endTime, getSelection:getSelection});
    }


    playerOnPress(e){
        if(this.state.play){
            this.setState({play:false});
        }else{
            this.setState({play:true});
        }
    }


    onChnageEvenet(){
        if(this.state.currentTime==this.state.endTime){
            this.setState({play:true});
        }
    }


    renderTrimBox(){ var thisClass=this;
        if(this.state.isChecked){
            return(
                <Trimmer
                    source={this.state.video_src}
                    onTrackerMove={(e) => console.log(e.currentTime)}
                    currentTime={this.state.currentTime}
                    themeColor={'#999'}
                    height={100}
                    width={screen.width}
                    thumbWidth={30}
                    trackerColor={'#e9a865'}
                    onChange={(e) => this.setDuration(e)}
                    minLength={1}
                />
            );
        }
    }


    render() {
        return (
          <View style={styles.trim_container}>
            <StatusBar backgroundColor="#000" barStyle="dark-content" />

            <View style={styles.preview_heading}>
                <Text style={styles.edit_clips}>Trim & Crop</Text>
            </View>
            <TouchableOpacity onPress={()=>this.backRecodring(this)} style={styles.back_camera_touch}>
                <IconF name="angle-left" style={[styles.camer_back_icons,styles.camer_back_icons2]}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.trimVideo(this)} style={styles.upload_camera_touch}>
                <IconE name="plus" style={styles.camer_back_icons}/>
                <Text style={[styles.heading_cancel_pre,styles.heading_cancel2]}>Add</Text>
            </TouchableOpacity>

                <Text style={styles.selec_duration_text}>Selected duration : {this.state.getSelection.toFixed(2)}</Text>
                <View style={styles.trim_videoPlayer}>
                    <TouchableWithoutFeedback style={styles.videoPlayer_main} onPress={this.playerOnPress.bind(this)}>
                        <VideoPlayer
                            ref={ref => this.videoPlayerRef = ref}
                            startTime={this.state.startTime}
                            endTime={this.state.endTime}
                            play={this.state.play}
                            replay={true} 
                            volume={.5}
                            playerWidth={screen.width}
                            rotate={this.state.rotate}
                            source={this.state.video_src}
                            style={this.state.playerStyle}
                            resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
                            onChange={({ nativeEvent }) =>  this.setState({currentTime:nativeEvent.currentTime},()=>this.onChnageEvenet()) } // get Current time on every second
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={[styles.player_trim]}>
                    {this.renderTrimBox()}
                </View>
                {this.renderLoading()}
          </View>

          
        );
    }

}


//export 
export default Trim;