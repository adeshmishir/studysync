import React from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ChatMessage = ({ message }) => {
  const [copied, setCopied] = React.useState(false);

  const isUser = message.role === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`flex gap-3 mb-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
          AI
        </div>
      )}
      
      <div className={`flex flex-col max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl break-words ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500`}>
          <span>{formatTime(message.createdAt)}</span>
          {!isUser && (
            <button
              onClick={copyToClipboard}
              className="hover:text-gray-700 transition-colors"
              title="Copy message"
            >
              {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
