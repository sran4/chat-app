import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = ({ onCloseSidebar, isMobile }) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900/95 via-purple-900/20 to-slate-900/95 backdrop-blur-3xl border-r border-white/10 shadow-2xl relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      {/* Mobile Close Button with Ultra-Modern Design */}
      {isMobile && (
        <div className="relative flex justify-between items-center p-6 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-2xl border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">💬</span>
            </div>
            <h2 className="text-white font-bold text-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Chats
            </h2>
          </div>
          <button
            onClick={onCloseSidebar}
            className="text-white hover:text-red-400 p-3 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 hover:from-red-500/20 hover:to-red-400/10 transition-all duration-300 hover:scale-110 backdrop-blur-md border border-white/20 shadow-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Desktop Header with Ultra-Modern Design */}
      {!isMobile && (
        <div className="relative p-6 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-2xl border-b border-white/10">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-3xl">🚀</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ChatApp
              </h2>
              <p className="text-indigo-300 text-sm">Real-time messaging</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="p-4 relative">
        <SearchInput />
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-hidden px-3 relative">
        <Conversations />
      </div>

      {/* Logout Button */}
      <div className="relative p-4 border-t border-white/10 bg-gradient-to-r from-slate-800/50 to-purple-800/30 backdrop-blur-2xl">
        <LogoutButton />
      </div>
    </div>
  );
};
export default Sidebar;

// STARTER CODE FOR THIS FILE
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
// 			<Conversations />
// 			<LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;
