import { firebaseDB } from '../../config/firebase/firebaseConfig';
import { generateUserID } from '../utils/generateIdUtils';

const createUserObject = (userData) => {
  const userID = generateUserID();
  return {
    id: userID,
    displayName: userData.displayName,
    email: userData.email,
    photoURL: userData.photoURL? userData.photoURL : '',
  }
}

const processUserDataOnLogin = (userData) =>
  new Promise((resolve, reject) => {
    const { email } = userData;

    firebaseDB.child('/users').orderByChild('email').equalTo(email).once('value').then((snap) => {
      if(snap.val()){
        const userSnapShot = snap.val();
        const keys = Object.keys(userSnapShot);
        if(keys.length !== 1){
          reject('Multiple user');
        } else {
          const userData = userSnapShot[keys[0]];
          resolve(userData)
        }
      } else {
        const userRecord = createUserObject(userData);
        firebaseDB.child(`/users/${userRecord.id}`).set(userRecord).then((err) => {
          if(err){
            reject(err);
          } else {
            resolve(userRecord);
          }
        });
      }

    });

  })

export default processUserDataOnLogin;
