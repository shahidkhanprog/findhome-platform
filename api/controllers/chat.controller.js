import prisma from "../lib/prisma.js";

// =====================================================================================================
//                                          Chat Controller
// =====================================================================================================
export const getAllChats = async (req, res) => {

    const tokenUserId = req.user.id;

    try {
        const chats = await prisma.chat.findMany({
            where: {
                userIDs: {
                    hasSome: [tokenUserId]
                }
            }
        });
        for(let chat of chats) {
            const receiverId = chat.userIDs.find(id => id !== tokenUserId);

            const receiver = await prisma.user.findUnique({
                where: {
                    id: receiverId
                },
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                }
            });
            chat.receiver = receiver;
        }
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch chats!" });
    }
};

// =====================================================================================================
//                                          Chat Controller
// =====================================================================================================
export const getChat = async (req, res) => {
    try {

        const tokenUserId = req.user.id;

        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId],
                }
            },

            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    },
                },
            },
        });

         await prisma.chat.update({
                where: {
                    id: req.params.id,
                },
            
            data: {
                seenBy:{
                    set:[tokenUserId],
                },
            },
        });

        res.status(200).json(chat);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch chat!" });
    }
};

// =====================================================================================================
//                                          Chat Controller
// =====================================================================================================
export const addChat = async (req, res) => {
        
    const tokenUserId = req.user.id;

    try {
        const newChat = await prisma.chat.create({
            data: {
                userIDs: [tokenUserId, req.body.receiverId],
            }
        });
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ message: "Failed to create chat!" });
    }
};

// =====================================================================================================
//                                          Chat Controller
// =====================================================================================================
export const readChat = async (req, res) => {
    
    const tokenUserId = req.user.id;

    try {
        const chat = await prisma.chat.update({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId],
                }
            },
            data: {
                seenBy: {
                    set: [tokenUserId],
                }
            }
        });

        res.status(200).json({ message: "Chat marked as read" });

    } catch (error) {
        res.status(500).json({ message: "Failed to mark chat as read!" });
    }
};  
// =====================================================================================================
//                                          End of File
// =====================================================================================================