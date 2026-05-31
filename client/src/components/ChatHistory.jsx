import React, { useEffect, useRef } from 'react';
import { FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useChatStore from '../context/chatStore';

const ChatHistory = ({ onSelectChat, currentChatId }) => {
  const { chatSessions, deleteChat, searchChats, searchResults, getChatSessions } = useChatStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const [displayedChats, setDisplayedChats] = React.useState([]);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    getChatSessions(false);
  }, [getChatSessions]);

  useEffect(() => {
    setDisplayedChats(chatSessions);
  }, [chatSessions]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim() === '') {
      setDisplayedChats(chatSessions);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchChats(query);
        setDisplayedChats(results);
      } catch {
        toast.error('Search failed');
      }
    }, 500);
  };

  const handleDelete = async (e, chatId) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChat(chatId);
        toast.success('Chat deleted');
        if (currentChatId === chatId) {
          onSelectChat(null);
        }
      } catch {
        toast.error('Failed to delete chat');
      }
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full hidden md:flex">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Chat History</h2>
        
        {showSearch ? (
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={() => !searchQuery && setShowSearch(false)}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiSearch size={16} />
            <span className="text-sm text-gray-600">Search</span>
          </button>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {displayedChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchQuery ? 'No chats found' : 'No chats yet. Start a new one!'}
          </div>
        ) : (
          displayedChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat._id)}
              className={`px-4 py-3 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-100 flex justify-between items-start gap-2 group ${
                currentChatId === chat._id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {chat.title}
                </h3>
                <p className="text-xs text-gray-500 capitalize">
                  {chat.topic}
                </p>
              </div>
              
              <button
                onClick={(e) => handleDelete(e, chat._id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
