import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { Store } from '@ngxs/store';
import { SetCurrentSubject } from 'src/app/services/state/app.state';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.scss']
})
// SMART COMPONENT THAT GETS THE SUBJECT DETAILS
export class SubjectDetailComponent implements OnInit {
  currSubjectId = undefined;
  subjectDetails = undefined;
  constructor(private route: ActivatedRoute, private store: Store) {}
  db;

  ngOnInit() {
    this.db = firebase.firestore();
    this.route.params.subscribe(params => {
      this.currSubjectId = params.subjectId;
      this.getSubjectDetails(this.currSubjectId);
      this.store.dispatch(new SetCurrentSubject(params.subjectId));
    });
  }

  getSubjectDetails(subjectId) {
    return this.db
      .collection('subjects')
      .doc(subjectId)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.subjectDetails = { id: doc.id, ...doc.data() };
        } else {
          console.log('No such document!', subjectId);
        }
      });
  }
}
