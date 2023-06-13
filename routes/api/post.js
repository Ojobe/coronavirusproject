const express=require("express");
const router= express.Router();
const {check, validationRsult, validationResult}=require("express-validator");
const auth=require("../../middleware/auth");
const Profile=require("../../models/Profile")
const Post=require("../../models/Post");
const User=require("../../models/Register");


// route POST api/post
// route test route
// @access Private

router.post("/", [auth, [
    check("text", "text is required").not().isEmpty()
]],
 async(req, res)=>{
const errors=validationResult(req)
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
}
try {
    const user= await User.findById(req.user.id).select("-password")

const newPost=new Post({
    text:req.body.text,
    name:user.name,
    avatar:user.avatar,
    user:req.user.id
});

const post= await newPost.save();
    res.json(post)

} catch (error) {
  console.error(error.message);
  res.status(500).send("server error")  
}
});



// route GET api/post
// route test route
// @access Private
router.get("/", auth, async(req, res)=>{
    try {
        const posts=await Post.find().sort({Date: -1})
        res.json({posts})
        
    } catch (error) {
        console.error(error.message).send("server error")
        
    }
});


// route GET api/post/ID
// route test route
// @access Private
router.get("/:id", auth, async(req, res)=>{
    try {
        const post=await Post.findById(req.params.id)
        if(!post){
            return res.status(400).json({msg:"post not found"})
        }
        res.json(post)
        
    } catch (error) {
        console.error(error.message)
        if(error.kind=== ObjectId){
            return res.status(404).json({msg:"post not found"})
        }
        res.status(400).send("server error")
        
    }
});



// route DELETE api/post
// route test route
// @access Private
router.delete("/:id", auth, async(req, res)=>{
    try {
       const post=await Post.findById(req.params.id);

       if(!post){
        return res.status(404).json({msg:"post not found"})

       }
       if(post.user.toString() !== req.user.id ){
        return res.status(401).json({msg:"user is not authorized"})
       }
       await post.remove()
       res.json({msg:"post is removed"})
    } catch (error) {
        console.error(error.message)
        if(error.kind=== ObjectId){
            return res.status(404).json({msg:"post not found"})
        }
    }
});

// route PUT api/post/likes/id
// route test route
// @access Private
router.put("/likes/:id", auth, async(req, res)=>{
    try {
        const post=await Post.findById(req.params.id);

        // check if post is alredy liked
        if(post.likes.filter(like => like.user.toString()===req.user.id).length > 0){
            return res.status(400).json({msg:"post already liked"})
        }
        post.likes.unshift({user: req.user.id})
        await post.save()
        console.log("you like a post")
        res.json(post.likes)
    } catch (error) {
       console.error(error.message)
       res.status(500).json({msg:"server error"}) 
    }
});



// route PUT api/post/unlike/:id
// route test route
// @access Private
router.put("/unlike/:id", auth, async(req, res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(post.likes.filter(like => like.user.toString()=== req.user.id).length === 0){
            console.log("post has not been liked")
            return res.status(400).json({msg:"post has not been liked"})
        }
        const removeIndex= post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1)
        await post.save()
        res.json(post.likes)
        
    } catch (error) {
        console.error(error.message);
        res.status(400).send("server error")
    }
});



// route POST api/post/comment
// route test route
// @access Private
router.post("/comment/:id", [auth, [
    check("text", "text is required").not().isEmpty()
]],
 async(req, res)=>{
const errors=validationResult(req)
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
}
try {
    const user= await User.findById(req.user.id)
    const post= await Post.findById(req.user.id).select("-password")

const newComment=new Post({
    text:req.body.text,
    name:user.name,
    avatar:user.avatar,
    user:req.user.id
});

 await Comment.unshift(newComment);
 post.save()
    res.json(post.Comment)

} catch (error) {
  console.error(error.message);
  res.status(500).send("server error")  
}
});



// route DELETE api/post/comment/:id/:comment_id
// route test route
// @access Private
router.delete("/comment/:id/:comment_id", auth, async(req, res)=>{
    try {
        const post=await Post.findById(req.user.id)
        const comment= post.Comment.find(comment=>comment.id=== req.params.comment_id);
        //mak sure comment exist
        if(!comment){
            return res.status(404).json({msg:"there is no comment to delete"})
        }
        const removeIndex= post.comment.map(comment => like.user.toString()).indexOf(req.user.id);
        post.comment.splice(removeIndex, 1)
        await post.save()
        res.json(post.comment)
    } catch (error) {
        console.error(error.message)
        res.status(400).send("server error")
        
    }
})

module.exports= router;