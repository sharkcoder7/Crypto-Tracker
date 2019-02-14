import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAf7z9JGe8KQ0rlPz8nzJBRxwispah_I6A",
  authDomain: "cryptotracker-ae4d7.firebaseapp.com",
  databaseURL: "https://cryptotracker-ae4d7.firebaseio.com"
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
export const reference = firebase
export default firebase