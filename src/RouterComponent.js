//import libray
import React from 'react';
import {
  Scene,
  Router
} from 'react-native-router-flux';


import LoginForm from './users/LoginForm';
import SignupForm from './users/SignupForm';
import Forgot from './users/Forgot';
import Invite from './users/Invite';
import RealSignIn from './users/RealSignIn';


import Profile from './profile/Profile';
import EditProfile from './profile/EditProfile';
import Setting from './settings/Setting';
import Reset from './profile/Reset';
import Record from './record/Record';
import Preview from './record/Preview';
import Trim from './record/Trim';
import Post from './record/Post';
import Home from './feeds/Home';
import termsofUse from './static-pages/termsofUse';
import privacyPolicy from './static-pages/privacyPolicy';
import helpCenter from './static-pages/helpCenter';
import accountLinked from './settings/accountLinked';
import blockUsers from './settings/blockUsers';
import Search from './feeds/Search';
import Notifications from './donations/Notifications';
import MyDonations from './donations/MyDonations';
import Comments from './feeds/Comments';
import LearnMore from './static-pages/LearnMore';
import Category from './feeds/Category';
import Likes from './profile/Likes';
import Followers from './profile/Followers';
import Cards from './donations/Cards';
import Card from './donations/Card';

import Query from './feeds/Query';
import Explore from './feeds/Explore';
import DraftPosts from './record/DraftPosts';
import UpdatePost from './record/UpdatePost';
import Withdraw from './donations/Withdraw';
import Payments from './donations/Payments';
import Winners from './donations/Winners';


import Trending from './feeds/Trending';
import Onrise from './feeds/Onrise';
import PurchaseCoins from './donations/PurchaseCoins';
import Purchases from './donations/Purchases';
import getWin from './donations/getWin';
import winShare from './donations/winShare';



import Picks from './feeds/Picks';
import Laugh from './feeds/Laugh';

//create components
const RouterComponent = () =>{
    return(
        <Router>
            <Scene key="root">

<Scene key="signin" type="replace" component={LoginForm} title="Sign In" hideNavBar={true} />
<Scene key="signup" component={SignupForm} title="Sign Up" hideNavBar={true} />
<Scene key="forgot"  component={Forgot} title="Forgot" hideNavBar={true} />
<Scene key="invite" type="replace" component={Invite} title="Invite" hideNavBar={true} />
<Scene key="realsignin" component={RealSignIn} title="realsignin" hideNavBar={true} />


<Scene key="record" type="replace" component={Record} title="Record" hideNavBar={true} />
<Scene key="preview" type="replace" component={Preview} title="Preview" hideNavBar={true} />
<Scene key="trim" type="replace" component={Trim} title="Trim" hideNavBar={true} />
<Scene key="post" type="replace" component={Post} title="Post" hideNavBar={true} />
<Scene key="draftposts"  component={DraftPosts} title="DraftPosts" hideNavBar={true} />
<Scene key="updatepost" component={UpdatePost} title="UpdatePost" hideNavBar={true} />


<Scene key="home" type="replace" component={Home} title="Home"  hideNavBar={true} initial/>
<Scene key="comments" component={Comments} title="Comments" hideNavBar={true} />
<Scene key="search" type="replace" component={Search} title="Search" hideNavBar={true} />
<Scene key="query" component={Query} title="Query" hideNavBar={true} />
<Scene key="explore" component={Explore} title="Explore" hideNavBar={true} />
<Scene key="trending" component={Trending} title="Trending" hideNavBar={true} />
<Scene key="onrise" component={Onrise} title="Onrise" hideNavBar={true} />
<Scene key="picks" component={Picks} title="Picks" hideNavBar={true} />
<Scene key="laugh" component={Laugh} title="Onrise" hideNavBar={true} />

<Scene key="LearnMore" component={LearnMore} title="LearnMore" hideNavBar={true} />
<Scene key="category" component={Category} title="Category" hideNavBar={true} />
<Scene key="likes" component={Likes} title="Likes" hideNavBar={true} />
<Scene key="followers" component={Followers} title="Followers" hideNavBar={true} />

<Scene key="purchases" component={Purchases} title="Purchases" hideNavBar={true} />
<Scene key="cards"  component={Cards} title="Cards" hideNavBar={true} />
<Scene key="card" type="replace" component={Card} title="Card" hideNavBar={true} />
<Scene key="mydonations" type="replace" component={MyDonations} title="MyDonations" hideNavBar={true} />
<Scene key="withdraw"  component={Withdraw} title="Withdraw" hideNavBar={true} />
<Scene key="payments"  component={Payments} title="Payments" hideNavBar={true} />
<Scene key="notifications" type="replace" component={Notifications} title="Notifications" hideNavBar={true} />
<Scene key="winners" component={Winners} title="Winners" hideNavBar={true} />
<Scene key="purchase_coins" component={PurchaseCoins} title="PurchaseCoins" hideNavBar={true} />

<Scene key="getWin" component={getWin} title="getWin" hideNavBar={true} />
<Scene key="winShare" component={winShare} title="winShare" hideNavBar={true} />

<Scene key="profile" component={Profile} title="Profile" hideNavBar={true} />
<Scene key="edit_profile" type="replace" component={EditProfile} title="EditProfile" hideNavBar={true} />
<Scene key="setting" type="replace" component={Setting} title="Setting" hideNavBar={true} />
<Scene key="reset_pass"  component={Reset} title="Reset" hideNavBar={true} />


<Scene key="termsofUse"  component={termsofUse} title="termsofUse" hideNavBar={true} />
<Scene key="privacyPolicy"  component={privacyPolicy} title="privacyPolicy" hideNavBar={true}/>
<Scene key="helpCenter"  component={helpCenter} title="helpCenter" hideNavBar={true} />
<Scene key="accountLinked" component={accountLinked} title="accountLinked" hideNavBar={true} />
<Scene key="blockUsers" component={blockUsers} title="blockUsers" hideNavBar={true} />

                
            </Scene>
        </Router>
    );
}


//export
export default RouterComponent;