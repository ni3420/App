import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import { Trash2, User, ChevronLeft, Send, Search, MoreVertical ,MessageSquare} from 'lucide-react';
import profileservice from '../AppWrite/profile';
import chatservice from '../AppWrite/chat_message';
import authservice from '../AppWrite/auth';

const Messages = () => {
    const navigate = useNavigate();
    
    // State
    const [chatList, setChatList] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    const messageEndRef = useRef(null);
    const isDark = useSelector((state) => state.theme.mode === 'dark');

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 1. Initial Setup: Get User and check URL params
    useEffect(() => {
        const init = async () => {
            try {
                const user = await authservice.CurrentUser();
                setCurrentUser(user);

                
            } catch (err) {
                console.error("Init Error:", err);
            }
        };
        init();
    }, []);

    // 2. Fetch Chat List (History-based)
    useEffect(() => {
        const fetchChatPartners = async () => {
            if (!currentUser) return;
            try {
                const history = await chatservice.getMessages();
                if (history) {
                    const partnerIds = new Set();
                    history.documents.forEach(m => {
                        if (m.senderId !== currentUser.$id) partnerIds.add(m.senderId);
                        if (m.receiverId !== currentUser.$id) partnerIds.add(m.receiverId);
                    });

                    // Add current selected user from URL if not in history yet

                    const profiles = await profileservice.ListProfile();
                    const filtered = profiles.documents.filter(p => partnerIds.has(p.$id));
                    setChatList(filtered);
                }
            } catch (err) {
                console.error("Chat list fetch error:", err);
            }
        };
        fetchChatPartners();
    }, [currentUser, messages.length, ]);

    // 3. History & Realtime Subscription
    useEffect(() => {
        if (!selectedUser || !currentUser) return;

        const fetchHistory = async () => {
            const history = await chatservice.getMessages();
            if (history) {
                const filtered = history.documents.filter(m => 
                    (m.senderId === currentUser.$id && m.receiverId === selectedUser.$id) ||
                    (m.senderId === selectedUser.$id && m.receiverId === currentUser.$id)
                );
                setMessages(filtered);
            }
        };

        fetchHistory();

        // Subscribe using the fixed logic
        const unsubscribe = chatservice.subscribeToMessages((payload) => {
            const isRelevant = 
                (payload.senderId === currentUser.$id && payload.receiverId === selectedUser.$id) ||
                (payload.senderId === selectedUser.$id && payload.receiverId === currentUser.$id);

            if (isRelevant) {
                setMessages((prev) => {
                    // Prevent duplicate messages if Realtime triggers for own message
                    if (prev.find(m => m.$id === payload.$id)) return prev;
                    return [...prev, payload];
                });
            }
        });

        return () => { if (unsubscribe) unsubscribe(); };
    }, [selectedUser, currentUser]);

    // 4. Action Handlers
    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!text.trim() || !selectedUser) return;

        try {
            await chatservice.sendMessage(currentUser.$id, selectedUser.$id, text);
            setText("");
        } catch (error) {
            console.error("Send error:", error);
        }
    };

    const removeChat = (e, id) => {
        e.stopPropagation();
        setChatList(prev => prev.filter(u => u.$id !== id));
        if (selectedUser?.$id === id) setSelectedUser(null);
    };

    const filteredList = chatList.filter(u => 
        u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`flex h-[92vh] m-2 md:m-4 rounded-2xl border overflow-hidden shadow-2xl transition-all ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-gray-50 border-gray-200'
        }`}>
            
            {/* SIDEBAR */}
            <div className={`w-80 flex flex-col border-r transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
            }`}>
                <div className="p-5">
                    <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Messages</h2>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                        isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'
                    }`}>
                        <Search size={18} className="text-gray-500" />
                        <input 
                            placeholder="Search chats..."
                            className="bg-transparent text-sm outline-none w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredList.map((user) => (
                        <div 
                            key={user.$id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-4 mx-2 rounded-xl flex items-center group cursor-pointer transition-all mb-1 ${
                                selectedUser?.$id === user.$id 
                                ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-200') 
                                : (isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')
                            }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-400 flex-shrink-0 mr-3 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20">
                                {user.fullName?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold truncate text-sm">{user.fullName}</h3>
                                <p className={`text-xs truncate ${selectedUser?.$id === user.$id ? 'text-blue-100' : 'text-gray-500'}`}>
                                    Tap to chat
                                </p>
                            </div>
                            <button 
                                onClick={(e) => removeChat(e, user.$id)}
                                className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                                    selectedUser?.$id === user.$id ? 'hover:bg-blue-700' : 'hover:bg-gray-200 dark:hover:bg-slate-700 text-red-500'
                                }`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 flex flex-col relative">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className={`p-4 flex items-center justify-between border-b z-10 ${
                            isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-100'
                        }`}>
                            <div className="flex items-center gap-3">
                                <button onClick={() => navigate(-1)} className="md:hidden p-1"><ChevronLeft /></button>
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                                    {selectedUser.fullName?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold leading-none">{selectedUser.fullName}</h3>
                                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</span>
                                </div>
                            </div>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        {/* Message List */}
                        <div className={`flex-1 p-6 overflow-y-auto flex flex-col gap-3 ${
                            isDark ? 'bg-slate-950' : 'bg-[#F4F7F9]'
                        }`}>
                            
                            {messages.map((msg, i) => {
                                const isMe = msg.senderId === currentUser?.$id;
                                return (
                                    <div key={msg.$id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 px-4 rounded-2xl text-sm shadow-sm animate-in fade-in slide-in-from-bottom-1 ${
                                            isMe 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : (isDark ? 'bg-slate-800 text-white rounded-tl-none' : 'bg-white text-gray-800 rounded-tl-none')
                                        }`}>
                                            <p>{msg.content}</p>
                                            <span className={`text-[9px] block text-right mt-1 opacity-60`}>
                                                {msg.$createdAt ? new Date(msg.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messageEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className={`p-4 border-t ${
                            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
                        }`}>
                            <div className={`flex items-center gap-2 rounded-2xl px-4 py-2 border ${
                                isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
                            }`}>
                                <input 
                                    className="flex-1 bg-transparent py-2 outline-none text-sm"
                                    placeholder="Write something..."
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    disabled={!text.trim()}
                                    className="text-blue-500 hover:scale-110 disabled:opacity-30 disabled:scale-100 transition-all p-2"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className={`flex-1 flex flex-col items-center justify-center text-center p-10 ${isDark ? 'text-slate-600' : 'text-gray-300'}`}>
                        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center mb-4">
                            <MessageSquare size={48} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-500 dark:text-slate-400">Your Conversations</h2>
                        <p className="max-w-xs text-sm mt-2">Pick a person from the menu or visit a profile to start a new chat.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;