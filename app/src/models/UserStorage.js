"use strict";

const db = require("../config/db");

class UserStorage {
    static getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM NFT.login WHERE email = ?;";
            db.query(query, [id], (err,data) => {
                if(err) reject(`${err}`);
                resolve(data[0]);
            });
        });
    };


    static async save(userInfo) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO NFT.login(login.email, login.username,login.password) VALUES(?, ?, ?);";
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
}  


module.exports = UserStorage;