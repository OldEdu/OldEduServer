"use strict";
//Post은 게시글 데이터를 가지고 검증 및 조작하는 역할

const PostStorage = require("./PostStorage");
const EduPhotoStorage = require("./EduPhotoStorage");
const CommentStorage = require("./CommentStorage");
class Post {

    constructor(body) {
        this.body = body;
    }

    //게시글 등록 기능
    async createPost() {
        const client = this.body;
        try {
            const response = await PostStorage.savePost(client);
            return response;
        } catch (err) {
            return { succrss: false, err };
        }
    }

    //게시글 수정하기 기능
    async updatePost() {
        const client = this.body;
        try {
            const response = await PostStorage.updatePost(client);
            return response
        } catch (err) {
            return { success: false, err };
        }
    }
    //게시글 삭제하기 기능
    async deletePost(postID) {
        try {
            //존재하지 않는 postID가 없는 경우
            if (await PostStorage.getPostInfo(postID)) { }
            var response = await PostStorage.deletePost(postID);
            //게시글 삭제시 게시글에 속한 EduPhoto들도 삭제
            response = await EduPhotoStorage.deleteEduPhotos(postID);
            //게시글 삭제시 게시글에 속한 comment들도 삭제
            response = await CommentStorage.deleteComments(postID);

            return response;
        } catch (err) {
            return { success: false, err: "존재하지 않는 postID입니다." };
        }
    }

    //postID로 게시글 정보 가져오기 기능
    async readPost() {
        const client = this.body;
        try {
            const response = await PostStorage.getPostInfo(client);//client = postID정보 받음
            return response;
        } catch (err) {
            return { succrss: false, err };
        }
    }
    //userID로 내가 쓴 게시글 보기 기능
    async readMyPostAll() {
        const client = this.body;
        try {
            const response = await PostStorage.getMyPosts(client); //client = userID정보 받음
            return response;
        } catch (err) {
            return { succrss: false, err };
        }
    }
    //category에 맞는 게시글 불러오기 (하트 정렬순)
    async readHeartPostAll(category) {
        try {
            const response = await PostStorage.getHeartPosts(category);
            return response;
        } catch (err) {
            return { success: false, err };
        }
    }

    //category에 맞는 게시글 불러오기 (조회수 정렬순)
    async readViewsPostAll(category) {
        try {
            const response = await PostStorage.getViewsPosts(category);
            return response;
        } catch (err) {
            return { success: false, err };
        }
    }

    //category에 맞는 게시글 불러오기 (최신 정렬순)
    async readRecentPostAll(category) {
        try {
            const response = await PostStorage.getRecentPosts(category);
            return response;
        } catch (err) {
            return { success: false, err };
        }
    }
    //게시글 검색(최신순)
    async readSearchRecentPostAll(category,keyword) {
        try {
            const response = await PostStorage.getSearchRecentPosts(category,keyword);
            return response;
        } catch (err) {
            return { success: false, err };
        }
    }
    //게시글 검색(하트)
    async readSearchHeartPostAll(category,keyword) {
        try {
            const response = await PostStorage.getSearchHeartPosts(category,keyword);
            return response;
        } catch (err) {
            return { success: false, err };
        }
    }
    //게시글 검색(조회수)
    async readSearchViewsPostAll(category,keyword) {
        try {
            const response = await PostStorage.getSearchViewsPosts(category,keyword);
            return response;
        } catch (err) {
            return { success: false, err };
        }
    }
    // 게시글 하트수 올리기
    async upPostHeart(){
        const client = this.body;
        const heartOn = await PostStorage.checkHeartOn(client);
        if (heartOn === false){
            try {
                const response = await PostStorage.updatePostHeart(client);
                return response;
            } catch (err) {
                return { success: false, err };
            }
        }
        else{
            return { success:false, msg:"You have already clicked heart on this post."}
        }
    }

    // 하트수 내리기
    async deleteHeart(heartID){
        try{
            const response = await PostStorage.reducePostHeart(heartID);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }

    // 하트/스크랩 클릭 정보
    async returnViewHeart(){
        const client = this.body;
        try {
            const response = await PostStorage.returnViewHeart(client);
            return response;
        } catch (err) {
            return { success: false, err };
        }
    }

}

module.exports = Post