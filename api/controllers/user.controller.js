// import prisma from "../lib/prisma.js";
// import bcrypt from "bcrypt";

// // ========================================================= getAllUsers ========================================================
// export const getAllUsers = async (req, res) => {
//     try{
//         const users = await prisma.user.findMany();
//         res.status(200).json(users);

//     }catch(error){
//         console.error("Error fetching users:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// // ========================================================= getUser ========================================================
// export const getUser = async (req, res) => {
//     const userId = req.params.id;
//     try{
//         const user = await prisma.user.findUnique( {
//             where: {
//                 id: userId
//             }
//         });
//         res.status(200).json(user);

//     }catch(error){
//         console.error("Error fetching user:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// // ========================================================= updateUser ========================================================
// export const updateUser = async (req, res) => {
//     const userId = req.params.id;

//     const tokenUserId = req.userId; // Assuming the token contains the user ID
//     const [password, avatar, ...otherUpdates] = req.body;

//     // Check if the user is trying to update their own profile or if they are an admin
//     if (tokenUserId !== userId && !req.isAdmin) {
//         return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
//     }

//     const updatedPassword = null;
//     try{
//         if(password){
//             updatedPassword = await bcrypt.hash(password, 10);
//         }
//         const updatedUser = await prisma.user.update({
//             where: {
//                 id: userId
//             },
//             data: {
//                 ...otherUpdates,
//                 ...(updatedPassword && { password: updatedPassword }), // Only include password if it was updated
//                 ...(avatar && { avatar: avatar }) // Only include avatar if it was updated
//             }
//         });

//         res.status(200).json(updatedUser);


//     }catch(error){
//         console.error("Error updating user:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// // ========================================================= deleteUser ========================================================
// export const deleteUser = async (req, res) => {
//     try{
//         const userId = req.params.id;
//         const tokenUserId = req.userId; // Assuming the token contains the user ID
        
//         if (!req.isAdmin) {
//             return res.status(403).json({ message: "Forbidden: Only admins can delete users" });
//         }

//         await prisma.user.delete({
//             where: {
//                 id: userId
//             }
//         });
//         res.status(200).json({ message: "User deleted successfully" });

//     }catch(error){
//         console.error("Error deleting user:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// ========================================================= getAllUsers ========================================================
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ========================================================= getUser ========================================================
export const getUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ========================================================= updateUser ========================================================
export const updateUser = async (req, res) => {
    const userId     = req.params.id;
    const tokenUserId = req.userId;

    // Allow user to update their own profile, or admin to update anyone
    if (tokenUserId !== userId && !req.isAdmin) {
        return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
    }

    // Destructure from req.body (it's an object, not an array)
    const { password, avatar, ...otherUpdates } = req.body;

    try {
        // Hash new password only if one was provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...otherUpdates,
                ...(hashedPassword  && { password: hashedPassword }),
                ...(avatar          && { avatar }),
            }
        });

        // Never send password hash back to the client
        const { password: _pw, ...safeUser } = updatedUser;
        res.status(200).json(safeUser);

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ========================================================= deleteUser ========================================================
export const deleteUser = async (req, res) => {
    try {
        const userId      = req.params.id;
        const tokenUserId = req.userId;

        // Only admins can delete — but an admin cannot delete themselves
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Forbidden: Only admins can delete users" });
        }

        await prisma.user.delete({ where: { id: userId } });
        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
