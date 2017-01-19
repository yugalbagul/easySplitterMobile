import { Actions } from 'react-native-router-flux';
import { ROUTES } from '../constants';
import { LOGIN_SUCCESS , LOGIN_FAILURAE, FIREBASE_QUERY_ERROR} from './actionTypes';
import processUserDataOnLogin from '../api/processFirebaseLogin';

const processUserBillData = (data,dispatch) => {
  // get
  console.log('calling api for login');
  processUserDataOnLogin(data.userData).then((result) => {
    dispatch({
      type: LOGIN_SUCCESS,
      userData: result
    })
    Actions[ROUTES.home]();
  }).catch((err) => {
    console.log(err);
    dispatch({
      type: FIREBASE_QUERY_ERROR,
      error: err
    })
  })
}

export const processLoginAction = (data) => {
  return(dispatch => {
    if(data.error){
      dispatch({
        type: LOGIN_FAILURAE,
        error: data.error,
        provider: data.provider
      })
    } else {
      processUserBillData(data, dispatch);
    }
  })
}
