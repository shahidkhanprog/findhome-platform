// import jwt from "jsonwebtoken";

// // ================================================== Verify Token Middleware ==================================================
// // Verify token - sets req.userId and req.isAdmin
// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: "Unauthorized: Invalid token" });
//         }
//         req.userId  = decoded.id;
//         req.isAdmin = decoded.isAdmin === true; //  set isAdmin from token
//         next();
//     });
// };

// // ================================================== Verify Admin Middleware ==================================================
// // Admin only - rejects non-admins
// export const verifyAdmin = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: "Unauthorized: Invalid token" });
//         }
//         if (!decoded.isAdmin) {
//             return res.status(403).json({ message: "Forbidden: Admins only" });
//         }
//         req.userId  = decoded.id;
//         req.isAdmin = true;
//         next();
//     });
// };

// // ================================================== Verify Token or Admin Middleware ==================================================
// // User or Admin - allows own profile access OR admin access
// export const verifyTokenOrAdmin = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: "Unauthorized: Invalid token" });
//         }
//         req.userId  = decoded.id;
//         req.isAdmin = decoded.isAdmin === true;

//         // Allow if admin OR accessing own resource
//         if (req.isAdmin || decoded.id === req.params.id) {
//             return next();
//         }

//         return res.status(403).json({ message: "Forbidden: Access denied" });
//     });
// };
// // ====================================================================================================

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
//  NO ownership check here — just verify the token is valid.
// Each controller handles its own ownership logic.
export const verifyTokenOrAdmin = (req, res, next) => {
    verifyToken(req, res, next);
};