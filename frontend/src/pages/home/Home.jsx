import { useState, useEffect } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useConversation from "../../zustand/useConversation";

const Home = () => {
  const { selectedConversation } = useConversation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // On mobile, show sidebar by default when no conversation is selected
      if (window.innerWidth < 768 && !selectedConversation) {
        setShowSidebar(true);
      } else if (window.innerWidth < 768 && selectedConversation) {
        setShowSidebar(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [selectedConversation]);

  return (
    <div className="flex h-[100vh] w-full max-w-8xl mx-auto relative overflow-hidden">
      {/* Mobile Overlay */}
      {showSidebar && isMobile && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-xl z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${showSidebar || !isMobile ? "translate-x-0" : "-translate-x-full"}
          transition-all duration-500 ease-out
          ${isMobile ? "fixed" : "relative"}
          z-50 md:z-auto
          h-full w-80 md:w-80 lg:w-96
          flex-shrink-0
        `}
      >
        <Sidebar
          onCloseSidebar={() => setShowSidebar(false)}
          isMobile={isMobile}
        />
      </div>

      {/* Message Container */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Header with Ultra-Modern Design */}
        {selectedConversation && isMobile && (
          <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-2xl border-b border-white/10 px-4 py-4 flex items-center justify-between shadow-2xl">
            <button
              onClick={() => setShowSidebar(true)}
              className="text-white hover:text-indigo-300 p-3 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/20"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {selectedConversation.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white font-bold text-lg truncate">
                {selectedConversation.fullName}
              </span>
            </div>
            <div className="w-12" />
          </div>
        )}

        <MessageContainer />
      </div>
    </div>
  );
};
export default Home;
