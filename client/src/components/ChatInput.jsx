import React from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = React.useState('');

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    await onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything... (Shift+Enter for new line)"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-32 text-sm md:text-base"
          rows="1"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 flex-shrink-0"
        >
          {isLoading ? (
            <FiLoader className="animate-spin" size={20} />
          ) : (
            <FiSend size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
