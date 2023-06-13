const mongoose=require("mongoose");


const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    state:{
        type:String
    },
    healthfacility:{
        type:String  
    },
    nameofvaccinator:{
        type:String
    },
    typeofvaccine:{
        type:String   
    },
    age:{
        type:Number,
    },
    phonenumber:{
        type:String
    },
    gender:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    date:{
        type: Date,
        default:Date.now
    }
});

module.exports=User=mongoose.model("User", UserSchema);