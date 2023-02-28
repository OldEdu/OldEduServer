"use strict";

const { resolve } = require("path");
const { reject } = require("underscore");
const db=require("../config/db");

class ScrapStorage {
    // postID로 eduPost에 있는 게시물 정보 받아오기
    static async getScrapInfo(postID) {
        return new Promise(async(resolve,reject)=>{
            try{
                const scrapRef = db.collection("eduPost").doc(postID);
                const response = await scrapRef.get();
                resolve(response.data());
            }catch(err) {
                reject(`${err}`)
            }
        })
    }

    // userID에 해당하는 스크랩 목록 가져오기
    static async getUserScrap(userID) {
        return new Promise(async(resolve,reject) => {
            try{
                var result = [];
                var idx = 0;
                const scrapRef = db.collection("scrap");
                const userRef = db.collection("users");
                const thisUserRef = db.collection("users").doc(userID);
                const user = await thisUserRef.get();
                const userQuery = await userRef.where('userID',"in",[userID]).get();
                if(userQuery.empty){
                    resolve({success:false, msg:"Sorry, but we can't find information of this ID."});
                }
                if(user.data().userType === false){
                    resolve({success:false, msg:"You are not Student. So, You can't get Scrap List."});
                }
                var queryRef = await scrapRef.where("userID","==",userID).get();
                if(queryRef.empty){
                    resolve({success:true, msg: "You don't have any scrap."}); 
                }
                queryRef.forEach(doc=>{
                    result[idx++]=doc.data();
                })
                resolve({success:true, result});
            }catch(err) {
                reject(`${err}`)
            }
        })
    }

    // 게시물 스크랩(저장)
    static async save(scrapInfo) {
        return new Promise(async(resolve,reject)=>{
            try{
                const isPostRef = db.collection("eduPost");
                const isPostQuery = await isPostRef.where('postID','in',[scrapInfo.postID]).get();
                if(isPostQuery.empty){
                    resolve({success:false,msg:"This post doesn't exist."});
                }
                else{
                    const scrapJson={
                        userID : scrapInfo.userID,
                        postID : scrapInfo.postID
                    };
                    const res = await db.collection("scrap").add(scrapJson);
                    await db.collection("scrap").doc(res.id)
                    .update({
                        scrapID:res.id,    
                    })
    
                    const postRef = db.collection("eduPost").doc(scrapInfo.postID);
                    const post = await postRef.get();
                    await db.collection("eduPost").doc(scrapInfo.postID)
                    .update({
                        scrap: ++(post.data().scrap),
                    })
                    resolve({success:true});
                }
            } catch(error){
                reject(`${err}`)
            }     
        })
    }
    
    // delete
    static async deleteScrap(scrapID){
        return new Promise(async(resolve,reject)=>{
            try{
                const scrapRef = db.collection("scrap").doc(scrapID);
                const scrap = await scrapRef.get();

                const postID = scrap.data().postID;
                const postRef = db.collection("eduPost").doc(postID);
                const post = await postRef.get();
                const scrapCount = post.data().scrap;
                // eduPost의 scrap이 0 이하인 경우에는 -1을하지 못하도록 함
                if (scrapCount > 0) {
                    await db.collection("eduPost").doc(postID)
                    .update({
                        scrap: --(post.data().scrap),
                    })
                }
                await db.collection("scrap").doc(scrapID).delete();
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
}

module.exports = ScrapStorage;

