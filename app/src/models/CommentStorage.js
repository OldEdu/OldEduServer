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
                    resolve({success:false, msg: "This post does not exist."});
                }
                var queryRef = await commentRef.where("postID","==",postID).get();
                if(queryRef.empty){
                    resolve({success:true , msg: "This post don't have any comment."});
                }
                const nowDate = new Date();
                queryRef.forEach(doc=>{
                    result[idx] = doc.data();
                    let comtDate = Date.parse(doc.data().comt_date);
                    let timeDiff = nowDate.getTime() - comtDate;
                    timeDiff = timeDiff / 1000;
                    // seconds //
                    let seconds = Math.floor(timeDiff % 60);
                    // minutes //
                    timeDiff = Math.floor(timeDiff / 60);
                    let minutes = timeDiff % 60;
                    // hours //
                    timeDiff = Math.floor(timeDiff / 60);
                    let hours = timeDiff % 24;
                    // day//
                    timeDiff = Math.floor(timeDiff / 24);
                    let days = timeDiff;
                    if(days >= 1){
                        result[idx].term = days+"일 전";
                    }
                    else if(hours >= 1){
                        result[idx].term = hours+"시간 전";
                    }
                    else if(minutes >= 1){
                        result[idx].term = minutes+"분 전";
                    }
                    else if(seconds > 0){
                        result[idx].term = seconds+"초 전";
                    }
                    result[idx].myComment = false;
                    idx++;
                })
                result = recentSort(result);
                resolve({success:true, result});
            }catch(err) {
                reject(`${err}`);
            }
        })
    }

     // 로그인 했을 경우 postID에 맞는 댓글 리스트 가져오기, userID가 쓴 댓글일 경우에는 true, 안 쓴 댓글 일 경우에는 false를 나타내는 필드 추가
     static async getCommentList_Post_Login(postID,userID){
        return new Promise(async(resolve,reject)=>{
            try{
                var result = [];
                var idx = 0;
                const commentRef = db.collection("comment");
                const postRef = db.collection("eduPost").doc(postID);
                const post = await postRef.get();
                
                if(post.data() === undefined){
                    resolve({success:false, msg: "This post does not exist."});
                }
                var queryRef = await commentRef.where("postID","==",postID).get();
                if(queryRef.empty){
                    resolve({success:true , msg: "This post don't have any comment."});
                }
                const nowDate = new Date();
                queryRef.forEach(doc=>{
                    result[idx] = doc.data();
                    let comtDate = Date.parse(doc.data().comt_date);
                    let timeDiff = nowDate.getTime() - comtDate;
                    timeDiff = timeDiff / 1000;
                    // seconds //
                    let seconds = Math.floor(timeDiff % 60);
                    // minutes //
                    timeDiff = Math.floor(timeDiff / 60);
                    let minutes = timeDiff % 60;
                    // hours //
                    timeDiff = Math.floor(timeDiff / 60);
                    let hours = timeDiff % 24;
                    // day//
                    timeDiff = Math.floor(timeDiff / 24);
                    let days = timeDiff;
                    if(days >= 1){
                        result[idx].term = days+"일 전";
                    }
                    else if(hours >= 1){
                        result[idx].term = hours+"시간 전";
                    }
                    else if(minutes >= 1){
                        result[idx].term = minutes+"분 전";
                    }
                    else if(seconds > 0){
                        result[idx].term = seconds+"초 전";
                    }
                    // myComment
                    if(userID == doc.data().userID){
                        result[idx].myComment = true;
                    }  
                    else{
                        result[idx].myComment = false;
                    }
                    idx++;
                })
                result = recentSort(result);
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
                const nowDate = new Date();
                queryRef.forEach(doc=>{
                    result[idx] = doc.data();
                    let comtDate = Date.parse(doc.data().comt_date);
                    let timeDiff = nowDate.getTime() - comtDate;
                    timeDiff = timeDiff / 1000;
                    // seconds //
                    let seconds = Math.floor(timeDiff % 60);
                    // minutes //
                    timeDiff = Math.floor(timeDiff / 60);
                    let minutes = timeDiff % 60;
                    // hours //
                    timeDiff = Math.floor(timeDiff / 60);
                    let hours = timeDiff % 24;
                    // day//
                    timeDiff = Math.floor(timeDiff / 24);
                    let days = timeDiff;
                    if(days >= 1){
                        result[idx].term = days+"일 전";
                    }
                    else if(hours >= 1){
                        result[idx].term = hours+"시간 전";
                    }
                    else if(minutes >= 1){
                        result[idx].term = minutes+"분 전";
                    }
                    else if(seconds > 0){
                        result[idx].term = seconds+"초 전";
                    }
                    result[idx].myComment = true;
                    idx++;
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
                const commentRef = db.collection("comment").doc(comtID);
                const comment = await commentRef.get();

                const postID = comment.data().postID;
                const postRef = db.collection("eduPost").doc(postID);
                const post = await postRef.get();
                const commentCount = post.data().commment;
                // eduPost의 scrap이 0 이하인 경우에는 -1을하지 못하도록 함
                if (commentCount > 0) {
                    await db.collection("eduPost").doc(postID)
                    .update({
                        comment: --(post.data().comment),
                    })
                }
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
                    comt_date : comt_date,
                    myComment:true,
                    term:"방금전"
                };
                const res = await db.collection("comment").add(commentJson);
                await db.collection("comment").doc(res.id)
                .update({
                    comtID:res.id,
                })

                const commentRes= await db.collection("comment").doc(res.id)
                const postRef = db.collection("eduPost").doc(commentInfo.postID);
                const post = await postRef.get();
                await db.collection("eduPost").doc(commentInfo.postID)
                .update({
                    comment: ++(post.data().comment),
                })
                const temparray=[]
                temparray[0] = await (await commentRes.get()).data()

                resolve({success:true, result:temparray});
            }catch(err){
                reject(`${err}`);
            }     
        })
    }
}

function recentSort(array){
    array.sort(function (a, b) {
        if (b.comt_date > a.comt_date) return 1;
        else if (b.comt_date < a.comt_date) return -1;
        else return 0;
    })
    return array;
}

module.exports = CommentStorage;