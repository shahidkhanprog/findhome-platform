import prisma from "../lib/prisma.js";

// ==============================================================================================================================================
//                                                                           Add Message
// ==============================================================================================================================================
export const addMessage = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const { text } = req.body;

    console.log("addMessage called:", { tokenUserId, chatId, text });

    if (!tokenUserId || !chatId || !text) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // 1. Verify chat exists AND current user is a participant
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            select: { userIDs: true }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        if (!chat.userIDs.includes(tokenUserId)) {
            return res.status(403).json({ message: "You are not a participant in this chat" });
        }

        // 2. Create message
        const message = await prisma.message.create({
            data: {
                text: text.trim(),
                chatId: chatId,
                userId: tokenUserId
            }
        });

        // 3. Update chat's lastMessage and seenBy
        await prisma.chat.update({
            where: { id: chatId },
            data: {
                lastMessage: text.trim(),
                seenBy: [tokenUserId]
            }
        });

        console.log("Message saved:", message.id);
        res.status(201).json(message);
    } catch (error) {
        console.error("Error in addMessage:", error);
        
        res.status(500).json({ 
            message: "Failed to send message",
            error: error.message,
            stack: error.stack
        });
    }
};
// ==============================================================================================================================================
//                                                                       end
// ==============================================================================================================================================
