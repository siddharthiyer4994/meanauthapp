const mongoose = require("mongoose");
const config = require("../config/database");

const Schema = mongoose.Schema;

//Post schema
const PostSchema = mongoose.Schema({
  
    text: String,
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reply'
      }
    ]
  });

//Replies schema
const RepliesSchema = mongoose.Schema({
  
  message: String,
  parentId : Number,
  thread: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thread"
    }
  ]
});

//Threads schema
const ThreadSchema = mongoose.Schema({
  parentId:Number,
  message: String,
  thread: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thread"
    }
  ]
});
    


const Post =  module.exports =  mongoose.model("Post", PostSchema);
const Reply =  mongoose.model("Reply", RepliesSchema);
const Thread =  mongoose.model("Thread", ThreadSchema);

module.exports.addPost = function(newPost, callback){
       
    const nPost = new Post({
        text: newPost.text
    });
    nPost.save(callback)
    
}

module.exports.getPosts = function( callback){
       
    Post.find({},callback)
    
}

module.exports.addReply = function(postId,reply,callback){
    let query = {_id:postId};
    let newReply = new Reply({
        message: reply.message
    })

    Post.findByIdAndUpdate(query,{
        $push:{
            replies:[
                newReply
            ]
        }
    },callback)
}