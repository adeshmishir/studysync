import { create } from 'zustand';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useChatStore = create((set, get) => ({
  // State
  chatSessions: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
  searchResults: [],

  // Create new chat session
  createChatSession: async (topic = 'general') => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${backendUrl}/api/chat/sessions`,
        { topic },
        { headers: { token } }
      );
      
      const newChat = response.data.data;
      set((state) => ({
        chatSessions: [newChat, ...state.chatSessions],
        currentChat: newChat,
        messages: [],
      }));
      
      return newChat;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create chat';
      set({ error: errorMsg });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Send message
  sendMessage: async (chatSessionId, message) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${backendUrl}/api/chat/messages`,
        { chatSessionId, message },
        { headers: { token } }
      );

      const { userMessage, assistantMessage, chatSession } = response.data.data;
      
      set((state) => ({
        messages: [
          ...state.messages,
          {
            _id: userMessage._id,
            role: 'user',
            content: userMessage.content,
            createdAt: userMessage.createdAt,
          },
          {
            _id: assistantMessage._id,
            role: 'assistant',
            content: assistantMessage.content,
            createdAt: assistantMessage.createdAt,
          },
        ],
        currentChat: chatSession,
        chatSessions: state.chatSessions.map((chat) =>
          chat._id === chatSessionId ? chatSession : chat
        ),
      }));

      return { userMessage, assistantMessage };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send message';
      set({ error: errorMsg });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Get all chat sessions
  getChatSessions: async (archived = false) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${backendUrl}/api/chat/sessions?archived=${archived}`,
        { headers: { token } }
      );

      set({ chatSessions: response.data.data });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch chats';
      set({ error: errorMsg });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Get specific chat session with messages
  getChatSession: async (chatSessionId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${backendUrl}/api/chat/sessions/${chatSessionId}`,
        { headers: { token } }
      );

      const chatData = response.data.data;
      set({
        currentChat: {
          _id: chatData._id,
          title: chatData.title,
          topic: chatData.topic,
        },
        messages: chatData.messages,
      });

      return chatData;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch chat';
      set({ error: errorMsg });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Delete chat
  deleteChat: async (chatSessionId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${backendUrl}/api/chat/sessions/${chatSessionId}`,
        { headers: { token } }
      );

      set((state) => ({
        chatSessions: state.chatSessions.filter((chat) => chat._id !== chatSessionId),
        currentChat: state.currentChat?._id === chatSessionId ? null : state.currentChat,
        messages: state.currentChat?._id === chatSessionId ? [] : state.messages,
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete chat';
      set({ error: errorMsg });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Search chats
  searchChats: async (query) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${backendUrl}/api/chat/search?query=${encodeURIComponent(query)}`,
        { headers: { token } }
      );

      set({ searchResults: response.data.data });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to search chats';
      set({ error: errorMsg });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Clear messages
  clearMessages: () => {
    set({ messages: [] });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useChatStore;
