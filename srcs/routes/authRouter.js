const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
const { developing } = require('../values/responseMessage')
const key = require('../config/jwt-config');
/**
 * * Variables
 */
const hashRound = 11;
/**
 * * Route
 */

//* Register account
authRouter.post('/register', (req, res) => {
    const username = req.body['username'];
    const rawPassword = req.body['password'];
    const firstName = req.body['firstname'];
    const lasName = req.body['lastname'];
    const email = req.body['email'];
    var refreshToken = null;
    if (username == null || rawPassword == null || email == null || username == "" || rawPassword == "" || email == "") {
        res.status(400).json({ 'status': false, 'message': 'Missing required fields' });
    }
    else if (!username.match("^[a-zA-Z0-9]*$")){
        res.status(400).json({ 'status': false, 'message': 'Username must only contains letters and numbers' });
    }
    else if (rawPassword.length < 8) {
        res.status(400).json({ 'status': false, 'message': 'Password length must be greater than 8 characters' });
    }
    else if (!emailValidator.validate(email)) {
        res.status(400).json({ 'status': false, 'message': 'Not valid email' });
    }
    else {
        bcrypt.hash(rawPassword, hashRound, async (err, hash) => {
            if (err) {
                console.log(err);
                res.status(500).json({ 'error': err })
            }
            else {
                await jwt.sign({ 'username': username }, key, (error, token) => {
                    if (!error) {
                        refreshToken = token;
                    }
                    else {
                        console.log(error);
                    }
                });

                const user = {
                    username: username,
                    password: hash,
                    firstname: firstName,
                    lastname: lasName,
                    email: email,
                    refreshToken: refreshToken,
                    role: null
                };

                if ((await userModel.insertUser(user)).status == true) {

                    res.status(201).json({ 'status': true, 'message': 'Registered' });
                }
                else {
                    res.status(400).json({ 'status': false, 'message': 'Not Registered' })
                }
            }
        });
    }
})

//* Login to account
authRouter.post('/login', async (req, res) => {
    const username = req.body['username'];
    const rawPassword = req.body['password'];

    const user = await userModel.getUser(username);
    if (!user) {
        res.status(401).json({ 'status': false, 'message': 'Authentication failed' });
    }
    else {
        bcrypt.compare(rawPassword, user.password, (err, match) => {
            if (!err) {
                if (match) {
                    jwt.sign({ 'username': username }, key, { expiresIn: 8 * 3600 }, (error, token) => {
                        if (!error) {
                            res.status(200).json({ 'status': true, 'datas': { 'accessToken': token, 'refreshToken': user.refreshToken } });
                        }
                        else {
                            console.log(error);
                        }
                    }); //*Expire in 'X' x 3600 seconds (1 hours)
                }
                else {
                    res.status(401).json({ 'status': false, 'message': 'Authentication failed' });
                }
            }
        });
    }
});

authRouter.post('/set-role', async (req, res) => {
    const username = req.body['username'];
    const role = req.body['role'];

    const user = await userModel.getUser(username);
    if (!user) {
        res.status(401).json({ 'status': false, 'message': 'Authentication failed' });
    }
    else {
        if(typeof role !== typeof 0) {
            res.status(400).json({'status': false, 'message': 'Invalid typeof role'});
        }
        else {
            const updateData = {
                username: username,
                role: role
            };
        
            const result = await userModel.updateUserRole(updateData);
        
            if (!result) {
                res.status(500).json({ status: false, message: "Update failed" });
            }
            else {
                res.status(200).json({ status: true, message: 'Success'})
            }
    
        }
    }

    
});

//TODO: implement send verify OTP to user mail
authRouter.post('/sendOTP', (req, res) => {
    res.status(501).json(developing);
    // let transporter = nodemailer.createTransport({
    //     host: 'localhost',
    //     port: 1111,
    //     secure: false
    //     // auth: {
    //     //     user: '',
    //     //     pass: '',
    //     // },
    // });

    // transporter.sendMail({
    //     from: 'ventnguyen06@gmail.com', // sender address
    //     to: "dangduynguyen046@gmail.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    // }, (err, info) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
});

//TODO: implement change Password
authRouter.post('/change-password', (req,res) => {
    res.status(501).json(developing);
});
module.exports = authRouter;