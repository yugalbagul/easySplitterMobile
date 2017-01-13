import { Map } from 'immutable';
import { LOGIN_SUCCESS, SET_DASHBOARD_LOADING, SET_BILL_RECORDS_WITH_SPLIT } from '../actions/actionTypes';


const intialState = new Map({
  dashBoardLoading: null,
  notificationsLoading: null,
  notificationCount: null,
})

export default function (state = intialState, action) {
  switch (action.type) {

  case LOGIN_SUCCESS:
    return state.set('dashBoardLoading', true);

  case SET_DASHBOARD_LOADING:
    return state.set('dashBoardLoading', action.status);
  case SET_BILL_RECORDS_WITH_SPLIT:
    return state.set('dashBoardLoading', false);
  default:
    return state;
  }
}
