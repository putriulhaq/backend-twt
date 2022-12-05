const express = require("express");
const Joi = require("joi");
const User = require("../models/users");
const authLoginUserMiddleware = require("../middlewares/authLoginUserMiddleware");

const router = express.Router();

const re_username = /^[a-zA-Z0-9]{3,10}$/;
const re_password = /^[a-zA-Z0-9]{4,30}$/;

const userSchema = Joi.object({
    username: Joi.string().pattern(re_username).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(re_password).required(),
    confirm: Joi.string(),
});

router.post("/signup", authLoginUserMiddleware, async (req, res) => {
    try {
        const { username, email, password, confirm } = await userSchema.validateAsync(req.body);

        if(password !== confirm){
            return res.status(412).send({
                errorMessages: "Password does not match",
            });
        }

        if(username.search(re_username) === -1){
            return res.status(412).send({
                errorMessages: "Username is invalid",
            });
        }

        if(password.search(re_password) === -1){
            return res.status(412).send({
                errorMessages: "Password is invalid",
            });
        }

        if(isRegexValidation(password, username)){
            return res.status(412).send({
                errorMessages: "Password cannot contain username",
            });
        }

        const user = await User.findOne({
            attributes: ["userId"],
            where: {
                username,
            },
        });

        if (user.length){
            return res.status(412).send({
                errorMessages: "Username or email already exists",
            });
        }

        const newUser = await User.create({ username, email, password , userId: 0});

        return res.status(200).send({ 
            message: "User created successfully",
        });

    } catch (err) {
        console.trace(err);
        console.log(`${req.method} ${req.originalUrl} ${err}`);

        return res.status(400).send({
            errorMessages: "Invalid email or password",
        });

    }
});

function isRegexValidation(target, regex){
    return target.search(regex) !== -1;
}

module.exports = router;