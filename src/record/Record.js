//import
import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View, Animated, StatusBar, TouchableOpacity, DeviceEventEmitter, TouchableWithoutFeedback, Image, NativeModules, NativeEventEmitter, Alert, Slider } from 'react-native';
import {Actions} from 'react-native-router-flux';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFE from 'react-native-vector-icons/Entypo';
import IconFI from 'react-native-vector-icons/Ionicons';

//import Recorder from 'react-native-screcorder';
import Dimensions from 'Dimensions';
var screen = Dimensions.get('window');
import ModalSelector from './../common/ModalSelector';
var ImagePicker = require('react-native-image-picker');
import styles from './../style';
import Camera from 'react-native-camera';

var hPresss=[];
import TimerMixin from 'react-timer-mixin';
import { ProcessingManager } from 'react-native-video-processing';

import RNVideoEditor from 'react-native-video-editor';

var recordPress=false; var getBarWidth=0;
//create component
class Record extends Component {
    constructor(props) {
        super(props);
        this.camera = null;

        this.state = {
          sliderMin: 0,
          sliderMax: 1,
          recording: false,
          currentDuration: 0,
          previousDuration:0,
          maxDuration: 7000,
          limitReached: false,
          nbSegments: 0,
          mySegments:[],
          camera: {
            aspect: 'fill',
            captureTarget: Camera.constants.CaptureTarget.temp,
            type: Camera.constants.Type.back,
            orientation:'portrait',
            flashMode: Camera.constants.FlashMode.auto,
            captureQuality: 'high',
            playSoundOnCapture:false
          },
        };

        this.progressbar = this.progressbar.bind(this);
    }


    componentWillMount(){
      StatusBar.setBarStyle('light-content', true);
      if(this.props.segments){
        this.reRenderSegments(this.props.segments);
      }
      DeviceEventEmitter.addListener('dsRecorderEvent', this.progressbar);
    }


    componentWillUnMount() {
      DeviceEventEmitter.removeListener('dsRecorderEvent', this.progressbar);
    }

    progressbar(addDuration: Event) {
        //console.log(addDuration);

        if(addDuration < 199){
          addDuration=200;
        }
        var duration=Number(this.state.previousDuration)+Number(addDuration);
        var getWidth = (screen.width/this.state.maxDuration)*duration;
        getBarWidth=getWidth; this.setState({currentDuration:duration});
    }

    record(){ var thisClass=this;
    if (thisClass.state.limitReached) return;
    
    if (thisClass.camera) {
        thisClass.setState({recording: true});  
        //console.log('come to record');
        

        thisClass.progressbar(200);

        if(thisClass.state.currentDuration <= thisClass.state.maxDuration){
          var totalSeconds=thisClass.state.maxDuration - thisClass.state.currentDuration;

          thisClass.camera.capture({mode: Camera.constants.CaptureMode.video,totalSeconds:totalSeconds})
          .then((data) =>{
            var getSegmentId=thisClass.randomString();
            var newSegment={};
            newSegment.segmentId=getSegmentId;
            newSegment.url=data.url;
            newSegment.duration=data.duration;
            newSegment.thumbnail=null;

            var mySegments = thisClass.state.mySegments;
            if(newSegment.sound){}else{newSegment.sound='no';}
            mySegments.push(newSegment);

            var previousDuration=thisClass.state.previousDuration+data.duration;
            thisClass.setState({mySegments:mySegments,previousDuration:previousDuration});
            thisClass.createThumbnails(data.url,getSegmentId);

          }).catch(err => console.error(err));


        }


    }
  }



  pause() {
    recordPress=false;
    if (!this.state.recording) return;
    this.setState({recording: false});

    this.camera.stopCapture();
    this.setState({nbSegments: ++this.state.nbSegments});
  }



