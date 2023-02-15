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
router.get("/recentPosts",ctrl.output.recentPosts);
router.get("/heartPosts",ctrl.output.heartPosts);
router.get("/viewsPosts",ctrl.output.viewsPosts);

router.post("/login",ctrl.process.login);
router.post("/register",ctrl.process.register);
router.post("/profile/:userID",ctrl.process.profile);
router.post("/createPost",ctrl.process.createPost);
router.post("/writeComment",ctrl.process.writeComment);
router.post("/commentListPost",ctrl.process.commentListPost);
router.post("/commentListUser",ctrl.process.commentListUser);
router.post("/updateComment",ctrl.process.updateComment);

router.delete("/deleteComment/:comtID",ctrl.output.deleteComment);

module.exports=router;