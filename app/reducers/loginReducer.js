import { Map, fromJS } from 'immutable';
import { LOGIN_SUCCESS, LOGIN_FAILURAE } from '../actions/actionTypes';

const intialState = new Map({
  isLoggedIn: false,
  currentUser: null,
  currentUserId: null,
  loginFailed: false,
  loginErrorText: null
});

export default function (state = intialState, action ){
  switch (action.type) {
  case LOGIN_SUCCESS:{
    const newState = new Map({
      isLoggedIn : true,
      currentUser: fromJS(action.userData),
      currentUserId: action.userData.id,
      loginFailed: false,
      loginErrorText: null
    })
    return newState;
  }
  default:
    return state;
  }
}
