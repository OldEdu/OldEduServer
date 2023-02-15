"use strict"

const express = require("express");
const router=express.Router();

const ctrl =require("./home.ctrl");

router.get("/",ctrl.output.home);
router.get("/login",ctrl.output.login);
router.get("/register",ctrl.output.register);
router.get("/profile/:userID",ctrl.output.profile);
router.get("/scrap/:userID",ctrl.output.scrap);


router.post("/login",ctrl.process.login);
router.post("/register",ctrl.process.register);
router.post("/profile/:userID",ctrl.process.profile);
router.post("/scrap",ctrl.process.scrap);

router.delete("/deleteScrap/:scrapID",ctrl.output.deleteScrap);

module.exports=router;