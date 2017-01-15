import { ADD_NEW_USER_TO_STORE, FIREBASE_QUERY_ERROR } from './actionTypes';
import addNewUser from '../api/addNewUser'

export const addNewUserAction = (newUserInfo, currentUser) => dispatch => {
  dispatch({
    type: ADD_NEW_USER_TO_STORE,
    newUserInfo,
  })
  addNewUser(newUserInfo, currentUser).then(() => {

  }).catch((err) => {dispatch({type:FIREBASE_QUERY_ERROR, err})})
}
