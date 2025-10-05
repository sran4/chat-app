// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  USERS: `${API_BASE_URL}/api/users`,
  MESSAGES: {
    BASE: `${API_BASE_URL}/api/messages`,
    SEND: (conversationId) =>
      `${API_BASE_URL}/api/messages/send/${conversationId}`,
    GET: (conversationId) => `${API_BASE_URL}/api/messages/${conversationId}`,
    MARK_READ: (conversationId) =>
      `${API_BASE_URL}/api/messages/read/${conversationId}`,
    UNREAD_COUNTS: `${API_BASE_URL}/api/messages/unread/counts`,
    RECENT: `${API_BASE_URL}/api/messages/recent/all`,
  },
};

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default API_BASE_URL;
