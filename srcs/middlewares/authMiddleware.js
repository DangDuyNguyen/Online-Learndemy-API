const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel')
const key = require('../config/jwt-config')

module.exports = {
    all: (req, res, next) => {
        var accessToken = req.headers["authorization"];
        if (!accessToken) {
            res.status(401).json({ status: false, message: "token invalid" });
            return;
        }
        else {
            accessToken = accessToken.split(' ')[1];
        }

        jwt.verify(accessToken, key, async (err, decoded) => {
            if (err) {
                res.status(401).json({ status: false, message: "token invalid" });
            }
            else {
                const username = decoded["username"];
                const user = await userModel.getUser(username);
                if (!user) {
                    res.status(401).json({ message: "unauthenticated" })
                }
                next();
            }
        });
    },

    admin: (req, res, next) => {
        var accessToken = req.headers["authorization"];
        if (!accessToken) {
            res.status(401).json({ status: false, message: "token invalid" });
            return;
        }
        else {
            accessToken = accessToken.split(' ')[1];
        }

        jwt.verify(accessToken, key, async (err, decoded) => {
            if (err) {
                res.status(401).json({ status: false, message: "token invalid" });
            }
            else {
                const username = decoded["username"];
                const user = await userModel.getUser(username);
                if (!user) {
                    res.status(401).json({status: false, message: "unauthenticated" })
                }

                if(decoded['roleId'] == 0) {
                    next();
                }
                {
                    res.status(403).json({status: false, message: "Forbidden" })
                }
            }
        });
    }
}