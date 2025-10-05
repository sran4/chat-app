import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),

  // Unread counts management
  unreadCounts: {}, // Track unread counts per conversation

  setUnreadCounts: (counts) => set({ unreadCounts: counts }),

  setUnreadCountForConversation: (conversationId, count) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: count,
      },
    })),

  clearUnreadCount: (conversationId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: 0,
      },
    })),
}));

export default useConversation;
