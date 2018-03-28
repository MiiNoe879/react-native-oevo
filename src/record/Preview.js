//import
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Video from 'react-native-video';
import styles from './../style';
import IconF from 'react-native-vector-icons/FontAwesome';


//craete components
class Preview extends Component {
  constructor(props) {
    super(props);
    var allSegments = this.props.segments;

    this.state = {
      paused: true,
      thumbnail : allSegments[0].thumbnail,
      video : allSegments[0].url,
      //video : 'file:///data/user/0/com.oevo/cache/VID_20171203_170058764111683.mp4',
      isFull:true,
      muted:false,
      repeat:false,
      isEnd:false,
      maxDuration: 7000,
      segments:allSegments,
      selectedSegment:'',
      selectedSegmentIndex:0
    };
  }

  componentWillMount(){
    StatusBar.setBarStyle('light-content', true);
    
    var segments= this.state.segments;
    if(segments.length==1){ this.setState({selectedSegmentIndex:0}); }
  }

  goBack(e) {
    this.setState({paused: true});
    Actions.record({segments:this.state.segments});
  }

  startPlayer(){
    this.player.seek(0);
  }


  playerPress(e){
    if(this.state.paused){
      if(this.state.isEnd){ 
        if(this.state.isFull){
          this.segmentPress(0);
        }else{
          this.player.seek(0); 
        }
      }
      this.setState({paused: false});
    }else{
      this.setState({paused: true});
    }
  }

  upload(e){
    var videoData = this.state.segments
    this.setState({paused: true});
    Actions.post({segments:videoData});
  }


  changeMutedConditions(index,value){
    var newSegments=[];
    var getSegmnets = this.state.segments;
    if(getSegmnets.length>0){
      for(mIndex in getSegmnets){
        var singleSegmnt = getSegmnets[mIndex];
        if(mIndex==index){
          singleSegmnt.sound=value;
        }
        newSegments.push(singleSegmnt);
      }
    }
    this.setState({segments:newSegments});
  }

  toggleMuted(e){
    var selectedSegmentIndex= this.state.selectedSegmentIndex;
    var getSegmnets = this.state.segments;
    var selectedSegment = getSegmnets[selectedSegmentIndex];

    if(selectedSegment.sound=='yes'){
      this.setState({muted: false});
      this.changeMutedConditions(selectedSegmentIndex,'no');
    }else if(selectedSegment.sound=='no'){
      this.setState({muted: true});
      this.changeMutedConditions(selectedSegmentIndex,'yes');
    }
  }

  onEnd(){
    if(this.state.isFull){
      var totalSeg = (this.state.segments.length) - 1;
      if(this.state.selectedSegmentIndex!=totalSeg){
        var newSeg = this.state.selectedSegmentIndex+1;
        this.segmentPress(newSeg);
      }else{
        this.setState({paused: true, isEnd:true});
      }
    }else{
      this.setState({paused: true, isEnd:true});
    }
  }

  loadStart(){
    this.setState({isEnd:false});
  }

  goTrash(e){
    var segments= this.state.segments;
    var selectedSegmentIndex = this.state.selectedSegmentIndex;

    var myNewSegments = [];
    for (index in segments) {
        if(index==selectedSegmentIndex){}else{
            myNewSegments.push(segments[index]);
        }
    }

    if(myNewSegments.length==0){
      this.setState({selectedSegmentIndex:'', segments:[]},() => this.goBack());
    }else{
      this.setState({selectedSegmentIndex:0, segments:myNewSegments}, ()=>this.segmentPress(0));
    }
    
  }



  makeDuplicate(e){
    var segments= this.state.segments;
    var totalDuration = 0;
    var selectedSegmentIndex = this.state.selectedSegmentIndex;
    var myNewSegments = [];
    for (index in segments) {
        if(index==selectedSegmentIndex){
          myNewSegments.push(segments[index]);
          myNewSegments.push(segments[index]);

          totalDuration=totalDuration+segments[index].duration;
          totalDuration=totalDuration+segments[index].duration;
        }else{
            myNewSegments.push(segments[index]);
            totalDuration=totalDuration+segments[index].duration;
        }
    }

    if(totalDuration > this.state.maxDuration){
      Alert.alert( 'Warning!', 'Max Duration will cross with this segment!');
    }else{
      this.setState({segments:myNewSegments});
    }
  }

  renderMutedImage(){
    if(this.state.muted){
      return <Image style={styles.preview_options_mute_img} source={require('./../images/sounds2.png')}/>;
    }else{
      return <Image style={styles.preview_options_mute_img} source={require('./../images/sounds.png')}/>;
    }
  }

