import { firebaseDB } from '../../config/firebase/firebaseConfig';

const saveBillRecord = (billRecord, splitRecord) =>
  new Promise((resolve, reject) => {
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
