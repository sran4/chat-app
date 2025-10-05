import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form className="px-6 md:px-8 py-6" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <div className="relative">
          <input
            type="text"
            className="w-full p-5 pr-20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 text-lg font-medium shadow-2xl"
            placeholder="Type your amazing message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {/* Gradient border effect on focus */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 pointer-events-none focus-within:opacity-100"></div>
        </div>
        <button
          type="submit"
          className="absolute top-1/2 -translate-y-1/2 end-0 flex items-center justify-center me-3 w-14 h-14 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl"
          disabled={loading || !message.trim()}
        >
          {loading ? (
            <div className="loading loading-spinner loading-sm text-white"></div>
          ) : (
            <BsSend className="w-6 h-6" />
          )}
        </button>
      </div>
    </form>
  );
};
export default MessageInput;

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;
