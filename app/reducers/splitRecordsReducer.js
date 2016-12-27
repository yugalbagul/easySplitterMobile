import { Map } from 'immutable';
import { isEmpty } from 'lodash';
import { SAVE_DISH_SPLIT, CANCEL_DISH_SPLIT } from '../actionTypes'

const initialState = new Map({
  0: {
    splitRecordID: 0,
    billID: 0,
    totalAmountSplit: 200,
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

const calculateAlreadySplitAmpunt = (billSplitRecord,dishID,dishSplitInfo) => {
  const dishUnderEdit = billSplitRecord.dishSplitMap[dishID];
  if(dishUnderEdit && !isEmpty(dishUnderEdit)){
    const currenDishAmount = dishUnderEdit.totalSplits * dishUnderEdit.baseSplitAmount;
    const newDishAmount = dishSplitInfo.totalSplits * dishSplitInfo.baseSplitAmount;
    const deltaDishAmount = newDishAmount - currenDishAmount;
    return  billSplitRecord.totalAmountSplit + deltaDishAmount;
  } else{
    const newDishAmount =dishSplitInfo.totalSplits * dishSplitInfo.baseSplitAmount
    return  billSplitRecord.totalAmountSplit + newDishAmount;
  }

}

const saveDishSplit = (state, action) => {
  const { billID, dishSplitInfo } = action;
  let newState = state;
  const billSplitRecord  = newState.get(billID.toString());
  if(billSplitRecord){
    // TODO deep convert the data into immuatable
    const { dishID } = dishSplitInfo;
    const newTotalAmountSplit = calculateAlreadySplitAmpunt(billSplitRecord, dishID, dishSplitInfo)
    billSplitRecord.dishSplitMap[dishID] = dishSplitInfo;
    billSplitRecord.totalAmountSplit = newTotalAmountSplit;
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
}
