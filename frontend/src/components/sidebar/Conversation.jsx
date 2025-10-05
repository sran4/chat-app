import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import useMarkMessagesAsRead from "../../hooks/useMarkMessagesAsRead";
import { useEffect, useState } from "react";

const Conversation = ({ conversation, lastIdx, emoji, unreadCount = 0 }) => {
  const { selectedConversation, setSelectedConversation, setMessages } =
    useConversation();
  const { markMessagesAsRead } = useMarkMessagesAsRead();

  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);
  const [renderCount, setRenderCount] = useState(0);

  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  // Track renders (for debugging - can be removed in production)
  useEffect(() => {
    setRenderCount((prev) => prev + 1);
  }, [unreadCount, localUnreadCount]);

  // Update local state when prop changes
  useEffect(() => {
    setLocalUnreadCount(unreadCount);
  }, [unreadCount]);

  // Listen for custom events
  useEffect(() => {
    const handleUnreadUpdate = (event) => {
      if (event.detail && event.detail[conversation._id] !== undefined) {
        const newCount = event.detail[conversation._id];
        setLocalUnreadCount(newCount);
      }
    };

    window.addEventListener("unreadCountUpdate", handleUnreadUpdate);

    return () => {
      window.removeEventListener("unreadCountUpdate", handleUnreadUpdate);
    };
  }, [conversation._id, conversation.fullName, localUnreadCount]);

  const handleConversationClick = async () => {
    setMessages([]);
    setSelectedConversation(conversation);
    setLocalUnreadCount(0);

    try {
      await markMessagesAsRead(conversation._id);
    } catch (error) {
      console.error(
        `Error marking messages as read for ${conversation.fullName}:`,
        error
      );
    }
  };

  const shouldShowBadge = localUnreadCount > 0;

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${
          isSelected ? "bg-sky-500" : ""
        }`}
        onClick={handleConversationClick}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={conversation.profilePic}
              alt="user avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online Status Indicator */}
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            <div
              className={`w-full h-full rounded-full ${
                isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between items-center">
            <div className="flex flex-col">
              <p className="font-bold text-gray-200">{conversation.fullName}</p>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <p className="text-xs text-gray-400">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {shouldShowBadge && (
                <div
                  key={`badge-${conversation._id}-${localUnreadCount}`}
                  className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold animate-bounce"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "20px",
                    height: "20px",
                  }}
                >
                  {localUnreadCount > 99 ? "99+" : localUnreadCount}
                </div>
              )}
              <span className="text-xl">{emoji}</span>
            </div>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
