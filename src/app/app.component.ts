import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import { AuthListener } from './services/auth/auth.listener';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'revision-app';

  constructor(private authListener: AuthListener, private router: Router) {}

  ngOnInit() {
    // Firebase App (the core Firebase SDK) is always required and must be listed first
    const firebaseConfig = {
      apiKey: 'AIzaSyB7EUPeObgQ-YOGNCEp1Ku53mG8Ds2WWxQ',
      authDomain: 'revision-fire.firebaseapp.com',
      databaseURL: 'https://revision-fire.firebaseio.com',
      projectId: 'revision-fire',
      storageBucket: 'revision-fire.appspot.com',
      messagingSenderId: '778804066581',
      appId: '1:778804066581:web:8e3c18eb677ba4a1'
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    this.authListener.initAuth();
    this.router.navigate(['home', 'today']);
  }
}
