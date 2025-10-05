import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { SOCKET_URL } from "../config/api.js";
import useConversation from "../zustand/useConversation.js";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const newSocket = io(SOCKET_URL, {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      // Make socket globally accessible for Firefox debugging
      window.socket = newSocket;

      // Add connection event listeners
      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      // socket.on() is used to listen to the events. can be used both on client and server side
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Listen for unread count updates
      newSocket.on("unreadCountUpdate", (data) => {
        console.log("📡 Unread count update received:", data);

        // Try multiple dispatch methods for browser compatibility
        try {
          // Method 1: CustomEvent (works in Chrome)
          const event = new CustomEvent("unreadCountUpdate", {
            detail: data,
            bubbles: true,
            cancelable: true,
          });
          window.dispatchEvent(event);
        } catch (error) {
          console.error("CustomEvent failed:", error);
        }

        // Method 2: Direct function call (Firefox fallback)
        if (typeof window.handleUnreadUpdate === "function") {
          window.handleUnreadUpdate(data);
        }

        // Method 3: Store in window for polling (Edge fallback)
        window.lastUnreadData = {
          data: data,
          timestamp: Date.now(),
        };

        // Update Zustand store if available
        if (window.updateUnreadCounts) {
          window.updateUnreadCounts(data);
        }
      });

      // Listen for messages read events
      newSocket.on("messagesRead", (data) => {
        // Handle when messages are read by the other user
        try {
          window.dispatchEvent(
            new CustomEvent("messagesRead", { detail: data })
          );
        } catch (error) {
          console.log("Custom event failed, using fallback:", error);
        }

        // Fallback: Store data globally for direct access
        window.lastMessagesReadUpdate = data;

        // Trigger a custom event with a different name as fallback
        if (window.triggerMessagesRead) {
          window.triggerMessagesRead(data);
        }
      });

      return () => {
        console.log("Cleaning up socket connection");
        newSocket.close();
        delete window.socket;
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
