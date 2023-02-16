"use strict"
const db = require("../../config/db");
const User = require("../../models/User");
const Teacher = require("../../models/Teacher");
const Student = require("../../models/Student");
const Post = require("../../models/Post");
const EduPhoto = require("../../models/EduPhoto");
const Comment = require("../../models/Comment");
const Scrap = require("../../models/Scrap");
const { response } = require("express");

const output={
    home : (req,res)=>{
        res.render("home/index");
    },
    login : (req,res)=>{
        res.render("home/login");
    },
    register : (req,res)=>{
        res.render("home/register");
    },
    profile:async(req,res)=>{
        try{
            var userType = await new User(req.body).getUserType(req.params.userID);
            if(userType === true){ // 학습자인 경우 => 학습자 정보 불러오기
                const student = new Student(req.params.userID);
                const response = await student.getStudent();
                res.send(response);
            }
            else { // 교육자 정보 불러오기
                const teacher = new Teacher(req.params.userID);
                const response = await teacher.getTeacher();
                res.send(response);
            } 
        }catch(error){
            res.send(error)
        }
    },
    myPost:async(req,res)=>{
        const posts = new Post(req.params.userID);
        const response =await posts.readMyPostAll();
        res.send(response);
    },
    post:async(req,res)=>{
        const posts = new Post(req.params.postID);
        const response =await posts.readPost();
        res.send(response);
    },
    eduPhoto:async(req,res)=>{
        const eduPhoto=new EduPhoto(req.params.postID);
        const response =await eduPhoto.readEduPhotos();
        res.send(response);
    },
    deletePost:async(req,res)=>{
        const post=new Post();
        const response = await post.deletePost(req.params.postID);
        res.send(response);
    },

    deleteEduPhoto:async(req,res)=>{
        const eduPhoto=new EduPhoto();
        const response = await eduPhoto.deleteEduPhoto(req.params.eduPhotoID);
        res.send(response);
    },
    recentPosts:async(req,res)=>{
        const posts = new Post();
        const response = await posts.readPostAll();
        res.send(response);
    },
    heartPosts:async(req,res)=>{
        const posts = new Post();
        const response = await posts.readHeartPostAll();
        res.send(response);
    },
    viewsPosts:async(req,res)=>{
        const post=new Post();
        const response = await post.readViewsPostAll(req.params.category);
        res.send(response);
    },
    searchRecentPosts:async(req,res)=>{
        const post=new Post();
        const response = await post.readSearchRecentPostAll(req.params.category,req.query.keyword);
        res.send(response);

    },
    searchHeartPosts:async(req,res)=>{
        const post=new Post();
        const response = await post.readSearchHeartPostAll(req.params.category,req.query.keyword);
        res.send(response);

    },
    searchViewsPosts:async(req,res)=>{
        const post=new Post();
        const response = await post.readSearchViewsPostAll(req.params.category,req.query.keyword);
        res.send(response);

    },
    scrap:async(req,res)=>{
        const scrap = new Scrap(req.params.userID);
        const response = await scrap.getScrapList(scrap.userID);
        res.send(response);
    },
    deleteScrap:async(req,res)=>{
        const scrap = new Scrap();
        const response = await scrap.deleteScrap(req.params.scrapID);
        res.send(response);
    },
    deleteComment:async(req,res)=>{
        const comment = new Comment();
        const response = await comment.deleteComment(req.params.comtID);
        res.send(response);
    }
}

const process={
    login:async (req,res)=>{
        const user= new User(req.body);
        const response=await user.login();
        return res.json(response);
    },
    register:async (req,res)=>{
        const user= new User(req.body);
        const response=await user.register();
        return res.json(response);
    },
    profile:async (req,res)=>{
        const teacher= new Teacher(req.body);
        const response=await teacher.updateProfile();
        return res.json(response);
    },
    createPost:async(req,res)=>{
        const post = new Post(req.body);
        const response = await post.createPost();
        return res.json(response);
    },
    updatePost:async(req,res)=>{
        const post=new Post(req.body);
        const response = await post.updatePost();
        return res.json(response);
    },
    createEduPhoto:async(req,res)=>{
        const eduPhoto = new EduPhoto(req.body);
        const response = await eduPhoto.createEduPhoto();
        return res.json(response);
    },
    updateEduPhoto:async(req,res)=>{
        const eduPhoto = new EduPhoto(req.body);
        const response = await eduPhoto.updateEduPhoto();
        return res.json(response);
    },
    scrap:async(req,res)=>{        
        const userType = await new Scrap(req.body).getUserType(req.params.userID);
        if(userType === true) {
            const scrap = new Scrap(req.body);
            const response = await scrap.addScrap();
            return res.json(response);
        }
        else{
            const response = {success:false , msg: "You are not Sutudent."};
            return res.json(response);
        }
    },
    writeComment:async(req,res)=>{
        const comment = new Comment(req.body);
        const response = await comment.writeComment();
        return res.json(response);
    },
    commentListPost:async(req,res)=>{
        const comment = new Comment(req.body);
        const response = await comment.getComment_Post();
        return res.json(response);
    },
    commentListUser:async(req,res)=>{
        const comment = new Comment(req.body);
        const response = await comment.getComment_User();
        return res.json(response);
    },
    updateComment:async(req,res)=>{
        const comment = new Comment(req.body);
        const response = await comment.updateComment();
        return res.json(response);
    }
};

module.exports={
    output,
    process,
};