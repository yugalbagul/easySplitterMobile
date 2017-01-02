import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk'
import billRecordsReducer from '../reducers/billRecordsReducer';
import splitRecordsReducer from '../reducers/splitRecordsReducer';
import appStateReducer from '../reducers/appStateReducer';


const combinedReducers   = combineReducers({
  billRecordsReducer,
  splitRecordsReducer,
  appStateReducer
})


const store = createStore(combinedReducers , applyMiddleware(thunk));

export default store;
