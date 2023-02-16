"use strict";
//Post은 게시글 데이터를 가지고 검증 및 조작하는 역할

const PostStorage =require("./PostStorage");
const EduPhoto =require("./EduPhoto");
const EduPhotoStorage = require("./EduPhotoStorage");

class Post{
   
    constructor(body){
        this.body=body;
    }

    //게시글 등록 기능
    async createPost(){
        const client = this.body;
        try{
            const response = await PostStorage.savePost(client);
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }

    //게시글 수정하기 기능
    async updatePost(){
        const client =this.body;
        try{
            const response = await PostStorage.updatePost(client);
            return response
        }catch(err){
            return {success:false,err};
        }
    }
    //게시글 삭제하기 기능
    async deletePost(postID){
        try{
            //존재하지 않는 postID가 없는 경우
            if(await PostStorage.getPostInfo(postID)){   }
            var response= await PostStorage.deletePost(postID);
            //게시글 삭제시 게시글에 속한 EduPhoto들도 삭제
            response =await EduPhotoStorage.deleteEduPhotos(postID);
             
            return response;
        }catch(err){
            return {success:false,err:"존재하지 않는 postID입니다."};
        }
    }

    //postID로 게시글 정보 가져오기 기능
    async readPost(){
        const client =this.body;
        try{
            const response =await PostStorage.getPostInfo(client);//client = postID정보 받음
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }
    //userID로 내가 쓴 게시글 보기 기능
    async readMyPostAll(){
        const client = this.body;
        try{
            const response = await PostStorage.getPosts(client); //client = userID정보 받음
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }
    
    //게시글 검색(최신순)
    async readSearchRecentPostAll(keyword){
        try{
            const response = await PostStorage.getSearchRecentPosts(keyword);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }
    //게시글 검색(하트)
    async readSearchHeartPostAll(keyword){
        try{
            const response = await PostStorage.getSearchHeartPosts(keyword);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }
    //게시글 검색(조회수)
    async readSearchViewsPostAll(keyword){
        try{
            const response = await PostStorage.getSearchViewsPosts(keyword);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }

}

module.exports=Post