//import libray
import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage,Keyboard, ScrollView,StatusBar, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import {Actions} from 'react-native-router-flux';

import Menu from './../common/Menu';
import styles from './../style';

import SpinnerBig from './../common/SpinnerBig';
import axios from 'axios';
import Spinner from './../common/Spinner';
import {appEngine,gStorage} from './../common/Config';
import VideoCard from './../feeds/VideoCard';
import IconF from 'react-native-vector-icons/FontAwesome';
import IconFE from 'react-native-vector-icons/EvilIcons';

import { renderCategories } from './../common/Video';
import {renderUploadsLoadings,renderLoadingPercenatge}  from './../common/Video';
import {db,firebase,getFile,getFollowing,getUsers}  from './../db/DbConfig';
import FastImage from 'react-native-fast-image';

//create componet
class Explore extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:'', query:this.props.query, pageLoading:false, 
            categories:[],
            creators:[],
            tags:[],
            isEnded:false,
            isRunning:false,
            isCheck:false,
            uploadPercentage:0,users:[],
        }
    }


    filterVideos(videos,videoId){
        for(index in videos){
            var getN=videos[index];
            if(getN.videoId==videoId){
                return getN.username;
            }
        }
    }

    componentWillMount(){ Keyboard.dismiss(); var thisClass=this;
        StatusBar.setHidden(false); 
        AsyncStorage.getItem('username').then((username) => { 
            if(username){ this.setState({username:username}); 
                renderUploadsLoadings(thisClass,username);
            }else{ Actions.signin(); }


            db.child('categories').once('value',snap=>{
                if(snap.val()){
                    var categories=[];
                    snap.forEach(function(cat) {
                        var catObject=cat.val();catObject.categoryId=cat.key;
                        categories.push(catObject);
                    }); thisClass.setState({categories:categories,isCheck:true});
                }
            });

            db.child('tags').orderByChild('videos').limitToLast(1000).once('value',snap=>{
                var now = new Date(); var last24Hours=new Date(now.getTime() - (24*1000*60*60));
                if(snap.val()){
                    var tags=[];
                    snap.forEach(function(tag) {
                        var tagObject=tag.val();tagObject.tagId=tag.key;
                        var created_at=new Date(tagObject.created_at);
                        if(created_at>last24Hours){
                            tags.push(tagObject);
                        }
                    }); 
                    tags.sort(function(a,b) {
                      return parseInt(b.videos) - parseInt(a.videos);
                    });
                    thisClass.setState({tags:tags});
                }
            });
            
            getUsers().then(snap=>{
                thisClass.setState({users:snap}); 

                db.child('views').once('value',snap=>{
                    var creators=[]; var now = new Date(); var last24Hours=new Date(now.getTime() - (168*1000*60*60));
                    snap.forEach(function(data){ var dataVal=data.val();
                        var created_at=new Date(dataVal.created_at);
                        if(created_at>last24Hours && dataVal.creator){
                            creators.push(dataVal.creator);
                        }else{
                             db.child('views').child(data.key).remove();
                        }
                    });
                    var newCreators=[];
                    if(creators.length>0){for(index in creators){ var nowCreator=creators[index]; if(newCreators.indexOf(nowCreator) != -1){}else{newCreators.push(nowCreator); } } }
                    var newCreatorsData=[];
                    if(newCreators.length>0){
                        for(index in newCreators){
                            var nowCreator2=newCreators[index];
                            var makeObject={}; makeObject.username=nowCreator2;
                            var count = creators.reduce(function(n, val) {
                                return n + (val === nowCreator2);
                            }, 0);
                            makeObject.count=count;
                            newCreatorsData.push(makeObject);
                        }
                    }
                    if(newCreatorsData.length>0){
                        newCreatorsData.sort(function(a,b) {
                          return parseInt(b.count) - parseInt(a.count);
                        });
                    }


                    var Finalcreators=[];
                    if(newCreatorsData.length>0){
                        newCreatorsData=newCreatorsData.slice(0, 10);
                        for(index in newCreatorsData){
                            var nowCreator3=newCreatorsData[index];
                            var userData=thisClass.getUserData(nowCreator3.username);
                            if(userData){Finalcreators.push(userData);}
                        }
                    }
                    thisClass.setState({creators:Finalcreators});
                });
            });

        });
    }


    getUserData(username){
        var getUsers=this.state.users;
        if(getUsers.length>0){
            for(index in getUsers){
                var getNow=getUsers[index];
                if(getNow.username==username){
                    return getNow;
                }
            }
        }
    }

    renderLoading(){if(this.state.pageLoading){return <SpinnerBig/>; } }
    
    renderCreators(){
        var thisClass= this;
        return this.state.creators.map(function(creator, i){
            var userImage = gStorage+'/profile_thumbs/'+creator.profilePic;        
            return(
                <TouchableOpacity key={i} style={styles.single_creator} onPress={()=>Actions.profile({username:creator.username})}>
                    <Image style={styles.single_creator_img} source={{uri : userImage }}/>
                </TouchableOpacity>
            );
        });
    }


    renderCategories(page){
        var thisClass= this; var allCategories=this.state.categories; allCategories=allCategories.slice(0,12);

        var getallCategories=[];
        if(page==1){
            getallCategories=allCategories.slice(0, 4);
        }else if(page==2){
            getallCategories=allCategories.slice(4, -4);
        }else if(page==3){
            getallCategories=allCategories.slice(1).slice(-4);
        }

        return getallCategories.map(function(category, i){
            //console.log(category.name);
            if(category.categoryId==1){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/talents_i.png')}/>);}
            if(category.categoryId==2){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/animals.png')}/>);}
            if(category.categoryId==3){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/commedy.png')}/>);}
            if(category.categoryId==4){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/foods.png')}/>);}
            if(category.categoryId==5){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/style_i_new.png')}/>);}
            if(category.categoryId==6){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/fitness_i.png')}/>);}
            if(category.categoryId==7){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/gaming_i_new.png')}/>);}
            if(category.categoryId==8){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/rants_i.png')}/>);}
            if(category.categoryId==9){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/sports_i.png')}/>);}
            if(category.categoryId==10){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/random_i.png')}/>);}
            if(category.categoryId==11){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/culture_icons.png')}/>);}
            if(category.categoryId==12){  var thumbnail =(<Image style={styles.single_creator_img} source={require('./../images/life_style.png')}/>);}
            return(
                <TouchableOpacity key={i} style={styles.single_category} 
                onPress={()=>{Actions.category({category:category})}}>
                    {thumbnail}
                    <Text style={[styles.single_category_txt,{marginBottom:0}]}>{category.name}</Text>
                </TouchableOpacity>
            );

        });
    }



    searchSubmit(){
        Actions.search({fromExplore:true});
    }

    renderTags(page){
        var thisClass= this; var allTags=this.state.tags; allTags=allTags.slice(0,18);

        var getallTags=[];
        if(page==1){
            getallTags=allTags.slice(0, 6);
        }else if(page==2){
            getallTags=allTags.slice(6, -6);
        }else if(page==3){
            getallTags=allTags.slice(1).slice(-6);
        }

        return getallTags.map(function(tag, i){
            return(
                <View key={i} style={styles.trending_tags_new_single}>
                    <TouchableOpacity onPress={()=>Actions.query({tags:tag.tags})}><Text style={styles.trending_tags_new_single_t}>#{tag.tags}</Text></TouchableOpacity>
                </View>
            );
        });

        
    }




    renderCreatorsHeading(){
        if(this.state.creators.length>0){
            return(
                <View style={[styles.donation_donars]}>
                    <View style={[styles.donation_donars_bottom,{borderBottomColor:'#262626'}]}></View>
                    <Text style={[styles.donation_donars_top_txt,styles.donation_donars_top_txt2]}>Top Creators</Text>
                </View>
            );
        }
    }

    renderTrendingIcons(){
        return(
            <View style={styles.new_trending_top_area_new}>
                <View style={styles.new_trending_top}>
                    <View style={[styles.new_trending_top_left]}>
                        <TouchableOpacity onPress={()=>Actions.trending()} style={styles.new_trending_top_left_tou}>
                            <Image  style={styles.new_trending_top_leftimg} source={require('./../images/trending_icons1.png')}/> 
                            <Text style={styles.new_trending_top_txt}>Trending Now</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.new_trending_top_left}>
                        <TouchableOpacity onPress={()=>Actions.onrise()} style={styles.new_trending_top_left_tou}>
                            <Image  style={styles.new_trending_top_leftimg} source={require('./../images/trending_icons.png')}/> 
                            <Text style={styles.new_trending_top_txt}>On The Rise</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.new_trending_top,styles.new_trending_top2]}>
                    <View style={[styles.new_trending_top_left]}>
                        <TouchableOpacity onPress={()=>Actions.picks()} style={styles.new_trending_top_left_tou}>
                            <Image  style={styles.new_trending_top_leftimg} source={require('./../images/picks.png')}/> 
                            <Text style={styles.new_trending_top_txt}>Editors Picks</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.new_trending_top_left}>
                        <TouchableOpacity onPress={()=>Actions.laugh()} style={styles.new_trending_top_left_tou}>
                            <Image  style={styles.new_trending_top_leftimg} source={require('./../images/laugh.png')}/> 
                            <Text style={styles.new_trending_top_txt}>Spotlight</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }


    renderLocationTitle(){
        if(this.state.tags && this.state.tags.length>0){
            return(
                <View style={styles.trending_tags_new_h}>
                    <Text style={styles.trending_tags_new_ht}>Trending</Text>
                </View>
            );
        }
    }

    render(){
        var thisClass=this;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={'#fafafa'} barStyle="dark-content" />
                {renderLoadingPercenatge(thisClass,'explore')}
                <View style={styles.invite_heading}>
                    <View style={[styles.invite_heading_top,styles.invite_heading_top2,styles.invite_heading_top278]}>
                        <IconFE name="search" style={[styles.search_cions, styles.search_cions678]}/> 
                        <TextInput underlineColorAndroid='transparent' onFocus={()=>this.searchSubmit()} autoCapitalize = 'none' 
                placeholderTextColor="#b3b3b3" style={[styles.search_form_row,styles.search_form_row45]} value={this.state.query} placeholder="search..." autoCorrect={false} onChangeText={query=>this.setState({query : query})}/>
                    </View>
                    <TouchableOpacity style={styles.winners_menu_new} onPress={()=>Actions.winners()}>
                        <Image  style={styles.winners_top_troppy_new} source={require('./../images/new_tttrpy.png')}/>
                    </TouchableOpacity>
                 </View>

                <ScrollView style={styles.exploreSchorrl2}>
                    <View style={styles.top_creators}>
                        {this.renderCreatorsHeading()}
                        <View style={styles.top_creators_bottom}>
                            <ScrollView horizontal= {true} decelerationRate={0} snapToInterval={200}  snapToAlignment={"center"}>
                                {this.renderCreators()}
                            </ScrollView>
                        </View>
                    </View>

                    {this.renderTrendingIcons()}
                    <View style={styles.trensing_cats_new}>
                        <View style={styles.trending_tags_new_c_left}>
                            {this.renderCategories(1)}
                        </View>
                        <View style={styles.trending_tags_new_c_left}>
                            {this.renderCategories(2)}
                        </View>
                        <View style={styles.trending_tags_new_c_left}>
                            {this.renderCategories(3)}
                        </View>
                        
                    </View>

                    <View style={styles.trending_tags_new}>
                            {this.renderLocationTitle()}
                        <View style={styles.trending_tags_new_c}>
                            <View style={[styles.trending_tags_new_c_left]}>
                                {this.renderTags(1)}
                            </View>
                            <View style={styles.trending_tags_new_c_left}>
                                {this.renderTags(2)}
                            </View>
                            <View style={styles.trending_tags_new_c_left}>
                                {this.renderTags(3)}
                            </View>

                        </View>
                    </View>
                    
                    


                </ScrollView>
                {this.renderLoading()}
                <Menu activeMenu="search" />
            </View>
        );
    }

}


//export to other parts
export default Explore;
