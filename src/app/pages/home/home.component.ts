import { Component, OnInit } from '@angular/core';
// import allQ from './chumma';
// import interviewQ from './interview-qs';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  db = firebase.firestore();

  constructor() {}

  ngOnInit() {
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
}
