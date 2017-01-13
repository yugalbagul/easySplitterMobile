import { ADD_NEW_BILL,
  CHANGE_BILL_NAME,
  CHANGE_BILL_AMOUNT,
  SET_BILL_FOR_EDIT,
  BILL_PERSIST_SUCCESS,
  SET_PAID_BY,
  SET_INTIAL_DATA_ON_LOGIN
} from './actionTypes'
import { generateBillID } from '../utils/generateIdUtils';
import saveBillRecord from '../api/saveBillRecord';
import getUserBills from '../api/getUserBills';
import { ROUTES } from '../constants'

export const addNewBillAction = () => {
  return ((dispatch) => {
    const newBillId = generateBillID();
    dispatch({
      type: ADD_NEW_BILL,
      billID: newBillId
    })

  })
}

export const setBillForEdit = (billRecord, splitRecord, billUsers) => {
  return {
    type: SET_BILL_FOR_EDIT,
    billRecord,
    splitRecord,
    billUsers
  }
}

export const onBillNameChangeAction = (newBillName, billID) =>  {
  return { type: CHANGE_BILL_NAME , newBillName, billID }
}

export const onBillAmountChangeAction = (newBillAmount, billID) =>  {
  return { type: CHANGE_BILL_AMOUNT, newBillAmount, billID }
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

export const persistBillRecordAction = ({ billRecord, splitRecord, newBill, currentUser, navigator }) => {
  return((dispatch) => {
    saveBillRecord({ billRecord, splitRecord, newBill, currentUser }).then(() => {
      dispatch({
        type: BILL_PERSIST_SUCCESS,
        billRecord,
        splitRecord,
      })
      navigator.push({title:'Dish Split Page', routeName: ROUTES.dashBoard});
    } , (error) => { console.error(error) })
  })
}


export const getUserBillsAction = (userId) => dispatch => {
  getUserBills(userId).then(result => {
    const billRecords = {};
    const splitRecords = {};
    const userRecords = {};
    const bills = result.bills;
    const users = result.users;
    if(bills)
    bills.map((item) => {
      if(item){
        splitRecords[item.id] = item.splitRecord;
        delete item.splitRecord;
        billRecords[item.id] = item
      }
    })
    users.map((item) => {
      if(item){
        userRecords[item.id] = item;
      }
    })
    dispatch({
      type: SET_INTIAL_DATA_ON_LOGIN,
      billRecords,
      splitRecords,
      userRecords
    })
  })
  dispatch({
    type: 'YOU'
  })
}
