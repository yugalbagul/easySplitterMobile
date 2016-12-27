import { firebaseDB } from '../../config/firebase/firebaseConfig';

const saveBillRecord = (data) =>
  new Promise((resolve, reject) => {
    const newID = firebaseDB.child('/bills').push().key;
    data.id = newID;
    firebaseDB.child(`/bills/${newID}`).set(data).then((result) => {
    });
    resolve();
  })

export default saveBillRecord;
