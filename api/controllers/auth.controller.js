import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
    
    const { username, email, password } = req.body;
    
    try {
        // Hash password | bcrypt.hashSync return promise and we need to await it
    const hashedPassword = await bcrypt.hashSync(password, 10);

    // Save user to database
    const newUser = await prisma.user.create({ 
        data:{
            username,
            email,
            password:hashedPassword,
        }});

    console.log("User registered:", newUser);

    res.status(201).json({ message: "User registered successfully", user: newUser.username });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

export const login = (req, res) => {
    //db
    console.log("Login endpoint");
};  

export const logout = (req, res) => {
    console.log("Logout endpoint");
};