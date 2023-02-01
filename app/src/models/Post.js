"use strict";
//Post은 게시글 데이터를 가고 검증 및  조작하는 역할

const PostStorage =require("./PostStorage");

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
    //하트가 많은 게시글 불러오기
    async readHeartPostAll(){
        try{ 
            const response = await PostStorage.getHeartPosts();
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }

    //조회수 가장 높은 게시글 불러오기
    async readViewsPostAll(){
        try{
            const response = await PostStorage.getViewsPosts();
            return response;
        }catch(err){
            return {success:false,err};
        }
    }
    
    //최근 게시글 불러오기
    async readPostAll(){
        try{
            const response = await PostStorage.getRecentPosts();
            return response;
        }catch(err){
            return {success:false,err};
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