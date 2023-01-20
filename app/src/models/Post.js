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
            const response = await PostStorage.save(client);
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }
    //userID로 내가 쓴 게시글 보기 
    async readPost(){
        const client = this.body;
        try{
            const response = await PostStorage.getPosts(client); //client = userID정보 받음
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }


}

module.exports=Post