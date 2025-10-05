import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // We don't need to update stored unread counts anymore since we count from database
    console.log("Message sent, will count unread messages from database");

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
      // Also send updated unread count - count actual unread messages
      const actualUnreadCount = await Message.countDocuments({
        senderId: senderId,
        receiverId: receiverId,
        isRead: false,
      });

      // Send unread count update with userId as key (matches frontend format)
      const unreadCountData = {
        [senderId]: actualUnreadCount, // Use senderId as key, unreadCount as value
      };
      io.to(receiverSocketId).emit("unreadCountUpdate", unreadCountData);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // We don't need to update stored unread counts since we count from database

    // Mark all messages from the other user as read
    await Message.updateMany(
      {
        senderId: userToChatId,
        receiverId: senderId,
        isRead: false,
      },
      { isRead: true }
    );

    // No need to save conversation since we're not updating stored counts

    // Notify the sender that their messages have been read
    const senderSocketId = getReceiverSocketId(userToChatId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", {
        conversationId: conversation._id,
        readBy: senderId,
      });
    }

    // Also send unread count update to the current user (receiver)
    const currentUserSocketId = getReceiverSocketId(senderId);
    if (currentUserSocketId) {
      // Send unread count update with userId as key (matches frontend format)
      const unreadCountData = {
        [userToChatId]: 0, // Use userToChatId as key, 0 as value (marked as read)
      };
      io.to(currentUserSocketId).emit("unreadCountUpdate", unreadCountData);
    }

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.log("Error in markMessagesAsRead controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "fullName profilePic");

    const unreadCountsArray = await Promise.all(
      conversations.map(async (conversation) => {
        const otherParticipant = conversation.participants.find(
          (p) => p._id.toString() !== userId
        );

        // Count actual unread messages from database
        const actualUnreadCount = await Message.countDocuments({
          senderId: otherParticipant._id,
          receiverId: userId,
          isRead: false,
        });

        return {
          conversationId: conversation._id,
          userId: otherParticipant._id,
          unreadCount: actualUnreadCount,
          otherParticipant: {
            _id: otherParticipant._id,
            fullName: otherParticipant.fullName,
            profilePic: otherParticipant.profilePic,
          },
        };
      })
    );

    // Convert array to object format: { userId: unreadCount }
    // This matches the frontend which displays users, not conversations
    const unreadCountsObject = {};
    unreadCountsArray.forEach((item) => {
      unreadCountsObject[item.userId] = item.unreadCount;
    });

    // Log unread counts for debugging (can be removed in production)
    console.log("📊 Unread counts:", unreadCountsObject);
    res.status(200).json(unreadCountsObject);
  } catch (error) {
    console.log("Error in getUnreadCounts controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRecentMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "fullName profilePic");

    // Get recent messages from all conversations
    const recentMessages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic")
      .sort({ createdAt: -1 })
      .limit(50); // Get 50 most recent messages

    // Format the messages with sender/receiver names
    const formattedMessages = recentMessages.map((message) => ({
      _id: message._id,
      message: message.message,
      senderId: message.senderId._id,
      senderName: message.senderId.fullName,
      senderProfilePic: message.senderId.profilePic,
      receiverId: message.receiverId._id,
      receiverName: message.receiverId.fullName,
      receiverProfilePic: message.receiverId.profilePic,
      createdAt: message.createdAt,
      isRead: message.isRead,
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.log("Error in getRecentMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
