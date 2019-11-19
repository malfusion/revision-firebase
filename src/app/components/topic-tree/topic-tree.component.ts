import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import * as firebase from 'firebase/app';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SetTopicListFilter, TopicsState } from 'src/app/services/state/topics.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-topic-tree',
  templateUrl: './topic-tree.component.html',
  styleUrls: ['./topic-tree.component.scss']
})
export class TopicTreeComponent implements OnInit, OnChanges {
  db = firebase.firestore();
  @Input() subjectId = undefined;
  topics = [];

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private store: Store) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.subjectId) {
      this.getTopics(changes.subjectId.currentValue);
    }
  }

  getTopics(subjectId) {
    return this.db
      .collection('subjects')
      .doc(subjectId)
      .collection('topics')
      .onSnapshot(snapshot => {
        const topics = [];
        snapshot.forEach(doc => {
          topics.push({ id: doc.id, ...doc.data() });
          this.store.dispatch(new SetTopicListFilter(doc.id, 'revision'));
        });
        this.topics = topics;
      });
  }

  addNewTopic() {
    const dialogRef = this.dialog.open(NewTopicDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== '') {
        return this.db
          .collection('subjects')
          .doc(this.subjectId)
          .collection('topics')
          .add({
            name: result,
            subject: this.subjectId
          })
          .then(() => {
            this.snackBar.open(`'${result}' Topic Added`, 'Hide', {
              duration: 2000
            });
          });
      }
    });
  }
}

@Component({
  selector: 'app-new-topic-dialog',
  templateUrl: 'new-topic-dialog.html'
})
export class NewTopicDialogComponent {
  name = '';
  constructor(public dialogRef: MatDialogRef<NewTopicDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
