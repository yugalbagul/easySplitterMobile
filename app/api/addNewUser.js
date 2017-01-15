import { firebaseDB } from '../../config/firebase/firebaseConfig';

const addNewUser = (newUserInfo, currentUser) => {
  return new Promise((resolve, reject) => {
    firebaseDB.child(`/users/${newUserInfo.id}`).set(newUserInfo).then(() => {
      firebaseDB.child(`/userFriends/${newUserInfo.id}/${currentUser.id}`).set(true).then(() => {
        firebaseDB.child(`/userFriends/${currentUser.id}/${newUserInfo.id}`).set(true).then(() => {
          resolve();
        }).catch((err) => reject(err))
      }).catch((err) => reject(err))
    }).catch((err) => reject(err))
  })
}

export default addNewUser;
