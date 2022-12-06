const express = require("express");
const app = express();
const login = require("./routes/login");
const signup = require("./routes/signup");
const post = require("./routes/post");
const connect = require("./models/index");

connect();

const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookieParser());~
 
app.use("/api", [login, signup, post]);

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

