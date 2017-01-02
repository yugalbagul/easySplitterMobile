import { Map, fromJS } from 'immutable';
import { isEmpty } from 'lodash';
import {
  ADD_NEW_BILL,
  SAVE_BILL_RECORD,
  SET_BILL_FOR_EDIT,
  CHANGE_BILL_NAME,
  CHANGE_BILL_AMOUNT,
  SAVE_DISH_SPLIT
} from '../actions/actionTypes';

const initialState = new Map({
  newBillId: null,
  unsavedBillStatus : false,
  unsavedBillID: null,
  billIdUnderEdit: null,
  billRecord: null,
  splitRecord: null,
  currentBillName: null,
  currentBillAmount: null,
  people: null,
});

const newBillRecord = {
  restaurantName: '',
  billName:'',
  totalBillAmount: 0,
  dishes: [],
  people: [
    {
      userID: 1,
      name: 'Yugal'
    },
    {
      userID: 2,
      name: 'Saurbh'
    },
    {
      userID: 3,
      name: 'Kunal'
    },
  ],
}

const newSplitRecord = {
  totalAmountSplit: 0,
  dishSplitMap: {}
}


const saveDishInfo = (billRecord, action) => {
  const { dishInfo } = action;
  if(billRecord){
    const newBillRecord = billRecord.toJS();
    const newDishesArray = newBillRecord.dishes;
    const dishIndex = newDishesArray.findIndex((dish) => dish.dishID === dishInfo.dishID);
    const newDishAmount = dishInfo.count * dishInfo.pricePerItem;
    if(dishIndex !== -1){
      const previousDishAmount = newDishesArray[dishIndex].count * newDishesArray[dishIndex].pricePerItem;
      const deltaDishAmount = newDishAmount - previousDishAmount;
      newBillRecord.totalBillAmount = newBillRecord.totalBillAmount + deltaDishAmount;
      newDishesArray[dishIndex] = dishInfo;
    } else {
      newBillRecord.totalBillAmount = newBillRecord.totalBillAmount + newDishAmount;
      newDishesArray.push(dishInfo);
    }
    newBillRecord.dishes = newDishesArray;

    return newBillRecord;
  }
  return billRecord;
}

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

const saveDishSplit = (billSplitRecord, action) => {
  const {  dishSplitInfo } = action;
  if(billSplitRecord){
    // TODO deep convert the data into immuatable
    const newBillSplitRecord  = billSplitRecord.toJS();
    const { dishID } = dishSplitInfo;
    const newTotalAmountSplit = calculateAlreadySplitAmpunt(newBillSplitRecord, dishID, dishSplitInfo)
    delete dishSplitInfo.splitInfo;
    newBillSplitRecord.dishSplitMap[dishID] = dishSplitInfo;
    newBillSplitRecord.totalAmountSplit = newTotalAmountSplit;
    return newBillSplitRecord;
  }
  return billSplitRecord;

}


export default (state = initialState , action) => {
  switch (action.type) {
  case ADD_NEW_BILL:{
    let newState = state.set('newBillId', action.billID);
    newBillRecord.id = action.billID;
    newSplitRecord.billID = action.billID
    newState.set('billRecord', fromJS(newBillRecord));
    newState.set('splitRecord', fromJS(newSplitRecord));
    return newState;
  }

  case SAVE_BILL_RECORD:
    return initialState;

  case SAVE_DISH_SPLIT:{
    const dishInfo = saveDishInfo(state.get('billRecord'),action);
    const dishSplitInfo = saveDishSplit(state.get('splitRecord'), action);
    let newState = state.set('billRecord', fromJS(dishInfo));
    newState = newState.set('splitRecord', fromJS(dishSplitInfo));
    return newState;
  }

  case SET_BILL_FOR_EDIT:{
    let newState = state.set('billRecord', fromJS(action.billRecord));
    newState = newState.set('splitRecord', fromJS(action.splitRecord));
    newState = newState.set('currentBillName', action.billRecord.billName);
    newState = newState.set('currentBillAmount', action.billRecord.totalBillAmount);
    newState = newState.set('billIdUnderEdit', action.billRecord.id);
    return newState;
  }

  case CHANGE_BILL_NAME:
    return state.set('currentBillName', action.newName);
  case CHANGE_BILL_AMOUNT:
    return state.set('currentBillAmount', action.amount);
  default:
    return state;
  }
}
