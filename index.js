const express = require("express");
const app = express();
const {dbConnect} = require("./config/db")
const PORT = process.env.PORT;
const authRouter = require("./routes/auth");
const fileRouter = require("./routes/file")
app.use(express.json())
app.listen(PORT,()=>{
    console.log(`App is Listning on Port ${PORT}`)
})
dbConnect();


app.use("/api/v1/auth",authRouter);
app.use("/api/v1/file",fileRouter)


app.get("/",(req,res)=>{
    res.send("Server is Running")
})