"use strict"

const UserStorage = require("./UserStorage");

class User {
    constructor(body) {
        this.body = body;
    }

    async login() {
        const body = this.body;

        try {
            const user = await UserStorage.getUserInfo(body.id);

            if (user) {
                if (user.email == body.id && user.password == body.passwd) {
                    return { success: true };
                }
    
                return { success: false, msg: "비밀번호가 틀렸습니다." };
            }
    
            return { success: false, msg: "존재하지 않는 아이디입니다." };
        } catch (err) {
            return { seuccess: false, err };
        }

    }

    async register() {
        try {
            const client = this.body;
            const response = await UserStorage.save(client);
            alert('회원가입 성공');
            return response;
        } catch(err) {
            return { success: false, msg:err};
        }
    }
}

module.exports = User;  