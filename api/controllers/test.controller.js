import jwt from "jsonwebtoken";

// ================================================== Should be logined in ==================================================

export const shouldBeLoginedIn = async (req, res) => {
    
    // console.log(req.userId);
    
    res.status(200).json({ message: "You are logged in", userId: req.userId});

};

// ================================================== Should be admin ==================================================

export const shouldBeAdmin = async (req, res) => {
    
    // console.log(req.AdminId);

    res.status(200).json({ message: "You are logged in"});
}

// ==================================================  ==================================================