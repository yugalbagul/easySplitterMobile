import { Map } from 'immutable';
import { LOGIN_SUCCESS, SET_DASHBOARD_LOADING, SET_USERS_DATA_ON_LOGIN, SET_BILLS_DATA_ON_LOGIN } from '../actions/actionTypes';


const intialState = new Map({
  userBillsLoading: null,
  userFriendsLoading: null,
  notificationsLoading: null,
  notificationCount: null,
})

export default function (state = intialState, action) {
  switch (action.type) {

  case LOGIN_SUCCESS:{
    let newState = state.set('userBillsLoading', true);
    newState = newState.set('userFriendsLoading', true);
    return newState;
  }
  case SET_DASHBOARD_LOADING:
    return state.set('dashBoardLoading', action.status);
  case SET_BILLS_DATA_ON_LOGIN:
    return state.set('userBillsLoading', false);
  case SET_USERS_DATA_ON_LOGIN:
    return state.set('userFriendsLoading', false)
  default:
    return state;
  }
}
