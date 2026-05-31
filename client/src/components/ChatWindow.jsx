import React, { useEffect, useRef } from 'react';
import { FiArrowLeft, FiPlus, FiTrash2, FiMessageCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import useChatStore from '../context/chatStore';

const ChatWindow = ({ chatId, onBack, onNewChat }) => {
  const messagesEndRef = useRef(null);
  const { messages, loading, currentChat, getChatSession, sendMessage } = useChatStore();

  useEffect(() => {
    if (chatId) {
      getChatSession(chatId);
    }
  }, [chatId, getChatSession]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!chatId) return;
    
    try {
      await sendMessage(chatId, message);
    } catch {
      toast.error('Failed to send message');
    }
  };

  if (!chatId || !currentChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl mx-auto">
            <FiMessageCircle />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Start a Conversation</h2>
          <p className="text-gray-600 max-w-md">
            Ask me anything about academics, programming, DSA, or learning strategies.
          </p>
          <button
            onClick={onNewChat}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <FiPlus size={20} />
            New Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4 flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="md:hidden flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-2"
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          <h2 className="text-xl font-bold text-gray-800">{currentChat.title}</h2>
          <p className="text-sm text-gray-500 capitalize">{currentChat.topic}</p>
        </div>
        <button
          onClick={onNewChat}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-600 hover:text-indigo-600"
          title="New Chat"
        >
          <FiPlus size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-center">
            <p>No messages yet. Start typing to begin the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message._id} message={message} />
          ))
        )}
        
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
              AI
            </div>
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={loading} />
    </div>
  );
};

export default ChatWindow;
