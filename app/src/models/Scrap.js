"user strict";

const ScrapStorage = require("./ScrapStorage");
const db = require("../config/db");

class Scrap {
    constructor(body){
        this.body = body;
    }

    // UserType
    async getUserType(){
        const client = this.body
        try{
            const userRef = db.collection("users").doc(client.userID);
            const response = await userRef.get();
            return response.data().userType;
        }catch(err){
            return {success:false, err};
        }
    }

    // 스크랩에 게시글 추가
    async addScrap() {
        const client = this.body; // scrap JSON
        try{
            const response = await ScrapStorage.save(client);
            return response;
        }catch(err) {
            return {success:false,err};
        }
    }

    // 스크랩한 게시글 정보 가져오기
    async getScrap() {
        const client = this.body; // scrap JSON
        try{
            const response = await ScrapStorage.getScrapInfo(client);
            return response;
        } catch(err) {
            return {succrss: false, msg:"The post you want doesn't exist."};
        }
    }

    // userID로 해당 userID에 해당하는 스크랩 목록 가져오기
    async getScrapList() {
        const client = this.body; // userID
        try{
            const response = await ScrapStorage.getUserScrap(client);
            return response;
        } catch(err) {
            return {succrss: false,err};
        }
    }

    // 스크랩에 게시글 삭제
    async deleteScrap(scrapID){
        try{
            const response = await ScrapStorage.deleteScrap(scrapID);
            return response;
        }catch(err){
            return {succrss: false,err};
        }
    }
}

module.exports = Scrap;