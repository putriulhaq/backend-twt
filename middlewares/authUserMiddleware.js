const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next) => {
    try {
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

        const user = await User.findOne({ where: { userId } });

        res.locals.user = user;
        next();
    } catch (error) {
        res.local.user = { userId: undefined };
        next();
    }

};