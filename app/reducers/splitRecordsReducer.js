import { Map } from 'immutable';
import { SET_BILLS_DATA_ON_LOGIN, BILL_PERSIST_SUCCESS } from '../actions/actionTypes';

const initialState = new Map()



export default function(state=initialState, action) {
  switch (action.type) {
  case BILL_PERSIST_SUCCESS: {
    return state.set(action.billRecord.id, action.splitRecord);
  }
  case SET_BILLS_DATA_ON_LOGIN: {
    return state.mergeDeep(action.splitRecords);
  }
  default:
    return state;
  }
}
