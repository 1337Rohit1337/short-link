const express = require("express")
const app = express();
const {connectToMongoDb} = require("./connect")
const {URL} = require("./models/url")
const PORT = 8001

app.use(express.json());

const urlRoute = require('./routes/url')
app.listen(PORT,()=>{console.log(`Server started at Port Number:${PORT}`)});

app.get('/:shortId',async(req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({shortId},{$push:{visitHistory:{timestamp:Date.now()}}},{new:true})
    res.redirect(entry.redirectURL);
})

connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
.then(()=>{console.log("MongoDB connected!")})

app.use("/url",urlRoute);