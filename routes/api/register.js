const express=require("express");
const router= express.Router();
const gravatar=require("gravatar");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const config=require("config");
const { check, validationResult}=require("express-validator");

const user=require("../../models/Register")


// route POST api/users
// route test route
// @access public

router.post("/", [
check( "name", "name is required").not().isEmpty(),
check("email", "email is required").isEmail(),
check("password", "please enter a valid password").isLength({min:6})
], 
async (req, res)=>{ 
  const errors=validationResult(req);
  if(!errors.isEmpty())
  return res.status(400).json({errors:errors.array()});


   // see if user exist
const {
  name,
  email,
  password
   } = req.body;
try {
  let user = await User.findOne({ email });
  if(user){
    res.status(400).json({error: [{msg: "user already exit"}]});
  }

// get user gravtar
const avatar= gravatar.url(email, {
  s: "200",
  r: "pg",
  d: "mm",

})

user=new User({
  name,
  email,
  avatar,
  healthfacility,
  nameofvaccinator,
  state,
  phone,
  password
});
// encrypt password
const salt=  await bcrypt.genSalt(10)
user.password= await bcrypt.hash(password, salt);
await user.save();

// return jsonweb token
const payload={
  user:{
    id:user.id
  }
}

jwt.sign(payload, config.get("jwtSecret"), 
{expiresIn:36000},
(err, token)=>{
if(err) throw err
console.log(token)
res.json({token});
});


}catch(err){
console.log(err.message)
res.status(500).send("server error")
}
}
);


module.exports= router;
