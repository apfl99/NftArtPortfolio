"use strict";

const db = require("../config/db");

class UserStorage {
    static getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM NFT.login_designer WHERE userId = ?;";
            db.query(query, [id], (err,data) => {
                if(err) reject(`${err}`);
                resolve(data[0]);
            });
        });
    };


    static async save(userInfo) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO NFT.login_designer(login_designer.userId,login_designer.username,login_designer.password) VALUES(?, ?, ?);";
            db.query(query, [userInfo.email,userInfo.username,userInfo.passwd], (err) => {
                if(err) reject(`${err}`);
                resolve({success: true});
            });
        });
    };

    static async art_save(artInfo,ipfsVal) {
        return new Promise((resolve, reject) => {
            const query2 = "INSERT INTO NFT.art(art.art_name, art.author_id, art.ipfs_link, art.art_explain, art.art_category, art.ipfs_cid) VALUES(?, ?, ?, ?, ?, ?);";
            db.query(query2, [artInfo.artName, artInfo.userId, ipfsVal.ipfsUrl, artInfo.artDescription, artInfo.artCategory, ipfsVal.ipfsCid], (err) => {
                if(err) reject(`${err}`);
                resolve({success: true});
            });
        });
    };


    static async art_save1(artInfo1,ipfsVal) {
        return new Promise((resolve, reject) => {
            const query3 = "update NFT.login_designer set login_designer.ipfs_link2= ? , login_designer.major = ?, login_designer.birth = ?, login_designer.comment = ? where userId=? ";
            db.query(query3, [ipfsVal.ipfsUrl, artInfo1.major, artInfo1.birth, artInfo1.personalDescription, artInfo1.userId], (err) => {
                if(err) reject(`${err}`);
                resolve({success: true});
            });
        });
    };

    static authorPortfolio_nft(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM NFT.login_designer WHERE userId = ?;";
            db.query(query, [id], (err,data) => {
                if(err) reject(`${err}`);
                resolve(data[0]);
            });
        });
    };

}  


module.exports = UserStorage;