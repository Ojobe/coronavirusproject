const express=require("express");
const router= express.Router();
const request=require("request");
const config=require("config");
const { check, validationResult}=require("express-validator");
const auth=require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { findOne } = require("../../models/Profile");
const profile=require("../../models/Profile");
const User=require("../../models/Register");

//

//@route GET api/profile/me
//@desc  get current users profile
//@access public

router.get("/me", auth, async(req, res)=> {
    try{
        const profile= await Profile.findOne({user:req.user.id}).populate("user", ["name", "avatar"])
        if(!profile){
            return res.status(400).json({msg: "there is no profile for this"})
        }
        res.json(profile)    
    }catch(err){
console.error(err.message);
console.log(err)
res.status(500).send("server error")
    }
});


router.post("/", [auth, [
    check("status", "status is required").not().isEmpty(),
    check("skills", "skills is required").not().isEmpty()
]], async(req, res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({error: errors.array()})
    }
    const {company,website,location, bio, status,githubusername,skills,
youtube,facebook,twitter,instagram,linkedin }=req.body;

const profileFields={};
profileFields.user=req.user.id;
if(company) profileFields.company=company;
if(website) profileFields.website=website;
if(location) profileFields.location=location
if(bio) profileFields.bio=bio;
if(status) profileFields.status=status;
if(githubusername) profileFields.githubusername=githubusername;
if(skills){
    profileFields.skills=skills.split(",").map(skill=> skill.trim());
}

//build socials array
profileFields.social={}
if(youtube) profileFields.social.youtube=youtube;
if(twitter) profileFields.social.twitter=twitter;
if(facebook) profileFields.social.facebook=facebook;
if(instagram) profileFields.social.instagram=instagram;
if(linkedin) profileFields.social.linkedin=linkedin

try {
    let profile=await Profile.findOne({user:req.user.id})
    if(profile){
       profile = await Profile.findOneAndUpdate({user:req.user.id}, {$set:profileFields},
        {new:true});
        return res.json(profile); 

    };
    //create
    profile=new Profile(profileFields)
    await profile.save()
    res.json(profile)
}catch (err) {
console.error(err.message)
res.status(500).send("server error")
}
});

router.get("/", async(req, res)=>{
try{
    profiles=await Profile.find().populate("user",["name", "avatar"])
    res.json(profiles)

}catch(err){
    console.log(err.msg)
    res.status(500).send(error.message)
}
});

router.get("/user/:user_id", async(req, res)=>{
    try{
        profiles=await Profile.findOne({user: req.params.user_id}).populate("user",["name", "avatar"])
        if(!profile){
            return res.status(400).json({msg: "there is no profile for this user"})
        }
        res.json(profiles)
    
    }catch(err){
        console.log(err.msg)
        res.status(500).send(error.message)
    }
    });


    //delete user and profile

    router.delete("/", auth, async(req, res)=>{
        try{
        await Profile.findOneAndRemove({user: req.user.id})
            await User.findOneAndRemove({_id: req.user.id})
            
            res.json({msg: "user is removed"})
        
        }catch(err){
            console.log(err.msg)
            res.status(500).send(error.message)
        }
        });

        //making a put request to upate the profile

        router.put("/experience", [auth,[
            check("title", "title is required").not().isEmpty(),
            check("company", "company is required").not().isEmpty(),
            check("from","from date is required").not().isEmpty(),
        ]],
            async(req, res)=>{
                const errors=validationResult(req)
                if(!errors.isEmpty()){
                    res.status(400).json({errors:errors.array()})
                }
                const {
                    title,
                    company,
                    location,
                    from,
                    to,
                    current,
                    description
                }=req.body
            

            const newExp={
                    title,
                    company,
                    location,
                    from,
                    to,
                    current,
                    description
            }
            try {
                const profile= await Profile.findOne({user:req.user.id})
                profile.experience.unshift(newExp)
                await profile.save();
                res.json({profile})
                
            } catch (errors) {
                console.log(error.message)
                res.status(400).send("server error occured")
            }
        } 
        );


        router.delete("/experience/:exp_id", auth, async(req, res)=>{
            try {
                const profile=await Profile.findOne({user: req.user.id});
                const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
                profile.experience.splice(removeIndex, 1);
                await profile.save();
                console.log("experience is deleted")
                res.json(profile)
                
            } catch (error) {
                cconsole.log(error.message)
                res.status(500).send("server error occured")
                
            }
        });

        //add and delete education
        router.put("/education",[ auth,[
            check("scchool","school is requird").not().isEmpty(),
            check("degree","degree is required").not().isEmpty(),
            check("fieldofstudy","field of study is required").not().isEmpty(),
            check("from","start date is required").not().isEmpty()
            
        ]], 
        async(req, res)=>{
          const { school,
                  degree,
                  fieldofstudy,
                  from,
                  to,
                  current,
                  description
                 }=req.body 
                 
                 const newEdu={
                    school,
                    degree,
                    fieldofstudy,
                    from,
                    to,
                    current,
                    description
                 }

                 try {
                    const profile=await Profile.findOne({user: req.user.id});
                 profile.education.unshift(newEdu)
                 await profile.save();
                 console.log("education is updated successfully");
                 res.json(profile)
                    
                 } catch (error) {
                    console.error(error.message)
                    res.status(400).send("server error")
                 }
        });


        router.delete("/education/:edu_id", auth,async(req,res)=>{
           try {

            const profile=await Profile.findOne({user:req.user.id})
            const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id)
            profile.education.splice(removeIndex,1)
            profile.save()
            res.json(profile)
           } catch (error) {
            console.log(error)
            res.status(400).send("sever error");
           } 
        })
            
        router.get("/github/:username", async(req, res)=>{
            try {
                const options={
                    uri:`https://api.github.com/users/${req.params.username}
                    /repos?per_page=5&sort=created:asc&client_id=${config.get("gitHubClientId")}
                    &client_secret=${config.get("gitHubClientSecret")}`,
                    method:"GET",
                    headers:{"user-agent":"node.js"}
                };
                request(options, (error, response, body)=>{
                    if(error) console.log(error);

                    if(response.statusCode !==200){ 
                        return res.status(404).json({msg:"no github profile found"});
                    }
                    res.json(JSON.parse(body));
                })
                }catch (error) {
                console.error(error.msg)
                res.status(400).send("server error")
            }
        })


module.exports= router;