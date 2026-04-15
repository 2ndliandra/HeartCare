import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Activity,
    Stethoscope,
    ClipboardList,
    Heart,
    BrainCircuit,
    Send,
    Bot,
    User,
    Loader2,
    Sparkles,
    Trash2
} from 'lucide-react';
import { authService } from '../../lib/authService';
import api from '../../lib/api';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const ChatConsultationPage: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Halo! Saya HeartGuard Assistant. Ada yang bisa saya bantu terkait kesehatan jantung Anda hari ini?',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Get user from localStorage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        fetchChatHistory();
        scrollToBottom();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const response = await api.get('chats');
            if (response.data.success && response.data.data.length > 0) {
                const historyMessages = response.data.data.flatMap((chat: any) => [
                    {
                        id: `u-${chat.id}`,
                        text: chat.message,
                        sender: 'user',
                        timestamp: new Date(chat.created_at)
                    },
                    {
                        id: `a-${chat.id}`,
                        text: chat.response,
                        sender: 'ai',
                        timestamp: new Date(chat.created_at)
                    }
                ]);
                // reverse wait, they are already descending from server. 
                // We want oldest at top.
                setMessages(historyMessages.reverse());
            }
        } catch (error) {
            console.error('Fetch history error:', error);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navigation = [
        { name: 'Beranda', icon: LayoutDashboard, href: '/user', current: false },
        { name: 'Cek Kesehatan', icon: Activity, href: '/user/cek-kesehatan', current: false },
        { name: 'Hasil Prediksi AI', icon: BrainCircuit, href: '/user/hasil-prediksi', current: false },
        { name: 'Konsultasi AI', icon: Bot, href: '/user/konsultasi', current: true },
        { name: 'Rekomendasi Medis', icon: Stethoscope, href: '/user/rekomendasi', current: false },
        { name: 'Riwayat Pemeriksaan', icon: ClipboardList, href: '/user/riwayat', current: false },
        { name: 'Profil Saya', icon: User, href: '/user/profile', current: false },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('chat', { prompt: input });
            let responseText = response.data.data;

            // Handle if the backend returns an error object/array instead of a string
            if (typeof responseText === 'object' && responseText !== null) {
                responseText = responseText.message || responseText.error || JSON.stringify(responseText);
            }
            
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: String(responseText || 'Maaf, saya tidak dapat memberikan jawaban untuk saat ini.'),
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Maaf, terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti.',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        if (window.confirm('Hapus semua riwayat percakapan ini?')) {
            setMessages([
                {
                    id: '1',
                    text: 'Halo! Saya HeartGuard Assistant. Ada yang bisa saya bantu terkait kesehatan jantung Anda hari ini?',
                    sender: 'ai',
                    timestamp: new Date()
                }
            ]);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">Heart<span className="text-primary">Predict</span></span>
                    </Link>
                    <button className="lg:hidden ml-auto text-slate-500" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <div className="px-4 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">Menu Utama</div>
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.name} to={item.href} className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${item.current ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                <Icon className={`mr-3 h-5 w-5 ${item.current ? 'text-emerald-600' : 'text-slate-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
                <div className="p-4 border-t border-slate-100">
                    <button onClick={handleLogout} className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                        <LogOut className="mr-3 h-5 w-5 text-blue-400" /> Keluar Akun
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">HeartGuard AI Assistant</h1>
                                <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online & Siap Membantu
                                </p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={clearChat}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Percakapan"
                    >
                        <Trash2 size={20} />
                    </button>
                </header>

                {/* Content Wrapper */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Chat Container */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f8fafc] custom-scrollbar">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm ${
                                            msg.sender === 'user' ? (user?.profile_picture ? '' : 'bg-indigo-600 text-white') : 'bg-white border border-slate-200 text-primary'
                                        }`}>
                                            {msg.sender === 'user' ? (
                                                user?.profile_picture ? (
                                                    <img src={`http://localhost:8000/storage/${user.profile_picture}`} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={16} />
                                                )
                                            ) : (
                                                <Bot size={16} />
                                            )}
                                        </div>
                                        <div className={`space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                                msg.sender === 'user' 
                                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                            }`}>
                                                {(typeof msg.text === 'string' ? msg.text : String(msg.text || '')).split('\n').map((line, i) => (
                                                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-slate-400 px-1">
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start animate-in fade-in duration-300">
                                    <div className="flex gap-3 max-w-[75%]">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-primary flex items-center justify-center shadow-sm">
                                            <Bot size={16} />
                                        </div>
                                        <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium italic">Mengetik...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Right Side Summary (Desktop Only) */}
                    <div className="hidden xl:flex w-80 border-l border-slate-200 bg-white flex-col p-6 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Sparkles size={16} className="text-amber-500" /> Ringkasan Terakhir
                            </h3>
                            {messages.length > 2 ? (
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Topik Terakhir</p>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                        {messages[messages.length - 1].sender === 'ai' 
                                            ? messages[messages.length - 2].text.substring(0, 60) + '...'
                                            : messages[messages.length - 1].text.substring(0, 60) + '...'}
                                    </p>
                                    <div className="h-px bg-slate-200 w-full"></div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Respon AI</p>
                                    <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Solutif & Medis
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                    <p className="text-xs text-slate-400 italic">Belum ada insight untuk diringkas.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <h4 className="text-[10px] font-bold text-indigo-700 uppercase mb-2">Tips Konsultasi</h4>
                            <p className="text-[11px] text-indigo-600/80 leading-relaxed">
                                Tanyakan tentang "gejala awal jantung koroner" atau "cara menurunkan kolesterol" untuk hasil optimal.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-slate-200 p-4 shrink-0">
                    <form 
                        onSubmit={handleSubmit}
                        className="max-w-3xl mx-auto relative group"
                    >
                        <div className="absolute -top-10 left-0 right-0 flex justify-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <div className="bg-slate-800 text-white text-[10px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                                <Sparkles size={12} className="text-amber-400" /> AI akan menjawab berdasarkan konteks medis
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Tanyakan sesuatu tentang kesehatan jantung..."
                                className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:grayscale flex-shrink-0"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-2">
                            Gunakan sebagai referensi, bukan diagnosa medis pengganti dokter.
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ChatConsultationPage;
