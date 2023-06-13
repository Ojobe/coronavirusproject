const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const postSchema=new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    text:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    avatar:{
        type:String
    },
    likes:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref:"users"
            }
        }
    ],
    Comment:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref:"users"
            },
            text:{
                type:String,
                required:true
            },
            avatar:{
                type:String
            },
            date:{
                type:String,
                default:Date.now
            }
        }
    ],
    date:{
        type:String,
        default:Date.now
    }

})

module.exports=Post=mongoose.model("Post", postSchema)