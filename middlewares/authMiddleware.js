const jwt = require("jsonwebtoken");
const User = require("../models/users");
require("dotenv").config();
const bson = require("bson");
const cookieParser = require("cookie-parser");

module.exports = async (req, res, next) => {
    try{
        const cookies = req.cookies[process.env.COOKIE_NAME];

        if(!cookies){
            return res.status(403).send({
                errorMessages: "You are not logged in",
            });
        }

        const [tokenType, tokenValue] = cookies.split(" ");

        if(tokenType !== "Bearer"){
            return res.status(403).send({
                errorMessages: "Invalid token type",
            });
        }
        
        const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);

        const user = await User.findOne({ "userId": userId });

        res.locals.user = user;
        next();

    } catch(err){
        console.log(err);
        console.log(`${req.method} ${req.originalUrl} ${err}`);
        return res.status(403).send({
            errorMessages: "Cannot authenticate user",
        });
    }

};