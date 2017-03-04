import React from 'react'
import { Router, Scene, Reducer } from 'react-native-router-flux';
import BillSplitScene from './modules/BillSplitScreen/BillSplitScene';
import DishSplitScene from './modules/DishSplitScreen/DishSplitScene';
import HomeScene from './modules/DashBoardScreen/HomeScene';
import LoginScene from './modules/LoginScreen/LoginScene';
import FriendsScene from './modules/FriendsScreen/FriendsScene';
import NotificationScene from './modules/NotificationScreen/NotificationScene';
import UserProfileScene from './modules/UserProfile/UserProfileScene';
import EmailBasedLogin from './modules/LoginScreen/EmailBasedLogin';
import { ROUTES } from './constants';
import store from './store/configureStore'

const reducerCreate = params=>{
  const defaultReducer = Reducer(params);
  return (state, action)=>{
    store.dispatch(action)
    return defaultReducer(state, action);
  }
};

export default class ESNavigator extends React.Component {
  render() {
    return (
      <Router  createReducer = {reducerCreate} duration={0}>
        <Scene key="root"  hideNavBar={true}>
         <Scene key={ROUTES.loginPage} component={LoginScene}   />
         <Scene key={ROUTES.home} component={HomeScene} />
         <Scene key={ROUTES.billSplitPage} component={BillSplitScene}  />
         <Scene key={ROUTES.dishSplitPage} component={DishSplitScene} />
         <Scene key={ROUTES.friendsPage} component={FriendsScene} />
         <Scene key={ROUTES.notificationsPage} component={NotificationScene} />
         <Scene key={ROUTES.userProfilePage} component={UserProfileScene} />
         <Scene key={ROUTES.emailLoginPage} component={EmailBasedLogin} />

       </Scene>
      </Router>
    )
  }
}
