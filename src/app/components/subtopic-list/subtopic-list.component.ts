import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnChanges } from '@angular/core';
import * as firebase from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthListener } from 'src/app/services/auth/auth.listener';
import { Store } from '@ngxs/store';
import { TopicsState } from 'src/app/services/state/topics.state';

@Component({
  selector: 'app-subtopic-list',
  templateUrl: './subtopic-list.component.html',
  styleUrls: ['./subtopic-list.component.scss']
})
export class SubtopicListComponent implements OnInit, OnChanges {
  db = firebase.firestore();
  @Input() topicId = undefined;
  @Input() subjectId = undefined;
  @Input() confidenceFilter = undefined;
  @Input() statusFilter = undefined;
  @Input() limit = undefined;
  @ViewChild('linkmenutrigger', { static: false }) linkMenuTrigger: ElementRef;

  reviseSchedule = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711];

  subtopics = [];
  subtopicsUnsubscribe;
  subtopicsFilter;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthListener,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.select(TopicsState.topicFilter(this.topicId)).subscribe(filter => {
      this.subtopicsFilter = filter;
    });
  }

  ngOnChanges() {
    this.getSubtopicsFiltered(this.subjectId, this.topicId, this.statusFilter, this.confidenceFilter, this.limit);
  }

  getSubtopicsFiltered(subjectId, topicId, status, confidence, limit) {
    console.log("ASasdas", subjectId, topicId, status, confidence, limit)
    if (this.subtopicsUnsubscribe) {
      this.subtopicsUnsubscribe();
    }
    let subtopicsRef: any;
    if (subjectId && topicId) {
      subtopicsRef = this.db
        .collection('subjects')
        .doc(subjectId)
        .collection('topics')
        .doc(topicId)
        .collection('subtopics');
    } else {
      subtopicsRef = this.db.collectionGroup('subtopics');
    }
    console.log(status)
    if (status === 'revision') {
      if (confidence !== undefined) {
        subtopicsRef = subtopicsRef.where('confidence', '==', confidence);
      }
      subtopicsRef = subtopicsRef.where('revision_deadline', '>=', new Date(0));
      subtopicsRef = subtopicsRef.where('revision_deadline', '<', new Date());
    } else if (status === 'unattended') {
      subtopicsRef = subtopicsRef.where('revision_deadline', '==', new Date(0));
    } else if (status === 'aced') {
      if (confidence !== undefined) {
        subtopicsRef = subtopicsRef.where('confidence', '==', confidence);
      }
      subtopicsRef = subtopicsRef.where('revision_deadline', '>', new Date());
    } else if (status === 'any') {
      if (confidence !== undefined) {
        subtopicsRef = subtopicsRef.where('confidence', '==', confidence);
      }
    }

    if (status !== 'unattended') {
      subtopicsRef = subtopicsRef.orderBy('revision_deadline');
    }
    if (limit !== undefined) {
      subtopicsRef = subtopicsRef.limit(limit);
    }

    this.subtopicsUnsubscribe = subtopicsRef.onSnapshot(snapshot => {
      const stopics = [];
      if (status === 'any') {
        snapshot.forEach(doc => {
          const item = { id: doc.id, priority: 0, ...doc.data() };
          if (this.needsRevisionWarning(item)) {
            item.priority += 3;
          }
          if (this.needsFirstRead(item)) {
            item.priority += 1;
          }
          stopics.push(item);
        });
        this.subtopics = stopics.sort((x, y) => y.priority - x.priority);
      } else {
        snapshot.forEach(doc => {
          const item = { id: doc.id, priority: 0, ...doc.data() };
          stopics.push(item);
        });
        this.subtopics = stopics;
        // this.subtopics = stopics.sort((x, y) => x.revision_deadline.seconds - y.revision_deadline.seconds);
      }
    });
  }

  needsRevisionWarning(subtopic) {
    if (
      subtopic.num_revisions > 0 &&
      subtopic.revision_deadline &&
      new Date() > new Date(subtopic.revision_deadline.seconds * 1000)
    ) {
      return true;
    }
    return false;
  }

  needsFirstRead(subtopic) {
    return subtopic.num_revisions === 0;
  }

  addNewSubtopic() {
    const dialogRef = this.dialog.open(NewSubtopicDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== '') {
        return this.db
          .collection('subjects')
          .doc(this.subjectId)
          .collection('topics')
          .doc(this.topicId)
          .collection('subtopics')
          .add({
            name: result,
            topic: this.topicId,
            link: '',
            confidence: 1,
            streak: 0,
            num_revisions: 0,
            revision_deadline: new Date(0)
          })
          .then(() => {
            this.snackBar.open(`'${result}' Subtopic Added`, 'Hide', {
              duration: 2000
            });
          });
      }
    });
  }
}
@Component({
  selector: 'app-new-subtopic-dialog',
  templateUrl: 'new-subtopic-dialog.html'
})
export class NewSubtopicDialogComponent {
  name = '';
  constructor(public dialogRef: MatDialogRef<NewSubtopicDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
