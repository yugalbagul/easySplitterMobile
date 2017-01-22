import {
  CHANGE_BILL_NAME,
  CHANGE_BILL_AMOUNT,
  CHANGE_BILL_DATE
} from './actionTypes'


export const onBillNameChangeAction = (newBillName) =>  {
  return { type: CHANGE_BILL_NAME , newBillName }
}

export const onBillAmountChangeAction = (newBillAmount) =>  {
  return { type: CHANGE_BILL_AMOUNT, newBillAmount }
}

export const onBillDateChangeAction = (newBillDate) =>  {
  return { type: CHANGE_BILL_DATE, newBillDate }
}
