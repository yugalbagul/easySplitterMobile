import { ADD_NEW_BILL, CHANGE_BILL_NAME, CHANGE_BILL_AMOUNT, SET_BILL_FOR_EDIT } from './actionTypes'
import { generateBillID } from '../utils/generateIdUtils';

export const addNewBillAction = () => {
  return ((dispatch) => {
    const newBillId = generateBillID();
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
