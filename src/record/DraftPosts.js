//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';

import SpinnerBig from './../common/SpinnerBig';
import styles from './../style';

import Menu from './../common/Menu';
import {Actions} from 'react-native-router-flux';
import IconF from 'react-native-vector-icons/FontAwesome';
import Spinner from './../common/Spinner';
import axios from 'axios';


import {appEngine,gStorage} from './../common/Config';


console.disableYellowBox = true;
//create componet
class DraftPosts extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            pageLoading:false,
            videos:[],
            page:1,
            isEnded:false,
            isCheck:false,
            closeToBottom:false
        };
    }

    async saveItem(item, selectedValue) {try {await AsyncStorage.setItem(item, selectedValue); } catch (error) {  } }

    componentWillMount(){
      StatusBar.setHidden(false); StatusBar.setBarStyle('dark-content', true);
      var thisClass=this;
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ 
                this.setState({ username:username}); 
                thisClass.loadVideos(1);
            }else{ Actions.signin(); }
            
        });
    }

    renderLoading(){
        if(this.state.pageLoading){
            return <SpinnerBig/>;
        }
    }

    loadVideos(page){ var thisClass=this;
        var shouldTake=page*10;
        AsyncStorage.getItem('videos').then((videos) => { 
            if(videos){ var videos=JSON.parse(videos);
                var myVideos=[];
                if(videos.length>0){
                    for(ind in videos){
                        var getNow=videos[ind];
                        if(getNow.username==thisClass.state.username){myVideos.push(getNow)}
                    }
                }
                var getVideos = myVideos.slice(0, shouldTake);
                thisClass.setState({videos:getVideos, closeToBottom:false});
                if(videos.length<shouldTake){
                    thisClass.setState({isEnded:true});
                }
            }
            thisClass.setState({isCheck:true});
        });
    }

    handleScroll(nativeEvent) {
        if (isCloseToBottom(nativeEvent)) {this.enableSomeButton(); }
    }

    enableSomeButton(){
        if(this.state.isEnded==false && this.state.closeToBottom==false){
            var getPage = this.state.page + 1;
            this.setState({closeToBottom:true, page : getPage});
            this.loadVideos(getPage);
        } 
    }


    deleteVideo(video){
        var thisClass = this;
        Alert.alert( 'Confirmation', 'Want to delete video?', 
            [ 
                {text: 'Cancel', onPress: () => console.log('cancel') , style: 'cancel'},
                {text: 'Delete', onPress: () => thisClass.deleteVideoF(video) },
            ], 
            { cancelable: false } 
        );
    }

    deleteVideoF(video){ var thisClass=this;
        AsyncStorage.getItem('videos').then((videos) => {
            if(videos){ 
                var newVideos=JSON.parse(videos);
                var myRes=[];
                if(newVideos.length>0){
                    for(index in newVideos){
                        var getNow=newVideos[index];
                        if(getNow.created_at==video.created_at){}else{
                            myRes.push(getNow);
                        }
                    }
                }
                thisClass.saveItem('videos',JSON.stringify(myRes));
                var shouldTake=Number(thisClass.state.page)*10;
                var getVideos = myRes.slice(0, shouldTake); thisClass.setState({videos:getVideos});
            }
        });
    }

    updateVideos(videoId){
        var getVideos=this.state.videos;
        var neVideos=[];
        for(index in getVideos){
            var getSingle = getVideos[index];
            if(getSingle.videoId!=videoId){
                neVideos.push(getSingle);
            }
        }

        this.setState({videos:neVideos});
    }

    renderTagTitle(tags){
        if(tags){
            if(tags.length > 20){
                return tags.substring(0,20)+'..';
            }else{
                return tags;
            }
        }
        
    }

    renderVideos(){
        var thisClass= this;
        if(this.state.isCheck && this.state.videos.length==0){
            return(
                <View style={styles.not_found_single}><Text style={styles.not_found_single_txt}>No draft post!</Text></View>
            );
        }else{
            return this.state.videos.map(function(video, i){
                var thumbnailUrl=null;
                if(video.thumbnails && video.thumbnails.length > 0){
                    for(index in video.thumbnails){
                        var getNow=video.thumbnails[index];
                        if(index==Number(video.thumbnail)){
                            thumbnailUrl=getNow;
                        }
                    }
                }
                var created_at=new Date(video.created_at).toDateString();
                return(
                    <View key={i} style={styles.draft_single}>
                        <View style={styles.draft_single_thumbnail}>
                            <Image style={styles.draft_thumbnail} source={{uri : thumbnailUrl }}/>
                        </View>
                        <View style={styles.draft_single_data}>
                            <Text style={styles.draft_title}>{thisClass.renderTagTitle(video.tags)}</Text>
                            <Text style={styles.draft_cat}>{video.category}</Text>
                            <Text style={styles.draft_cat}>{video.updated_at}</Text>
                        </View>
                        <View style={styles.draft_single_action}>
                            <TouchableOpacity onPress={()=>Actions.updatepost({video:video})} style={styles.draft_single_action_t}>
                                <IconF name="edit" style={[styles.vector_edit,styles.vector_edit2]}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>thisClass.deleteVideo(video)} style={styles.draft_single_action_t}>
                                <IconF name="trash-o" style={[styles.vector_edit]}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            });
        }
    }

    renderCloseLoading(){
        if(this.state.closeToBottom){
            return(
                <View style={styles.closeto_bottom}><Spinner size={'small'}/></View>
            );
        }
    }



    render(){
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.edit_profile}>
                    <View style={styles.reg_heading}>
                        <Text style={[styles.profile_s_t]}>Draft Posts</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.heading_area_back]} onPress={()=>Actions.setting()}>
                    <IconF name="angle-left" style={[styles.back_vator]}/>   
                </TouchableOpacity>

                <ScrollView onScroll={({nativeEvent}) =>this.handleScroll(nativeEvent)} 
                scrollEventThrottle={2000}  style={styles.draftSCrioll}>
                    {this.renderVideos()}
                    {this.renderCloseLoading()}
                </ScrollView>

                {this.renderLoading()}
                <Menu/>
            </View>
        );
    }

}

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

//export to other parts
export default DraftPosts;
