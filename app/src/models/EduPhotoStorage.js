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

    //postID를 이용해 eduPost에 추가된 모든 교육사진 정보 불러오기
    static async getEduPhotos(postID){
        return new Promise(async(resolve,reject)=>{
            try{
                var result=[];
                var residx=0;
                const eduPhotoRef = db.collection("eduPhoto")
                var queryRef =await eduPhotoRef.where("postID","==",postID).get();
            
                 if(queryRef.empty){
                    resolve({success:true , msg: "No eduPhotos have been created."}); //작성된 교육사진이 없습니다.
                }
                queryRef.forEach(doc=>{
                    result[residx++]=doc.data();
                })

                result.sort(function(a,b){//생성 순으로 정렬
                    if(a.eduPhotoID>b.eduPhotoID)return 1;
                    else if(a.eduPhotoID<b.eduPhotoID) return -1;
                    else return 0;
                })


                resolve({success:true, result});
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