import bcrypt from 'bcryptjs';
import User from '../models/models.user.js';
import generateToken from '../utils/jwtUtils.js';
import jwt from 'jsonwebtoken';

// Signup logic
  export const signup = async (req, res) => {
    const { name, email, password, gender, userImage } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Set default profile image based on gender
        const defaultBoyImage = `https://avatar.iran.liara.run/public/boy?email=${email}`;
        const defaultGirlImage = `https://avatar.iran.liara.run/public/girl?email=${email}`;
        const profileImage = userImage || (gender === "male" ? defaultBoyImage : defaultGirlImage);
        
        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            gender,
            userImage: profileImage,
        });
        
        // Save user into the database
        await newUser.save();
        
        // Return successful response
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            userImage: newUser.userImage,
            message: "User registered successfully"
        });
        console.log("User Registered successfully")
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// login logic 
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter the required fields!" });
        }
        const existingUser  = await User.findOne({ email });
        if (!existingUser ) {
            return res.status(404).json({ message: "User  not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser .password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
       
        // Generate a JWT token using the imported function
        const token = generateToken(existingUser );

        // set cookies 
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 31536000000 // 1 year
        });

        console.log("Login token is:" + token);
        
        res.status(200).json({
            _id: existingUser ._id,
            name: existingUser .name,
            email: existingUser .email,
            userImage: existingUser .userImage,
            token, // Send the token back to the client
            message: "User  logged in successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
// logout logic
export const logout=async(req,res)=>{
    const token=req.cookies.jwt;
    if(!token){
        return res.status({message:"User  is not logged in"});
    }
    // clear cookies
    res.clearCookie('jwt');
    res.status(200).json({message:"User  logged out successfully"})
}
