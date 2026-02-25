import React, { useEffect, useState, useRef } from 'react';
import profileservice from '../AppWrite/profile';
import chatservice from '../AppWrite/chat_message';
import authservice from '../AppWrite/auth';

const Messages = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const messageEndRef = useRef(null); // For auto-scrolling

    // Auto-scroll to bottom whenever messages change
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 1. Get Current User
    useEffect(() => {
        const init = async () => {
            try {
                const user = await authservice.CurrentUser();
                setCurrentUser(user);
            } catch (err) {
                console.error("Auth error:", err);
            }
        };
        init();
    }, []);

    // 2. Fetch Sidebar Users
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await profileservice.ListProfile();
            if (res) setUsers(res.documents);
        };
        fetchUsers();
    }, []);

    // 3. Real-time Subscription
    useEffect(() => {
        const unsubscribe = chatservice. subscribeToMessages((payload) => {
            // Logic: Only add to UI if the message involves the current selected chat
            setMessages((prev) => [...prev, payload]);
        });
        return () => unsubscribe(); 
    }, [selectedUser]); // Reset sub if needed when user changes

    const handleSendMessage = async () => {
        if (!text || !selectedUser || !currentUser) return;
        try {
           const pro= await chatservice.sendMessage(currentUser.$id, selectedUser.$id, text);
            setText(""); 
            console.log(pro)
            return pro
        } catch (error) {
            console.error("Send error:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            {/* LEFT SIDEBAR */}
            <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
                <div className="p-4 bg-gray-100 font-bold text-xl border-b">Chats</div>
                <div className="overflow-y-auto flex-1">
                    {users.map((user) => (
                        <div 
                            key={user.$id}
                            onClick={() => {
                                setSelectedUser(user);
                                setMessages([]); // Optional: Clear old chat view while loading new ones
                            }}
                            className={`p-4 flex items-center cursor-pointer border-b hover:bg-gray-50 transition-colors ${selectedUser?.$id === user.$id ? 'bg-gray-200' : ''}`}
                        >
                            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                {user.fullName?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{user.fullName}</h3>
                                <p className="text-xs text-gray-500">Online</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE: Chat Window */}
            <div className="flex-1 flex flex-col bg-[#e5ddd5] relative">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="p-3 bg-gray-200 flex items-center shadow-md z-10">
                            <div className="w-10 h-10 bg-gray-400 rounded-full mr-3"></div>
                            <div className="font-bold text-gray-700">{selectedUser.fullName}</div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === currentUser?.$id;
                                return (
                                    <div 
                                        key={msg.$id || index} 
                                        className={`max-w-[70%] p-2 rounded-lg shadow-sm text-sm ${
                                            isMe 
                                            ? "self-end bg-[#dcf8c6] text-gray-800 rounded-tr-none" 
                                            : "self-start bg-white text-gray-800 rounded-tl-none"
                                        }`}
                                    >
                                        <p>{msg.content}</p>
                                        <span className="text-[10px] text-gray-500 float-right ml-2 mt-1">
                                            {new Date(msg.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={messageEndRef} /> {/* Scroll target */}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-gray-100 flex items-center gap-3">
                            <input 
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:border-teal-500"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-700 transition-transform active:scale-95"
                            >
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                                </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                            💬
                        </div>
                        <h2 className="text-xl font-light"> Connect Me</h2>
                        <p className="text-sm">Select a contact to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;