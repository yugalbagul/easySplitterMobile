import { isEmpty } from 'lodash';
import { firebaseDB } from '../../config/firebase/firebaseConfig';

const getUserBills = (userId) =>
  new Promise((resolve, reject) => {
    const userIDsArray = [];
    const userRecordsPromises = [];
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

                // store user ids in an array to fetch the users separatly , check if already present
                if(billRecord.people && !isEmpty(billRecord.people)) {
                  billRecord.people.map((item) => {
                    if(userIDsArray.indexOf(item.id) === -1){
                      userIDsArray.push(item.id);
                    }
                  })
                }

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
      resolveObject.bills = result;
      userIDsArray.map((item) => {
        const userFetchPromise = new Promise((resolve, reject) => {
          firebaseDB.child(`/users/${item}`).once('value').then((userSnap) => {
            if(userSnap.exists()){
              // TODO: Update this code to fetch pending user charges.
              resolve(userSnap.val());
            } else {
              resolve(null);
            }
          }).catch(err => reject(err));
        })
        userRecordsPromises.push(userFetchPromise);
      })
      return Promise.all(userRecordsPromises)
    }).catch(err => reject(err)) // reject for bills data fetching
    .then((result) => {
      resolveObject.users = result;
      resolve(resolveObject);
    });


  })

export default getUserBills;
