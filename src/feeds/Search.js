//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Keyboard, AsyncStorage, ScrollView,StatusBar, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';

import Menu from './../common/Menu';
import styles from './../style';

import SpinnerBig from './../common/SpinnerBig';
import axios from 'axios';
import Listing from './Listing'
import Spinner from './../common/Spinner';
import {appEngine,gStorage} from './../common/Config';
import VideoCard from './VideoCard';
import IconFE from 'react-native-vector-icons/EvilIcons';
import IconFF from 'react-native-vector-icons/Feather';

import {db}  from './../db/DbConfig';
//create componet
class Search extends Component{
    constructor(props) {
        super(props);
        if(this.props.selectTab){
            var selectTab=this.props.selectTab;
        }else{
            var selectTab='top';
        }

        this.state = {
            username:'',
            pageLoading:false, 
            
            alltopdata:[],  
            allcreators:[], 
            alltags:[],
            alllocations:[],

            maincreators:[], 
            maintags:[],
            mainlocations:[],

            topdata:[],  
            creators:[], 
            tags:[],
            locations:[],

            isRunning:false,
            selectTab:selectTab,
            query:this.props.query,
            isEndedT:false,
            isEndedP:false,
            isEndedTa:false,
            isEndedL:false,
            pageT:1,
            pageP:1,
            pageTa:1,
            pageL:1,
            wPage:1,
            isCheck:false,
        }
    }

