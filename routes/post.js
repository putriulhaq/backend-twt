const express = require("express")
const router = express.Router()
const Posts = require('../models/posts')
const Users = require ('../models/users')
const authMiddleware = require("../middlewares/authMiddleware")
const { connection } = require("mongoose")

//TIMELINE
router.get("/timeline" , async (req,res) => {
    const timeline = await Posts.find();
    const dataUsers = await Users.find();
    
    const posts = timeline.map(post => {
        const userId  = post.userId; 
        return {
            title: post.title,
            content: post.content,
            username: post.userId
        }
    })
    res.send(posts)
});


router.post("/posts", authMiddleware, async(req, res)=> {
    try{
        const userIdLogin = res.locals.user.userId
        const postData = new Posts({
            postId:0,
            title:req.body.title,
            content:req.body.content,
            userId:userIdLogin,
        });
        const createPost = await Posts.create({
            postId:postData.postId,
            title: postData.title,
            content: postData.content,
            userId:postData.userId
        });
        res.json(createPost);
    } catch(e){
        console.log(e)
    }
})

router.delete("/posts/delete/:postId", async(req, res) => {
    const {postId} = req.params;  
    const getPost = await Posts.find({postId});
    if (getPost.length > 0){
        await Posts.deleteOne({postId})
    }
    res.json({ result: "deleted success" });
})

router.get("/all", async(req, res) => {
    const allPost = await Posts.find();
    res.json(allPost)

})

module.exports = router;