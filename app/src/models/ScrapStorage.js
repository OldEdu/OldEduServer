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
                const scrapRef = db.collection("scrap");
                var queryRef =await scrapRef.where("userID","==",userID).get();
            
                 if(queryRef.empty){
                    resolve({success:true , msg: "You don't have any scrap."}); 
                }
                for(var i=0; i<queryRef.size; i++){
                    result[i]=queryRef.docs.at(i).data();
                }
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
                const scrapJson={
                    userID : scrapInfo.userID,
                    postID : scrapInfo.postID
                };
                const res = await db.collection("scrap").add(scrapJson);
                await db.collection("scrap").doc(res.id)
                .update({
                    scrapID:res.id,
                })
                resolve({success:true});
            } catch(error){
                reject(`${err}`)
            }     
        })
    }

    // delete
    static async deleteScrap(scrapID){
        return new Promise(async(resolve,reject)=>{
            try{
                await db.collection("scrap").doc(scrapID).delete();
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
}

module.exports = ScrapStorage;

