const User = require("../models/User");
const validater = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const OTP = require("../models/OTP");
const { sendMail } = require("../utils/emailSender");
const otpTamplet = require("../mails/otpTemplet");
const jwt = require("jsonwebtoken");

// Use a safe default in development so login doesn't crash when JWT_SECRET is missing
const JWT_SECRET = process.env.JWT_SECRET || "DEV_JWT_SECRET_CHANGE_ME";

exports.registerUser = async(req,res)=>{
    try {
        const{name,password,email,} = req.body;

        if(!name||!password||!email)
        {
            return res.status(404).json({
                success:"false",
                message:"All field is REquired"
            })
        }
        if(name.length<=3)
        {
            return res.status(422).json({
                success:"false",
                message:"Name should be prper and greater thne 2 charecter"
            });
        }
        if(!validater.isEmail(email))
        {
            return res.status(422).json({
                success:"false",
                message:"fill correct email"
            })
        }
        const userExist = await User.findOne({email:email})
        if(userExist && userExist.userVerified == false)
        {
            await User.deleteOne({email:userExist.email});
            const otp = crypto.randomInt(100000,999999);
            await OTP.deleteMany({email});

            const newOTP = await OTP.create({email,otp,expiresAt:Date.now() + 5 * 60 * 1000});
            const otpMail = otpTamplet(userExist.name,otp) ;
            const response = sendMail(userExist.email,"OTP Verification","text",otpMail);

             const hashedPassword = await bcrypt.hash(password,10);
             const user = await User.create({name:name,
                        password:hashedPassword,
                        email:email,
                        userVerified:false});

            return res.status(403).json({
                message:"User is Registerd but not verifid so OTP is send"
            })
        }else if(userExist && userExist.userVerified == true)
        {
            return res.status(401).json({
                success:false,
                message:"User is Registerd already"
            })
        }
       const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({name:name,
                        password:hashedPassword,
                        email:email,
                        userVerified:false});
        
        const otp = crypto.randomInt(100000,999999);
        await OTP.deleteMany({email});

        const newOTP = await OTP.create({email,otp,expiresAt:Date.now() + 5 * 60 * 1000});
        console.log(newOTP);
        const otpMail = otpTamplet(user.name,otp) ;
        const response = sendMail(user.email,"OTP Verification","text",otpMail);
        if(!response)
        {
            return res.status(500).json({
                success:false,
                message:"Verification not be done Due to some issue"
            })
        }
        return res.status(200).json({
            success:true,
            message:"OTP is sended Sussefull on email :-"+user.email
        })
 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error while SignUp",
            error:error,
        })
        
    }
}

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (otpRecord.expiresAt < Date.now()) {
      await OTP.deleteMany({ email });
      return res.status(410).json({
        success: false,
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
        warning:`${3-otpRecord.attempts} Attempts are Left`
      });
    }

    await User.findOneAndUpdate(
      { email },
      { userVerified: true }
    );

    await OTP.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during OTP verification",
    });
  }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email||!password)
        {
            return res.status(400).json({
                success:false,
                message:'All field Are required'
            })
        }
        if(!validater.isEmail(email))
        {
            return res.status(400).json({
                success:false,
                message:'Fill Proper Email ID'
            })
        }
        const isUser = await User.findOne({ email: email });
        if(!isUser)
        {
            return res.status(404).json({
                success:false,
                message:"User not Found"
            })
        }
        if(!isUser.userVerified)
        {
            return res.status(401).json({
                success:false,
                message:"User is Exist but Not Verifyed Go to Resister page "
            })
        }
        const isPass = await bcrypt.compare(password, isUser.password);
        if(!isPass)
        {
            return res.status(400).json({
                success:false,
                message:"Wrong Password"
            })
        }
        const token = jwt.sign(
          { id: isUser._id, email: isUser.email, name: isUser.name },
          JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

        // never send password back
        isUser.password = undefined;
        return res.status(200).json({
            success:true,
            message:"User is Loged In",
            token:token,
            user:isUser,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Internal Server Error during Login",
        });
        
    }
    
}