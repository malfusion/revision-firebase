import { Component, OnInit, Inject, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import uuidv1 from 'uuid/v1';
import { AuthListener } from 'src/app/services/auth/auth.listener';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-subtopic-list-item',
  templateUrl: './subtopic-list-item.component.html',
  styleUrls: ['./subtopic-list-item.component.scss']
})
export class SubtopicListItemComponent implements OnInit {
  db = firebase.firestore();
  shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  notesOpen = false;
  notesDirty = false;
  noteText = ''

  @Input() topicId = undefined;
  @Input() subjectId = undefined;
  @Input() subtopic = undefined;


  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthListener
  ) {}

  ngOnInit() {
    if(this.subtopic !== undefined){
      this.refreshNote(this.subtopic);
    }
  }

  onNotesChange(){
    this.notesDirty = true;
  }

  onClickItem(evt){
   
    evt.stopPropagation();
    evt.preventDefault();
    if(this.notesOpen === true && this.notesDirty){
      this.saveNote(this.subtopic, this.noteText)
    }else{
      this.refreshNote(this.subtopic);
      this.notesDirty = false;
    }
    this.notesOpen = !this.notesOpen;    
  }

  refreshNote(subtopic){
    if(subtopic !== undefined){
      const noteRef = this.db
      .collection('notes')
      .doc(this.subtopic.id)
      .get()
      .then(note => {
        if (note.exists) {
          this.noteText = ((note.data() || {}).content)
        }
      })
    }  
  }

  saveNote(subtopic, noteText){
    if(subtopic !== undefined && noteText !== undefined && noteText !== ''){
      const noteRef = this.db
      .collection('notes')
      .doc(this.subtopic.id)
      .set(
        {
          subtopicId: this.subtopic.id,
          content: noteText,
          userId: this.authService.loggedInUser.uid
        },
        { merge: true }
      )
      .then(() => {
        this.snackBar.open(`Item Updated`, 'Hide', {
          duration: 2000
        });
      });
    }
  }

  openNewGoogleSheet() {
    window.open('https://sheets.new', '_blank');
  }

  openSubtopicLink(subtopic) {
    window.open(subtopic.link, '_blank');
  }

  addToTodoist(taskName, dateStr) {
    const todoToken = this.authService.getCurrentTodoistToken();
    return this.http
      .post(
        'https://api.todoist.com/sync/v8/sync',
        {},
        {
          headers: {
            'content-type': 'text/plain'
          },
          params: {
            token: todoToken,
            commands: JSON.stringify([
              {
                temp_id: uuidv1(),
                uuid: uuidv1(),
                type: 'item_add',
                args: { content: 'Algo: ' + taskName, date_string: dateStr, project_id: 1769899878 }
              }
            ])
          }
        }
      )
      .subscribe(data => {
        this.snackBar.open(`Added Task to Todoist`, 'Hide', {
          duration: 2000
        });
      });
  }

  containsLink(subtopic) {
    return subtopic.link === '' || subtopic.link === undefined;
  }

  getDaysAgo(ts) {
    if (ts === undefined || ts.seconds === 0) {
      return '';
    }
    return `(+${Math.floor((new Date().valueOf() / 1000 - ts.seconds) / (60 * 60 * 24))})`;
  }

  getShortDate(ts) {
    if (ts === undefined) {
      return '';
    }
    const d = new Date(ts.seconds * 1000);
    return d.getDate() + ' ' + this.shortMonths[d.getMonth()];
  }

  getRevisionClass(confidence) {
    if (confidence === 1) {
      return 'revision-red';
    } else if (confidence === 2) {
      return 'revision-yellow';
    } else if (confidence === 3) {
      return 'revision-green';
    }
    return 'revision-gray';
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

  resetRevisions(subtopic) {
    const subtopicRef = this.db
      .collection('subjects')
      .doc(this.subjectId)
      .collection('topics')
      .doc(this.topicId)
      .collection('subtopics')
      .doc(subtopic.id);
    subtopicRef
      .set(
        {
          confidence: 0,
          streak: 0,
          revision_deadline: new Date(0),
          num_revisions: 0
        },
        { merge: true }
      )
      .then(() => {
        this.snackBar.open(`Revisions Cleared`, 'Hide', {
          duration: 2000
        });
      });
    subtopicRef
      .collection('revisions')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
  }

  editSubtopicLink(subtopic) {
    const dialogRef = this.dialog.open(EditSubtopicDialogComponent, {
      width: '400px',
      data: {
        name: subtopic.name,
        link: subtopic.link
      }
    });

    dialogRef.afterClosed().subscribe((result: {name: string, link: string}) => {
      if (result !== undefined && result.name !== '') {
        return this.db
          .collection('subjects')
          .doc(this.subjectId)
          .collection('topics')
          .doc(this.topicId)
          .collection('subtopics')
          .doc(subtopic.id)
          .set(
            {
              name: result.name,
              link: result.link
            },
            { merge: true }
          )
          .then(() => {
            this.snackBar.open(`Item Updated`, 'Hide', {
              duration: 2000
            });
          });
      }
    });
  }

  addRevisionToSubtopic(subjectId, topicId, subtopicId, confidence) {
    const subtopicRef = this.db
      .collection('subjects')
      .doc(subjectId)
      .collection('topics')
      .doc(topicId)
      .collection('subtopics')
      .doc(subtopicId);
    const revisionsRef = subtopicRef.collection('revisions');

    this.db.runTransaction(t => {
      return t
        .get(subtopicRef)
        .then(subtopic => {
          if (!subtopic.exists) {
            throw Error('Document Day does not exist!');
          } else {
            const updates = this.getSubtopicUpdateObjectForNewRevision(subtopic.data(), confidence);
            return t.update(subtopicRef, updates);
          }
        })
        .then(() => {
          return t.set(revisionsRef.doc(), {
            ts: new Date(),
            confidence
          });
        })
        .then(() => {
          this.snackBar.open(`Revision Added`, 'Hide', {
            duration: 2000
          });
        });
    });
  }

  getSubtopicUpdateObjectForNewRevision(subtopic, confidence) {
    const updates = {
      confidence,
      streak: null,
      revision_deadline: null,
      num_revisions: (subtopic.num_revisions || 0) + 1
    };

    let newStreak = 0;
    let newRevisionDeadline = new Date();

    if (confidence === 3) {
      // prettier-ignore
      const daysToNextRevision = [
        1, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233,
        377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711
      ];
      const oldRevisionDeadline = subtopic.revision_deadline
        ? new Date(subtopic.revision_deadline.seconds * 1000)
        : new Date(0);

      if (new Date() > oldRevisionDeadline) {
        if (subtopic.streak === undefined || subtopic.streak === null) {
          console.log('Streak changed to 0');
          newStreak = 0;
        } else {
          newStreak = subtopic.streak + 1;
          console.log('Streak changed to ', subtopic.streak + 1);
        }
        newRevisionDeadline = this._getDateDaysFromNow(daysToNextRevision[newStreak] || 9999);
        console.log('Revision deadline changed to ', newRevisionDeadline);
      } else {
        console.log('No Change to Revision deadline and streak');
        newStreak = subtopic.streak;
        newRevisionDeadline = oldRevisionDeadline;
      }
    } else if (confidence === 2) {
      newStreak = 0;
      newRevisionDeadline = this._getDateDaysFromNow(1);
    } else if (confidence === 1) {
      newStreak = 0;
      newRevisionDeadline = this._getDateDaysFromNow(1);
    }

    updates.streak = newStreak;
    updates.revision_deadline = newRevisionDeadline;
    return updates;
  }

  _getDateDaysFromNow(days) {
    const toReviseOn = new Date();
    toReviseOn.setDate(toReviseOn.getDate() + days);
    toReviseOn.setHours(0);
    toReviseOn.setMinutes(0);
    toReviseOn.setSeconds(0);
    return toReviseOn;
  }
}

@Component({
  selector: 'app-edit-subtopic-dialog',
  templateUrl: 'edit-subtopic-dialog.html'
})
export class EditSubtopicDialogComponent {
  constructor(public dialogRef: MatDialogRef<EditSubtopicDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
