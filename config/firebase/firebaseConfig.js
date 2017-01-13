import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDVzbjc_-mNOJEGKeYcTQ2qS7xad4awt6A',
  authDomain: 'easy-splitter-dev.firebaseapp.com',
  databaseURL: 'https://easy-splitter-dev.firebaseio.com',
  storageBucket: 'easy-splitter-dev.appspot.com',
  messagingSenderId: '876826807673'
};

firebase.initializeApp(config);
export const firebaseAuth = firebase.auth();
export const fbProvider = firebase.auth.FacebookAuthProvider;

export const firebaseDB = firebase.database().ref();
