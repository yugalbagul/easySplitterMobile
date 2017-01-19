import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk'
import billRecordsReducer from '../reducers/billRecordsReducer';
import splitRecordsReducer from '../reducers/splitRecordsReducer';
import billSplitReducer from '../reducers/billSplitReducer';
import appStateReducer from '../reducers/appStateReducer';
import loginReducer from '../reducers/loginReducer';
import userRecordsReducer from '../reducers/userRecordsReducer';
import navigationReducer from '../reducers/NavigationReducer'


const combinedReducers   = combineReducers({
  billRecordsReducer,
  splitRecordsReducer,
  billSplitReducer,
  loginReducer,
  appStateReducer,
  userRecordsReducer,
  navigationReducer
})


const store = createStore(combinedReducers , applyMiddleware(thunk));

export default store;
