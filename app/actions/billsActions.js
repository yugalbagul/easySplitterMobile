import { ADD_NEW_BILL,
  CHANGE_BILL_NAME,
  CHANGE_BILL_AMOUNT,
  SET_BILL_FOR_EDIT,
  BILL_PERSIST_SUCCESS,
  SET_PAID_BY } from './actionTypes'
import { generateBillID } from '../utils/generateIdUtils';
import saveBillRecord from '../api/saveBillRecord';

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


export const persistBillRecordAction = (billRecord, splitRecord) => {
  return((dispatch) => {
    saveBillRecord(billRecord, splitRecord).then(() => {
      dispatch({
        type: BILL_PERSIST_SUCCESS,
        billRecord,
        splitRecord,
      })
    } , (error) => { console.error(error) })
  })
}

export const setPaidByAction = ({ paidBy, togglePaidByModal, toggleMultiplePaidByModal, multiplePaideByRecord }) => {
  return {
    type: SET_PAID_BY,
    paidBy,
    togglePaidByModal,
    toggleMultiplePaidByModal,
    multiplePaideByRecord
  }
}
