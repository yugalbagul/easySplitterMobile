import { Map, fromJS } from 'immutable';
import { isEmpty } from 'lodash';
import {
  ADD_NEW_BILL,
  SAVE_BILL_RECORD,
  SET_BILL_FOR_EDIT,
  CHANGE_BILL_NAME,
  CHANGE_BILL_AMOUNT,
  SAVE_DISH_SPLIT,
  SET_PAID_BY
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
  currentPeople: null,
  paidBy: null,
  multiplePaideByRecord: null,
  showMultiplePaidByModal:false,
  showPaidByModal: false
});

const newBillRecord = {
  restaurantName: '',
  billName:'',
  totalBillAmount: '',
  dishes: [],
  people: [
    {
      id: 1,
      name: 'Yugal'
    },
    {
      id: 2,
      name: 'Saurbh'
    },
    {
      id: 3,
      name: 'Kunal'
    },
  ],
}

const newSplitRecord = {
  totalAmountSplit: 0,
  dishSplitMap: {}
}


const saveDishInfo = (state, action) => {
  const { dishInfo } = action;
  const billRecord = state.get('billRecord');
  const currentBillAmount = parseFloat(state.get('currentBillAmount'));
  if(billRecord){
    const newBillRecord = billRecord.toJS();
    const newDishesArray = newBillRecord.dishes;
    const dishIndex = newDishesArray.findIndex((dish) => dish.dishID === dishInfo.dishID);
    const newDishAmount = dishInfo.count * dishInfo.pricePerItem;
    if(dishIndex !== -1){
      const previousDishAmount = newDishesArray[dishIndex].count * newDishesArray[dishIndex].pricePerItem;
      const deltaDishAmount = newDishAmount - previousDishAmount;
      newBillRecord.totalBillAmount = currentBillAmount + deltaDishAmount;
      newDishesArray[dishIndex] = dishInfo;
    } else {
      newBillRecord.totalBillAmount = currentBillAmount;
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
    const newDishAmount = dishSplitInfo.totalSplits * dishSplitInfo.baseSplitAmount
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
    newState = newState.set('billRecord', fromJS(newBillRecord));
    newState = newState.set('splitRecord', fromJS(newSplitRecord));
    newState = newState.set('currentBillName', newBillRecord.billName);
    newState = newState.set('currentBillAmount', newBillRecord.totalBillAmount);
    newState = newState.set('currentPeople', newBillRecord.people);
    return newState;
  }

  case SAVE_BILL_RECORD:
    return initialState;

  case SAVE_DISH_SPLIT:{
    const dishInfo = saveDishInfo(state,action);
    const dishSplitInfo = saveDishSplit(state.get('splitRecord'), action);
    let newState = state.set('billRecord', fromJS(dishInfo));
    newState = newState.set('splitRecord', fromJS(dishSplitInfo));
    newState = newState.set('currentBillAmount', dishInfo.totalBillAmount.toString());
    return newState;
  }

  case SET_BILL_FOR_EDIT:{
    let newState = state.set('billRecord', fromJS(action.billRecord));
    newState = newState.set('splitRecord', fromJS(action.splitRecord));
    newState = newState.set('currentBillName', action.billRecord.billName);
    newState = newState.set('currentBillAmount', action.billRecord.totalBillAmount);
    newState = newState.set('billIdUnderEdit', action.billRecord.id);
    newState = newState.set('currentPeople', action.billRecord.people);
    newState = newState.set('paidBy', action.billRecord.paidBy);
    if(action.billRecord.paidBy === 'multiple'){
      newState = newState.set('multiplePaideByRecord', action.billRecord.multiplePaideByRecord);
    }
    return newState;
  }

  case CHANGE_BILL_NAME:
    return state.set('currentBillName', action.newBillName);
  case CHANGE_BILL_AMOUNT:
    return state.set('currentBillAmount', action.newBillAmount);


  case SET_PAID_BY: {
    if(action.paidBy && action.paidBy !== 'multiple'){
      // a single person was clicked on small modal
      let newState = state.set('paidBy', action.paidBy);
      newState = newState.set('showPaidByModal', false)
      return newState;

    } else if(action.paidBy  && action.toggleMultiplePaidByModal){
      // to open/ close the multiple payer modal
      let newState = state
      if(action.paidBy === 'multiple'){
        // 'Multiple' was clicked on small paid by modal
        newState = newState.set('paidBy', action.paidBy);
        newState = newState.set('showMultiplePaidByModal', true);
      }
      return newState;
    } else if(!action.paidBy &&  !isEmpty(action.multiplePaideByRecord) && action.toggleMultiplePaidByModal ) {
      // Save was clicked on multiple payer modal
      let newState = state;
      newState = newState.set('multiplePaideByRecord', action.multiplePaideByRecord);
      newState = newState.set('showMultiplePaidByModal', false);
      newState = newState.set('showPaidByModal', false);
      return newState;
    } else if(action.togglePaidByModal !== undefined){
      // on PaidBy click of Bill split scene header or Close icon on small modal
      return state.set('showPaidByModal' , !state.get('showPaidByModal'));
    } else if(action.toggleMultiplePaidByModal !== undefined){
      // on close click of mulsiplt split modal
      return state.set('showMultiplePaidByModal' , !state.get('showMultiplePaidByModal'));
    }
    return state;
  }
  default:
    return state;
  }
}
