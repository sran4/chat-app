import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../config/api.js";
import { getAuthHeaders } from "../utils/getAuthHeaders.js";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(
        API_ENDPOINTS.MESSAGES.SEND(selectedConversation._id),
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ message }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);

      // Firefox fallback: Multiple manual refreshes after sending message
      const isFirefox = /Firefox/.test(navigator.userAgent);
      if (isFirefox && window.refreshUnreadCounts) {
        console.log("Firefox: Multiple manual refreshes after sending message");
        // Multiple refreshes to ensure it updates
        setTimeout(() => window.refreshUnreadCounts(), 500);
        setTimeout(() => window.refreshUnreadCounts(), 1500);
        setTimeout(() => window.refreshUnreadCounts(), 3000);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
export default useSendMessage;
