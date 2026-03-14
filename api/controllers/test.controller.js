import jwt from "jsonwebtoken";

export const shouldBeLoginedIn = async (req, res) => {

    
    res.status(200).json({ message: "You are logged in", userId: req.userId});

};

export const shouldBeAdmin = async (req, res) => {
        
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // You would typically verify the token here and extract user information
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        if(!decoded.isAdmin) {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }
    })
    res.status(200).json({ message: "You are logged in"});
}
