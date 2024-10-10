import Conversation from "../models/models.conversation.js";
import Message from "../models/models.message.js";

export const sendMessage = async (req, res) => {
    const { message, receiverId } = req.body;  // Correct destructuring for message and receiverId
    const senderId = req.user._id;
    
    try {
        // Find existing conversation or create a new one
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            messages: message,  
            conversationId: conversation._id
        });

        // Save the message and update conversation
        await newMessage.save();
        conversation.messages.push(newMessage._id);
        await conversation.save();

        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error sending message', error });
    }
};
