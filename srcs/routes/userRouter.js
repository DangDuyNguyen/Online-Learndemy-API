const express = require('express');
const userModel = require('../models/userModel');
const responseMessage = require('../values/responseMessage');

const userRouter = express.Router();

//* Get all users (dev mode only)
userRouter.get('/', async (req, res) => {
    const result = await userModel.getAllUsers();
    if (!result) {
        res.status(500).json({ status: false, message: "Get failed" });
    }
    else {
        responseMessage.getSucceed.datas = result;
        res.json(responseMessage.getSucceed);
    }
});

//* get user by username filter
userRouter.get('/:username', async (req, res) => {
    const username = req.params['username'];

    const result = await userModel.getUser(username);
    
    if (!result) {
        res.status(500).json({ status: false, message: "Get failed" });
    }
    else {
        delete result._id;
        delete result.password;
        delete result.refreshToken;

        responseMessage.getSucceed.datas = result;
        res.json(responseMessage.getSucceed);
    }
});

//* update user info
userRouter.put('/update/:username', async (req, res) => {
    const username = req.params['username'];
    const firstname = req.body['firstname'];
    const lastname = req.body['lastname'];
    const email = req.body['email'];
    
    if (firstname == '' || lastname == '' || email == '') {
        res.status(400).json({status: false, message: 'All fields must not be blank'});
    }
    if (!firstname || !lastname || !email) {
        res.status(400).json({status: false, message: 'Missing field detected, check for your request body'})
    }

    const user = await userModel.getUser(username);

    if (!user) {
        res.status(400).json({status: false, message: 'User not existed'});
    }
    else {
        const updateData = {
            username: username,
            firstname: firstname,
            lastname: lastname,
            email: email
        };
    
        const result = await userModel.updateUser(updateData);
    
        if (!result) {
            res.status(500).json({ status: false, message: "Update failed" });
        }
        else {
            res.status(200).json({ status: true, message: 'Success'})
        }
    }
});

//* delete user
userRouter.delete('/delete/:username', async (req, res) => {
    const username = req.params['username'];

    const user = await userModel.getUser(username);

    if (!user) {
        res.status(400).json({status: false, message: 'User not existed'});
    }
    else {
        const result = await userModel.deleteUser(username);

        if (!result) {
            res.status(500).json(responseMessage.deleteFailure);
        }
        else {
            res.status(200).json(responseMessage.deleteSucceed);
        }
    }
});

module.exports = userRouter;