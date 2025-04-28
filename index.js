const express = require("express")
const urlRoute = require("./routes/url")
const userRoute = require("./routes/user");
const staticRoute = require("./routes/staticRouter.js")
const{connectToMongoDB} = require("./connect.js")
const URL = require("./models/url.js")
const app =express()
const PORT = 2001
const path = require('path')
const cookieParser = require("cookie-parser")
const{restrictToLoggedinUserOnly,checkAuth} = require("./middleware/auth")



app.listen(PORT,()=>{
    console.log(`Server has started at ${PORT}`)
})

app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


app.get("/test", async(req,res)=>{
    const entry = await URL.find({});
    res.render('home',{
        urls:entry
    })
})

app.use("/",checkAuth,staticRoute);
app.use("/user",userRoute);

app.set("view engine", 'ejs');
app.set("views",path.resolve("./views"))


connectToMongoDB("mongodb://localhost:27017/short-link").then(()=>{console.log("MongoDB connected!")})



app.use("/url",restrictToLoggedinUserOnly,urlRoute)
    


app.get("/:shortId",async(req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory:{
                timestamp:Date.now()
            },
        }

    })

    
res.redirect(entry.redirectURL);
});



