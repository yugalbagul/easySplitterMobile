import { firebaseDB } from '../../config/firebase/firebaseConfig';

const getUserBills = (userId) =>
  new Promise((resolve, reject) => {
    const resolveObject = {};
    resolveObject.bills = [];
    resolveObject.users = [];
    firebaseDB.child(`/userBills/${userId}`).once('value').then(billSnap => {
      if(billSnap.exists()){
        const billsRecordsPromises  = []

        billSnap.forEach((billRecordSnap) => {
          let billRecord = {}
          const billFetchPromise = new Promise((resolve, reject) => {
            firebaseDB.child(`/bills/${billRecordSnap.key}`).once('value').then(billSnap => {

              if(billSnap.exists()){

                billRecord = billSnap.val();
                // fetch related split record for the bill
                firebaseDB.child(`/splitRecords/${billRecordSnap.key}`).once('value').then(splitRecordSnap => {
                  if(splitRecordSnap.exists()){
                    billRecord.splitRecord = splitRecordSnap.val();
                  } else {
                    billRecord.splitRecord = {};
                  }
                  resolve(billRecord);
                })
              } else {
                resolve(null)
              }
            }).catch(err => {
              reject(err)
            })
          })

          billsRecordsPromises.push(billFetchPromise);
        })

        return Promise.all(billsRecordsPromises)
      } else {
        // no bills found
        resolve(resolveObject);
      }
    }).catch(err => reject(err)) // reject for userBills Record fetch
    .then((result) => {
      resolve(result)
    }).catch(err => reject(err)) // reject for bills data fetching

  })

export default getUserBills;
