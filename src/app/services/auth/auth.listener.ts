import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
const provider = new firebase.auth.GoogleAuthProvider();

@Injectable({
  providedIn: 'root'
})
export class AuthListener {
  loggedInUser = undefined;
  constructor() {}

  initAuth() {
    console.log('Logging in ', firebase.auth());

    firebase.auth().onAuthStateChanged(
      user => {
        if (user) {
          // User is signed in.
          const displayName = user.displayName;
          const email = user.email;
          const emailVerified = user.emailVerified;
          const photoURL = user.photoURL;
          const uid = user.uid;
          const phoneNumber = user.phoneNumber;
          const providerData = user.providerData;
          user.getIdToken().then(accessToken => {
            this.loggedInUser = {
              displayName,
              email,
              emailVerified,
              phoneNumber,
              photoURL,
              uid,
              accessToken,
              providerData
            };
            console.log(this.loggedInUser);
            this.fetchTodoistToken(uid);
          });
        } else {
          this.loggedInUser = undefined;
          firebase
            .auth()
            .signInWithRedirect(provider)
            .then(() => {
              (window as any).location.href = '/';
            });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  async fetchTodoistToken(uid) {
    const db = firebase.firestore();
    return db
      .collection('tokens')
      .where('uid', '==', uid)
      .where('app', '==', 'todoist')
      .get()
      .then(snapshot => {
        const doc = snapshot.docs[0];
        if (doc && doc.exists) {
          this.loggedInUser.todoistToken = doc.data().access_token;
          console.log(this.loggedInUser);
        }
      });
  }

  // TODO: MUST REFACTOR THIS OUT
  getCurrentTodoistToken() {
    if (this.loggedInUser && (this.loggedInUser as any).todoistToken) {
      return this.loggedInUser.todoistToken;
    }
  }
}
