import { LOGIN_SUCCESS , LOGIN_FAILURAE, FIREBASE_QUERY_ERROR} from './actionTypes';
import { ROUTES } from '../constants';
import processUserDataOnLogin from '../api/processFirebaseLogin';

const processUserData = (data,dispatch) => {
  processUserDataOnLogin(data.userData).then((result) => {
    dispatch({
      type: LOGIN_SUCCESS,
      userData: result
    })
    console.log("Login success navigating");
    data.navigator.push({title:'Dish Split Page', routeName: ROUTES.dashBoard});
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
      processUserData(data, dispatch);
    }
  })
}
