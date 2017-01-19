import { ADD_NEW_BILL,
  CHANGE_BILL_NAME,
  CHANGE_BILL_AMOUNT,
  SET_BILL_FOR_EDIT,
  BILL_PERSIST_SUCCESS,
  SET_PAID_BY,
  SET_BILLS_DATA_ON_LOGIN,
  SET_USERS_DATA_ON_LOGIN,
  SET_CURRENT_PEOPLE,
  SHOW_PEOPLE_INVOVLVED_MODAL
} from './actionTypes'
import { Actions } from 'react-native-router-flux';
import { generateBillID } from '../utils/generateIdUtils';
import saveBillRecord from '../api/saveBillRecord';
import getUserBills from '../api/getUserBills';
import getUserFriends from '../api/getUserFriends';
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

export const setPeopleInvovledAction = ({ peopleInvolved }) => {
  console.log("in ac");
  return {
    type: SET_CURRENT_PEOPLE,
    peopleInvolved
  }
}

export const setPeopleInvovledModalAction = (status) => {
  return {
    type: SHOW_PEOPLE_INVOVLVED_MODAL,
    status
  }
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

export const persistBillRecordAction = ({ billRecord, splitRecord, newBill, currentUser }) => {
  return((dispatch) => {
    saveBillRecord({ billRecord, splitRecord, newBill, currentUser }).then(() => {
      dispatch({
        type: BILL_PERSIST_SUCCESS,
        billRecord,
        splitRecord,
      })
      Actions.pop();
    } , (error) => { console.error(error) })
  })
}


export const getUserBillsAction = (userId) => dispatch => {
  getUserBills(userId).then(bills => {
    const billRecords = {};
    const splitRecords = {};
    bills.map((item) => {
      if(item){
        splitRecords[item.id] = item.splitRecord;
        delete item.splitRecord;
        billRecords[item.id] = item
      }
    })
    dispatch({
      type: SET_BILLS_DATA_ON_LOGIN,
      billRecords,
      splitRecords,
    })
  })
  dispatch({
    type: 'YOU'
  })
}

export const getUserFriendsAction = (userId) => dispatch => {
  getUserFriends(userId).then(users => {
    const userRecords = {};
    users.map((item) => {
      if(item){
        userRecords[item.id] = item;
      }
    })
    dispatch({
      type: SET_USERS_DATA_ON_LOGIN,
      userRecords,
    })
  })
}
