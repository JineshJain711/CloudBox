const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.protectedRoute = async (req,res,next) => {
    try {
        
        const token = req.headers.authorization?.split(" ")[1];

        if(!token)
        {
            if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, authorization denied",
            })};
        }
        const decode = await jwt.verify(token,process.env.JWT_SECRET);
        // console.log(decode);
        const user = await User.findById(decode.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found, authorization denied",
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in authentication middleware: ", error);
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
}