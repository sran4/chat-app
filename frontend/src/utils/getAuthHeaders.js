// Utility function to get authorization headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("chat-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export default getAuthHeaders;
