import { Map } from 'immutable';
import { SET_BILL_RECORDS_WITH_SPLIT } from '../actions/actionTypes';

const initialState = new Map({
  0: {
    splitRecordID: 0,
    id: 0,
    totalAmountSplit: 200,
    dishSplitMap: {
      0 : {
        dishID: 0,
        baseSplitAmount: 100,
        totalSplits: 2,
        dishSplit: [
          {
            id: 1,
            splitPortion: 1,
            dishAmount: 100,
          },
          {
            id: 2,
            splitPortion: 1,
            dishAmount: 100,
          },
        ]
      }
    }
  }
})



export default function(state=initialState, action) {
  switch (action.type) {
  case SET_BILL_RECORDS_WITH_SPLIT: {
    return state.mergeDeep(action.splitRecords);
  }
  default:
    return state;
  }
}
