import { ADD_NEW_BILL,
  CHANGE_BILL_NAME,
  CHANGE_BILL_AMOUNT,
  SET_BILL_FOR_EDIT,
  BILL_PERSIST_SUCCESS } from './actionTypes'
import { generateBillID } from '../utils/generateIdUtils';
import saveBillRecord from '../api/saveBillRecord';

export const addNewBillAction = () => {
  return ((dispatch) => {
    const newBillId = generateBillID();
    console.log(newBillId)
    dispatch({
      type: ADD_NEW_BILL,
      billID: newBillId
    })

  })
}

export const setBillForEdit = (billRecord, splitRecord) => {
  return {
    type: SET_BILL_FOR_EDIT,
    billRecord,
    splitRecord
  }
}

export const onBillNameChangeAction = (newBillName, billID) =>  {
  return { type: CHANGE_BILL_NAME , newBillName, billID }
}

export const onBillAmountChangeAction = (newBillAmount, billID) =>  {
  return { type: CHANGE_BILL_AMOUNT, newBillAmount, billID }
}


export const persistBillRecordAction = (billRecord, splitRecord) => {
  return((dispatch) => {
    console.log(billRecord);
    saveBillRecord(billRecord, splitRecord).then(() => {
      console.log("Post persist to firebase ");
      dispatch({
        type: BILL_PERSIST_SUCCESS,
        billRecord,
        splitRecord,
      })
    } , (error) => { console.error(error) })
  })
}
