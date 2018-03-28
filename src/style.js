/* React dependencies */
var React = require('react-native');
var screen = require('Dimensions').get('window');
import { ifIphoneX } from './common/isIphoneX';

var {
  StyleSheet
} = React;

module.exports =StyleSheet.create({
    //home page
    home_page:{margin:50 },
    container:{backgroundColor : '#fff', flex:1, paddingTop:20, position:'relative'},
    listing_container:{backgroundColor : '#fff', flex:1,position:'relative'},
    home_header:{position:'absolute', left:0, right:0, top:0, alignItems:'center', zIndex:9, backgroundColor:'#fff', borderBottomColor:'#b3b3b3', borderBottomWidth:1 },
    home_mneu_left_img:{width:36, height:32 },
    home_header_r:{position:'absolute', left:0, right:0, top:0, alignItems:'center', zIndex:99, backgroundColor:'#fafafa', borderBottomColor:'#b3b3b3', borderBottomWidth:1 },
    home_mneu_right_img:{width:22, height:22, 
        ...ifIphoneX({
            marginTop:17
        }, {
            marginTop:2,
        })
    },
    container_notif:{flex:1},
    new_see_more:{fontStyle:'italic',color:'#6B0565', fontSize:15},
    video_verified_icon:{fontSize:16, color:'#00a8e2', marginLeft:5},
    video_verified_icon56:{marginTop:5},
    pick_follers_single_to2:{
        backgroundColor:'#efefef'
    },
    username_top_video:{flexDirection:'row'},
    home_mneu_left:{padding:20, paddingTop:30, position:'absolute', right:0, top:0, zIndex:10 },
    single_listing:{backgroundColor:'#fff'},
    single_listing_top:{flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', padding:15 },
    single_listing_top_left:{flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', },
    single_listing_top_right:{flex:2, alignItems:'flex-start', justifyContent:'flex-start', flexDirection:'row', },
    player_area:{width:screen.width, height:(16/16)*screen.width, position:'relative' },
    single_listing_top_left_right:{ marginLeft:7},
    list_preview:{position:'absolute', left:0, right:0, top:0, bottom:0, backgroundColor:'#000'},
    player_thumbnail:{width:screen.width, height:(16/16)*screen.width, },
    listing_user_img:{width:40, height:40, borderRadius:20, overflow:'hidden' },
    connect_loading:{marginBottom:100},
    user_name:{fontFamily:'Calibri-bold',fontSize:16,color:'#262626',marginLeft:2},
    listing_user_h_img:{width:20, height:20},
    user_name_hours:{color:'#969696', fontFamily:'Calibri',fontSize:14, flexDirection:'row', justifyContent:'flex-start', lineHeight:16, alignItems:'flex-start'},
    listing_user_add_img:{width:27, height:24.69, marginTop:5 },
    listing_user_add_txtb:{fontFamily:'Calibri-Bold',fontSize:16,  color:'#842196', textAlign:'right', marginTop:5},
    listing_user_add_txts:{fontFamily:'Calibri',fontSize:14, color:'#842196', textAlign:'right'},
    single_listing_top_right_left:{flex:2, alignItems:'flex-end', },
    single_listing_top_right_right:{alignItems:'flex-end', marginLeft:0 },
    single_listing_bottom:{padding:15, position:'relative', paddingTop:10, paddingBottom:0},
    single_listing_middle_b_single_i45:{fontSize:30},
    single_listing_middle_b_single_i:{width:25,height:23,marginTop:5},
    single_listing_middle_b_single_i2:{width:24,height:24,marginTop:3},
    single_listing_bottom_top_tx:{fontFamily:'Calibri-Bold',fontSize:16,lineHeight:16, color:'#262626'},
    home_mneu_more_img:{fontSize:30,color:'#262626', paddingRight:15,paddingLeft:10,paddingTop:5},
    home_mneu_more_img2:{ },
    single_listing_bottom_bottom:{},
    single_listing_middle:{position:'relative'},
    player_sound:{position:'absolute', zIndex:9, top:0, right:0, padding:15, },
    
    single_listing_middle_b:{flexDirection:'row', justifyContent:'flex-start',position:'relative'},
    single_listing_middle_b_single:{ alignItems:'flex-start', backgroundColor:'transparent', marginLeft:10},
    single_listing_middle_b_single_area:{flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', },
    listing_menu_t_area:{flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start',},
    single_listing_middle_b_single_txt:{fontFamily:'Calibri',fontSize:16, backgroundColor:'transparent', color:'#758a91', padding:10, paddingLeft:5, paddingBottom:5 },
    listing_user_add:{paddingBottom:7,paddingTop:3,paddingLeft:15, paddingRight:15},
    single_listing_middle_b_single_touch:{padding:5, alignItems:'center',justifyContent:'center', backgroundColor:'transparent' },
    ds_video_loading:{alignItems:'center', backgroundColor:'rgba(0,0,0,.7)', justifyContent:'center', flex:1, position:'absolute', left:0, right:0, top:0, bottom:0, zIndex:8},


    //seach page
    top_creators:{paddingTop:15, paddingBottom:5, marginTop:15},
    top_list_videos:{paddingTop:10, paddingBottom:15},
    exploreScroll:{flex:1,  paddingTop:15,marginBottom:50,
            marginTop:25,},
    commentsSCroll:{flex:1,  marginBottom:65, ...ifIphoneX({
            marginTop:82,
        }, {
            marginTop:40,
        })},

    commentsSCroll2:{flex:1, marginBottom:60,marginTop:40, },
    win_heading2:{color:'#ffc700'},
    search_heading:{fontFamily:'Calibri',fontSize:18, color:'#6b4182', marginBottom:15, textAlign:'center'},
    single_creator_img:{width:60, height:60, borderRadius:30, overflow:'hidden', margin:5, marginBottom:15 },
    single_creator:{position:'relative', margin:5 },
    single_creator_txt:{color:'#fff', backgroundColor:'#ec5f35', position:'absolute', right:0, top:0, height:30, width:30, borderRadius:15, overflow:'hidden', fontWeight:'bold', paddingTop:5, fontFamily:'Calibri-Bold',fontSize:13, textAlign:'center'},
    top_creators_win:{backgroundColor:'#532850', paddingTop:35, paddingBottom:30, alignItems:'center',},
    win_heading:{fontFamily:'Calibri-Bold',fontSize:24, fontWeight:'bold', textAlign:'center', color:'#fff'},
    learn_more_txt:{borderWidth:1, borderColor:'#fff', color:'#fff', padding:5, paddingLeft:15, paddingRight:15, marginTop:10, borderRadius:2 },
    single_top_video_img:{width:90, height:90, borderRadius:45, overflow:'hidden'},
    single_top_video:{margin:10, },
    single_category:{margin:5,alignItems:'center', },
    profileExtra_t23:{color:'#C03BA4',textAlign:'left', alignSelf:'flex-start', fontSize:16, fontFamily:'Calibri-Bold'},
    single_category_txt:{textAlign:'center', color:'#6d6e71', marginBottom:15, fontFamily:'Calibri',fontSize:16, },
    categories_area_heading:{marginLeft:15, marginBottom:15, color:'#6d6e71', fontFamily:'Calibri-Bold',fontSize:18 },
    listing_heading:{flexDirection:'row', justifyContent:'center', alignItems:'center'},
    listing_heading_txt:{marginLeft:15, marginBottom:10, color:'#fff', fontFamily:'Calibri-Bold',fontSize:16, backgroundColor:'#a96bc2', borderRadius:3, padding:10, overflow:'hidden', marginTop:20, paddingBottom:10, paddingTop:10 },
    font_bold:{fontWeight:'bold',fontFamily:'Calibri-Bold'},
    home_logo_im:{width:100, height:29,  
        marginTop:5,
            marginBottom:15,
    },
    homeSCrollView:{flex:1,
        marginTop:30,
        marginBottom:55,
    },
    heart_hover_area:{position:'absolute',left:0,right:0,top:0,bottom:0,zIndex:99, alignItems:'center',justifyContent:'center',},
    heart_hover_area_icons:{fontSize:80,color:'#fff',backgroundColor:'transparent'},
    search_scroll:{flex:1, marginTop:75, marginBottom:55,...ifIphoneX({

        }, {

        })},
    home_mneu_left2:{padding:20, paddingTop:30, position:'absolute', left:0, top:0, zIndex:10 },
    home_mneu_right:{padding:20, paddingTop:30, position:'absolute', right:0, top:0, zIndex:10,
        ...ifIphoneX({
            paddingBottom:16
        }, {
            
        })
    },
    
    //menu component
    menu_area:{position:'absolute', bottom:0, right:0, left:0, backgroundColor:'#fafafa', 
    borderColor:'#b3b3b3', borderTopWidth:1, zIndex:999 },
    menu_area_main:{flexDirection: 'row', justifyContent:'flex-start', },
    single_menu:{position:'relative', flex:5, },
    
    menu_icons:{},
    menu_icons_home:{width:25,height:25},
    menu_icons_prifile:{width:25,height:25},
    menu_icons_search:{width:25,height:25},
    menu_icons_notifications:{width:25,height:25},
    menu_icons_record:{width:25,height:25},
    new_see_more:{fontStyle:'italic',color:'#6B0565', fontSize:16},

    menu_text:{flex:1, padding:15, alignItems:'center',
        ...ifIphoneX({
            paddingBottom:25,
            paddingTop:12
        }, {
            
        })
    },
    menu_image23:{width:11, height:22,},
    menu_active_icons:{color:'#6B0565'},
    menu_text_extra:{position:'absolute', backgroundColor:'red', top:5, right:10, color:'#fff', 
    fontFamily:'Calibri-Bold',fontSize:13, fontWeight:'bold', borderRadius:10, padding:5, paddingBottom:2, paddingTop:2, overflow:'hidden'},

    //profile page
    scroll_view:{flex:1, marginTop:35, marginBottom:50, paddingTop:15, },
    profile_videos:{marginBottom:30},
    container_profile:{backgroundColor : '#fff', flex:1, position:'relative'},
    pro_menu_text:{
        color:'#262626',
        marginBottom:10,
        textAlign:'center',
        fontFamily:'Calibri-Bold',fontSize:18,
        paddingBottom:0,
        marginTop:5,
    }, 
    profile_user_area_single_text1:{
        color:'#fff',
        fontFamily:'Calibri-Bold',fontSize:18
    },
    profile_user_area_single_text2:{
        color:'#fff',
        fontFamily:'Calibri',fontSize:16
    },
    profile_user_plus:{ paddingTop:7, paddingBottom:8},
    back_vator_profile_settings:{paddingTop:5},
    profile_user_area:{
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    profile_user_area_right_top:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        overflow:'hidden',
    },
    new_p_follow2:{
        color:'#689368'
    },
    profile_sma_cions23:{color:'#689368'},
    new_p_follow1:{color:'#fff'},
    new_p_follow_m1:{backgroundColor:'#2dafdf', borderColor:'#2dafdf'},
    new_p_follow_m2:{
        borderColor:'#689368',
    },
    profile_user_area_right_top_left:{
        flex:2,
        marginBottom:5
    },
    profile_sma_cions:{
        color:'#42193B',
        fontSize:15,
        paddingTop:2
    },
    new_p_follow:{
        fontFamily:'Calibri-Bold',fontSize:14,
        paddingLeft:5,
        paddingTop:3,
        paddingBottom:3,
        color:'#42193B',
    },
    search_not_found:{
        alignItems:'center',
        marginTop:100,
        marginBottom:10
    },
    go_back_ds:{
        fontFamily:'Calibri-Bold',fontSize:16,
        fontWeight:'bold',
        padding:10
    },
    go_back_ds2:{
        fontFamily:'Calibri',fontSize:16,
    },
    new_p_follow_m:{
        alignItems:'center',
        borderWidth:2,
        borderColor:'#42193B',
        borderRadius:20,
        padding:5, 
    },
    ds_follow_extra:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    profile_user_area_left:{
        width:'34%',
        overflow:'hidden',
        alignItems:'center',
        justifyContent:'center',
    },
    profile_user_area_right:{
        width:'66%',
        overflow:'hidden',
        marginRight:15
    },
    profile_user_area_single_area:{
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    profile_photo_img:{
        width:18,
        height:18,
        marginTop:2
    },
    profile_photo_t5:{
        fontFamily:'Calibri-Bold',fontSize:16,
        color:'#4B2562',
        textAlign:'center',
        marginLeft:4, marginRight:4
    },
    profile_follow_img:{
        width:15,
        height:15,
        marginTop:2
    },
    block_user:{
        textAlign:'center',color:'red',
        padding:5,paddingTop:0
    },
    profile_follow_text:{
        color:'#42193B',
        fontFamily:'Calibri-Bold',fontSize:16,
        textAlign:'center',
        borderColor:'#42193B',
        borderWidth:1,
        padding:7,
        paddingLeft:15,
        paddingRight:15,
        borderRadius:15,
        marginBottom:10,
    },
    profile_follow:{
        alignItems:'center'
    },
    profile_user_area_single:{
        justifyContent:'center',
        alignItems:'center',
        flex:4,
        paddingTop:15,
        paddingBottom:15
    },
    profileExtra:{

    },
    profileExtra_t:{
        fontFamily:'Calibri-Bold',fontSize:16,
        color:'#000',
        lineHeight:17,
        margin:0,
        padding:0,
    },
    profile_user_area_top_m:{
        alignItems:'center',
        marginBottom:10
    },
    profile_user_data:{
        backgroundColor:'#9868C1',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems:'flex-start'
    },
    profile_header_main:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        zIndex:99,
        backgroundColor:'#fafafa',
        borderBottomColor:'#b3b3b3',
        borderBottomWidth:1,
    },
    left_invite_menu:{
        position:'absolute',
        left:0,
        top:0,
        zIndex:99,
    },
    right_invite_menu:{
        position:'absolute',
        right:0,
        top:0,
        zIndex:99,
        paddingBottom:0,
    },


    //edit profile
    container_edit_profile:{
        backgroundColor : '#fff',
        flex:1,
        position:'relative'
    },
    reg_heading:{
        position:'relative',
        justifyContent:'center',
        alignItems:'center',
    },
    login_page:{
        flex:1
    },
    profile_s_cancel_e:{
        color:'#262626',
        fontFamily:'Calibri-Bold',fontSize:16,
        paddingLeft:5, paddingTop:3
    },
    signup_logo:{
        width:120,
        height:36
    },
    signup_cross:{
        width:20,
        height:20,
        marginTop:5
    },
    signup_cross_txt:{
        color:'#000'
    },
    logout_final_text:{
        padding:15,
        paddingTop:5
    },
    logout_final_text2:{
        color:'#000',
        fontFamily:'Calibri',fontSize:16,
        paddingTop:15,
        paddingBottom:15
        
    },
    heading_area_back_edit:{
        padding:20,
        position:'absolute',
        left:0,
        top:0,
        zIndex:9,
        paddingRight:30,
        paddingBottom:10,
    },
    logout_final_text3:{
        fontWeight:'bold',
        fontFamily:'Calibri-Bold'
    },
    form_row:{
        paddingTop:10,
        paddingBottom:10,
        borderBottomWidth:1,
        borderBottomColor:'#F4F6F7',
        position:'relative'
    },
    input_field:{
        paddingTop:10,
        paddingBottom:7,
        color:'#333',
        fontFamily:'Calibri',fontSize:16,
        paddingLeft:20,
    },
    label:{
        color:'#333',
        fontFamily:'Calibri',fontSize:14,
        paddingTop:8,
        paddingRight:10,
        paddingLeft:20,
    },
    form_radio:{
        marginTop:5,
        paddingLeft:20
    },
    input_error:{
        borderBottomColor:'red'
    },
    single_error:{
        color:'red',
        fontFamily:'Calibri',fontSize:13,
        paddingLeft:20
    },
    login_logo_area:{
        alignItems: 'center',
        marginTop:50,
        marginBottom:0
    },
    login_logo:{
        height:54,
        width:180
    },
    input_field_textarea:{
        minHeight:70,
        paddingLeft:20,
        fontWeight:'normal'
    },
    label2:{
        position:'relative',
        marginBottom:15
    },
    real_cancel:{
        backgroundColor:'red',
        padding:15
    },
    limit_charters:{
        fontFamily:'Calibri',fontSize:12
    },
    profile_user_area2:{
        flex:1,
        alignItems:'center',
        marginTop:15,
        marginBottom:15,
        paddingLeft:15,
        paddingRight:15,
    },
    pfile_image:{
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:8,
        borderColor:'#EDE5F6',
        marginTop:5,
        marginBottom:5,
        ...ifIphoneX({
            marginTop:15
        }, {
            
        })
    },
    extra_title_page_tx:{
        color:'#505966',
        fontFamily:'Calibri-Bold',fontSize:15,
    },
    right_done_opacity:{
        position:'absolute',
        right:0,
        top:0,
        zIndex:99,
        alignItems:'flex-start',
        flexDirection:'row',  paddingBottom:11, paddingLeft:70, paddingRight:15, backgroundColor:'transparent',
        paddingTop:3,
    },
    vator_icon23:{paddingBottom:3},

    //reset password
    container_rest:{
        backgroundColor : '#fff',
        flex:1,
        position:'relative'
    },
    reset_heading:{
        position:'relative',
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    profile_s_cancel_save:{
        backgroundColor:'red',
        padding:15,
        margin:0
    },
    profile_s_t2:{
        paddingTop:35
    },
    rest_touc:{
        position:'absolute',
        right:0,
        top:0,
        zIndex:10,
        paddingLeft:15,
    },
    edotpCenter:{
        alignItems:'center',
    },

    

    //settings page
    setting_container:{
        backgroundColor : '#fff',
        flex:1,
        position:'relative'
    },
    logout_final_text2:{
        color:'#000',
        fontFamily:'Calibri',fontSize:16,
        paddingTop:15,
        paddingBottom:15,
        paddingRight:15
    },
    logout_final_text3:{
        fontWeight:'bold'
    },
    profile_s_cancel_save:{
        flexDirection: 'row',
        justifyContent:'flex-end'
    },
    profile_s_cancel_save2:{
        flexDirection: 'row',
        justifyContent:'flex-start'
    },
    login_page:{
        flex:1
    },
    profile_s_cancel:{
        color:'#262626',
        padding:15,
        paddingTop:35
    },
    signup_logo:{
        width:120,
        height:36
    },
    signup_cross:{
        width:20,
        height:20,
        marginTop:5
    },
    signup_cross_txt:{
        color:'#000'
    },
    s_form_row:{
        padding:8,
        paddingLeft:15,
        paddingRight:15,
        flexDirection:'row',
        justifyContent:'flex-start',
        position:'relative',
        borderBottomWidth:1,
        borderBottomColor:'#F4F6F7',
        flex:1,
        alignItems:'flex-start'
    },
    form_row2:{
        paddingTop:10,
        paddingBottom:10,
        marginLeft:20,
        marginRight:20,
        flexDirection:'row',
        justifyContent:'flex-start',
    },
    s_label:{
        color:'#262626',
        fontFamily:'Calibri',fontSize:16,
        paddingTop:8,
        paddingRight:50,
        flex:2,
        paddingBottom:5
    },
    login_logo_area:{
        alignItems: 'center',
        marginTop:50,
        marginBottom:0
    },
    ds_switcher:{
        position:'absolute',
        right:13,
        top:6,
        transform: [{ scaleX: .8 }, { scaleY: .8 }],
        backgroundColor:'transparent',
        borderRadius:20
    },
    extra_title_page:{
        backgroundColor:'#fafafa',
        padding:10,
        paddingBottom:10
    },
    right_arrow_img2:{
        width:14,
        height:20,
        marginTop:5,
        position:'absolute',
        right:15
    },
    right_arrow_main:{
        flex:2,
        alignItems:'flex-end',
    },
    right_vator:{color:'#262626',fontSize:30},
    edit_profile:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        zIndex:99,
        backgroundColor:'#fafafa',
        borderBottomColor:'#b3b3b3',
        borderBottomWidth:1
    },

    //static page
    non_container:{
        backgroundColor : '#fff',
        flex:1,
        position:'relative'
    },
    header_area:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        zIndex:99,
        backgroundColor:'#fafafa',
        borderBottomColor:'#b3b3b3',
        borderBottomWidth:1,
        justifyContent:'center',
        alignItems:'center',
    },
    back_vator_list:{
        fontSize:20,
        paddingBottom:15,
        paddingTop:10,
    },
    draftSCrioll:{
        flex:1,marginBottom:55,
        marginTop:20, 
    },
    profile_s_t:{
        fontFamily:'Calibri-Bold',fontSize:16,
        color:'#262626',
        paddingBottom:15,
        paddingTop:5,
    },
    cat_SCroll:{flex:1, 
        marginTop:18,
        marginBottom:50,
    },
    vator_icon78:{fontSize:30},
    right_done_opacity34:{ paddingBottom:5,...ifIphoneX({
            paddingTop:40,
        }, {
            paddingTop:0,
        })},
    profile_s_t23:{
        fontFamily:'Calibri'
    },
    heading_area_back:{position:'absolute', left:0, top:0, zIndex:99, paddingRight:50, },
    draft_thumbnail:{width:70,height:60},
    draft_single:{alignItems:'flex-start',flexDirection:'row',padding:10,
    backgroundColor:'#fafafa', marginBottom:5, position:'relative'},
    text_container:{
        padding:20
    },
    draft_single_data:{marginLeft:15, marginTop:5},
    draft_single_action:{alignItems:'flex-start', flexDirection:'row', position:'absolute', right:10, top:10},
    vector_edit:{fontSize:20, padding:12, color:'red'},
    draft_title:{color:'#262626',fontFamily:'Calibri-Bold'},
    draft_cat:{fontFamily:'Calibri',color:'#262626'},
    vector_edit2:{marginTop:2,color:'#000'},
    normal_text_h:{
        fontFamily:'Calibri-Bold',fontSize:16,
        fontWeight:'bold',
        marginTop:10,
        marginBottom:10, color:'#262626'
    },
    normal_text_t:{
        fontFamily:'Calibri',fontSize:16,
        marginBottom:10, color:'#262626'
    },
    back_vator2:{paddingBottom:2, paddingTop:20},



    //notifications page
    notification_header:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        padding:15,
        paddingTop:10,
        paddingBottom:10,
        position:'absolute',
        left:0,
        right:0,
        top:0,
        zIndex:99,
        backgroundColor:'#fafafa',
        borderColor:'#b3b3b3',
        borderBottomWidth:1
    },
    notification_header_left:{
        flex:2,
        marginRight:15
    },
    notification_header_left2:{
        marginRight:0,
        marginLeft:15
    },
    notification_btn:{
        fontFamily:'Calibri-Bold',fontSize:16,
        color:'#fff',
        textAlign:'center',
        backgroundColor:'#252429',
        borderRadius:15,
        overflow:'hidden',
        lineHeight:16,
        paddingTop:10,
        paddingBottom:10,
    },
    notification_sctoll:{flex:1,  paddingTop:15, marginBottom:56,...ifIphoneX({
            marginTop:72,
        }, {
            marginTop:40,
        })},
    notification_btn_active:{
        backgroundColor:'#9267b7'
    },
    single_notification:{
        backgroundColor:'#f2f3f3',
        marginBottom:10,
        flexDirection:'row',
        flex:1,
        paddingTop:10,
        paddingBottom:10,
        position:'relative',
        width:screen.width,
        justifyContent:'center'
    },
    notification_image:{
        width:55,
        height:55,
        borderRadius:27.5,
        overflow:'hidden'
    },
    notification_v_thumb:{
        width:70,
        height:60,
    },
    single_notificationleft:{width:'20%',  alignItems:'center', justifyContent:'center'},
    single_notificationmiddle:{
        width:'54%', justifyContent:'center'
    },
    single_notificationright:{width:'26%',  alignItems:'center', justifyContent:'center'},
    noti_text_top:{
        fontFamily:'Calibri',fontSize:15,
        color:'#000',
        textAlign:'left',
        marginBottom:3,
    },
    noti_text_duration_con:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    noti_text_duration:{
        fontFamily:'Calibri',fontSize:14,
        color:'#b1c7d7',
    },
    noti_follow_text:{
        color:'#a0a0a5',
        borderWidth:1,
        borderColor:'#a0a0a5',
        borderRadius:15,
        overflow:'hidden',
        fontFamily:'Calibri',fontSize:14,
        padding:5,
        paddingRight:10,paddingLeft:10,
        textAlign:'center'
    },

    noti_donation_text:{
        color:'#fff',
        backgroundColor:'#80d08e',
        fontWeight:'bold',
        fontFamily:'Calibri-Bold',fontSize:16,
        textAlign:'center',
        padding:5,
        paddingRight:10,
        paddingLeft:10,
        borderRadius:13,
        overflow:'hidden',
    },
    donation_heading:{
        alignItems:'center',
        marginTop:20
    },
    donation_heading_b_txt:{
        color:'#6eb65f',
        fontFamily:'Calibri',fontSize:17
    },
    donation_heading_balance:{
        fontFamily:'Calibri-Bold',fontSize:26,
        fontWeight:'bold',
        color:'#6eb65f',
        marginTop:5,
        marginBottom:10
    },
    donation_donars_top_txt:{
        fontFamily:'Calibri-Bold',fontSize:16,
        fontWeight:'bold',
        color:'#7ba1bd',
        backgroundColor:'#fff',
        position:'absolute',
        zIndex:5,
        textAlign:'center',
        paddingLeft:10,
        paddingRight:10,
        top:0
    },
    donation_donars_bottom:{
        width:screen.width,
        height:4,
        borderBottomColor:'#7ba1bd',
        borderBottomWidth:1,
        marginTop:7,
    },
    donation_donars:{
        alignItems:'center',
        marginTop:0,
        marginBottom:15,
        position:'relative'
    },
    notification_drn_image:{
        width:75,
        height:75,
        borderRadius:37.5,
        overflow:'hidden',
        marginBottom:15,
        position:'relative'
    },
    donate_amnt:{
        position:'absolute',
        right:0,
        top:0,
        backgroundColor:'#536f83',
        color:'#fff',
        paddingTop:5,
        paddingLeft:5,
        paddingRight:5,
        paddingBottom:0,
        fontFamily:'Calibri',fontSize:14, lineHeight:14, 
        borderRadius:10, 
        borderColor:'#ddd', borderWidth:1,zIndex:99
    },
    donation_donars_single:{
        margin:5,
    },
    donation_donars_list:{
        marginBottom:2,
        marginTop:5,
        alignItems:'center'
    },
    top_creators_bottom:{
        alignItems:'center'
    },
    donation_lists:{
        marginTop:15
    },
    notification_drn_image_sm:{
        width:50,
        height:50,
        borderRadius:25,
        overflow:'hidden',
        marginTop:5
    },
    donation_lists_single:{
        marginBottom:10,
        width:screen.width,
        position:'relative',
        backgroundColor:'#f2f3f3',
    },
    donation_lists_single_left:{
        padding:15,
        justifyContent:'center',
        paddingRight:90,
        flex:1,
        paddingTop:5,
        paddingBottom:5
    },
    donation_lists_single_left_area:{flexDirection:'row',alignItems:'flex-start',},
    donation_lists_single_right:{
        backgroundColor:'#f2f3f3',
        width:90,
        position:'absolute',
        right:0,
        top:0,
        bottom:0,
        alignItems:'center',
        borderLeftWidth:10,
        borderLeftColor:'#fff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    donation_lists_single_left_left:{flex:1},
    donation_lists_single_left_right:{
        paddingLeft:10,
        paddingRight:5,
        flex:3
    },
    no_list_text_main:{
        fontFamily:'Calibri',fontSize:15,
        color:'#262626',
        marginTop:5
    },
    donation_lists_single_right_txt:{
        color:'#6eb65f',
        fontFamily:'Calibri',fontSize:15
    },



    //comments
    single_comments:{
        paddingTop:10,
        paddingBottom:10,
        paddingBottom:0,
        position:'relative',
        backgroundColor:'#fff',
    },
    single_comments_top:{
        position:'relative'
    },
    single_comments_child:{
        paddingTop:10,
        paddingBottom:10,
        position:'relative',
        marginLeft:35,
        paddingRight:0,
    },
    commnets_owner:{
        width:35,
        height:35,
        borderRadius:17.5,
        overflow:'hidden',
        marginRight:10,
        marginLeft:10,
        marginTop:2
    },
    commnte_box_replyto:{position:'relative',backgroundColor:'#efefef',padding:15, paddingBottom:10},
    commnte_box_replyto_txt56:{position:'absolute',right:0,top:0},
    commnte_box_replyto_txtcc:{color:'#262626',fontSize:18,fontFamily:'Calibri', padding:11, paddingLeft:15, paddingRight:15,},
    commnte_box_replyto_txt:{fontFamily:'Calibri',fontSize:16,color:'#868686'},
    single_comments_left:{position:'absolute',left:0,top:0,zIndex:9, bottom:0, zIndex:9},
    commnte_box_right:{
        position:'absolute',
        right:0,
        width:45,
        bottom:0,
        top:0,
        justifyContent:'center'
    },
    commnte_box_left:{
        position:'absolute',
        left:0,
        width:60,
        bottom:0,
        top:0,
        justifyContent:'center',
        alignItems:'center',
    },
    comment_post:{
        color:'#3476B2',
        fontFamily:'Calibri-Bold',
        fontSize:17
    },
    
    single_comments_right_top:{
        fontFamily:'Calibri',fontSize:15,
        color:'#262626'
    },
    single_comments_right_time:{
        fontFamily:'Calibri',fontSize:15,
        color:'#969696',
        marginRight:10
    },
    single_comments_right:{
        position:'relative',
        marginLeft:55,
        marginRight:45,
    },
    commnets_dots_area:{position:'absolute',right:0,bottom:0,zIndex:9,backgroundColor:'transparent',width:45, alignItems:'center'},
    commnets_dots_icons:{fontSize:30,color:'#262626',paddingTop:3},
    single_comments_left2:{top:20,},
    single_comments_right_bottom:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        position:'relative'
    },
    comnes_box_area:{
        flex:1,
        position:'relative'
    },
    commnte_box:{
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        borderTopColor:'#b3b3b3',
        borderTopWidth:1,
        zIndex:9,
        backgroundColor:'#fff',
    },
    comments_area_page:{
        marginBottom:20
    },
    load_cmnts_area:{
        alignItems:'center'
    },
    load_cmnts_area_txt:{
        fontStyle:'italic',
        fontFamily:'Calibri',fontSize:14,
        color:'#262626'
    },
    commnte_box2:{
        bottom:30
    },
    commnte_box_area:{
        position:'relative',
        justifyContent:'center',
        borderTopColor:'#efefef',
        borderTopWidth:1
    },
    commnets_reply:{
        color:'#969696',
        padding:5,
        fontFamily:'Calibri',fontSize:16,
        paddingTop:0
    },
    commnets_plane:{
        width:40,
        height:40,
        borderRadius:20,
        overflow:'hidden'
    },
    commnte_box_middle:{
        position:'absolute',
        left:45,
        right:50,
        top:0,
        bottom:0,
    },
    input_field_textarea2:{
        fontWeight:'normal',
        height:'100%',
        margin:0,
        padding:0,
        paddingTop:0,
        paddingBottom:15
    },





    //record page
    player_wrapper: {
        flex: 1,
        position:'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0
    },
    player_area_main:{
        position:'absolute',
        
        left:0,
        right:0,
        width:screen.width,
        height:(16/16)*screen.width,
        backgroundColor:'#000',
        alignItems:'center',top:50
    },
    barWrapper: {
        width: screen.width,
        height: 50,
        opacity: 1,
        marginTop:0
    },
    barGauge: {
        width: 0,
        height: 50,
        backgroundColor: "red"
    },
    ds_container_player:{
        flex:1,
        position:'relative',
        backgroundColor:'#000'
    },
    duration_row:{
        flex:1,
        marginBottom:15,
        position:'absolute',
        right:40,
        bottom:100,
        height:30,
        zIndex:1,
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    clock_icon:{
        color:'#fff',
        fontSize:25
    },
    duration_row_area:{
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    click_text:{
        color:'#fff',
        fontFamily:'Calibri',fontSize:16,
        paddingTop:3,
        paddingLeft:8,
        backgroundColor:'transparent'
    },
    segments_steps:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        zIndex:5,
    },
    click_icon:{
        width:44,
        height:30,
        opacity:.7
    },
    camre_controls:{color:'#fff',fontSize:30,backgroundColor:'transparent',},
    single_control:{ alignItems:'center', justifyContent:'center', ...ifIphoneX({
    height:95,
}, {
    height:80,
})},
    camre_controls_flash:{color:'#fff',fontSize:40,backgroundColor:'transparent'},
    camre_controls2:{fontSize:30},
    click_icon2:{
        width:35,
        height:30
    },
    recoding_icons:{
        width:85,
        height:85,
        borderRadius:40,
        overflow:'hidden'
    },
    extra_conteols:{
        position:'absolute',
        right:0,
        left:0,
        bottom:0,
        
        ...ifIphoneX({
    height:95,
}, {
    height:80,
})
    },
    camre_controls34:{fontSize:25},
    conteols_main_div:{
        position:'absolute',
        bottom:90,
        left:0,
        right:0,
        zIndex:0,
        justifyContent:'center',
        alignItems:'center'
    },
    extra_conteols_area:{
        flexDirection:'row',
        justifyContent:'flex-start',
    },
    extra_conteols_single:{
        flex:4,
    },
    conteols_cnacle:{
        flex:2,
        alignItems:'flex-start',
    },
    conteols_area:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        zIndex:9,
        flexDirection:'row',
        justifyContent:'flex-start',
    },
    conteols_camerabcak_cion:{
        fontSize:40,
        color:'#fff',
        backgroundColor:'transparent',
        padding:10,
        
        paddingBottom:5,
        paddingRight:50,paddingTop:4,},
    conteols_camerabcak_cion2:{paddingLeft:50, paddingBottom:10, paddingRight:15},
    conteols_camerabcak_upload:{
        width:31,
        height:28
    },
    conteols_upload:{
        flex:2,
        alignItems:'flex-end'
    },

    recoding_icons:{
        width:85,
        height:85,
        borderRadius:40
    },
    segmentText:{
      padding:15
    },
    extrarecording:{
      position:'absolute',
      left:0,
      right:0,
      top:0,
      bottom:0,
      zIndex:99
    },
    single_listing_top_left_right_area:{alignItems:'flex-start',flexDirection:'row'},
    clock_icon_video:{color:'#969696',fontSize:15, paddingRight:5},

    //preview sections
    preview_container:{
        flex:1,
        backgroundColor:'#000',
        position:'relative'
      },
      preview_heading:{
        justifyContent:'center',
        height:55,
        position:'absolute',
        top:0,
        left:0,
        right:0, zIndex:99,
      },
      back_camera_touch:{position:'absolute',left:0,top:0, zIndex:99, alignItems:'flex-start', flexDirection:'row',  paddingLeft:15, 
      paddingRight:50, backgroundColor:'transparent',paddingTop:5},
      upload_camera_touch:{position:'absolute',right:0,top:0, zIndex:99, alignItems:'flex-start', flexDirection:'row',paddingLeft:50, 
      paddingRight:15, backgroundColor:'transparent',paddingTop:10},
      alignLeft:{flexDirection:'row', alignItems:'flex-start'},
      heading_cancel_pre:{
        fontFamily:'Calibri',fontSize:16,
        color:'#fff',paddingTop:5, paddingLeft:5
      },
      heading_cancel_pre2:{marginTop:5},
      camer_back_icons2:{fontSize:35},
      camer_back_icons:{color:'#fff',fontSize:25},
      heading_cancel2:{
        textAlign:'right',
        paddingTop:5, paddingLeft:5
      },
      edit_clips:{
        color:'#fff',
        fontFamily:'Calibri-Bold',fontSize:18,
        textAlign:'center',
        paddingBottom:10,
        paddingTop:5
      },
      preview_video:{
        position:'relative',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        
        left:0,
        right:0,
        flex:1,
        width:screen.width,
        height:(16/16)*screen.width,
        top:55
      },
      preview: {
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0, zIndex:9,
          backgroundColor:'#fff'
      },
      preview_options:{
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        flexDirection:'row',
        justifyContent:'flex-start',
        borderTopWidth:1,
        borderColor:'#858585',
        height:65,
        backgroundColor:'#000'
      },
      preview_options_1:{
        flex:4,
        alignItems:'center'
      },
      preview_options_mute:{
        textAlign:'center',
        padding:15
      },
      preview_options_mute_img:{
        width:35,
        height:33,
        marginTop:18
      },
      preview_options_img2:{
        width:28,
        height:33,
        marginTop:18
      },
      single_tag_d:{
        color:'#A561BA',fontSize:18,fontFamily:'Calibri'
      },
       single_tag_d_t:{color:'#55414C',fontSize:16,fontFamily:'Calibri-Bold'},
       video_location:{
        color:'#868686',
        fontFamily:'Calibri', marginBottom:0,fontSize:14,
      },
      single_listing_middle_b_single_touch567:{backgroundColor:'#7D7E81', width:25, height:25, borderRadius:13, overflow:'hidden', justifyContent:'center', alignItems:'center'},
      preview_clips:{
        position:'absolute',
        left:0,
        right:0,
        bottom:70,
        height:120,
        flexDirection:'row',
        justifyContent:'flex-start',
        marginTop:10,
      },
      single_segment_txt:{
        margin:2,
      },
      single_segment_img:{
        width:70,
        height:70,
        borderWidth:5,
        borderColor:'transparent',
        opacity:.7,
        marginTop:15
      },
      single_segment_img_active:{
        borderColor:'#fff',
        opacity:1
      },


    //posts area
    post_container:{flex:1, position:'relative', backgroundColor:'#fff'},
    post_heading:{flexDirection:'row', borderBottomWidth:1, borderBottomColor:'#f7f8f9', borderBottomWidth:1, 
    justifyContent:'flex-start', position:'absolute', right:0, top:0, left:0, backgroundColor:'#fff', zIndex:99 },
    post_heading_left:{flex:2 },
    back_vator:{color:'#262626',fontSize:30,paddingBottom:10, paddingLeft:15,backgroundColor:'transparent',paddingRight:70
    ,paddingTop:0,},
    back_vator3:{paddingTop:20, paddingBottom:5},
    post_heading_right:{flex:2, flexDirection:'row', justifyContent:'flex-end', },
    vator_icon2:{color:'#743db7'},
    post_player:{
        width:screen.width-110,
        height:screen.width-110,
        justifyContent:'center',
        alignItems:'center',
        marginTop:4
    },
    thumbnails_con:{height:screen.width-110,},
    playicons:{fontSize:50,color:'#fff'},
    wColor:{color:'#fff'},
    bColor:{color:'#000'},
    header_areaedit:{backgroundColor:'#000'},
    share_text:{
    fontFamily:'Calibri',fontSize:18, color:'#000', paddingLeft:8, paddingTop:3},
    post_share:{flexDirection:'row',alignItems:'flex-start',padding:15,  paddingBottom:8,paddingTop:5,},
    setting_scroll:{flex:1, ...ifIphoneX({
            marginTop:80,
        }, {
            marginTop:40,
        })},
    vator_icon:{fontSize:20,color:'#000'},
    vator_icon67:{paddingTop:5},
    back_vator_posing:{paddingTop:5},
    input_error:{borderBottomColor:'red'},
    single_error:{color:'red', fontFamily:'Calibri',fontSize:13, paddingLeft:20 },
    post_thumbnails:{position:'relative',marginLeft:10,},
    post_share_area:{padding:20,  paddingTop:10, paddingBottom:0 },
    post_share_single:{flexDirection:'row', alignItems:'flex-start', marginBottom:10},
    post_share_single_tight:{flex:3,alignItems:'center'},
    post_share_single_tight12:{flexDirection:'row', alignItems:'flex-start'},
    check_marks_icons24:{width:26,height:26,borderRadius:13, margin:0, padding:0},
    check_marks_icons256:{fontSize:25},
    fb_share_icons:{fontSize:35, color:'#90a2a9', marginRight:15},
    post_share_single_tight2:{alignItems:'flex-start'},
    single_cat:{margin:5, alignItems:'center'},
    post_category:{backgroundColor:'#f7f8f9',},
    post_title:{flexDirection:'row',alignItems:'flex-start',borderBottomColor:'#f7f8f9', borderBottomWidth:1, marginTop:3, position:'relative', borderTopWidth:1, borderTopColor:'#f7f8f9',zIndex:99},
    ds_switcher2:{marginTop:5},
    single_cat_txt:{borderWidth:1, borderColor:'#3291de', borderRadius:5, padding:10, paddingBottom:3, fontFamily:'Calibri',fontSize:14, color:'#3291de', textAlign:'center', overflow: 'hidden'},
    single_cat_txt_active:{color:'#fff', backgroundColor:'#3291de', borderRadius:5, overflow: 'hidden'},
    input_field2:{ paddingTop:7, paddingBottom:7, color:'#262626', fontFamily:'Calibri',
    fontSize:16,paddingLeft:40, flex:1 },
    filed_cions_previous:{paddingTop:15, paddingLeft:15, paddingRight:5, fontSize:18, color:'#758a91', position:'absolute',left:0,top:0},
    post_player_area:{flexDirection:'row',alignItems:'flex-start',},
    single_segment_txt1:{margin:2, },
    single_segment_img1:{width: 100, height:100, borderWidth:5, borderColor:'transparent', opacity:.7, marginTop:5 },
    single_segment_img_active1:{borderColor:'#000', opacity:1 },
    share_text_3:{fontFamily:'Calibri-Bold',fontSize:16, color:'#90a2a9', marginTop:10, textAlign:'left' },
    cat_touch:{marginBottom:15,},
    cat_touch2:{marginBottom:5,},
    no_notifications_at:{textAlign:'center', padding:50, fontFamily:'Calibri',fontSize:18, color:'#000' },
    check_marks_icons2:{width:14,height:14,borderRadius:7,borderColor:'#868686', borderWidth:1, 
      alignItems:'center', overflow:'hidden', justifyContent:'center',alignSelf:'center'},
      single_category_txt2:{marginBottom:5},
    check_marks_icons:{fontSize:18, color:'#fff',textAlign:'center'},
    check_marks_icons22:{backgroundColor:'#4293ff', borderColor:'#4293ff',},

    psoting_bg_image:{position:'absolute',left:0,right:0,top:0,bottom:0,zIndex:9},


    //followers
    container_followers:{flex:1, position:'relative', backgroundColor:'#fff'},
    single_language:{
        paddingTop:10,
        paddingBottom:15,
        paddingLeft:20,
        paddingRight:20,
        flexDirection:'row',
        justifyContent:'flex-start',
        position:'relative',
        borderBottomWidth:1,
        borderBottomColor:'#F4F6F7',
        flex:1
    },
    vator_icon_s:{marginTop:8, marginRight:5, width:15},
    ds_switcher_lan:{
        position:'absolute',
        right:13,
        top:10,
        transform: [{ scaleX: .8 }, { scaleY: .8 }],
        backgroundColor:'transparent',
        borderRadius:20
    },
    label_language:{
        color:'#262626',
        fontSize:14,
        paddingTop:8,
        paddingRight:50,
        flex:2,
        fontWeight:'bold',
    },
    follow_channel_list_single:{paddingLeft:15, paddingRight:15, paddingTop:10, marginTop:5, marginBottom:5, flexDirection:'row', justifyContent:'flex-start'},

    follow_channel_list_single2:{paddingLeft:15, paddingRight:15, paddingTop:5, marginTop:5, marginBottom:5, flexDirection:'row', justifyContent:'flex-start'},

    follow_channel_list_single_left_right:{marginLeft:12, marginTop:3 },
    channel_list_text:{color:'#000', fontFamily:'Calibri-Bold',fontSize:16, fontWeight:'bold'},
    channel_list_text2:{fontFamily:'Calibri',fontSize:15, color:'#969696'},
    channel_list_pho:{width:50, height:50, borderRadius:25, borderColor:'#969696', borderWidth:1, overflow:'hidden'},
    follow_channel_list_single_left:{flex:2, flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start'},
    channel_follow_text:{backgroundColor:'#3897f1', color:'#fff', paddingLeft:15, 
    paddingRight:15, borderRadius:15, overflow:'hidden', fontFamily:'Calibri',fontSize:16, 
    marginTop:7, paddingBottom:10},
    follow_channel_list_single_left_main:{flex:2, marginTop:5},
    follow_channel_list_single_left_main2:{flex:2, marginTop:5},
    follow_channel_list_single_right:{flex:2, alignItems:'flex-end', },
    home_not_found:{width:'70%', marginLeft:'15%', marginTop:20, flex:1, marginBottom:30},
    home_not_found_txt:{fontFamily:'Calibri-Bold',fontSize:18, textAlign:'center', padding:7, 
    paddingTop:10, paddingLeft:7, paddingRight:0, color:'#fff'},
    home_not_found_main:{alignItems:'center',marginBottom:20, borderWidth:1, borderColor:'#6b9ad8', 
    borderRadius:20, overflow:'hidden', backgroundColor:'#6b9ad8'},
    home_not_found_main_m:{flexDirection:'row', },
    notfound_h_txt:{color:'#fff',fontSize:20,paddingTop:12, paddingBottom:10},
    home_not_found_main2:{backgroundColor:'#20b66f', backgroundColor:'#20b66f'},
    donation_scroll:{flex:1,marginTop:30,},
    //cards
    payments_add_btn:{width:25,height:25},
    payments_add_area:{padding:20, position:'absolute', right:0, top:0, zIndex:99, paddingTop:25, paddingRight:30, paddingBottom:10 },
    cards_icons:{width:50, height:35, marginTop:5},
    card_delete_icons:{width:17,height:20},
    card_delete_icons2:{width:20,height:20},
    follow_channel_list_single_right:{flexDirection:'row',alignItems:'flex-start', justifyContent:'flex-start'},
    vator_icon_big:{fontSize:40,color:'#262626'},
    follow_channel_list_single_right2:{marginTop:5},
    form_row_2:{alignItems:'flex-start', flexDirection:'row', justifyContent:'flex-start',paddingTop:10, paddingBottom:10, borderBottomWidth:1, borderBottomColor:'#F4F6F7',},
    form_row_4:{flex:2},
    label2:{fontWeight:'bold',fontFamily:'Calibri-Bold',fontSize:16},
    label23:{marginTop:20},
    edito_trac_touch:{padding:15, paddingTop:0},
    donat_user_data:{justifyContent:'center', alignItems:'center', marginTop:20, marginBottom:20},
    donations_page_name:{fontFamily:'Calibri-Bold',fontSize:16, fontWeight:'bold', marginTop:10},
    donat_user_data22:{width:'100%'},
    donat_user_data2:{justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'},
    input_field222:{fontSize:60, fontFamily:'Calibri-Bold', lineHeight:60, color:'#1bb3e1', textAlign:'center', marginTop:20, marginBottom:10},
    input_field2223:{borderRadius:3, borderWidth:1, borderColor:'#eeeff2', padding:0,  height:50, paddingRight:15, marginLeft:0, 
    marginRight:0, marginTop:20, marginBottom:25, backgroundColor:'#eeeff2',height:90},

    donat_user_data2_e:{flexDirection:'row'},
    heading_area_back45:{paddingTop:47},
    donat_user_data2_left:{flex:2},

    card_selection_area:{backgroundColor:'#ECEDED', position:'absolute', bottom:0, right:0, left:0, zIndex:99},
    card_selection_area_top:{flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', borderColor:'#d1d3d3', borderBottomWidth:1, borderTopWidth:1},
    card_selection_area_top_left:{flex:2},
    header_area23:{borderWidth:0, backgroundColor:'#fafafa', paddingTop:20},
    container_followers23:{backgroundColor:'#fafafa'},
    card_selection_area_top_select:{fontFamily:'Calibri-Bold',fontSize:16, padding:15,fontWeight:'bold',color:'#262626'},
    card_selection_area_top_cancel_tx:{fontFamily:'Calibri-Bold',fontSize:16, padding:15,textAlign:'right',fontWeight:'bold', color:'#6BAEF6'},
    pop_card_selction_single:{padding:15, borderColor:'#dbdfdf', borderBottomWidth:1,},
    pop_card_selction_single_area:{position:'relative',paddingLeft:50},
    s_label33:{fontFamily:'Calibri',fontSize:15, color:'#000'},
    s_label334:{fontFamily:'Calibri',fontSize:13, color:'#999'},
    s_label3345:{color:'#6BAEF6', textAlign:'center'},

    ds_slider:{height: 50, width: 150,  position:'absolute', zIndex:999, bottom:0 },
    donations_list_con:{backgroundColor:'#fff'},


    addCardView:{flex:1, marginTop:40 },
    card_top_contaner:{backgroundColor:'#44c7f3', paddingLeft:30, paddingRight:30, paddingBottom:30, paddingTop:10},
    input_field_card:{paddingTop:10, paddingBottom:7, color:'#262626', fontFamily:'Calibri',fontSize:16, paddingLeft:0, borderBottomWidth:1, borderBottomColor:'#0395c5', },
    form_row_card:{position:'relative', marginTop:10 },
    card_label_ds:{color:'#262626', fontSize:14, marginTop:10},
    form_row_25:{borderBottomWidth:0},
    input_field_card3:{marginRight:5},
    label234:{textAlign:'center', margin:0,padding:0, color:'#999', paddingTop:40, paddingBottom:15, fontSize:20, fontFamily:'Calibri'},
    input_field_crd_btn:{paddingLeft:30},
    input_field_card45:{marginLeft:5},

    //modal middle style
    ds_modal:{backgroundColor:'transparent', flex:1, justifyContent:'flex-end',},
    ds_modal_bottom:{opacity:1, backgroundColor:'#fff', padding:5, marginTop:15, alignItems:'center', marginLeft:'5%', marginRight:'5%', borderRadius:7, marginBottom:15, overflow:'hidden'},
    ds_modal_bottom_cancel:{paddingTop:15, paddingBottom:10,  color:'#057bf9', fontFamily:'Calibri-Bold', fontSize:18},
    ds_modal_top:{backgroundColor:'#fff',  marginLeft:'5%', marginRight:'5%', borderRadius:7, overflow:'hidden'},
    ds_modal_top_row:{borderBottomWidth:1, borderBottomColor:'#ddd', alignItems:'center', backgroundColor:'#fff'},
    ds_modal_top_row_txt:{color:'#057bf9', padding:15, fontSize:18,fontFamily:'Calibri'},
    ds_modal_top_row_last:{borderBottomWidth:0},


    //signup page 
    sign_ucontainer:{backgroundColor:'#fff',flex:1, justifyContent:'center', position:'relative'},
    sign_logo:{width:200,height:62},
    heading_area_back2:{ paddingBottom:30, paddingRight:50,},
    signip_login_page:{flex:1,justifyContent:'center',alignItems:'center', height:screen.height},
    signip_login_page34:{flex:1,alignItems:'center'},
    login_logo_area:{marginBottom:50},
    sign_login_form:{width:screen.width},
    input_field_signup:{borderWidth:1,fontFamily:'Calibri', borderColor:'#ebf2f5', borderRadius:25, backgroundColor:'#ebf2f5', padding:10,width:'80%',textAlign:'center', marginLeft:'10%', fontSize:16, color:'#262626'},
    login_form_label:{textAlign:'center',fontFamily:'Calibri-Bold',fontSize:18, marginBottom:15,  color:'#262626'},
    signip_login_page_ha_txt:{textAlign:'center',fontFamily:'Calibri', fontSize:18, padding:15, 
    color:'#262626',
    paddingTop:20,
    ...ifIphoneX({
            paddingBottom:20
        }, {
            
        })
    },
    
    signip_login_page_hav:{position:'absolute', bottom:0, right:0, left:0, zIndex:99, backgroundColor:'transparent'},
    signup_loading:{marginTop:20},
    login_form_row_bottom:{alignItems:'flex-end'},
    extra_submit_btn_txt:{fontSize:18,padding:10, color:'#fff', borderWidth:1, borderColor:'#007aff', backgroundColor:'#007aff', paddingRight:20, paddingLeft:20, marginTop:20, fontFamily:'Calibri-Bold', paddingTop:10},
    device_single:{ marginLeft:'10%',  marginRight:'10%', marginBottom:10},
    device_single_left_tx:{fontSize:18, fontFamily:'Calibri-Bold', paddingTop:10, paddingLeft:7, color:'#262626'},
    device_single_left:{flex:2},
    login_form_row_features:{marginBottom:20, marginTop:25},
    device_single_left2:{justifyContent:'flex-start', alignItems:'flex-start', flexDirection:'row',},
    enable_f_icons:{color:'#262626',fontSize:20,marginTop:10},

    //social connect
    login_form_row_social:{alignItems:'center'},
    login_form_row_social456:{backgroundColor:'#868686'},
    signup_connect_touch:{marginBottom:20,
    backgroundColor:'#48669D', borderRadius:25, overflow:'hidden',padding:5, paddingLeft:20, paddingRight:20, alignItems:'center'},
    signup_connect_touch_a:{flexDirection:'row',width:200},
    signup_connect_touch256:{backgroundColor:'#ff6f69'},
    signup_connect_img2:{color:'#fff',fontSize:25, padding:5},
    signup_connect_img21:{color:'#fff',fontSize:22, padding:5},
    signup_connect_txt:{color:'#fff', fontFamily:'Calibri-Bold', fontSize:16, 
    paddingTop:7, textAlign:'center'},
    signup_connect_touch2:{backgroundColor:'#1BB3E1'},
    extra_submit_btn_txt_s:{backgroundColor:'#FE6D67',borderColor:'#FE6D67'},

    //invite page
    invie_container:{position:'relative', flex:1, backgroundColor:'#fff'},
    invite_heading:{position:'absolute', top:0, left:0, right:0, backgroundColor:'#fafafa', zIndex:999},
    invite_heading_top:{alignItems:'center', marginBottom:10,
        ...ifIphoneX({
            paddingTop:15
        }, {
            
        })
    },
    invite_heading_top_txt:{paddingTop:12, fontFamily:'Calibri-Bold', fontSize:18, color:'#262626'},
    invite_heading_bottom_single:{flex:4,alignItems:'center',  borderColor:'#b3b3b3', borderBottomWidth:2,
    paddingBottom:5, ...ifIphoneX({
            paddingTop:0, 
        }, {
            paddingTop:0, 
        })},
    invite_heading_bottom2:{marginTop:10},
    invite_heading_bottom:{flexDirection:'row'},
    invite_heading_bottom_txt:{fontSize:16, fontFamily:'Calibri-Bold', color:'#868686', },
    invie_lfet_btn:{position:'absolute',left:0,top:0,zIndex:999},
    invie_lfet_btn_txt:{padding:10, paddingTop:5, paddingBottom:5, backgroundColor:'#a066b3', color:'#fff', fontFamily:'Calibri-Bold', 
    marginLeft:15, marginRight:15, borderRadius:10, overflow:'hidden', marginTop:10},
    invie_lfet_btn2:{position:'absolute',right:0,top:0, zIndex:999},
    invie_lfet_btn_txt2:{backgroundColor:'#01a656'},
    invite_heading_bottom_single_active:{borderColor:'#1bb3e1'},
    channel_list_text2:{color:'#868686',marginTop:0, fontStyle:'italic', fontFamily:'Calibri-Bold'},
    channel_follow_text2:{borderRadius:13,paddingTop:3,paddingBottom:4, backgroundColor:'#2dafdf',marginTop:15},
    invie_lfet_btn_txt3:{paddingLeft:20, paddingRight:20,},
    donate_pay_btn:{backgroundColor:'#252429', paddingTop:10, paddingBottom:6, borderRadius:20, overflow:'hidden', margin:10, alignItems:'center', marginLeft:20, marginRight:20},
    donat_icons_txt:{color:'#fff', fontFamily:'Calibri-Bold',padding:5, paddingTop:0},
    donat_icons_ca:{width:20,height:20},
    donate_pay_btn23:{backgroundColor:'#1bb3e1'},
    donate_pay_btn_area:{flexDirection:'row', alignItems:'flex-start', justifyContent:'flex-start'},


    invite_heading_top2:{flexDirection:'row', alignItems:'flex-start'},
    invite_heading_top_left:{flex:3,position:'relative'},
    invite_heading_top_right:{flex:1,},
    search_form_row:{paddingTop:7, paddingBottom:7, borderWidth:1, borderColor:'#eef0f2', 
    marginLeft:20, position:'relative', marginTop:5, marginBottom:10, flex:1, 
    textAlign:'center', backgroundColor:'#eef0f2', borderRadius:10, color:'#262626', fontFamily:'Calibri', fontSize:16},
    search_input_error:{borderBottomColor:'red'},
    search_form_row2:{marginTop:10, marginRight:20, marginBottom:10},
    clear_serach_txt:{fontSize:20, backgroundColor:'#eef0f2', paddingTop:5, paddingBottom:8, borderRadius:10, marginLeft:15, overflow:'hidden', color:'#868686', textAlign:'center', marginRight:15},
    single_creator_area:{flexDirection:'row',borderColor:'#eef0f2', borderBottomWidth:1, padding:15, paddingBottom:0, paddingTop:10, },
    single_creator_area_right:{marginLeft:15, marginTop:8},
    single_creator_txt_2:{fontFamily:'Calibri-Bold', color:'#262626'},
    single_creator_txt_23:{fontFamily:'Calibri', color:'#868686'},
    single_creator_img2:{width:40, height:40, borderRadius:20, marginTop:10},
    single_serach_tag:{paddingTop:5, paddingBottom:15, color:'#262626'},
    invite_heading_top23:{marginBottom:0,backgroundColor:'#fff'},
    home_trensing_icons:{position:'absolute',top:0,right:0,zIndex:99},


    trending_page_icons:{width:20,height:27, marginTop:5},
    clear_serach_trenn:{backgroundColor:'transparent', alignItems:'flex-end',paddingRight:30, 
    paddingLeft:0, paddingTop:7, paddingBottom:17},
    clear_serach_trenn2:{ backgroundColor:'transparent', paddingLeft:50, 
    paddingBottom:12,
    paddingTop:5,
    },
    listing_heading23:{marginBottom:10},
    not_found_single_txt:{textAlign:'center', fontFamily:'Calibri',fontSize:18, paddingTop:20,color:'#b3b3b3' },
    clear_serach_txt_main:{color:'#262626',fontSize:18,  fontFamily:'Calibri',...ifIphoneX({
            paddingTop:37,
        }, {
            paddingTop:10,
        })},
    clear_serach34:{alignItems:'center', marginTop:5},
    clear_serach_txt34:{position:'absolute',right:0,top:5, backgroundColor:'transparent',zIndex:9},
    clear_serach_txt34_txt:{padding:10,color:'#868686', fontFamily:"Calibri-Bold", paddingRight:15, paddingTop:12},
    invite_heading_bottom_txt_active:{color:'#262626'},
    search_cions:{position:'absolute',left:30,top:20, backgroundColor:'transparent',zIndex:99,
    fontSize:20, color:'#868686'},

    //trending page
    single_v_card:{margin:10, marginBottom:20},
    single_v_card_img:{width:250, height:250, borderRadius:5,overflow:'hidden'},
    single_v_card_user_p:{width:25,height:25,borderRadius:12.5,overflow:'hidden',alignItems:'flex-start',marginRight:10},
    single_v_card_bottom_bottom:{flexDirection:'row', alignItems:'flex-start', justifyContent:'flex-start', flex:1},
    single_v_card_bottom_bottom_t:{flexDirection:'row', alignItems:'flex-start', justifyContent:'flex-start'},
    single_v_card_t:{fontFamily:'Calibri-Bold',fontSize:16,paddingTop:10,color:"#262626"},
    single_v_card_user:{marginTop:2},
    nopos_profile:{alignItems:'center'},
    nopos_profile_top:{alignItems:'center'},
    nopos_profile_top_i:{fontSize:70,marginTop:50, marginBottom:20, color:'#262626'},
    nopos_profile_top_txt:{fontSize:16, fontFamily:'Calibri-Bold', color:'#262626'},
    nopos_profile_bottom:{alignItems:'center', backgroundColor:'#efefef', paddingTop:30,  width:screen.width,  backgroundColor:'#efefef', position:'absolute', left:0, right:0,...ifIphoneX({
    bottom:68
}, {
    bottom:60
})},
    nopos_profile_bottom_t2:{fontFamily:'Calibri', fontSize:16, color:'#262626'},
    nopos_profile_top_i2:{fontSize:30,color:'#262626',marginTop:5},
    login_form_row_social45:{marginTop:50},
    single_notification24:{backgroundColor:'#e7e7e9'},
    donation_lists_single34:{backgroundColor:'#ddd'},
    donation_lists_single_right34:{backgroundColor:'#ddd'},
    donation_lists_single_right_txt34:{color:'red'},
    ds_style_hash:{width:65, alignItems:'center', },
    locations_icons:{fontSize:45,color:'#868686', marginRight:10},
    hash_icons:{fontSize:25,color:'#868686', marginRight:10, marginTop:5, textAlign:'center'},
    single_creator_area2:{paddingTop:15, paddingBottom:10,},

    input_fiepaypal:{borderRadius:3, borderWidth:1, borderColor:'#eeeff2', padding:0,  paddingRight:15, marginLeft:0, 
    marginRight:0, marginTop:20, marginBottom:25, backgroundColor:'#eeeff2', textAlign:'center', height:50},
    donat_user_data245:{marginTop:20},
    current_lab:{color:'#262626', fontSize:16, fontFamily:'Calibri'},
    right_done_opacity345:{paddingTop:10, paddingLeft:20},
    payment_row_v:{flex:3},
    payment_row:{fontFamily:'Calibri',fontSize:16,color:'#262626'},
    payment_row2:{textAlign:'center', fontFamily:'Calibri'},
    follow_channel_list_single34:{paddingLeft:15, paddingRight:15, paddingTop:10, marginTop:5, marginBottom:5, flexDirection:'row', justifyContent:'flex-start'},

    new_p_views:{fontSize:16,color:'#C03BA4',fontFamily:'Calibri-Bold', textAlign:'right',fontSize:16},
    new_profile_area:{alignItems:'flex-start', flexDirection:'row', marginTop:5, marginBottom:10},
    new_profile_area_left:{flex:2},
    categories_area:{marginTop:20},
    categories_area2:{marginTop:0},


    single_v_card_bottom:{position:'absolute', bottom:0,right:0,left:0,zIndex:9, alignItems:'flex-start', flexDirection:'row'},
    single_v_card_views:{backgroundColor:'transparent', color:'#fff', fontFamily:'Calibri', fontSize:14},
    single_v_card_circles:{backgroundColor:'transparent', color:'#fff', fontFamily:'Calibri', fontSize:14},
    single_v_card_bottom_right:{alignItems:'flex-end', marginRight:10, marginBottom:10},
    donation_donarsexplode:{marginTop:0, marginBottom:15},

    top_list_videos23:{marginBottom:0, paddingBottom:0},
    single_v_card_top_img_t:{position:'relative'},
    single_v_card_top_img_tt:{position:'absolute', zIndex:9, top:10, left:10, backgroundColor:'transparent', fontFamily:'Calibri',fontSize:16, color:'#fff'},
    search_cions34:{top:41},
    search_form_row34:{marginRight:0},
    search_form_row45:{marginRight:20, marginTop:10},
    search_cions45:{top:25},
    top_creators_top_homet:{marginTop:20, marginBottom:0},


    new_trending_top:{flex:1, alignItems:'flex-start', flexDirection:'row',backgroundColor:'#F5F6F7',paddingTop:20,paddingBottom:20},
    new_trending_top_left:{flex:2, alignItems:'center'},
    new_trending_top_leftimg:{width:30, height:30},
    new_trending_top_txt:{fontSize:16, fontFamily:'Calibri', color:'#777777', marginTop:10},
    new_trending_top_left_tou:{alignItems:'center',},


    single_category_new:{flexDirection:'row', alignItems:'flex-start', backgroundColor:'#ddd', borderRadius:50, marginBottom:10, width:'75%',paddingLeft:5},
    trensing_cats_new:{marginBottom:10,flexDirection:'row',justifyContent:'flex-start',backgroundColor:'#fff',paddingTop:20,paddingBottom:20},
    single_category_txt34:{fontFamily:'Calibri-Bold',fontSize:20, color:'#fff', marginTop:12, marginLeft:5},
    single_creator_img3:{width:40,height:40,borderRadius:20, marginTop:5, marginBottom:5},

    trending_tags_new_ht:{backgroundColor:'#D4D4D4', color:'#5D625F', fontFamily:'Calibri-Bold', 
    fontSize:20, textAlign:'center', paddingTop:15, paddingBottom:15},
    trending_tags_new_c:{flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', flex:1},
    trending_tags_new_c_left:{flex:3},
    trending_tags_new_single_t:{backgroundColor:'#EFF0F1', textAlign:'center',
    color:'#646966', fontFamily:'Calibri-Bold', fontSize:15,borderRadius:10,overflow:'hidden',
    margin:10,paddingTop:4,paddingBottom:5,marginBottom:0},
    donation_donars_top_txt2:{color:'#262626', fontSize:18},
    single_category_new_1:{backgroundColor:'red'},
    exploreSchorrl2:{flex:1,...ifIphoneX({
    marginBottom:60,
    marginTop:43
}, {
    marginBottom:50,
    marginTop:30
})},

    trending_tags_new:{marginBottom:20},


    login_form_row_picker23:{backgroundColor:'#424242', marginTop:20},
    preview_options_pay_img:{color:'#fff', fontSize:50},



    //trim
    trim_container:{flex:1, backgroundColor:'#000'},
    videoPlayer_main:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    zIndex:0
  },
  videoPlayer_main2:{
    position:'absolute',
    top:50,
    left:0,
    right:0,
    bottom:0,
    zIndex:0
  },
  player_trim:{
    position:'absolute',
    left:0,
    right:0,
    bottom:20,
    height:150,
    borderTopWidth:1,
    borderTopColor:'#090909',
    paddingTop:15,
    zIndex:9,
  },
  selec_duration_text:{
    position:'absolute',
    right:20,
    top:50,
    color:'#fff',
    fontSize:16,
    zIndex:9
  },

  trim_videoPlayer:{
    position:'absolute',
    top:80,
    left:0,
    right:0,
    margin:0, padding:0,
    height:screen.width
  },

  single_listing_middle_b_single_i_real:{fontSize:30,color:'#262626'},


   //winners
    winners_top:{backgroundColor:'#3C6C81', alignItems:'flex-start',flexDirection:'row'},
    winners_top_left:{flex:2},
    winners_top_left_tts:{alignItems:'center', justifyContent:'center', paddingTop:30, paddingBottom:20},
    winners_single_pp:{width:50,height:50,borderRadius:25,overflow:'hidden', marginBottom:10},
    winners_top_left2:{width:30,height:30},
    winners_top_left22:{width:30,height:31},
    winners_top_txt1:{fontFamily:'Calibri-Bold',color:'#fff',fontSize:18, marginTop:10,},
    winners_top_txt2:{fontFamily:'Calibri-Bold',color:'#fff',fontSize:30},
    profile_s_t34:{fontFamily:'Calibri',fontSize:20},


    winners_list_single:{backgroundColor:'#8446bb',alignItems:'flex-start', flexDirection:'row', paddingTop:5, paddingBottom:5},
    winners_list_single_leftimg:{width:54,height:54,borderRadius:27,overflow:'hidden', marginTop:8, borderColor:'#788A94', borderWidth:5},
    winners_list_single_left:{flex:1,alignItems:'center'},
    winners_list_single_right:{flex:3,borderBottomWidth:1,borderBottomColor:'#F6F6F5', paddingTop:10, paddingBottom:10,position:'relative'},
    winners_list_single_right_left_t:{alignItems:'flex-start',flexDirection:'row',},

    winners_single_tt:{color:'#fff',fontSize:16,fontFamily:'Calibri-Bold', paddingLeft:8, paddingTop:10},
    winners_single_tt2:{position:'absolute',right:15, top:16, color:'#fff',fontSize:20,fontFamily:'Calibri-Bold',padding:10, paddingTop:5, paddingBottom:5, borderRadius:15, overflow:'hidden', backgroundColor:'#8670bd'},
    cat_SCroll2:{marginBottom:0},
    winners_list_single_right_last:{borderBottomWidth:0},
    winners_list:{position:'relative'},

    winners_date_list_single:{backgroundColor:'#F7F7F6'},
    winners_date_list_singleT:{position:'relative', padding:15, borderBottomWidth:1,borderBottomColor:'#ddd'},
    winners_date_list_single_tt:{color:'#868686',fontSize:20,fontFamily:'Calibri-Bold', paddingTop:5},
    winners_date_list_single_ff:{fontSize:30,position:'absolute',right:0, bottom:0,top:0, padding:15},
    winners_top_troppy_new:{width:30,height:30,marginTop:15,
        marginRight:15,  marginBottom:15, marginLeft:15},
    invite_heading_top278:{width:'85%',marginBottom:0},
    winners_menu_new:{position:'absolute',right:0,top:0,},
    search_form_row45:{marginTop:10},
    search_cions678:{...ifIphoneX({
    top:40,
}, {
    top:22,
})},


    uploadBar: {
        width: screen.width,
        height: 5,
        opacity: 1,
        marginTop:3,
        backgroundColor:'rgba(0,0,0,.2)',
        position:'absolute',
        zIndex:999999,
        left:0,right:0,
        
        ...ifIphoneX({
            top:75,
        }, {
            top:45,
        })
    },
    uploadBarGauge: {
        width: 0,
        height: 5,
        backgroundColor: "#02B4EB"
    },
    uploadBar_explore:{top:54,},
    uploadBar_cat:{top:37,},
    uploadBar_profile:{top:33,},


    pick_follers:{borderBottomWidth:1, borderBottomColor:'#efefef',maxHeight:200,borderTopWidth:1, 
    borderTopColor:'#efefef', flex:1, width:screen.width, position:'relative',zIndex:9, backgroundColor:'#fff'},
    pick_follers_single_to:{flexDirection:'row',flex:1,position:'relative'},
    pick_follers_single_img:{width:30,height:30,borderRadius:15, marginLeft:15, marginTop:7, position:'absolute', left:0,top:0,bottom:0},
    pick_follers_single_area:{borderBottomWidth:1, borderBottomColor:'#fafafa',flex:1, marginLeft:50},
    pick_follers_single_txt:{fontSize:16,color:'#262626', padding:10, fontFamily:'Calibri',paddingTop:12},
    pick_follers_post:{position:'absolute',left:0,right:0,bottom:0,zIndex:99,},


    new_loading_up:{backgroundColor:'#000',position:'absolute',left:0,right:0,bottom:0,top:0, alignItems:'center',justifyContent:'center'},
    new_loading_up_txt:{color:'#fff',fontSize:16,fontFamily:'Calibri', marginBottom:10},

    closeto_bottom_cmnts:{marginTop:10, marginBottom:5},


    home_new_friemds_area:{borderBottomWidth:1, borderBottomColor:'#D4D4D4'},
    new_trending_top_left_tou1:{paddingTop:20, paddingBottom:10},
    new_winners_home:{width:40,height:40},

    profile_user_plus34:{fontSize:25,paddingBottom:15,paddingTop:10},
    winners_top_troppy_new45:{marginTop:10,width:25,height:25},




    preview_re_order:{position:'absolute',zIndex:99,right:120,top:0,padding:20,left:120, alignItems:'center',
    backgroundColor:'transparent',
    ...ifIphoneX({
        paddingTop:40,paddingBottom:15,
    }, {
        paddingTop:27,paddingBottom:18,
    })
    },
    preview_re_order_img:{width:30,height:30,},
    donat_user_data2_e45:{alignItems:'center',justifyContent:'center'},
    donate_pay_btn_area23:{paddingLeft:25,paddingRight:25},
    tokenScroll:{flex:1,...ifIphoneX({
        marginTop:80, 
    }, {
        marginTop:40, 
    })},
    purchase_coins:{margin:30, marginTop:10},
    purchase_coins_touch:{flexDirection:'row',alignItems:'flex-start',
    justifyContent:'flex-start',borderBottomColor:'#ddd',borderBottomWidth:1},
    purchase_coins_txt:{flex:3,padding:15,fontSize:16,fontFamily:'Calibri',paddingTop:20,color:'#262626'},
    purchase_coins_txt2:{fontFamily:'Calibri-Bold',color:'purple'},

    ituesnError:{alignItems:'center',marginTop:30},
    ituesnError_txt:{color:'#262626',fontFamily:'Calibri',fontSize:16,marginBottom:10},
    ituesnError_txt2:{color:'purple',fontFamily:'Calibri-Bold',fontSize:16,padding:10},

    gift_modal_area:{width:screen.width, height:screen.height,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,.4)'},
    gift_modal:{backgroundColor:'#fff',width:300,borderRadius:10,overflow:'hidden',alignItems:'center'},
    gift_modal_bottom:{flexDirection:'row',alignItems:'flex-start',borderTopWidth:1,borderTopColor:'#ddd'},
    gift_modal_bottom_left:{flex:2},
    gift_modal_top:{padding:15},
    gift_modal_middle_input:{borderColor:'#ddd',borderWidth:1,padding:10,fontFamily:'Calibri',fontSize:16,marginBottom:15,width:270, borderRadius:5,paddingTop:7,paddingBottom:7,color:'#262626',textAlign:'center'},
    gift_modal_top_txt1:{fontFamily:'Calibri-Bold',color:'#262626',fontSize:18,paddingTop:15,textAlign:'center'},
    gift_modal_top_txt2:{fontFamily:'Calibri',color:'#262626',fontSize:14,textAlign:'center'},
    gift_modal_bottom_left2:{borderRightWidth:1,borderRightColor:'#ddd'},
    gift_modal_bottom_left_ctxt:{fontFamily:'Calibri-Bold',fontSize:18,textAlign:'center',padding:10,color:'grey'},
    gift_modal_bottom_left_ctxt2:{fontFamily:'Calibri-Bold',fontSize:18,textAlign:'center',padding:10,color:'purple'},



    commmpe_going_sgg:{marginTop:50,paddingTop:200},
    commmpe_going_sto_start:{textAlign:'center',fontSize:20,fontFamily:'Calibri-Bold',color:'#868686',},
    single_tag_d:{
        color:'#2A59AB',fontSize:18,fontFamily:'Calibri'
      },
    single_cmnt_raw_pro:{
        color:'#262626',fontSize:16,fontFamily:'Calibri'
      },

    single_tag_d_t:{color:'#262626',fontSize:18,fontFamily:'Calibri'},
    single_cmnt_raw_pro_follow:{color:'#2A59AB'},
    single_cmnt_raw_pro_tag:{color:'#2A59AB'},
    single_cmnt_raw_pro_lunk:{color:'#2A59AB'},

    single_tag_d_tga:{color:'#2A59AB',},
    single_tag_d_link:{color:'#2A59AB'},
    single_tag_d__fol:{color:'#2A59AB'},
    current_lab_lib:{fontSize:14, marginTop:5, color:'#444'},
    back_to_home:{fontFamily:'Calibri-Bold',fontSize:18, color:'#000', padding:15},


    activity_new:{marginTop:7,paddingLeft:5,paddingRight:20},
    new_likes_area:{justifyContent:'flex-start',alignItems:'flex-start',flexDirection:'row'},


    passwordScroll:{
        ...ifIphoneX({
            flex:1, marginTop:80
        }, {
            flex:1, marginTop:70
        })
    },
    winners_dummy:{width:screen.width},
    no_winners_page:{position:'relative'},
    no_winners_page_bottom:{position:'absolute',left:0,right:0,top:0, bottom:0,zIndex:99, backgroundColor:'rgba(0,0,0,.8)'},

    heart_hover_area:{position:'absolute',left:0,right:0,top:0,bottom:0,zIndex:99, alignItems:'center',justifyContent:'center',},
    heart_hover_area_icons:{fontSize:80,color:'#fff',backgroundColor:'transparent'},
    withdrawlScroll:{flex:1,marginTop:70},



    winP_area:{flex:1,backgroundColor:'transparent', alignItems:'center',justifyContent:'center'},
    winP_area_user_extra:{alignItems:'center'},
    winner_background:{position:'absolute', width:screen.width,height:screen.height},
    winer_ppic_c:{width:80,height:80,borderRadius:40,overflow:'hidden'},
    winP_area_user:{marginTop:20,marginBottom:20},
    winP_area_txt:{alignItems:'center'},
    congrats:{fontFamily:'Calibri-Bold',color:'#fff',fontSize:30},
    congrats_user:{fontFamily:'Calibri-Bold',color:'#fff',fontSize:20,marginTop:5,marginBottom:5},
    congrats_winn:{fontSize:24,fontFamily:'Calibri',color:'#fff',paddingRight:20,paddingLeft:20, textAlign:'center'},
    congrats_amoun:{fontFamily:'Calibri-Bold',color:'#fff',fontSize:26,borderColor:'#ddd', borderWidth:1, paddingTop:10, paddingLeft:20, paddingRight:20, paddingBottom:10, marginTop:20, marginBottom:25,},
    congrats_cliam:{backgroundColor:'#fff',fontFamily:'Calibri',fontSize:26, color:'#515151', paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom:10, borderRadius:25, overflow:'hidden'},

    setp_to_follow:{color:'#fff',fontSize:20},
    withdrawlScroll45:{backgroundColor:'#f4f7f7',...ifIphoneX({
            marginTop:60
        }, {
            marginTop:50
        }) },
    win_share_bottom:{alignItems:'center',padding:50, paddingTop:15},
    win_share_bottom_mtxt:{fontFamily:'Calibri',fontSize:18, color:'#000',textAlign:'center'},
    win_share_top_top_txt2:{fontFamily:'Calibri',fontSize:20, color:'#000',paddingRight:18},
    win_share_bottom_tttx:{marginTop:15, backgroundColor:'#5ac3ef',color:'#fff',fontSize:20, paddingLeft:50, paddingRight:50, paddingTop:17, paddingBottom:15, borderRadius:30,overflow:'hidden', marginBottom:20, textAlign:'center'},
    win_share_top_left:{alignItems:'flex-start', marginLeft:15},
    win_share_top_right:{marginLeft:15,flex:3},
    win_share_top_top_txt:{color:'#fff', fontSize:18, backgroundColor:'#edc023', width:40, height:40, borderRadius:20, paddingTop:10, overflow:'hidden', textAlign:'center', justifyContent:'center'},
    win_share_top_top:{marginBottom:40,flexDirection:'row',},
    win_share_top:{paddingTop:40,backgroundColor:'#fff'},
    win_share_top_top2:{marginBottom:20},

    win_share_top_top_txt22:{backgroundColor:'#5ded23'},
    share_touch_btn:{alignItems:'center'},
    share_touch_btn_txt:{color:'#000', backgroundColor:'#fed948',paddingLeft:30, paddingRight:30,paddingTop:10, paddingBottom:10, borderRadius:20, marginTop:15, overflow:'hidden', textAlign:'center', fontFamily:'Calibri', fontSize:18,},
    win_share_top_right_right_img:{width:70,height:92},
    win_share_top_right_right:{flex:1},
    clock_icon_video_noti:{color:'#b1c7d7',paddingRight:3,paddingTop:2},





    channel_follow_text267:{backgroundColor:'#fff', color:'#bbb', borderColor:'#bbb', borderWidth:1},
    channel_follow_text56:{paddingTop:4, paddingBottom:5},
    profile_sma_cions67:{color:'#fff'},
    new_p_follow_m67:{backgroundColor:'#3897f1',borderColor:'#3897f1',},
    new_p_follow_m1676:{backgroundColor:'#fff', borderColor:'#bbb'},
    profile_sma_cions676:{color:'#bbb'},
    win_heading67:{fontSize:16},
    new_video_cmnts:{justifyContent:'flex-start', flexDirection:'row', alignItems:'flex-start',marginTop:5, borderColor:'#f0f1f3', borderTopWidth:1, borderBottomWidth:1},
    new_video_cmnts_right_main:{justifyContent:'flex-start', flexDirection:'row', alignItems:'flex-start'},
    new_video_cmnts_left:{backgroundColor:'#f0f1f3',  width:screen.width/2},
    new_video_cmnts_right:{alignItems:'center',width:screen.width/2,},
    new_video_cmnts_left_txt:{fontFamily:'Calibri',color:'#758a91',fontSize:16, padding:8, paddingLeft:15, paddingRight:5, paddingBottom:10},
    new_video_cmnts_right_txt:{fontFamily:'Calibri-Bold',color:'#758a91',fontSize:16, paddingRight:4,paddingTop:8,paddingBottom:10},
    ew_video_c_comments_down:{color:'#758a91', fontSize:20,paddingTop:8},
    video_edit_btn:{position:'absolute', zIndex:99, right:0, top:0,},

    back_to_home78:{padding:5},
    login_logo_area_new:{marginBottom:50, marginTop:100},
    signip_login_page_hav34:{alignItems:'center'},
    pronounced_as:{color:'#c5b8b1',fontSize:16, fontFamily:'Calibri-Bold',textAlign:'center'},
    privacy_terms:{textAlign:'center',color:'#444',fontSize:14,fontFamily:'Calibri', marginTop:10,marginBottom:10},
    signip_login_page_ha_txt56:{textAlign:'center',width:250, fontSize:20,fontFamily:'Calibri-Bold', color:'#fff', backgroundColor:'#ffd05e', padding:10,paddingRight:15,paddingLeft:15, borderRadius:20, overflow:'hidden'},



    new_trending_top2:{backgroundColor:'#efefef'},
    winners_top_list:{flex:3, alignItems:'center', backgroundColor:'#7744b4'},
    winners_top_list_area:{alignItems:'center', marginTop:20, marginBottom:20},
    winners_list_single_right_top:{alignItems:'center'},
    winners_single_pp45:{width:70,height:70,borderRadius:35},
    winners_single_tt23:{fontFamily:'Helvetica',fontSize:16,textAlign:'center', marginTop:10, marginBottom:10,color:'#fff'},
    winners_single_tt278:{fontSize:16, fontFamily:'Helvetica-Bold',color:'#fff', marginTop:8, backgroundColor:'#8670bd', padding:10, paddingTop:5, paddingBottom:5, borderRadius:15, overflow:'hidden'},


    date_show_area:{flexDirection:'row',backgroundColor:'#8446bb', paddingTop:20, paddingBottom:20},
    date_show_area_left:{width:'20%'},
    date_show_area_middle:{width:'60%'},
    date_show_area_middle_txt:{textAlign:'center',color:'#000',fontSize:20, fontFamily:'Helvetica-Bold', backgroundColor:'#fad455', padding:10, paddingLeft:10, paddingRight:10, borderRadius:20, overflow:'hidden', marginTop:5},
    left_right_winners_icons:{color:'#fff', textAlign:'center',fontSize:50, padding:5, paddingTop:0},
    winner_page_top_new:{flexDirection:'row'},
    winners_single_pp4589:{width:100,height:100,borderRadius:50},
    winners_top_list23:{paddingTop:20},
});