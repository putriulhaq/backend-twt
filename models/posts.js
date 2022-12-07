const mongoose = require("mongoose");
const autoIncrement = require('mongoose-sequence')(mongoose)

const Schema = mongoose.Schema

const postSchema = new Schema({
    postId:{
        type: Number,
        required: true,
        unique:true
    },
    title:{
        type:String,
        required: true,
    },
    content:{
        type:String,
        required: true,
    },
    userId:{
        type:Number,
        ref:'User'
    },
    userName:{
        type:String,
        ref:'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

postSchema.plugin(autoIncrement, { inc_field:'postId'});

module.exports = mongoose.model('Post', postSchema)