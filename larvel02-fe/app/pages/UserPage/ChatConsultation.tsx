import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Info, 
  Plus, 
  Bot, 
  Send, 
  X,
  Lightbulb,
  ChevronRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import api from "~/lib/api";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function ChatConsultation() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [infoOpen, setInfoOpen] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const suggestedQuestions = [
    "Apa saja gejala penyakit jantung yang harus saya waspadai?",
    "Bagaimana cara menurunkan kolesterol secara alami?",
    "Makanan apa yang baik untuk kesehatan jantung?",
    "Berapa kali saya harus berolahraga dalam seminggu?",
    "Bagaimana cara membaca hasil tensi?",
    "Apa efek samping obat pengencer darah?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    fetchChatHistory();
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const fetchChatHistory = async () => {
    try {
      const response = await api.get("chats");
      if (response.data?.success && response.data.data.length > 0) {
        const historyMessages = response.data.data.flatMap((chat: any) => [
          {
            id: `u-${chat.id || chat._id}`,
            text: chat.message,
            sender: "user",
            timestamp: new Date(chat.created_at)
          },
          {
            id: `a-${chat.id || chat._id}`,
            text: chat.response,
            sender: "ai",
            timestamp: new Date(chat.created_at)
          }
        ]);
        setMessages(historyMessages.reverse());
      }
    } catch (error) {
      console.error("Fetch history error:", error);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await api.post("chat", { prompt: textToSend });
      let responseText = response.data?.data;

      if (typeof responseText === "object" && responseText !== null) {
        responseText = responseText.message || responseText.error || JSON.stringify(responseText);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: String(responseText || "Maaf, saya tidak dapat memberikan jawaban untuk saat ini."),
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Gagal menghubungi asisten AI. Silakan periksa koneksi Anda.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const InfoPanel = (
    <div className="h-full flex flex-col bg-white">
      <div className="p-8 space-y-8 overflow-y-auto flex-1 no-scrollbar">
        {/* AI Brand Card */}
        <div className="relative group p-6 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-xl shadow-emerald-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <Bot className="w-12 h-12 text-emerald-100 mb-4" />
          <h3 className="text-xl font-black font-display mb-1 flex items-center gap-2">
            HeartPredict AI <ShieldCheck className="w-4 h-4" />
          </h3>
          <p className="text-xs text-emerald-50/80 font-medium leading-relaxed mb-4">
            Didukung oleh dataset medis terpercaya untuk asisten kesehatan jantung Anda 24/7.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse shadow-[0_0_8px_rgba(110,231,183,1)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">AI Siap Membantu</span>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Pertanyaan Populer</h4>
          <div className="space-y-2">
            {suggestedQuestions.slice(0, 5).map((q, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 4 }}
                onClick={() => handleSendMessage(q)}
                className="w-full text-left p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-emerald-200 hover:bg-white transition-all flex items-start gap-3 group"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                <span className="text-sm font-bold text-slate-700 leading-tight line-clamp-2">{q}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Healthcare Tips Card */}
        <div className="p-6 rounded-[2rem] bg-blue-50 border border-blue-100 relative group overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100/50 rounded-full blur-xl" />
          <Lightbulb className="w-8 h-8 text-blue-500 mb-3" />
          <h5 className="text-sm font-black text-slate-900 mb-2">Tips Kardiovaskular</h5>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Membatasi asupan garam hingga kurang dari 5 gram per hari dapat membantu menurunkan tekanan darah secara signifikan.
          </p>
          <button className="mt-4 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:gap-3 transition-all">
            Lihat Blog <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="-m-4 sm:-m-8 flex h-[calc(100vh-4rem)] relative bg-slate-50 overflow-hidden font-sans">
      
      {/* Central Chat Panel */}
      <div className="flex-1 flex flex-col h-full bg-white relative z-10 shadow-sm xl:rounded-l-[3rem] transition-all">
        
        {/* Header */}
        <header className="h-16 flex-shrink-0 border-b border-slate-100 px-6 sm:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 font-display leading-tight">Konsultasi AI</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active Assistant</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="xl:hidden rounded-xl text-slate-400" onClick={() => setInfoOpen(true)}>
               <Info className="w-5 h-5" />
             </Button>
             <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl font-bold border-slate-200" onClick={() => setMessages([])}>
               <Plus className="w-4 h-4 mr-2" /> Chat Baru
             </Button>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-10 scroll-smooth no-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence initial={false}>
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 flex flex-col items-center text-center space-y-10"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="relative w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center border-8 border-emerald-50 ring-1 ring-emerald-100">
                      <Bot className="w-16 h-16 text-emerald-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-3xl font-black text-slate-900 font-display">Ada yang bisa dibantu?</h2>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                      Ceritakan gejala Anda atau tanyakan tips seputar kesehatan jantung hari ini.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                    {suggestedQuestions.slice(0, 4).map((q, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        className="h-auto p-5 rounded-[1.5rem] border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 justify-start text-left items-start group shadow-sm bg-white"
                        onClick={() => handleSendMessage(q)}
                      >
                        <MessageSquare className="w-5 h-5 text-emerald-600 mr-4 shrink-0 mt-1" />
                        <span className="text-sm font-bold text-slate-700 line-clamp-2 leading-tight">{q}</span>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-end gap-3",
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* Message Bubble */}
                    <div className={cn(
                      "flex flex-col max-w-[85%] sm:max-w-xl",
                      msg.sender === "user" ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-5 py-3.5 shadow-sm text-sm font-medium leading-relaxed",
                        msg.sender === "user" 
                          ? "bg-emerald-600 text-white rounded-[1.5rem] rounded-br-[0.25rem] shadow-emerald-100" 
                          : "bg-white border border-slate-100 text-slate-900 rounded-[1.5rem] rounded-bl-[0.25rem]"
                      )}>
                        {msg.text.split("\n").map((line, i) => (
                          <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-tight">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}

              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-white border border-slate-100 px-5 py-4 rounded-[1.5rem] rounded-bl-[0.25rem] shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-50 sticky bottom-0 z-20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="max-w-4xl mx-auto flex items-end gap-3 relative"
          >
            <div className="flex-1 relative group">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan kesehatan jantung Anda..."
                rows={1}
                className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 rounded-[1.5rem] px-6 py-4 text-sm font-medium resize-none transition-all outline-none pr-12 min-h-[56px] max-h-48 scrollbar-hide"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="h-14 w-14 rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-100 hover:scale-105 active:scale-95 transition-all text-white p-0 shrink-0"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </Button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-[0.2em] font-black">AI dapat memberikan hasil yang kurang akurat. Selalu konsultasikan dengan dokter.</p>
        </div>
      </div>

      {/* Info Panel (Desktop XL) */}
      <div className="hidden xl:block w-96 flex-shrink-0 h-full border-l border-slate-100 bg-white shadow-2xl z-20">
        {InfoPanel}
      </div>

      {/* Mobile/Tablet Info Drawer */}
      <AnimatePresence>
        {infoOpen && (
          <div className="xl:hidden fixed inset-0 z-[100] flex justify-end">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
               onClick={() => setInfoOpen(false)}
             />
             <motion.div 
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="relative w-full max-w-[340px] bg-white h-full shadow-2xl flex flex-col"
             >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                   <h3 className="font-black font-display text-slate-800">Informasi Obrolan</h3>
                   <Button variant="ghost" size="icon" onClick={() => setInfoOpen(false)} className="rounded-xl">
                      <X className="w-5 h-5 text-slate-400" />
                   </Button>
                </div>
                {InfoPanel}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
