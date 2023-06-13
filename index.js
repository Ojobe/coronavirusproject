const express=require("express");
const connectDB=require("./config/db")
const Cors = require("cors")
const app= express();

app.use(express.json({extended:false}))
app.use(express.urlencoded({extended:true}))
app.use(Cors)

connectDB();
app.get("/", (req, res)=> res.send(" api is running"))


//define routes
app.use("/api/register", require("./routes/api/register"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/post", require("./routes/api/post"));

const PORT= process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('server is up and running on port'));