// middleware/verifyToken.js
import jwt from "jsonwebtoken";

// ================================================== Verify Token ==================================================
export const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.userId  = decoded.id;
        req.isAdmin = decoded.isAdmin === true;
        next();
    });
};

// ================================================== Verify Admin ==================================================
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }
        next();
    });
};

// ================================================== Verify Token Or Admin ==================================================
export const verifyTokenOrAdmin = (req, res, next) => {
    verifyToken(req, res, next);
};