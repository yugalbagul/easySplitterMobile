import { Map } from 'immutable';
import { ActionConst } from 'react-native-router-flux';
import { ROUTES } from '../constants'

const intialState = new Map({
  currentRoute: null
});


export default function (state = intialState, action){

  switch (action.type) {
  case ActionConst.FOCUS:{
    if( action.scene.sceneKey !== ROUTES.loginPage){
      return state.set('currentRoute', action.scene.sceneKey)
    }
    else{
      return state
    }
  }

  default:
    return state;
  }
}
