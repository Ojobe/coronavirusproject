const mongoose=require("mongoose");
const config=require("config");
const db=config.get("mongoURI");

const connectDB= async()=>{
    try{
        await mongoose.connect(db, {useNewUrlParser:true});
        console.log("mongo database is connected...");

    }catch(err){
        console.error(err.message)
        process.exit();
    }
}

module.exports=connectDB;

