import { Map } from 'immutable';
import { SAVE_DISH_SPLIT, CANCEL_DISH_SPLIT } from '../actionTypes'

const initialState = new Map({
  0: {
    splitRecordID: 0,
    billID: 0,
    dishSplitMap: {
      0 : {
        dishID: 0,
        baseSplitAmount: 100,
        totalSplits: 2,
        dishSplit: [
          {
            userID: 1,
            splitPortion: 1,
            dishAmount: 100,
          },
          {
            userID: 2,
            splitPortion: 1,
            dishAmount: 100,
          },
        ]
      }
    }
  }
})

const saveDishSplit = (state, action) => {
  const { billID, dishSplitInfo } = action;
  let newState = state;
  const billSplitRecord  = newState.get(billID.toString());
  if(billSplitRecord){
    // TODO deep convert the data into immuatable
    billSplitRecord.dishSplitMap[dishSplitInfo.dishID] = dishSplitInfo;
    newState = newState.set(billID.toString(), billSplitRecord);
  }
  return newState;

}

export default function(state=initialState, action) {
  switch (action.type) {
  case SAVE_DISH_SPLIT:
    return saveDishSplit(state,action);
  default:
    return state;
  }
  return state;
}