  randomString() {var text = ""; var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; for (var i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length)); return text; }
  

  recordPress(){
    recordPress=true; this.record();
  }

  recordPressCamera(evt){
        recordPress=true;
        var geString=this.randomString();
        hPresss.push(geString);
        var thisClass=this;
        TimerMixin.setTimeout(function(){
          if(hPresss.length==2){
            thisClass.setDevice();
          }else if(hPresss.length==1){
            if(recordPress==true){thisClass.record();}
          }
          hPresss=[];
        }, 300);
    }
    

  pauseCamera() {
    this.pause();
  }

  createThumbnails(videoPath,segmentId){
      if(videoPath && segmentId){
          var thisClass=this;
          const maximumSize = { width: 1080, height: 1080 };
          ProcessingManager.getPreviewForSecond(videoPath,0,maximumSize,'JPEG')
          .then((data) =>{
              if(data.uri){
                var definNew=[];
                var currentSehments=thisClass.state.mySegments;
                for(index in currentSehments){
                    var getOwn = currentSehments[index];
                    if(getOwn.segmentId==segmentId){
                      getOwn.thumbnail=data.uri;
                    }
                    definNew.push(getOwn);
                }
                thisClass.setState({mySegments:definNew});
              }
          });
      }
      
  }



  renderBar() {
    return (
      <View style={styles.barWrapper}>
        <View style={[styles.barGauge,{width:getBarWidth}]}></View>
      </View>
    );
  }



  renderDuration(){
    var currentTime = (this.state.currentDuration/1000).toFixed(2);
    if(6.95 < currentTime){
      return '7.00';
    }else{
      return currentTime;
    }
  }

  onRecordDone() {
    this.setState({nbSegments: 0});
  }

  resetBarAnimation(){ getBarWidth=0; }

  resetAction(key){
    if(key=='reset_all'){ this.reset(); }else{
      var allSegmnets=this.state.mySegments;
      
      if(allSegmnets.length==1){ this.reset(); }
      if(allSegmnets.length > 1){
        var lastIndex = allSegmnets.length - 1;
        var newmySegments=[];
        for(ind in allSegmnets){
          if(ind==lastIndex){}else{
            var getSeg = allSegmnets[ind];
            newmySegments.push(getSeg);
          }
        }
        this.reRenderSegments(newmySegments);
      }
    }
  }


  reRenderSegments(getSegments){
        this.reset();
        var thisClass=this;
        setTimeout(function(){
          if(getSegments.length>0){
            for (index in getSegments) {
              thisClass.onNewSegment2(getSegments[index]);
            }
          }

          var current_duration = thisClass.state.currentDuration;
          var getWidth = (screen.width/thisClass.state.maxDuration)*current_duration;
          getBarWidth=getWidth;

          thisClass.setState({nbSegments:getSegments.length});
          if(current_duration >= thisClass.state.maxDuration){
              thisClass.setState({limitReached:true});
          }
        },200);
  }

  onNewSegment2(segment) {
    this.state.currentDuration += segment.duration;
    this.setState({currentDuration:this.state.currentDuration,previousDuration:this.state.currentDuration});

    //segments data
    var mySegments = this.state.mySegments;
    if(segment.sound){}else{segment.sound='no';}
    mySegments.push(segment);
    this.setState({mySegments:mySegments});
  }

  reset() {
    this.pause();
    this.hideFlash();
    this.resetBarAnimation();
    this.setState({
      recording: false,
      nbSegments: 0,
      currentDuration: 0,
      previousDuration:0,
      limitReached: false,
      mySegments:[]
    });
  }

  setDevice() {
    if (this.camera) {
      let newType; const { back, front } = Camera.constants.Type; if (this.state.camera.type === back) {newType = front; 
      } else if (this.state.camera.type === front) {newType = back; } this.setState({camera: {...this.state.camera, type: newType, }, }); 
    }
  }
  hideFlash(){const { auto, on, off } = Camera.constants.FlashMode; this.setState({camera: {...this.state.camera, flashMode: off, }, }); }
  toggleFlash() {let newFlashMode; const { auto, on, off } = Camera.constants.FlashMode; if (this.state.camera.flashMode === auto) {newFlashMode = on; } else if (this.state.camera.flashMode === on) {newFlashMode = off; } else if (this.state.camera.flashMode === off) {newFlashMode = auto; } this.setState({camera: {...this.state.camera, flashMode: newFlashMode, }, }); }


  libray(e){
    var options = {title: 'Select Video', mediaType:'video'};
    var limitSecond= this.state.maxDuration - this.state.currentDuration;
    limitSecond= (limitSecond/1000).toFixed(2);
    ImagePicker.launchImageLibrary(options, (response)  => {
        if(response.path){
          if(response.duration && response.duration > 999){
            Actions.trim({video_src:response.path, segments:this.state.mySegments, limitSecond:limitSecond, duration:response.duration});
          }else{
            Alert.alert('Warning!','Select a video with minimum duration 1 second!');
          }
        }
    });
  }




  cameraCross(key){this.reset();if(key=='back_app'){Actions.home();  } }
  video_previw() {
    var thisClass = this;
    setTimeout(function(){
      var allSegmnets=thisClass.state.mySegments;
      if(allSegmnets.length > 0){
        Actions.preview({segments:allSegmnets});
      }else{
        Alert.alert( 'Warning!', 'You did not capture any clips.');
      }
    },500);
  }

  upload(e){
    this.hideFlash(); this.preview();
  }

  renderFlash(){
    const { back, front } = Camera.constants.Type;
    if (this.state.camera.type === back) {
      return(
          <View style={styles.extra_conteols_single}>
              <TouchableOpacity onPressIn={this.toggleFlash.bind(this)} style={styles.single_control}>
                  <IconFI name="ios-flash" style={[styles.camre_controls_flash]}/>
              </TouchableOpacity>
          </View>
      );
    }
  }

  render(){
        const data = [
            { key: 'reset_camera', label: 'Reset Camera' },
            { key: 'back_app', label: 'Back to App' }
        ];

        const data2 = [
            { key: 'reset_last', label: 'Reset Last Segment' },
            { key: 'reset_all', label: 'Reset all Segments' }
        ];


        var bar     = this.renderBar();
        var flash, control = null; 


        if (!this.state.limitReached) {
          if(this.state.recording){
                control = (
                  <Image style={styles.recoding_icons} source={require('./../images/recording_s2.png')}/>
                );
          }else{
                control = (
                  <Image style={styles.recoding_icons} source={require('./../images/recording_s1.png')}/>
                );
          }
        }


        return(
            <View style={styles.ds_container_player}>   
              <StatusBar backgroundColor="#000" barStyle="dark-content" />

              <View style={styles.conteols_area}>
                  <View style={styles.conteols_cnacle}>
                      <ModalSelector data={data}
                      onChange={(option)=>{ this.cameraCross(option.key); }}>
                          <TouchableOpacity>
                              <IconFE name="cross" style={[styles.conteols_camerabcak_cion]}/>
                          </TouchableOpacity>
                      </ModalSelector>
                  </View>
                  <View style={styles.conteols_upload}>
                      <TouchableOpacity onPressIn={()=>this.video_previw()}>
                          <IconF name="angle-double-right" style={[styles.conteols_camerabcak_cion, styles.conteols_camerabcak_cion2]}/>
                      </TouchableOpacity>
                  </View>
              </View>

              <View style={styles.segments_steps}>
                  <TouchableOpacity onPress={()=>this.video_previw()}>{bar}</TouchableOpacity>
              </View>


              <View style={styles.player_area_main}>
                  <Camera
                    ref={(cam) => {
                      this.camera = cam;
                    }}
                    style={styles.preview}
                    aspect={this.state.camera.aspect}
                    captureTarget={this.state.camera.captureTarget}
                    type={this.state.camera.type}
                    flashMode={this.state.camera.flashMode}
                    orientation={this.state.camera.orientation}
                    playSoundOnCapture={this.state.camera.playSoundOnCapture}
                    defaultTouchToFocus
                  />
                  <TouchableOpacity style={styles.extrarecording} onPressIn={(evt) => this.recordPressCamera(evt) }  onPressOut={this.pauseCamera.bind(this)} ></TouchableOpacity>
              </View>

              
              <View style={styles.duration_row}>
                  <View style={styles.duration_row_area}>
                      <IconFI name="md-time" style={[styles.clock_icon]}/>
                      <Text style={styles.click_text}>{this.renderDuration()}</Text>
                  </View>
              </View>

              <View style={styles.conteols_main_div}>
                  <TouchableOpacity onPressIn={()=>this.recordPress()}  onPressOut={()=>this.pause()} style={styles.main_record_btn}>
                      {control}
                  </TouchableOpacity>
              </View>


              <View style={styles.extra_conteols}>
                    <View style={styles.extra_conteols_area}>
                        <View style={styles.extra_conteols_single}>
                            <TouchableOpacity onPressIn={this.setDevice.bind(this)} style={styles.single_control}>
                                <IconFI name="ios-reverse-camera-outline" style={[styles.camre_controls_flash]}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.extra_conteols_single}>
                            <ModalSelector data={data2}
                              onChange={(option)=>{ this.resetAction(option.key); }}>
                                <TouchableOpacity  style={styles.single_control}>
                                    <IconFI name="md-refresh" style={[styles.camre_controls, styles.camre_controls2]}/>
                                </TouchableOpacity>
                            </ModalSelector>
                        </View>
                        {this.renderFlash()}
                        <View style={styles.extra_conteols_single}>
                            <TouchableOpacity onPressIn={this.libray.bind(this)} style={styles.single_control}>
                                <IconF name="file-video-o" style={[styles.camre_controls,styles.camre_controls34]}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

}

//export
export default Record;