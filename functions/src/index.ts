import * as functions from 'firebase-functions';
import { FieldValue } from '@google-cloud/firestore';
const admin = require('firebase-admin');
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
export const documentWriteListener = 
    functions.firestore.document('subjects/{subjectId}/topics/{topicId}/subtopics/{subtopicId}')
    .onWrite((change, context) => {
        const subjectId = context.params.subjectId; 
        const topicId = context.params.topicId;   

        const db = admin.firestore();

        if (!change.before.exists) {
            // New document Created : add one to count
            db.collection('subjects').doc(subjectId).update({count: FieldValue.increment(1)});
            db.collection('subjects').doc(subjectId)
                    .collection('topics').doc(topicId)
                    .update({count: FieldValue.increment(1)});

        } else if (change.before.exists && change.after.exists) {
            // Maybe some future update when I figure out the rest of the 'move' workflow
        } else if (!change.after.exists) {
            // Deleting document : subtract one from count
            db.collection('subjects').doc(subjectId).update({count: FieldValue.increment(-1)});
            db.collection('subjects').doc(subjectId)
                    .collection('topics').doc(topicId)
                    .update({count: FieldValue.increment(-1)});
        }

    return;
});