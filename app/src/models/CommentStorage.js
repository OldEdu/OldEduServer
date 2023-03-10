"use strict"

const { response } = require("express");
const { resolve } = require("path");
const { reject } = require("underscore");
const db = require("../config/db");

class CommentStorage {
    // postID에 맞는 댓글 리스트 가져오기
    static async getCommentList_Post(postID){
        return new Promise(async(resolve,reject)=>{
            try{
                var result = [];
                var idx = 0;
                const commentRef = db.collection("comment");
                const postRef = db.collection("eduPost").doc(postID);
                const post = await postRef.get();
                if(post.data() === undefined){
                    resolve({sucess:false, msg: "This post does not exist."});
                }
                var queryRef = await commentRef.where("postID","==",postID).get();
                if(queryRef.empty){
                    resolve({success:true , msg: "This post don't have any comment."});
                }
                queryRef.forEach(doc=>{
                    result[idx++]=doc.data();
                })
                resolve({success:true, result});
            }catch(err) {
                reject(`${err}`);
            }
        })
    }

    // userID에 맞는 댓글 리스트 가져오기
    static async getCommentList_User(userID){
        return new Promise(async(resolve,reject)=>{
            try{
                var result = [];
                var idx = 0;
                const commentRef = db.collection("comment");
                const userRef = db.collection("users").doc(userID);
                const user = await userRef.get();
                if(user.data() === undefined){
                    resolve({sucess:false, msg: "This user does not exist."});
                }
                var queryRef = await commentRef.where("userID","==",userID).get();
                if(queryRef.empty){
                    resolve({success:true , msg: "This user didn't write any comment."});
                }
                queryRef.forEach(doc=>{
                    result[idx++]=doc.data();
                })
                resolve({success:true, result});
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    // comtID로 comment정보 가져오기
    static async getCommet(comtID){
        return new Promise(async(resolve,reject)=>{
            try{
                const commetRef = db.collection("comment").doc(comtID);
                const response = await commetRef.get();
                resolve(response.data());
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    // 댓글 수정(comtID, postID, userID, 새로운 comt_content를 입력받아 댓글을 수정)
    static async updateComment(comtInfo){
        return new Promise(async(resolve,reject)=>{
            try{
                const comt_date = new Date().toLocaleString();
                await db.collection("comment").doc(comtInfo.comtID)
                .update({
                    comt_content:comtInfo.comt_content,
                    comt_date:comt_date,
                })
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    // 댓글 삭제
    static async deleteComment(comtID){
        return new Promise(async(resolve,reject)=>{
            try{
                await db.collection("comment").doc(comtID).delete();
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
    //eduPost삭제시 eduPost달린 댓글 삭제하기
    static async deleteComments(postID){
        return new Promise(async(resolve,reject)=>{
            try{
                var commentIDs=[];
                var commentIdIdx=0;
                const commentRef = await db.collection("comment").where("postID","==",postID).get();
                commentRef.forEach(doc=>{
                    commentIDs[commentIdIdx++]=doc.data().comtID;
                })
                const commentRef2 = db.collection("comment")
                commentIDs.forEach(comtID=>{
                    commentRef2.doc(comtID).delete();
                    
                })
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    // 댓글 등록하기(save)
    static async save(commentInfo){
        return new Promise(async(resolve,reject)=>{
            try{
                const TIME_ZONE = 3240 * 10000; //한국과 시차 맞추기
                const date = new Date();
                const comt_date = new Date(+date + TIME_ZONE).toISOString().replace('T', ' ').replace(/\..*/, ''); //게시글 등록 시 날짜 및 시간
                // userName 가져오기
                const userRef = db.collection("users").doc(commentInfo.userID);
                const user = await userRef.get();
                const userName = user.data().userName;
                // eduPost의 comment up

                const commentJson={
                    postID : commentInfo.postID,
                    userID : commentInfo.userID,
                    userName: userName,
                    comt_content : commentInfo.comt_content,
                    comt_date : comt_date
                };
                const res = await db.collection("comment").add(commentJson);
                await db.collection("comment").doc(res.id)
                .update({
                    comtID:res.id,
                })
                const postRef = db.collection("eduPost").doc(commentInfo.postID);
                const post = await postRef.get();
                await db.collection("eduPost").doc(commentInfo.postID)
                .update({
                    comment: ++(post.data().comment),
                })
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }     
        })
    }

}

module.exports = CommentStorage;