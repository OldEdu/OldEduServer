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
                var posts = [];
                var result = [];
                var idx = 0;
                const scrapRef = db.collection("scrap");
                const userRef = db.collection("users");
                const thisUserRef = db.collection("users").doc(userID);
                const user = await thisUserRef.get();
                const userQuery = await userRef.where('userID',"in",[userID]).get();
                // user의 정보가 없는 경우
                if(userQuery.empty){
                    resolve({success:false, msg:"Sorry, but we can't find information of this ID."});
                }
                // userType이 students가 아닌 경우
                if(user.data().userType === false){
                    resolve({success:false, msg:"You are not Student. So, You can't get Scrap List."});
                }
                // 해당 userID의 유저가 어떤 게시글도 스크랩 하지 않은 경우
                var queryRef = await scrapRef.where("userID","==",userID).get();
                if(queryRef.empty){
                    resolve({success:true, msg: "You don't have any scrap."}); 
                }
                queryRef.forEach(doc=>{
                    posts[idx++] = doc.data().postID;
                })
                let post;
                let arrayIdx = 0;
                for(let i = 0; i < idx; i++){
                    post = (await db.collection("eduPost").doc(posts[i]).get()).data();
                    console.log(post);
                    if(post !== undefined){
                        result[arrayIdx] = post;
                        arrayIdx++;
                    }
                }
                resolve({success:true, result});
            }catch(err) {
                reject(`${err}`)
            }
        })
    }
    // 학습자가 해당 scrap를 클릭 했는지 확인하기 위한
    static async checkScrapOn(scrapInfo){
        return new Promise(async (resolve, reject) => {
            try{
                const scrapRef = await db.collection("scrap").where("postID", "==", scrapInfo.postID).get();
                scrapRef.forEach((scrap) => {
                    // 아래의 조건문에 걸리면 해당 학습자가 해당 게시글에 heart를 누른 것
                    if(scrap.data().userID === scrapInfo.userID){
                        resolve(true);
                    }
                });
                // 그대로 루프를 빠져나오면 하트를 클릭 안했다는 것
                resolve(false);
            }catch(err){
                reject(`${err}`);
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

                    const scrapID = res.id;
                    resolve({success:true, scrapID:scrapID,scrap:++(post.data().scrap)});
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
                resolve({success:true,scrapID:null,scrap:--(post.data().scrap)});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
}

module.exports = ScrapStorage;

