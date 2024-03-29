"use strict";

const db= require("../config/db");
const functions=require("firebase-functions");
const {Storage} = require("@google-cloud/storage");
const formidable = require("formidable-serverless");
const UUID = require("uuid-v4");

const storage = new Storage({
  keyFilename: "key.json",
});

//EduPhotoStorage에서는 DB를 CRUD(생성,읽기,수정,삭제)역할

class EduPhotoStorage{
    
    //eduNum 최대값 찾기
    static async findMaxImgNum(){
        return new Promise(async(resolve,reject)=>{
            try{
                const eduPhotoRef = db.collection("eduPhoto")
                const maxImgNum = await eduPhotoRef.orderBy('imgNum','desc').limit(1).get();
                maxImgNum.forEach(doc => {
                    resolve(doc.data().imgNum);
                });
            }catch(err){
                reject(`${err}`);
            }
        })
    }
    //교육사진 작성
    static async saveEduPhoto(eduPhotoInfo,imgNum){
        return new Promise(async(resolve, reject)=>{
            try{
                const eduPhotoJson={  
                    imgNum: imgNum,
                    postID:eduPhotoInfo.postID,
                    imgUrl:eduPhotoInfo.imgUrl,
                    voiceGuide:eduPhotoInfo.voiceGuide,
                    textGuide:eduPhotoInfo.textGuide,
                }
                const eduPhotoRef= await db.collection("eduPhoto").add(eduPhotoJson);
                await db.collection("eduPhoto").doc(eduPhotoRef.id)
                .update({
                    eduPhotoID:eduPhotoRef.id, //필드에 postID추가
                })
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    //postID를 이용해 eduPost에 추가된 모든 교육사진 정보 불러오기
    static async getEduPhotos(postID){
        return new Promise(async(resolve,reject)=>{
            try{
                var result=[];
                var residx=0;
                const eduPhotoRef = db.collection("eduPhoto")
                var queryRef =await eduPhotoRef.where("postID","==",postID).get();
            
                 if(queryRef.empty){
                    resolve({success:true , msg: "Image added to post does not exist."}); 
                }
                queryRef.forEach(doc=>{
                    result[residx++]=doc.data();
                })

                result.sort(function(a,b){//imgNum 오름차순으로 정렬
                    if(a.imgNum>b.imgNum)return 1;
                    else if(a.imgNum<b.imgNum) return -1;
                    else return 0;
                })


                resolve({success:true, result});
            }catch(err){
                reject(`${err}`);
            }
        })

    }
    //postID를 이용해 eduPost에 추가된 모든 교육사진 삭제하기
    static async deleteEduPhotos(postID){
        return new Promise(async(resolve,reject)=>{
            try{
                var eduPhotoIDs=[];
                var eduPhotoIdIdx=0;
                const eduPhotoRef = await db.collection("eduPhoto").where("postID","==",postID).get();
                eduPhotoRef.forEach(doc=>{
                    eduPhotoIDs[eduPhotoIdIdx++]=doc.data().eduPhotoID;
                })
                const eduPhotoRef2 = await db.collection("eduPhoto")
                eduPhotoIDs.forEach(eduPhotoID=>{
                    eduPhotoRef2.doc(eduPhotoID).delete();
                    
                })

                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })

    }
    //eduPhotoID로 교육사진 수정
    static async updateEduPhoto(eduPhotoInfo){
        return new Promise(async(resolve,reject)=>{
            try{
                await db.collection("eduPhoto").doc(eduPhotoInfo.eduPhotoID)
                .update({
                    imgUrl:eduPhotoInfo.imgUrl,
                    voiceGuide:eduPhotoInfo.voiceGuide,
                    textGuide:eduPhotoInfo.textGuide,
                })
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
    //eduPhotoID로 교육사진 삭제
    static async deleteEduPhoto(eduPhotoID){
        return new Promise(async(resolve,reject)=>{
            try{
                let eduPhotoRef = await db.collection("eduPhoto").doc(eduPhotoID);
                
                if(await (await eduPhotoRef.get()).exists){
                    eduPhotoRef.delete();
                    resolve({success:true});
                }
                else{
                    resolve({success:false, err:"생성되지 않은 eduPhotoID입니다."})
                }
                
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    //eduPhotoID로 교육사진 정보 불러오기
    static async getEduPhoto(eduPhotoID){
        return new Promise(async(resolve,reject)=>{
            try{
                let eduPhotoRef = await db.collection("eduPhoto").doc(eduPhotoID);
                console.log(await (await eduPhotoRef.get()).data())
                
                if(await (await eduPhotoRef.get()).exists){
                    resolve({success:true,eduPhotoResponse:(await eduPhotoRef.get()).data()});
                }
                else{
                    resolve({success:false, err:"생성되지 않은 eduPhotoID입니다."})
                }
                
            }catch(err){
                reject(`${err}`);
            }
        })
    }
}
module.exports=EduPhotoStorage