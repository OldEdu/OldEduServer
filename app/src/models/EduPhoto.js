"use strict";
const EduPhotoStorage = require("./EduPhotoStorage");
//EduPhoto은 게시글 데이터를 가지고 검증 및  조작하는 역할

class EduPhoto{
    constructor(body){
        this.body=body;
    }
    //imgNum 찾기
    async findImgNum(){
        try{
            let imgNum = await EduPhotoStorage.findMaxImgNum();
            return imgNum+1;
        }catch(err){
            console.log(err);
        }
    }

     //교육사진 등록 기능
     async createEduPhoto(){
        const client =this.body;
        try{
            const response = await EduPhotoStorage.saveEduPhoto(client,await this.findImgNum());
            return response;
        }catch(err){
            console.log(err);
            return {success: false,err };
        }

     }
     //교육사진 수정하기 기능
     async updateEduPhoto(){
        const client =this.body;
        try{
            const response = await EduPhotoStorage.updateEduPhoto(client);
            return response
        }catch(err){
            return {success:false,err};
        }
    }
    //게시글에 추가된 모든 교육사진 삭제
    async deleteEduPhotos(postID){
        try{
            console.log(postID);
            const response = await EduPhotoStorage.deleteEduPhotos(postID);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }
    //교육사진 삭제 기능
    async deleteEduPhoto(eduPhotoID){
        try{
            const response= await EduPhotoStorage.deleteEduPhoto(eduPhotoID);
            return response;
        }catch(err){
            return {success:false,err};
        }
    }
    //eduPost에 추가된 모든 교육사진 정보 불러오기
    async readEduPhotos(){
        const client =this.body;
        try{
            const response = await EduPhotoStorage.getEduPhotos(client); //postID 받음
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }
    //eduPhotoID로 eduPhotoID 정보 불러오기
    async readEduPhoto(eduPhotoID){
        const client =this.body;
        console.log(client)
        try{
            const response = await EduPhotoStorage.getEduPhoto(client); //eduPhotoID 받음
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }
}

module.exports=EduPhoto