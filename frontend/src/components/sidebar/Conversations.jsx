import { useEffect, useState } from "react";
import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import { API_ENDPOINTS } from "../../config/api";

const getRandomEmoji = () => {
  const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const Conversations = () => {
  const { loading: conversationsLoading, conversations } =
    useGetConversations();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch initial unread counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.MESSAGES.UNREAD_COUNTS, {
          credentials: "include", // Important for cookies
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ API Error Response:", {
            status: res.status,
            statusText: res.statusText,
            url: res.url,
            responseText: errorText,
          });
          throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        console.log("📥 Initial unread counts from API:", data);

        // Backend now returns object format: { conversationId: unreadCount }
        if (data && typeof data === "object" && !Array.isArray(data)) {
          setUnreadCounts(data);
          console.log("✅ Set unreadCounts from object:", data);
        } else {
          console.warn("⚠️ Unexpected data format from API:", data);
          setUnreadCounts({});
        }
      } catch (error) {
        console.error("❌ Error fetching unread counts:", error);
        setUnreadCounts({}); // Set empty object on error
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCounts();
  }, []);

  // Listen for socket updates
  useEffect(() => {
    const handleUnreadUpdate = (event) => {
      try {
        console.log("📊 Parent received unread update event:", event);

        if (!event.detail) {
          console.warn("⚠️ Event detail is missing");
          return;
        }

        console.log("📊 Event detail:", event.detail);

        // Make sure we're setting an object
        if (typeof event.detail === "object" && !Array.isArray(event.detail)) {
          setUnreadCounts((prevCounts) => {
            const newCounts = { ...prevCounts, ...event.detail };
            console.log("✅ Updated unreadCounts:", newCounts);
            return newCounts;
          });
        } else {
          console.warn("⚠️ Invalid event detail format:", event.detail);
        }
      } catch (error) {
        console.error("❌ Error handling unread update:", error);
      }
    };

    window.addEventListener("unreadCountUpdate", handleUnreadUpdate);
    console.log("👂 Listening for unreadCountUpdate events");

    return () => {
      console.log("🔇 Cleanup: removing unreadCountUpdate listener");
      window.removeEventListener("unreadCountUpdate", handleUnreadUpdate);
    };
  }, []);

  // Debug log current state (only when conversations are loaded)
  useEffect(() => {
    if (conversations?.length > 0) {
      console.log("🔍 Conversations loaded:", {
        conversationsCount: conversations.length,
        unreadCounts: unreadCounts,
      });
    }
  }, [conversations, unreadCounts]);

  // Safety check
  if (!conversations || !Array.isArray(conversations)) {
    console.warn("⚠️ Conversations is not an array:", conversations);
    return <div className="py-2">Loading conversations...</div>;
  }

  if (conversationsLoading || loading) {
    return <div className="py-2">Loading conversations...</div>;
  }

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.length === 0 ? (
        <div className="text-center text-gray-400">No conversations yet</div>
      ) : (
        conversations.map((conversation, idx) => {
          // Safety checks
          if (!conversation || !conversation._id) {
            console.warn("⚠️ Invalid conversation object:", conversation);
            return null;
          }

          const count = unreadCounts[conversation._id] || 0;

          // Only log if there are unread messages (for debugging)
          if (count > 0) {
            console.log(
              `🎯 ${conversation.fullName}: ${count} unread messages`
            );
          }

          return (
            <Conversation
              key={conversation._id}
              conversation={conversation}
              emoji={getRandomEmoji()}
              lastIdx={idx === conversations.length - 1}
              unreadCount={count}
            />
          );
        })
      )}
    </div>
  );
};

export default Conversations;
