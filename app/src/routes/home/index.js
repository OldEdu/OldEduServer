"use strict"

const express = require("express");
const router=express.Router();

const ctrl =require("./home.ctrl");

router.get("/",ctrl.output.home);
router.get("/login",ctrl.output.login);
router.get("/register",ctrl.output.register);
router.get("/profile/:userID",ctrl.output.profile);
router.get("/myPost/:userID",ctrl.output.myPost);
router.get("/post/:postID",ctrl.output.post);

router.post("/login",ctrl.process.login);
router.post("/register",ctrl.process.register);
router.post("/profile/:userID",ctrl.process.profile);
router.post("/createPost",ctrl.process.createPost);
module.exports=router;