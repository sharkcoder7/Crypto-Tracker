import { ref, firebaseAuth } from '../config/constants'
import 'firebase/auth';


export function auth (email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveUser (user) {
  return ref.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}



const getUserStatus = function (store) {
  store.dispatch('CHECK_USER_STATUS');
  return new Promise(function (resolve, reject) {

    firebaseAuth.auth().onAuthStateChanged(function (user) {
      if (user) {
        store.dispatch('LOGIN_SUCCESS', user.uid);
        resolve(user.uid);
      } else {
        store.dispatch('LOGIN_FAIL');
        reject(Error('It broke'));
      }
    });
  });
};

export { getUserStatus };

export default auth;

//onAuthenticateStateChange to register a call back with the UID. if null, your logged out else   .... providerData