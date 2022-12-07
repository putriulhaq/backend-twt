const express = require("express")
const router = express.Router()
const Posts = require('../models/posts')
const Users = require ('../models/users')
const authMiddleware = require("../middlewares/authMiddleware")
const { connection } = require("mongoose")
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
const date = require('date-and-time')

//TIMELINE
router.get("/timeline" , async (req,res) => {
    const timeline = await Posts.find();
    // const datauser = await Users.find();
    // const userMap = datauser.reduce((map, user) => map.set(user.userId, user.username), new Map());
    const posts = timeline.map(post => {
        // const name  = userMap.get(post.userId);
        return {
            title: post.title,
            content: post.content,
            username: post.userName,
            datetime: date.format(post.createdAt, 'DD/MM/YYYY HH:mm:ss'),
        }
    })
    res.send(posts)
});

//post tweet
router.post("/posts", authMiddleware, async(req, res)=> {
    try{      
        const userIdLogin = res.locals.user.userId
        const userName = res.locals.user.username
        const postData = new Posts({
            postId:0,
            title:req.body.title,
            content:req.body.content,
            userId:userIdLogin,
            username:userName,
        });
        const createPost = await Posts.create({
            postId:postData.postId,
            title: postData.title,
            content: postData.content,
            userId:postData.userId,
            userName:userName
        });
        res.json(createPost);
    } catch(e){
        console.log(e)
    }
})

// get post by id
router.get("/timeline/:Id", async(req,res) => {
    const {Id} = req.params
    const dataPosts =  await Posts.find({postId:Id})
    const getById = dataPosts.map(data => {
        return{
            data: data
        };
    });
    res.json(getById)
})

//deleted
router.delete("/posts/delete/:postId", async(req, res) => {
    const {postId} = req.params;  
    const getPost = await Posts.find({postId});
    if (getPost.length > 0){
        await Posts.deleteOne({postId})
    }
    res.json({ result: "deleted success" });
})


module.exports = router;