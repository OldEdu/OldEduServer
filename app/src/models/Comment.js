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
            return {succrss: false,err};
        }
    }

    // 특정 게시글의 댓글들 불러오기
    async getComment_Post(){
        const client = this.body; // postID 가져오기
        try{
            const response = await CommentStorage.getCommentList_Post(client);
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }

    // 특정 유저의 댓글들 불러오기
    async getComment_User(){
        const client = this.body; // userID 가져오기
        try{
            const response = await CommentStorage.getCommentList_User(client);
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }

    // 댓글 수정하기
    async updateComment(){
        const client = this.body;
        try{
            const response = await CommentStorage.updateComment(client);
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }     

    // 댓글 삭제하기
    async deleteComment(comtID){
        try{
            const response = await CommentStorage.deleteComment(comtID);
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }
}

module.exports = Comment;