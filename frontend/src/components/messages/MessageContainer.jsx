import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import RecentMessages from "./RecentMessages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  useEffect(() => {
    // cleanup function (unmounts)
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  // Check if the selected conversation user is online
  const isOnline = selectedConversation
    ? onlineUsers.includes(selectedConversation._id)
    : false;

  return (
    <div className="w-full flex flex-col h-full bg-gradient-to-br from-slate-900/95 via-indigo-900/20 to-purple-900/20 backdrop-blur-3xl relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>

      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Desktop Header with Ultra-Modern Design */}
          <div className="hidden md:block relative bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-2xl border-b border-white/10 px-6 py-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-xl">
                    {selectedConversation.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Online Status Ring */}
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-slate-900 ${
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
              <div className="flex-1">
                <h3 className="text-white font-bold text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {selectedConversation.fullName}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                      }`}
                    ></div>
                    <p className="text-indigo-300 font-medium">
                      {isOnline ? "Online now" : "Last seen recently"}
                    </p>
                  </div>
                  <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                  <p className="text-purple-300 text-sm">Real-time messaging</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden relative">
            <Messages />
          </div>

          {/* Message Input */}
          <div className="flex-shrink-0 relative bg-gradient-to-r from-slate-800/50 via-indigo-800/30 to-purple-800/30 backdrop-blur-2xl border-t border-white/10">
            <MessageInput />
          </div>
        </>
      )}
    </div>
  );
};
export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="w-full h-full relative overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative px-6 py-8">
        {/* Welcome Section */}
        <div className="relative px-8 py-12 text-center bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl max-w-lg mx-auto overflow-hidden mb-8">
          {/* Floating Elements */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
          <div
            className="absolute top-8 right-6 w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-6 left-8 w-2 h-2 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-pulse">
              <TiMessages className="text-4xl text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome {authUser.fullName}! ✨
            </h2>
            <p className="text-indigo-300 text-lg mb-6 font-medium">
              Choose a conversation to start your amazing chat experience
            </p>

            {/* Modern Loading Animation */}
            <div className="flex justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce shadow-lg"></div>
              <div
                className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>

            {/* Modern Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              <div className="px-3 py-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-indigo-300 text-xs font-medium">
                  💬 Real-time
                </span>
              </div>
              <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-purple-300 text-xs font-medium">
                  🚀 Modern UI
                </span>
              </div>
              <div className="px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-pink-300 text-xs font-medium">
                  ✨ Beautiful
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Messages Section */}
        <RecentMessages />
      </div>
    </div>
  );
};

// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;
