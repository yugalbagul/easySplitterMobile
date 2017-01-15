import { firebaseDB } from '../../config/firebase/firebaseConfig';

const saveBillRecord = ({ billRecord, splitRecord, newBill, currentUser }) =>
  new Promise((resolve, reject) => {
    console.log(newBill);
    if(newBill){
      firebaseDB.child(`/userBills/${currentUser.id}/${billRecord.id}`).set(true);
    }
    firebaseDB.child(`/bills/${billRecord.id}`).set(billRecord).then((result) => {
      if(result){
        reject(result)
      }
      firebaseDB.child(`/splitRecords/${billRecord.id}`).set(splitRecord).then((splitRecordSave) => {
        if(splitRecordSave){
          reject(splitRecordSave)
        }
        resolve();
      })
    });

  })

export default saveBillRecord;
