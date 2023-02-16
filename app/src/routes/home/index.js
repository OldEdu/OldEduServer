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
router.get("/eduPhoto/:postID",ctrl.output.eduPhoto);
router.get("/recentPosts/:category",ctrl.output.recentPosts);
router.get("/heartPosts/:category",ctrl.output.heartPosts);
router.get("/viewsPosts/:category",ctrl.output.viewsPosts);
router.get("/searchRecentPosts",ctrl.output.searchRecentPosts);
router.get("/searchHeartPosts",ctrl.output.searchHeartPosts);
router.get("/searchViewsPosts",ctrl.output.searchViewsPosts);

router.post("/login",ctrl.process.login);
router.post("/register",ctrl.process.register);
router.post("/profile/:userID",ctrl.process.profile);
router.post("/createPost",ctrl.process.createPost);
router.post("/updatePost",ctrl.process.updatePost);
router.post("/createEduPhoto",ctrl.process.createEduPhoto);
router.post("/updateEduPhoto",ctrl.process.updateEduPhoto);

router.delete("/deletePost/:postID",ctrl.output.deletePost);
router.delete("/deleteEduPhoto/:eduPhotoID",ctrl.output.deleteEduPhoto);


module.exports=router;