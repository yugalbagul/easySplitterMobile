import { Map } from 'immutable';
import { SET_USERS_DATA_ON_LOGIN, LOGIN_SUCCESS, ADD_NEW_USER_TO_STORE } from '../actions/actionTypes'

const initialState = new Map();

export default function (state = initialState, action) {
  switch (action.type) {
  case SET_USERS_DATA_ON_LOGIN: {
    return state.mergeDeep(action.userRecords);
  }
  case ADD_NEW_USER_TO_STORE: {
    return state.set(action.newUserInfo.id, action.newUserInfo)
  }
  case LOGIN_SUCCESS:{
    return state.set(action.userData.id, action.userData);
  }
  default:
    return state;
  }
}
