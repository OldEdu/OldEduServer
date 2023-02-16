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
router.get("/searchRecentPosts/:category",ctrl.output.searchRecentPosts);
router.get("/searchHeartPosts/:category",ctrl.output.searchHeartPosts);
router.get("/searchViewsPosts/:category",ctrl.output.searchViewsPosts);
router.get("/scrap/:userID",ctrl.output.scrap);

router.post("/login",ctrl.process.login);
router.post("/register",ctrl.process.register);
router.post("/profile/:userID",ctrl.process.profile);
router.post("/createPost",ctrl.process.createPost);
router.post("/writeComment",ctrl.process.writeComment);
router.post("/commentListPost",ctrl.process.commentListPost);
router.post("/commentListUser",ctrl.process.commentListUser);
router.post("/updateComment",ctrl.process.updateComment);

router.delete("/deleteComment/:comtID",ctrl.output.deleteComment);

router.post("/updatePost",ctrl.process.updatePost);
router.post("/createEduPhoto",ctrl.process.createEduPhoto);
router.post("/updateEduPhoto",ctrl.process.updateEduPhoto);
router.post("/scrap",ctrl.process.scrap);

router.delete("/deletePost/:postID",ctrl.output.deletePost);
router.delete("/deleteEduPhoto/:eduPhotoID",ctrl.output.deleteEduPhoto);
router.delete("/deleteScrap/:scrapID",ctrl.output.deleteScrap);


module.exports=router;