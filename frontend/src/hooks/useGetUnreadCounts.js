import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";

const useGetUnreadCounts = () => {
  const [loading, setLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState([]);
  const { authUser } = useAuthContext();

  const getUnreadCounts = async () => {
    if (!authUser) return;

    setLoading(true);
    try {
      console.log("🔄 Fetching unread counts from API...");
      const res = await fetch(API_ENDPOINTS.MESSAGES.UNREAD_COUNTS, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      console.log("📊 API Response:", data);
      console.log("📊 Response type:", typeof data);
      console.log(
        "📊 Response length:",
        Array.isArray(data) ? data.length : "not array"
      );

      // Log each unread count entry
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          console.log(`📊 Entry ${index}:`, {
            userId: item.userId,
            unreadCount: item.unreadCount,
            conversationId: item.conversationId,
          });
        });
      }

      setUnreadCounts(data);
    } catch (error) {
      console.log("❌ Error in getUnreadCounts hook:", error.message);
      setUnreadCounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUnreadCounts();

    // Firefox-specific: More aggressive polling
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const pollInterval = isFirefox ? 2000 : 10000; // 2 seconds for Firefox, 10 for others

    console.log(
      `Browser detected: ${isFirefox ? "Firefox" : "Other"}, polling every ${
        pollInterval / 1000
      }s`
    );

    const refreshInterval = setInterval(() => {
      console.log("Polling: Refreshing unread counts...");
      getUnreadCounts();
    }, pollInterval);

    return () => clearInterval(refreshInterval);
  }, [authUser]);

  // Listen for socket events to update unread counts
  useEffect(() => {
    const handleUnreadCountUpdate = (data) => {
      const { conversationId, unreadCount, userId } = data;

      setUnreadCounts((prev) => {
        // Find by conversationId first, then update
        const existingIndex = prev.findIndex(
          (uc) => uc.conversationId === conversationId
        );
        if (existingIndex !== -1) {
          // Update existing unread count
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            unreadCount: unreadCount,
          };
          return updated;
        } else {
          // If not found by conversationId, try to find by userId (sender)
          const userIndex = prev.findIndex((uc) => uc.userId === userId);
          if (userIndex !== -1) {
            const updated = [...prev];
            updated[userIndex] = {
              ...updated[userIndex],
              unreadCount: unreadCount,
            };
            return updated;
          } else {
            // Add new unread count entry
            const newEntry = {
              conversationId,
              userId,
              unreadCount,
              otherParticipant: { _id: userId },
            };
            return [...prev, newEntry];
          }
        }
      });
    };

    const handleMessagesRead = (data) => {
      const { userToChatId, unreadCount = 0 } = data;

      // Update the unread count to 0 for the specific conversation
      setUnreadCounts((prev) => {
        const updated = prev.map((uc) => {
          if (uc.userId === userToChatId) {
            return { ...uc, unreadCount: 0 };
          }
          return uc;
        });
        return updated;
      });
    };

    // Method 1: Try custom events (works in Chrome)
    const handleCustomEvent = (event) => {
      handleUnreadCountUpdate(event.detail);
    };

    const handleCustomMessagesRead = (event) => {
      handleMessagesRead(event.detail);
    };

    // Method 2: Polling fallback for Firefox/Edge
    const pollForUpdates = () => {
      console.log("🔍 Polling: Checking for updates...");
      console.log(
        "🔍 window.lastUnreadCountUpdate:",
        window.lastUnreadCountUpdate
      );
      console.log(
        "🔍 window.lastMessagesReadUpdate:",
        window.lastMessagesReadUpdate
      );

      if (window.lastUnreadCountUpdate) {
        console.log(
          "✅ Polling: Processing unread count update:",
          window.lastUnreadCountUpdate
        );
        handleUnreadCountUpdate(window.lastUnreadCountUpdate);
        window.lastUnreadCountUpdate = null; // Clear after processing
      } else {
        console.log("ℹ️ Polling: No unread count updates to process");
      }

      if (window.lastMessagesReadUpdate) {
        console.log(
          "✅ Polling: Processing messages read update:",
          window.lastMessagesReadUpdate
        );
        handleMessagesRead(window.lastMessagesReadUpdate);
        window.lastMessagesReadUpdate = null; // Clear after processing
      } else {
        console.log("ℹ️ Polling: No messages read updates to process");
      }
    };

    // Register global handlers for direct calls
    window.triggerUnreadUpdate = handleUnreadCountUpdate;
    window.triggerMessagesRead = handleMessagesRead;

    // Try custom events first
    window.addEventListener("unreadCountUpdate", handleCustomEvent);
    window.addEventListener("messagesRead", handleCustomMessagesRead);

    // Firefox-specific: More aggressive polling for socket events
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const socketPollInterval = isFirefox ? 2000 : 2000; // 2 seconds for both browsers

    console.log(
      `Socket polling: ${isFirefox ? "Firefox" : "Other"}, polling every ${
        socketPollInterval / 1000
      }s`
    );

    const pollInterval = setInterval(pollForUpdates, socketPollInterval);

    return () => {
      window.removeEventListener("unreadCountUpdate", handleCustomEvent);
      window.removeEventListener("messagesRead", handleCustomMessagesRead);
      clearInterval(pollInterval);

      // Clean up global handlers
      delete window.triggerUnreadUpdate;
      delete window.triggerMessagesRead;
    };
  }, [authUser]);

  const updateUnreadCount = (conversationId, newCount) => {
    setUnreadCounts((prev) =>
      prev.map((count) =>
        count.conversationId === conversationId
          ? { ...count, unreadCount: newCount }
          : count
      )
    );
  };

  // Manual refresh function for Firefox
  const refreshUnreadCounts = () => {
    console.log("Manual refresh triggered");
    getUnreadCounts();
  };

  // Expose refresh function globally for Firefox
  useEffect(() => {
    window.refreshUnreadCounts = refreshUnreadCounts;
    return () => {
      delete window.refreshUnreadCounts;
    };
  }, []);

  return { loading, unreadCounts, updateUnreadCount, refreshUnreadCounts };
};

export default useGetUnreadCounts;
