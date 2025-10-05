import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { API_ENDPOINTS } from "../../config/api";
import { extractTime } from "../../utils/extractTime";
import { getAuthHeaders } from "../../utils/getAuthHeaders.js";

const RecentMessages = () => {
  const { authUser } = useAuthContext();
  const { onlineUsers } = useSocketContext();
  const { setSelectedConversation } = useConversation();
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.MESSAGES.RECENT, {
          headers: getAuthHeaders(),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recent messages");
        }

        const data = await response.json();
        setRecentMessages(data.slice(0, 20)); // Show only 20 most recent
      } catch (error) {
        console.error("Error fetching recent messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMessages();
  }, []);

  const handleMessageClick = (message) => {
    // Find the conversation partner
    const partnerId =
      message.senderId === authUser._id ? message.receiverId : message.senderId;
    const partnerName =
      message.senderId === authUser._id
        ? message.receiverName
        : message.senderName;
    const partnerProfilePic =
      message.senderId === authUser._id
        ? message.receiverProfilePic
        : message.senderProfilePic;

    // Set the selected conversation
    setSelectedConversation({
      _id: partnerId,
      fullName: partnerName,
      profilePic: partnerProfilePic,
    });
  };

  const isOnline = (userId) => onlineUsers.includes(userId);

  // Function to limit message to specific number of words
  const truncateMessage = (message, maxWords = 12) => {
    const words = message.split(" ");
    if (words.length <= maxWords) {
      return message;
    }
    return words.slice(0, maxWords).join(" ") + "...";
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            💬
          </span>
          Recent Messages
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentMessages.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            💬
          </span>
          Recent Messages
        </h3>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-2xl">📭</span>
          </div>
          <p className="text-gray-300 text-lg">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Start a conversation to see recent messages here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
        <span className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
          💬
        </span>
        Recent Messages
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recentMessages.map((message) => {
          const isFromMe = message.senderId === authUser._id;
          const partnerId = isFromMe ? message.receiverId : message.senderId;
          const partnerName = isFromMe
            ? message.receiverName
            : message.senderName;
          const partnerProfilePic = isFromMe
            ? message.receiverProfilePic
            : message.senderProfilePic;

          return (
            <div
              key={message._id}
              onClick={() => handleMessageClick(message)}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] border border-white/10 hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={partnerProfilePic}
                    alt={partnerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      isOnline(partnerId) ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full ${
                        isOnline(partnerId)
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-base truncate">
                        {partnerName}
                      </h4>
                      <span className="text-gray-400 text-xs">•</span>
                      <p
                        className={`text-sm truncate ${
                          isFromMe ? "text-indigo-300" : "text-gray-300"
                        }`}
                      >
                        {isFromMe ? "You: " : ""}
                        {truncateMessage(message.message, 12)}
                      </p>
                      {isOnline(partnerId) && (
                        <div className="flex items-center gap-1 ml-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs">Online</span>
                        </div>
                      )}
                    </div>
                    <span className="text-gray-400 text-xs ml-2 flex-shrink-0">
                      {extractTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMessages;
