
require("dotenv").config();

module.exports = (req, res, next) => {
    try{
        const cookies = req.cookies[process.env.COOKIE_NAME];
        if(cookies){
            return res.status(403).send({
                errorMessages: "You are already logged in",
            });
        }
        next();
    } catch(err){
        console.trace(err);
        return res.status(400).send({
            errorMessages: "Invalid token",
        });
    }
};
