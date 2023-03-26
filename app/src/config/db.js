"use strict";

const admin=require("firebase-admin");
const functions=require("firebase-functions")
const credentials =require("../../key.json");


admin.initializeApp({
    credential:admin.credential.cert(credentials)
})

const db =admin.firestore();

module.exports =db;
