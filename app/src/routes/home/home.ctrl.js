// 컨트롤러 모듈화
"use strict";

const User = require("../../models/User");



const output = {
    root : (req,res) => {
        res.render('home/home');
    },
    login : (req,res) => {
        res.render("home/login");
    },
    register : (req,res) => {
        res.render("home/register");
    },
    artDetail : (req,res) => {
        res.render("home/art_detail");
    },
    art : (req,res) => {
        res.render("home/art");
    },    
    authorPortfolio : (req,res) => {
        res.render("home/author_portfolio");
    },
    authors : (req,res) => {
        res.render("home/authors");
    },    
    myPage : (req,res) => {
        res.render("home/mypage");
    },    
    errPage : (req,res) => {
        res.render("home/404");
    },    
    generateNFT : (req,res) => {
        res.render("home/generateNFT");
    },    
};

const process = {
    login : async (req,res) => {
        const user = new User(req.body);
        const response = await user.login(req);
        return res.json(response);
    },
    register : async (req,res) => {
        const user = new User(req.body);
        const response = await user.register();
        return res.json(response);
    },
};



module.exports = {
    output,
    process,
};