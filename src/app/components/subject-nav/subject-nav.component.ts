import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase/app';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select } from '@ngxs/store';
import { AppState } from 'src/app/services/state/app.state';

@Component({
  selector: 'app-subject-nav',
  templateUrl: './subject-nav.component.html',
  styleUrls: ['./subject-nav.component.scss']
})
export class SubjectNavComponent implements OnInit {
  subjects = [];
  db;
  @Output('onItemClicked') onItemClicked = new EventEmitter<void>();
  @Select(AppState.currentSubject)
  currentSubject$;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.db = firebase.firestore();
  }

  ngOnInit() {
    return this.db.collection('subjects').onSnapshot(querySnapshot => {
      const subs = [];
      querySnapshot.forEach(doc => {
        subs.push({ id: doc.id, ...doc.data() });
      });
      this.subjects = subs;
      console.log(this.subjects);
    });
  }

  _getDateDaysFromNow(days) {
    const toReviseOn = new Date();
    toReviseOn.setDate(toReviseOn.getDate() + days);
    toReviseOn.setHours(0);
    toReviseOn.setMinutes(0);
    toReviseOn.setSeconds(0);
    return toReviseOn;
  }

  addNewSubject() {
    const dialogRef = this.dialog.open(NewSubjectDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result !== undefined && result !== '') {
        return this.db
          .collection('subjects')
          .add({
            name: result
          })
          .then(() => {
            this.snackBar.open(`'${result}' Subject Added`, 'Hide', {
              duration: 2000
            });
          });
      }
    });
  }
}

@Component({
  selector: 'app-new-subject-dialog',
  templateUrl: 'new-subject-dialog.html'
})
export class NewSubjectDialogComponent {
  name = '';
  constructor(public dialogRef: MatDialogRef<NewSubjectDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClose(res): void {
    this.dialogRef.close(res);
  }
}
