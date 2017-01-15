import { firebaseDB } from '../../config/firebase/firebaseConfig';


export const generateBillID = () => {
  const key = firebaseDB.child('/bills').push().key
  return key;
};

export const generateUserID = () => {
  return firebaseDB.child('/users').push().key;
}