    componentWillMount(){
        StatusBar.setHidden(false); 
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ this.setState({username:username}); }else{ Actions.signin(); }
            this.loadData(1);
        });
    }


    loadData(page){ var thisClass=this;
        var shouldTake=page*5000;
        db.child('users').orderByChild('subscribers').limitToLast(shouldTake).once('value',snap=>{
            if(snap.val()){
                var creators=[];
                snap.forEach(function(user) {
                    var userObject=user.val();userObject.userId=user.key;
                    creators.push(userObject);
                });
                creators.sort(function(a,b) {
                  return b.videos - a.videos;
                });
                thisClass.setState({allcreators:creators,maincreators:creators});
            }
            db.child('tags').orderByChild('videos').limitToLast(shouldTake).once('value',snap2=>{
                if(snap2.val()){
                    var tags=[];
                    snap2.forEach(function(tag) {
                        var tagObject=tag.val();tagObject.tagId=tag.key;
                        tags.push(tagObject);
                    });
                    tags.sort(function(a,b) {
                      return b.videos - a.videos;
                    });
                    thisClass.setState({alltags:tags,maintags:tags});
                }
                db.child('locations').orderByChild('videos').limitToLast(shouldTake).once('value',snap3=>{
                    if(snap3.val()){
                        var locations=[];
                        snap3.forEach(function(location) {
                            var locationObject=location.val(); locationObject.locationId=location.key;
                            locations.push(locationObject);
                        });
                        locations.sort(function(a,b) {
                          return b.videos - a.videos;
                        });
                        thisClass.setState({alllocations:locations,isCheck:true,mainlocations:locations});
                        var items=['top','creators','tags','locations'];
                        thisClass.renderAllContents(1,items);
                    }
                });


            });

        });  
    }


    renderAllContents(page,items){ var thisClass=this;
        if(thisClass.state.isCheck){
            var allcreators=thisClass.state.allcreators;
            var alltags=thisClass.state.alltags;
            var alllocations=thisClass.state.alllocations;
            var alltopdata=(allcreators).concat(alltags,alllocations);
            alltopdata.sort(function(a,b) {
              return b.videos - a.videos;
            });
            var shouldTake=parseInt(page*20);


            if(items.indexOf('top')>=0 && alltopdata){
                var topdata=alltopdata.slice(0, shouldTake);
                thisClass.setState({topdata:topdata,closeToBottom:false});
                if(alltopdata.length < shouldTake){
                    thisClass.setState({isEndedT:true});
                }
            }
            
            if(items.indexOf('creators')>=0 && allcreators){
                var creators=allcreators.slice(0, shouldTake);
                thisClass.setState({creators:creators,closeToBottom:false}); 
                if(allcreators.length < shouldTake){
                    thisClass.setState({isEndedP:true});
                }
            }

            if(items.indexOf('tags')>=0 && alltags){
                var tags=alltags.slice(0, shouldTake);
                thisClass.setState({tags:tags,closeToBottom:false}); 
                if(alltags.length < shouldTake){
                    thisClass.setState({isEndedTa:true});
                }
            }

            if(items.indexOf('locations')>=0 && alllocations){
                var locations=alllocations.slice(0, shouldTake);
                thisClass.setState({locations:locations,closeToBottom:false});
                if(alllocations.length < shouldTake){
                    thisClass.setState({isEndedL:true});
                }
            }

            
        }
    }


    searchSubmit(query){ var thisClass=this;
        thisClass.setState({query:query});
        if(query){
            var query=((query).trim()).toString();
            
            var allcreators=thisClass.state.maincreators; var newCreators=[];
            if(allcreators.length > 0){
                for(index in allcreators){
                    var getNow=allcreators[index];
                    var getName=(getNow.name).toLowerCase();
                    if((getName).indexOf(query)>=0){
                        newCreators.push(getNow);
                    }else if((getNow.username).indexOf(query)>=0){
                        newCreators.push(getNow);
                    }
                }
            }

            var alltags=thisClass.state.maintags; var newTags=[];
            if(alltags.length > 0){
                for(index in alltags){
                    var getNow=alltags[index];
                    var getTags=(getNow.tags).toLowerCase();
                    if((getTags).indexOf(query)>=0){
                        newTags.push(getNow);
                    }
                }
            }

            var alllocations=thisClass.state.mainlocations; var newLocations=[];
            if(alllocations.length > 0){
                for(index in alllocations){
                    var getNow=alllocations[index];
                    var getLocations=(getNow.locations).toLowerCase();
                    if((getLocations).indexOf(query)>=0){
                        newLocations.push(getNow);
                    }
                }
            }
            thisClass.setState({alllocations:newLocations,allcreators:newCreators,alltags:newTags},()=>{
                var items=['top','creators','tags','locations'];
                thisClass.renderAllContents(1,items);
            });

            
        }else{
            var allcreators=thisClass.state.maincreators; var alllocations=thisClass.state.mainlocations;var alltags=thisClass.state.maintags;
            thisClass.setState({allcreators:allcreators,alllocations:alllocations,alltags:alltags});
        }
    }

    renderLoading(){if(this.state.pageLoading){return <SpinnerBig/>; } }

    getScrollViewSize(event) {const {x, y, width, height} = event.nativeEvent.layout; this.setState({scrollViewY: y, scrollViewHeight: height });}
    handleScroll(nativeEvent) {
        this.setState({offsetY: nativeEvent.contentOffset.y});
        if (isCloseToBottom(nativeEvent)) {this.enableSomeButton(); }
    }
    getCenter() {
        const y = this.state.offsetY - this.state.scrollViewY;
        return y + (this.state.scrollViewHeight / 2)
    }
    getDisplaySize(index) {
        return (event) => {
            const {y,height } = event.nativeEvent.layout;
            let payload = {};
            payload["item" + index] = {index,y,height};
            this.setState(payload);
        }
    }
    whetherIsFocused(size, margin) {
        let distance;
        distance = Math.abs((size.y + size.height / 2) - this.getCenter());
        return distance < margin;
    }
    renderCloseLoading(){
        if(this.state.closeToBottom){
            return(
                <View style={styles.closeto_bottom}><Spinner size={'small'}/></View>
            );
        }
    }
    enableSomeButton(){
        
        if(this.state.selectTab=='top'){
            if(this.state.isEndedT==false && this.state.closeToBottom==false){
                var getPage = this.state.pageT + 1;
                this.setState({closeToBottom:true, pageT : getPage});
                this.renderAllContents(getPage,['top']);
            } 
        }else if(this.state.selectTab=='people'){
            if(this.state.isEndedP==false && this.state.closeToBottom==false){
                var getPage = this.state.pageP + 1;
                this.setState({closeToBottom:true, pageP : getPage});
                this.renderAllContents(getPage,['creators']);
            } 
        }else if(this.state.selectTab=='tags'){
            if(this.state.isEndedTa==false && this.state.closeToBottom==false){
                var getPage = this.state.pageTa + 1;
                this.setState({closeToBottom:true, pageTa : getPage});
                this.renderAllContents(getPage,['tags']);
            } 
        }else if(this.state.selectTab=='locations'){
            if(this.state.isEndedL==false && this.state.closeToBottom==false){
                var getPage = this.state.pageL + 1;
                this.setState({closeToBottom:true, pageL : getPage});
                this.renderAllContents(getPage,['locations']);
            } 
        }
        
    }


    renderContents(){
        if(this.state.selectTab=='top'){
            return this.renderTopCreators();
        }else if(this.state.selectTab=='people'){
            return this.renderCreators();
        }else if(this.state.selectTab=='tags'){
            return this.renderTags();
        }else if(this.state.selectTab=='locations'){
            return this.renderLocations();
        }
    }



    renderTopCreators(){
        var thisClass= this;
        if(this.state.topdata.length==0 && this.state.isCheck==true){
            return(
                <View style={styles.not_found_single}><Text style={styles.not_found_single_txt}>Nothing found!</Text></View>
            );
        }else{
            return this.state.topdata.map(function(creator, i){
                if(creator.tagId){
                    var tag=creator;
                    return(
                        <TouchableOpacity key={i} style={[styles.single_creator_area,styles.single_creator_area2]} onPress={()=>Actions.query({tags:tag.tags})}>
                            <View style={styles.ds_style_hash}><IconFF name="hash" style={styles.hash_icons}/></View>
                            <Text style={[styles.single_serach_tag,styles.single_serach_tag2]}>{tag.tags}</Text>
                        </TouchableOpacity>
                    );
                }else if(creator.locationId){
                    var location=creator;
                    return(
                        <TouchableOpacity key={i} style={[styles.single_creator_area,styles.single_creator_area2]} onPress={()=>Actions.query({locations:location.locations})}>
                            <View style={styles.ds_style_hash}><IconFE name="location" style={styles.locations_icons}/></View>
                            <Text style={[styles.single_serach_tag,styles.single_serach_tag2]}>{location.locations}</Text>
                        </TouchableOpacity>
                    );
                }else{
                    var userImage = gStorage+'/profile_thumbs/'+creator.profilePic;     
                    var follwongText=null;
                    if(creator.isFollowed=='yes'){
                        follwongText=<Text>. Following</Text>;
                    }   
                    return(
                        <TouchableOpacity key={i} style={styles.single_creator_new} onPress={()=>Actions.profile({username:creator.username})}>
                            <View style={styles.single_creator_area}>
                                <View style={styles.single_creator_area_left}>
                                    <Image style={[styles.single_creator_img,styles.single_creator_img2]} source={{uri : userImage }}/>
                                </View>
                                <View style={styles.single_creator_area_right}>
                                    <Text style={styles.single_creator_txt_2}>@{creator.username}</Text>
                                    <Text style={styles.single_creator_txt_23}>{creator.name} {follwongText}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }
            });
        }
    }

    renderCreators(){
        var thisClass= this;
        if(this.state.creators.length==0 && this.state.isCheck==true){
            return(
                <View style={styles.not_found_single}><Text style={styles.not_found_single_txt}>Nothing found!</Text></View>
            );
        }else{
            return this.state.creators.map(function(creator, i){
                var userImage = gStorage+'/profile_thumbs/'+creator.profilePic; 
                var follwongText=null;
                if(creator.isFollowed=='yes'){
                    follwongText=<Text>. Following</Text>;
                } 

                return(
                    <TouchableOpacity key={i} style={styles.single_creator_new} onPress={()=>Actions.profile({username:creator.username})}>
                        <View style={styles.single_creator_area}>
                            <View style={styles.single_creator_area_left}>
                                <Image style={[styles.single_creator_img,styles.single_creator_img2]} source={{uri : userImage }}/>
                            </View>
                            <View style={styles.single_creator_area_right}>
                                <Text style={styles.single_creator_txt_2}>@{creator.username}</Text>
                                <Text style={styles.single_creator_txt_23}>{creator.name} {follwongText}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
    }


    renderTags(){
        var thisClass= this;
        if(this.state.tags.length==0 && this.state.isCheck==true){
            return(
                <View style={styles.not_found_single}><Text style={styles.not_found_single_txt}>Nothing found!</Text></View>
            );
        }else{
            return this.state.tags.map(function(tag, i){     
                return(
                    <TouchableOpacity key={i} style={[styles.single_creator_area,styles.single_creator_area2]} onPress={()=>Actions.query({tags:tag.tags})}>
                        <View style={styles.ds_style_hash}><IconFF name="hash" style={styles.hash_icons}/></View>
                        <Text style={[styles.single_serach_tag,styles.single_serach_tag2]}>{tag.tags}</Text>
                    </TouchableOpacity>
                );
            });
        }
    }

    renderLocations(){
        var thisClass= this;
        if(this.state.locations.length==0 && this.state.isCheck==true){
            return(
                <View style={styles.not_found_single}><Text style={styles.not_found_single_txt}>Nothing found!</Text></View>
            );
        }else{
            return this.state.locations.map(function(location, i){     
                return(
                    <TouchableOpacity key={i} style={[styles.single_creator_area,styles.single_creator_area2]} onPress={()=>Actions.query({locations:location.locations})}>
                        <View style={styles.ds_style_hash}><IconFE name="location" style={styles.locations_icons}/></View>
                        <Text style={[styles.single_serach_tag,styles.single_serach_tag2]}>{location.locations}</Text>
                    </TouchableOpacity>
                );
            });
        }
    }

    rendertabs(tabName){
        this.setState({selectTab:tabName});
    }


    clearSearch(){ Keyboard.dismiss(); var thisClass=this;
        this.setState({query:''});
        var allcreators=thisClass.state.maincreators; var alllocations=thisClass.state.mainlocations;var alltags=thisClass.state.maintags;
        thisClass.setState({allcreators:allcreators,alllocations:alllocations,alltags:alltags});
    }

    renderSearchBox(){
        if(this.props.fromExplore){
            return(
                <TextInput underlineColorAndroid='transparent' autoFocus autoCapitalize = 'none' 
                    placeholderTextColor="#b3b3b3" style={[styles.search_form_row]} value={this.state.query} placeholder="search..." autoCorrect={false} onChangeText={query=>this.searchSubmit(query)}/>
            );
        }else{
            return(
                <TextInput underlineColorAndroid='transparent'  autoCapitalize = 'none' 
                    placeholderTextColor="#b3b3b3" style={[styles.search_form_row]} value={this.state.query} placeholder="search..." autoCorrect={false} onChangeText={query=>this.searchSubmit(query)}/>
            );
        }
    }

    render(){
        var fbClass, twClass, conClass, sugClass; 
        var fbClass1, twClass1, conClass1, sugClass1; 
        fbClass=twClass=conClass=sugClass=[styles.invite_heading_bottom_single];
        fbClass1=twClass1=conClass1=sugClass1=[styles.invite_heading_bottom_txt];
        if(this.state.selectTab=='top'){
            fbClass=[styles.invite_heading_bottom_single,styles.invite_heading_bottom_single_active];
            fbClass1=[styles.invite_heading_bottom_txt,styles.invite_heading_bottom_txt_active];
        }else if(this.state.selectTab=='people'){
            twClass=[styles.invite_heading_bottom_single,styles.invite_heading_bottom_single_active];
            twClass1=[styles.invite_heading_bottom_txt,styles.invite_heading_bottom_txt_active];
        }else if(this.state.selectTab=='tags'){
            conClass=[styles.invite_heading_bottom_single,styles.invite_heading_bottom_single_active];
            conClass1=[styles.invite_heading_bottom_txt,styles.invite_heading_bottom_txt_active];
        }else if(this.state.selectTab=='locations'){
            sugClass=[styles.invite_heading_bottom_single,styles.invite_heading_bottom_single_active];
            sugClass1=[styles.invite_heading_bottom_txt,styles.invite_heading_bottom_txt_active];
        }

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#fafafa" barStyle="dark-content" />
                <View style={styles.invite_heading}>
                    
                    <View style={[styles.invite_heading_top,styles.invite_heading_top2]}>
                        <View style={styles.invite_heading_top_left}>
                            <IconFE name="search" style={[styles.search_cions]}/> 
                            {this.renderSearchBox()}
                            <TouchableOpacity  onPress={()=>this.clearSearch()} style={styles.clear_serach_txt34}><Text style={styles.clear_serach_txt34_txt}>x</Text></TouchableOpacity>
                        </View>
                        <View style={styles.invite_heading_top_right}>
                            <TouchableOpacity  onPress={()=>Actions.explore()} style={[styles.clear_serach, styles.clear_serach34]}>
                                <Text style={styles.clear_serach_txt_main}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.invite_heading_bottom}>
                        <TouchableOpacity onPress={()=>this.rendertabs('top')}  style={fbClass}>
                            <Text style={fbClass1}>TOP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>this.rendertabs('people')} style={twClass}>
                            <Text style={twClass1}>PEOPLE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>this.rendertabs('tags')} style={conClass}>
                            <Text style={conClass1}>TAGS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>this.rendertabs('locations')} style={sugClass}>
                            <Text style={sugClass1}>LOCATIONS</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <ScrollView onScroll={({nativeEvent}) =>this.handleScroll(nativeEvent)} onLayout={this.getScrollViewSize.bind(this)} scrollEventThrottle={2000} style={styles.search_scroll}>
                    {this.renderContents()}
                    {this.renderCloseLoading()}
                </ScrollView>
                {this.renderLoading()}
                <Menu activeMenu="search"/>
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
export default Search;
