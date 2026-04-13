// import jwt from "jsonwebtoken";

// // ================================================== Should be logined in ===========================================

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     // You would typically verify the token here and extract user information
//     jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: "Unauthorized: Invalid token" });
//         }
//         req.userId  = decoded.id; // Attach user Id to request
//         next();
//     })
// }
// // ================================================== Verify Admin ==================================================

// export const verifyAdmin = (req, res, next) => {
//    const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     // You would typically verify the token here and extract user information
//     jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: "Unauthorized: Invalid token" });
//         }
//         if(!decoded.isAdmin) {
//             return res.status(403).json({ message: "Forbidden: Admins only" });
//         }
//         req.AdminId  = decoded.id; // Attach admin Id to request
//         next();
//     })
// }

import jwt from "jsonwebtoken";

// ================================================== Verify Token Middleware ==================================================
// Verify token - sets req.userId and req.isAdmin
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.userId  = decoded.id;
        req.isAdmin = decoded.isAdmin === true; //  set isAdmin from token
        next();
    });
};

// ================================================== Verify Admin Middleware ==================================================
// Admin only - rejects non-admins
export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }
        req.userId  = decoded.id;
        req.isAdmin = true;
        next();
    });
};

// ================================================== Verify Token or Admin Middleware ==================================================
// User or Admin - allows own profile access OR admin access
export const verifyTokenOrAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.userId  = decoded.id;
        req.isAdmin = decoded.isAdmin === true;

        // Allow if admin OR accessing own resource
        if (req.isAdmin || decoded.id === req.params.id) {
            return next();
        }

        return res.status(403).json({ message: "Forbidden: Access denied" });
    });
};
// ====================================================================================================
