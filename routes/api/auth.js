const express=require("express");
const router= express.Router();
const bcrypt=require("bcryptjs")
const auth = require("../../middleware/auth");
const jwt=require("jsonwebtoken");
const config=require("config");
const { check, validationResult}=require("express-validator");
const user=require("../../models/Register");

// route GET api/auth
// route test route
// @access public

router.get("/", auth, async(req, res)=> {
   try{
    const user = await User.findById(req.user.id).select("-password");
    res.json(user)
   }catch(err){
     console.error(err.message);
     return res.status(500).send("server error")
   }
});


// route POST api/auth
// route test route
// @access public

router.post("/", [
  check("email", "email is required").isEmail(),
  check("password", "please enter a valid password").exists()
  ], 
  async (req, res)=>{ 
    const errors=validationResult(req);
    if(!errors.isEmpty())
    return res.status(400).json({errors:errors.array()});
  
  
     // see if user exist
  
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if(!user){
      return res.status(400).json({error: [{msg: "invalid credentials 1" }]});
    console.log(error); 
    }

    const isMatch= await bcrypt.compare(password, user.password);
    if(!isMatch){
     return res.status(400).json({error: [{msg: "invalid credentials 2"}]});
     console.log(error); 
     
    }
  // return jsonweb token
  const payload={
    user:{
      id:user.id
    }
  }
  
  jwt.sign(payload, config.get("jwtSecret"), {expiresIn:36000},
  (err, token)=>{
  if(err) throw err;
  return res.json({token});
  console.log("your request is successful")
  });
  }catch(err){
  console.log(err)
  res.status(500).send("server error")
  }
  }
  );



module.exports= router;