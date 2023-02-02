"use strict";

const db= require("../config/db");
//EduPhotoStorage에서는 DB를 CRUD(생성,읽기,수정,삭제)역할

class EduPhotoStorage{
    //교육사진 작성
    static async saveEduPhoto(eduPhotoInfo){
        return new Promise(async(resolve, reject)=>{
            try{
                const eduPhotoJson={  
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
                await db.collection("eduPhoto").doc(eduPhotoID).delete();
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
}
module.exports=EduPhotoStorage