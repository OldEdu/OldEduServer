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
router.get("/getScrapList/:userID",ctrl.output.getScrapList);
router.get("/commentListPost/:postID",ctrl.output.commentListPost);
router.get("/commentListUser/:userID",ctrl.output.commentListUser);
router.get("/getComment/:comtID",ctrl.output.getComment);

router.post("/login",ctrl.process.login);
router.post("/register",ctrl.process.register);
router.post("/profile",ctrl.process.profile);
router.post("/createPost",ctrl.process.createPost);
router.post("/updatePost",ctrl.process.updatePost);
router.post("/createEduPhoto",ctrl.process.createEduPhoto);
router.post("/updateEduPhoto",ctrl.process.updateEduPhoto);
router.post("/upPostHeart",ctrl.process.upPostHeart);
router.post("/scrap",ctrl.process.scrap);
router.post("/writeComment",ctrl.process.writeComment);
router.post("/updateComment",ctrl.process.updateComment);

router.delete("/deletePost/:postID",ctrl.output.deletePost);
router.delete("/deleteEduPhoto/:eduPhotoID",ctrl.output.deleteEduPhoto);
router.delete("/deleteScrap/:scrapID",ctrl.output.deleteScrap);
router.delete("/deleteComment/:comtID",ctrl.output.deleteComment);


module.exports=router;