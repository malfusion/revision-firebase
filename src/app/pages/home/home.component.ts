import { Component, OnInit, ViewChild } from '@angular/core';
// import allQ from './chumma';
// import interviewQ from './interview-qs';
import * as firebase from 'firebase/app';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  db = firebase.firestore();
  @ViewChild('snav', {static: false}) sideNav: MatSidenav;
  constructor() {}

  
  

  ngOnInit() {

    // START CALCULATE COUNTS FOR EACH TOPIC AND SUBJECT
    // let counts_subject = {

    // }
    // let counts_topic = {

    // }
    // this.db.collectionGroup('subtopics').get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //       // doc.data() is never undefined for query doc snapshots
    //       let topic = doc.data().topicId;
    //       let subject = doc.data().subjectId;
    //       if(counts_subject[subject] == undefined){
    //         counts_subject[subject] = 0
    //       }
    //       counts_subject[subject] += 1
    //       if(counts_topic[subject+'__'+topic] == undefined){
    //         counts_topic[subject+'__'+topic] = 0
    //       }
    //       counts_topic[subject+'__'+topic] += 1
    //   });
    //   console.log(counts_subject, counts_topic)
    //   for (let subject in counts_subject){
    //     this.db.collection('subjects').doc(subject).update({count : counts_subject[subject]})
    //   }
    //   for (let sub_top in counts_topic){
    //     let parts = sub_top.split('__')
    //     this.db.collection('subjects').doc(parts[0]).collection('topics').doc(parts[1]).update({count : counts_topic[sub_top]})
    //   }
    // })
    // END CALCULATE COUNTS FOR EACH TOPIC AND SUBJECT
    
    // const probs = allQ.stat_status_pairs;
    // const probmap = {};
    // let intQs = interviewQ;
    // const filledIntQs = [];
    // for (const prob of probs) {
    //   probmap[prob.stat.question_id] = {
    //     name: prob.stat.question__title,
    //     link: 'https://leetcode.com/problems/' + prob.stat.question__title_slug,
    //     topic: 'pHuY7VCOx1v8rC9nfTh9',
    //     dates_revised: [],
    //     confidence: 1
    //   };
    // }
    // console.log(probmap);
    // intQs = (intQs as any).map(intQ => {
    //   return probmap[intQ];
    // });
    // intQs.map((intQ: any) => {
    //   return this.db
    //     .collection('subjects')
    //     .doc('a9p1JZNSvLltElPJonIY')
    //     .collection('topics')
    //     .doc('pHuY7VCOx1v8rC9nfTh9')
    //     .collection('subtopics')
    //     .add(intQ as any);
    // });
    // console.log(intQs);
  }

  closeSidenav(){
    this.sideNav.close();
  }

}
