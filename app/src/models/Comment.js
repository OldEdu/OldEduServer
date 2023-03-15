"use strict";

const CommentStorage = require("./CommentStorage");

class Comment{
    constructor(body){
        this.body=body;
    }

    // 댓글 작성
    async writeComment(){
        const client = this.body;
        try{
            const response = await CommentStorage.save(client);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }

    // 로그인 하지 않았을 경우 특정 게시글의 댓글들 불러오기
    async getComment_Post(){
        const client = this.body; // postID 가져오기
        try{
            const response = await CommentStorage.getCommentList_Post(client);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }

    // 로그인 했을 경우 특정 게시글의 댓글들 불러오기
    async getComment_Post_Login(postID,userID){
        try{
            const response = await CommentStorage.getCommentList_Post_Login(postID,userID);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }

    // 특정 유저의 댓글들 불러오기
    async getComment_User(){
        const client = this.body; // userID 가져오기
        try{
            const response = await CommentStorage.getCommentList_User(client);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }

    // 특정 댓글 정보 가져오기
    async getComment(){
        const client = this.body;
        try{
            const response = await CommentStorage.getCommet(client);
            return response;
        }catch(err) {
            return {success:false,err}
        }
    }

    // 댓글 수정하기
    async updateComment(){
        const client = this.body;
        try{
            const response = await CommentStorage.updateComment(client);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }     

    // 댓글 삭제하기
    async deleteComment(comtID){
        try{
            const response = await CommentStorage.deleteComment(comtID);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }
}

module.exports = Comment;