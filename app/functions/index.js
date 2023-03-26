"use strict";

const functions=require("firebase-functions");
const admin=require("firebase-admin");

// Set up Algolia
const {default: algoliasearch} = require("algoliasearch");
const algoliaClient = algoliasearch(
    "PLWCCK93VC",
    "08de95a65adc4cc640393ce326e39f1a", algoliasearch,
);

const indexName = "edupost_search";
const collectionIndex = algoliaClient.initIndex(indexName);

admin.initializeApp(functions.config().firestore);

// Create a HTTP request cloud functions
exports.sendCollectionToAlgolia = functions
    .region("us-central1")
    .https.onRequest(async (request, response) => {
      const firestore = admin.firestore();
      const algoliaRecords = [];
      // eslint-disable-next-line max-len
      const snapshot = await firestore.collection("eduPost").get();
      snapshot.forEach((doc) => {
        const document = doc.data();
        const record = {
          objectID: doc.id,
          title: document.title,
          category:document.category,
        };
        algoliaRecords.push(record);
      });

      // After all records are created, save them to Algolia
      collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
        response.status(200)
            .send("COLLECTION was indexed to Algolia successfully.");
        response.errored
            .console.error();
      });
    });
// define functions:collectionOnCreate
exports.collectionOnCreate = functions
    .region("us-central1")
    .firestore.document("Record/{recordId}")
    .onCreate(async (snapshot, context) => {
      await saveDocumentInAlgolia(snapshot);
    });

const saveDocumentInAlgolia = async (snapshot) => {
  if (snapshot.exists) {
    const data = snapshot.data();
    console.log(snapshot.id);
    if (data) {
      const record = {
        objectID: snapshot.id,
        title: data.title,
        category:data.category,
      };
      collectionIndex.saveObject(record)
          .catch((res) => console.log("Error with: ", res));
    }
  }
};
// define functions:ticcleOnUpdate
exports.ticcleOnUpdate = functions
    .region("us-central1")
    .firestore.document("Record/{recordId}")
    .onUpdate(async (change, context) => {
      await updateDocumentInAlgolia(context.params.recordId, change);
    });


const updateDocumentInAlgolia = async (objectID, change) => {
  const before = change.before.data();
  const after = change.after.data();
  if (before && after) {
    const record = {objectID: objectID};
    let flag = false;
    if (before.title != after.title) {
      record.title = after.title;
      flag = true;
    }
    if (before.category != after.category) {
      record.category = after.category;
      flag = true;
    }

    if (flag) {
      // update
      collectionIndex.partialUpdateObject(record)
          .catch((res) => console.log("Error with: ", res));
    }
  }
};
// define functions:ticcleOnDelete
exports.ticcleOnDelete = functions
    .region("us-central1")
    .firestore.document("Record/{recordId}")
    .onDelete(async (snapshot, context) => {
      await deleteDocumentInAlgolia(snapshot);
    });
const deleteDocumentInAlgolia = async (snapshot) => {
  if (snapshot.exists) {
    const objectID = snapshot.id;
    collectionIndex.deleteObject(objectID)
        .catch((res) => console.log("Error with: ", res));
  }
};


// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
