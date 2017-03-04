import { isEmpty } from 'lodash';

const createBillPersistRecord = (data) => {
  const { billRecord, splitRecord, currentBillDate, currentBillName, currentBillAmount, currentPeople, currentUser, paidBy, newBill, multiplePaideByRecord } = data;
  const billPeople = [];
  currentPeople.map(item => {
    billPeople.push({ id: item.id });
  })
  const updateObject = {
    billName: currentBillName,
    totalBillAmount: parseFloat(currentBillAmount),
    people: billPeople,
    paidBy: paidBy,
    billDate: currentBillDate.toString()
  }
  const amountPerPerson = {};
  splitRecord.dishSplitMap.map((dishSplitRecord) => {
    dishSplitRecord.dishSplit.map((personSplit) => {
      if(amountPerPerson[personSplit.id]){
        amountPerPerson[personSplit.id].billAmountToPay = amountPerPerson[personSplit.id].billAmountToPay + personSplit.dishAmount
      } else {
        amountPerPerson[personSplit.id] = {
          billAmountToPay: personSplit.dishAmount
        }
      }
    })
  })
  const tempSplitRecord = Object.assign({}, splitRecord, { amountPerPerson: amountPerPerson });
  if(!isEmpty(multiplePaideByRecord)){
    updateObject.multiplePaideByRecord = multiplePaideByRecord;
  }
  const tempBillRecord = Object.assign({}, billRecord, updateObject);
  const actionParams = {
    billRecord: tempBillRecord,
    splitRecord: tempSplitRecord,
    newBill,
    currentUser,
  }
  return actionParams
}

export default createBillPersistRecord;
