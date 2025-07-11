const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");


// Generate JET Token

const generateToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"});
};


// @route POST /api/auth/register

const registerUser=async(req,res)=>{
    try {
        const{name,email,password,profileImageUrl}=req.body;

        // check if user already exists
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(401).json({message:"User already exists"})
        }

        // Hash passwords
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        // create new user

        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            profileImageUrl
        });

        // Return user data with jwt

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({message:"Server Error",error:error.message});
    }
};

// @route POST /api/auth/login 
const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid email or password"})
        }
        // compare password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid email or password"})
        }
        // Return user data with JWT
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({message:"Server Error",error:error.message});

    }
}; 

// @route GET /api/auth/profile
const getUserProfile=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(401).json({message:"User not found"})
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message:"Server Error",error:error.message});

    }
};

module.exports={registerUser,loginUser,getUserProfile};