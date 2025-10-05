import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import { getAuthHeaders } from "../utils/getAuthHeaders.js";

const useMarkMessagesAsRead = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const markMessagesAsRead = async (userToChatId) => {
    if (!authUser) return;

    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.MESSAGES.MARK_READ(userToChatId), {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Dispatch event to notify that messages have been read
      window.dispatchEvent(
        new CustomEvent("messagesRead", {
          detail: { userToChatId, unreadCount: 0 },
        })
      );

      return data;
    } catch (error) {
      console.log("Error in markMessagesAsRead hook:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, markMessagesAsRead };
};

export default useMarkMessagesAsRead;