  renderPlayButton(){
    if(this.state.paused){
      return (<TouchableOpacity onPress={() => this.playerPress()} style={{backgroundColor:'transparent', position:'relative',zIndex:99}}>
           <IconF name="play" style={styles.preview_options_pay_img}/>
        </TouchableOpacity>);
    }
  }


  segmentPress(index){
    var segments= this.state.segments;
    if(segments.length>0){
      var selectedSegment=segments[index];
      if(selectedSegment.sound=='yes'){
        this.setState({muted:true});
      }else{
        this.setState({muted:false});
      }
      this.setState({selectedSegmentIndex:index, selectedSegment:selectedSegment, video:selectedSegment.url}); 
      this.startPlayer(); this.setState({paused: false});
    }
  }

  segmentPressReal(index){
    this.setState({isFull:false});
    this.segmentPress(index);
  }


  playattime(){
    this.setState({isFull:true}, ()=>this.segmentPress(0));
  }


  renderRegmnets(e){
    var segments= this.state.segments; var thisClass= this;
    return segments.map(function(segment, i){
      var imagePath=segment.thumbnail;
      //var imagePath='file:///data/user/0/com.oevo/cache/94a15571-7357-4150-ba2b-cd8ae384a96d-screenshot18493224.jpeg';
      if(i==thisClass.state.selectedSegmentIndex){
        return( <TouchableOpacity key={i} style={styles.single_segment_txt} onPress={() => thisClass.segmentPressReal(i)}>
          <Image style={[styles.single_segment_img, styles.single_segment_img_active]} source={{uri : imagePath }}/></TouchableOpacity> );
      }else{
        return( <TouchableOpacity key={i} style={styles.single_segment_txt} onPress={() => thisClass.segmentPressReal(i)}>
          <Image style={[styles.single_segment_img]} source={{uri : imagePath }}/></TouchableOpacity> );
      }
      
    });
  }


  renderActions (){
    if(this.state.isFull){}else{
      return (
        <View style={styles.preview_options}>
            <View style={styles.preview_options_1}>
              <TouchableOpacity onPress={this.makeDuplicate.bind(this)}><Image style={styles.preview_options_img2} source={require('./../images/dupliacte_icons.png')}/></TouchableOpacity>
            </View>
            <View style={styles.preview_options_1}>
              <TouchableOpacity onPress={this.toggleMuted.bind(this)}>{this.renderMutedImage()}</TouchableOpacity>
            </View>
            <View style={styles.preview_options_1}>
              <TouchableOpacity onPress={this.playattime.bind(this)}><Image style={styles.preview_options_img2} source={require('./../images/small_play.png')}/></TouchableOpacity>
            </View>
            <View style={styles.preview_options_1}>
                <TouchableOpacity onPress={this.goTrash.bind(this)}><Image style={styles.preview_options_img2} source={require('./../images/trash.png')}/></TouchableOpacity>
            </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.preview_container}>
          <StatusBar backgroundColor="#000" barStyle="dark-content" />

          <View style={styles.preview_heading}>
              <Text style={styles.edit_clips}>Edit Clips</Text>
          </View>
          <TouchableOpacity onPress={()=>this.goBack(this)} style={styles.back_camera_touch}>
            <IconF name="angle-left" style={[styles.camer_back_icons,styles.camer_back_icons2]}/>
            <Text style={[styles.heading_cancel_pre,styles.heading_cancel_pre2]}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.upload(this)} style={styles.upload_camera_touch}>
            <IconF name="cloud-upload" style={styles.camer_back_icons}/>
            <Text style={[styles.heading_cancel_pre,styles.heading_cancel2]}>Upload</Text>
          </TouchableOpacity>


          <View style={styles.preview_video}>
            <Image style={[styles.psoting_bg_image]} source={{uri : this.state.thumbnail }}/>
            <TouchableWithoutFeedback style={styles.preview} onPress={() => this.playerPress()}>
              <Video
                source={{uri: this.state.video}}
                style={styles.preview}
                ref={(ref) => {
                 this.player = ref
                }} 
                rate={1.0}
                muted={ this.state.muted}
                volume={1.0}
                resizeMode="cover"
                paused={this.state.paused}
                onEnd={this.onEnd.bind(this)}
                onLoadStart={this.loadStart.bind(this)} 
                repeat={this.state.repeat}/>
            </TouchableWithoutFeedback>
            {this.renderPlayButton()}
          </View>
          <View style={styles.preview_clips}>
            <ScrollView horizontal= {true} decelerationRate={0} snapToInterval={200}  snapToAlignment={"center"}>
              {this.renderRegmnets()} 
            </ScrollView>
          </View>
          {this.renderActions()}

      </View>
      
    );
  }
}
//export components
export default Preview;