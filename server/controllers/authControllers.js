import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
}

// Register user
export const register = async (req, res)=>{
    try{
        const {name,email, password} = req.body;

        if(!name || !email || !password) return res.status(400).json({success: false, message: "All fields are required"});

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({success: false, message: "User already exists"});

        //Hash password
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

        // Create user
        const user = await User.create({name, email, password: hashedPassword});
        // return res.status(200).json({success: true, message: "User registered successfully"});

        const token = generateToken(user._id);

        res.status(201).json({success: true, token, user});

    } catch(error){
        console.error("Register error:", error.message); 
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

//Login user
export const login = async (req, res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({success: false, message: "All fields are required"});

        // Check if user already exists
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({success: false, message: "User not found"});

        //Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({success: false, message: "Invalid credentials"});

        const token = generateToken(user._id);

        res.status(201).json({success: true, token, user});

    } catch(error){
        console.error("Register error:", error.message); 
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

// Get Current user
export const getUser = async (req, res)=>{
    try{   
        const user = await User.findById(req.userId).select("-password");
        if(!user) return res.status(404).json({success: false, message: "User not found"});

        res.json({success: true, user});

    } catch(error){
        console.error("Register error:", error.message); 
        res.status(500).json({success: false, message: "Internal server error"});
    }
}