import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ChatHistory from '../components/ChatHistory';
import ChatWindow from '../components/ChatWindow';
import useChatStore from '../context/chatStore';

const ChatPage = () => {
  const { createChatSession } = useChatStore();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [mobileShowHistory, setMobileShowHistory] = useState(true);

  const handleNewChat = async () => {
    try {
      const newChat = await createChatSession('general');
      setSelectedChatId(newChat._id);
      setMobileShowHistory(false);
    } catch {
      toast.error('Failed to create new chat');
    }
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setMobileShowHistory(false);
  };

  const handleBack = () => {
    setMobileShowHistory(true);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile History Toggle */}
      <button
        onClick={() => setMobileShowHistory(!mobileShowHistory)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg z-40 hover:shadow-xl transition-shadow"
      >
        <FiPlus size={24} />
      </button>

      {/* Chat History Sidebar */}
      {mobileShowHistory && (
        <div className="fixed md:relative w-full md:w-auto h-screen md:h-auto z-30 md:z-0">
          <ChatHistory
            onSelectChat={handleSelectChat}
            currentChatId={selectedChatId}
          />
        </div>
      )}

      {/* Chat Window */}
      <ChatWindow
        chatId={selectedChatId}
        onBack={handleBack}
        onNewChat={handleNewChat}
      />
    </div>
  );
};

export default ChatPage;
