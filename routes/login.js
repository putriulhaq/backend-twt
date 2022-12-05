const express = require("express");
const Joi = require("joi");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const authLoginUserMiddleware = require("../middlewares/authLoginUserMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const bson = require("bson");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Login Page");
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

router.post("/login", authLoginUserMiddleware, async (req, res) => {
    try {
        const { email, password } = await loginSchema.validateAsync(req.body);

        // Check if email and password are correct from database
        const user = await User.findOne({
            "email": email,
            "password": password,
        });

        if(email !== user.email || password !== user.password){
            return res.status(412).send({
                errorMessages: "Invalid email or password",
            });
        }
        
        // console.log(user);

        if (!user) {
            return res.status(412).send({
                errorMessages: "Invalid email or password",
            });
        }

        const expires = new Date();
        expires.setDate(expires.getMinutes() + 60);

        const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY);

        res.cookie(process.env.COOKIE_NAME, `Bearer ${token}`, {
            expires: expires,
        });

        return res.status(200).send({ 
            message: "Login successful",
            token 
        });
    } catch (err) {
        console.log(`${req.method} ${req.originalUrl} ${err}`);

        return res.status(400).send({
            errorMessages: "Invalid email or password",
        });

    }
});

router.get("/me", authMiddleware, async (req, res) => {
    res.send({
        // show certain fields
        email: res.locals.user.email,
        username: res.locals.user.username,
    });
});

module.exports = router;