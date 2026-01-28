const mongoos = require("mongoose");

require("dotenv").config();
// console.log(process.env.MONGO_URL)
exports.dbConnect = async () => {
    mongoos.connect(process.env.MONGO_URL)
    .catch((error)=>{
        console.log(error)
        console.log("DB is Not Connected")
    })   
    .then(
        console.log("DB connected Successufully")
    ) 
}