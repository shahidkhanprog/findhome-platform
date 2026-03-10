import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    
    const { username, email, password } = req.body;
    
    // Hash password | bcrypt.hashSync return promise and we need to await it
    const hashedPassword = await bcrypt.hashSync(password, 10);
    
    // Save user to database
};

export const login = (req, res) => {
    //db
    console.log("Login endpoint");
};  

export const logout = (req, res) => {
    console.log("Logout endpoint");
};