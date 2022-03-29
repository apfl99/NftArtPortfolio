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
}  


module.exports = UserStorage;