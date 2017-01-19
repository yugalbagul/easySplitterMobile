import { firebaseDB } from '../../config/firebase/firebaseConfig';


const getUserFriends = (userId) => {
  return new Promise((resolve, reject) => {
    firebaseDB.child(`/userFriends/${userId}`).once('value').then((friendListSnap) => {
      if(friendListSnap.exists()){
        const userRecordsPromises = [];
        friendListSnap.forEach((userkeySnap) => {
          const userFetchPromise = firebaseDB.child(`/users/${userkeySnap.key}`).once('value').then((userSnap) => {
            if(userSnap.exists()){
              return userSnap.val();
            } else {
              return null;
            }
          }).catch((err) => {reject(err)});
          userRecordsPromises.push(userFetchPromise);
        })

        return Promise.all(userRecordsPromises);
      } else {
        resolve([])
      }
    }).then((userRecords) => {
      if(userRecords && userRecords.length !== -1){
        resolve(userRecords);
      }
      resolve([]);
    }).catch((err) => {
      console.log(err);
      reject(err);
    })
  })

}

export default getUserFriends;
