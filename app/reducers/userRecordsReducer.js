import { Map } from 'immutable';
import { SET_INTIAL_DATA_ON_LOGIN } from '../actions/actionTypes'

const initialState = new Map();

export default function (state = initialState, action) {
  switch (action.type) {
  case SET_INTIAL_DATA_ON_LOGIN: {
    return state.mergeDeep(action.userRecords);
  }
  default:
    return state;
  }
}
