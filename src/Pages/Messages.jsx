import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, Search, ChevronLeft, Send, MessageSquare, MoreVertical, Loader2 } from 'lucide-react';
import profileservice from '../AppWrite/profile';
import chatservice from '../AppWrite/chat_message';
import authservice from '../AppWrite/auth';

const Messages = () => {
    const navigate = useNavigate();
    const [chatList, setChatList] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingSidebar, setLoadingSidebar] = useState(true);
    
    const messageEndRef = useRef(null);
    const isDark = useSelector((state) => state.theme.mode === 'dark');

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 1. Get Current User
    useEffect(() => {
        const getUser = async () => {
            const user = await authservice.CurrentUser();
            setCurrentUser(user);
        };
        getUser();
    }, []);

    // 2. Fetch Chat List (Who have I talked to?)
    useEffect(() => {
        const fetchChatPartners = async () => {
    if (!currentUser) return;
    setLoadingSidebar(true);
    try {
        // 1. Get all messages to find history
        const allMsgs = await chatservice.getMessages(); 
        const ids = new Set();
        
        if (allMsgs && allMsgs.documents.length > 0) {
            allMsgs.documents.forEach(m => {
                if (m.senderId !== currentUser.$id) ids.add(m.senderId);
                if (m.receiverId !== currentUser.$id) ids.add(m.receiverId);
            });
        }

        // 2. Get all profiles
        const profiles = await profileservice.ListProfile();
        
        if (profiles) {
            // 3. THE FIX: If history exists, filter. If not, show all (except yourself).
            
            setChatList(profiles)
            
            // Show everyone except the logged-in user
                const list2 = profiles?.documents.filter(p => p.$id !== currentUser.$id);
                if(list2)
                {
                    setChatList(list2)


                }
                
            
            
            
        }
    } catch (err) {
        console.error("Sidebar Load Error:", err);
    } finally {
        setLoadingSidebar(false);
    }
};
if(currentUser)
{
        fetchChatPartners();

}
    }, [currentUser]);

    // 3. Fetch Specific Conversation & Realtime
    useEffect(() => {
        if (!selectedUser || !currentUser) return;

        const fetchHistory = async () => {
            try {
                const history = await chatservice.getMessages(currentUser.$id, selectedUser.$id);
                if (history) {
                    // Double filter to ensure only messages between these TWO specific people show
                    const filtered = history.documents.filter(m => 
                        (m.senderId === currentUser.$id && m.receiverId === selectedUser.$id) ||
                        (m.senderId === selectedUser.$id && m.receiverId === currentUser.$id)
                    );
                    setMessages(filtered);
                }
            } catch (err) { console.error(err); }
        };

        fetchHistory();

        const unsubscribe = chatservice.subscribeToMessages((payload) => {
            const isRelevant = 
                (payload.senderId === currentUser.$id && payload.receiverId === selectedUser.$id) ||
                (payload.senderId === selectedUser.$id && payload.receiverId === currentUser.$id);

            if (isRelevant) {
                setMessages((prev) => {
                    if (prev.some(m => m.$id === payload.$id)) return prev;
                    return [...prev, payload];
                });
            }
        });

        return () => { if (unsubscribe) unsubscribe(); };
    }, [selectedUser, currentUser,]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!text.trim() || !selectedUser) return;

        try {
            const sent = await chatservice.sendMessage(currentUser.$id, selectedUser.$id, text);
            if (sent) {
                setText("");
                // Realtime will usually handle adding it to the UI, 
                // but we add it manually for "instant" feel if needed.
            }
        } catch (error) {
            console.error("Send error:", error);
        }
    };

    const filteredList = chatList.filter(u => 
        u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`flex h-[90vh] m-4 rounded-3xl border shadow-2xl overflow-hidden transition-all ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100'
        }`}>
            
            {/* SIDEBAR */}
            <div className={`w-80 flex flex-col border-r ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
                <div className="p-6">
                    <h2 className="text-2xl font-black tracking-tighter mb-4">Messages</h2>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <Search size={16} className="text-gray-400" />
                        <input 
                            placeholder="Search chats..." 
                            className="bg-transparent text-sm outline-none w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2">
                    {loadingSidebar ? (
                        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>
                    ) : (
                        filteredList.map((user) => (
                            <div 
                                key={user.$id}
                                onClick={() => setSelectedUser(user)}
                                className={`p-4 rounded-2xl flex items-center group cursor-pointer transition-all mb-2 ${
                                    selectedUser?.$id === user.$id 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                    : (isDark ? 'hover:bg-slate-800' : 'hover:bg-white shadow-sm border border-transparent hover:border-gray-100')
                                }`}
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-500 flex-shrink-0 mr-3 flex items-center justify-center text-white font-bold border-2 border-white/20">
                                    {user.fullName?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold truncate text-sm">{user.fullName}</h3>
                                    <p className={`text-[10px] truncate uppercase font-bold tracking-widest ${selectedUser?.$id === user.$id ? 'text-blue-100' : 'text-gray-400'}`}>
                                        Active Conversation
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className={`p-4 flex items-center justify-between border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-50'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                                    {selectedUser.fullName?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-sm tracking-tight">{selectedUser.fullName}</h3>
                                    <span className="text-[10px] text-green-500 font-black uppercase">Live Chat</span>
                                </div>
                            </div>
                        </div>

                        <div className={`flex-1 p-6 overflow-y-auto space-y-4 ${isDark ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
                            {messages.map((msg) => {
                                const isMe = msg.senderId === currentUser?.$id;
                                return (
                                    <div key={msg.$id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] p-4 rounded-3xl text-sm font-medium shadow-sm transition-all ${
                                            isMe 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : (isDark ? 'bg-slate-800 text-white rounded-tl-none' : 'bg-white text-slate-800 rounded-tl-none border border-gray-100')
                                        }`}>
                                            <p>{msg.content}</p>
                                            <span className="text-[9px] block text-right mt-1 opacity-50 font-bold">
                                                {new Date(msg.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messageEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className={`p-6 border-t ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
                            <div className={`flex items-center gap-2 rounded-2xl px-4 py-1 border-2 transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus-within:border-blue-500/50' : 'bg-gray-50 border-gray-100 focus-within:border-blue-500/20'}`}>
                                <input 
                                    className="flex-1 bg-transparent py-3 outline-none text-sm font-medium"
                                    placeholder="Type a message..."
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                />
                                <button type="submit" disabled={!text.trim()} className="text-blue-500 hover:scale-110 disabled:opacity-20 transition-all p-2">
                                    <Send size={20} fill="currentColor" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 opacity-20">
                        <MessageSquare size={80} strokeWidth={1} />
                        <h2 className="text-2xl font-black mt-4 uppercase tracking-tighter">Connect Messaging</h2>
                        <p className="text-sm font-bold">Select a user to begin chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;