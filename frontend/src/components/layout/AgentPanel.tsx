import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AgentPanel = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Boa noite, Diego. Seu portfolio subiu 1.54% este mes — superando CDI (1.07%) e IBOV (0.92%)." },
    { role: "assistant", content: "ALERTA: Concentracao elevada detectada. Considere rebalancear posicoes acima de 8% do portfolio." },
    { role: "assistant", content: "Seus FIIs estao rendendo 0.82%/mes contra 0.71% do IFIX. Performance consistente nos ultimos 6 meses." },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setMessages(prev => [...prev, { role: "user", content: input.trim() }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: "Funcionalidade em desenvolvimento. Em breve o ZURT Agent analisará seu portfolio com IA." }]);
      setLoading(false);
    }, 1200);
  };

  if (collapsed) {
    return (
      <div className="hidden xl:flex flex-col items-center py-4 w-10 border-l shrink-0"
           style={{ borderColor: '#27272a', background: '#0a0a0a' }}>
        <button onClick={() => setCollapsed(false)}
                className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-[#27272a] transition-colors">
          <Sparkles className="h-3.5 w-3.5 text-[#00FF7A]" />
        </button>
      </div>
    );
  }

  return (
    <div className="hidden xl:flex flex-col w-[280px] shrink-0 border-l"
         style={{ borderColor: '#27272a', background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center justify-between h-12 px-4 border-b shrink-0" style={{ borderColor: '#27272a' }}>
        <div className="flex items-center gap-2">
          <div className="h-[7px] w-[7px] rounded-full bg-[#00FF7A]" style={{ boxShadow: '0 0 8px rgba(0,255,122,0.5)' }} />
          <span className="text-[13px] font-bold text-[#f3f3f3]">ZURT Agent</span>
        </div>
        <button onClick={() => setCollapsed(true)}
                className="h-6 w-6 rounded flex items-center justify-center text-[#a5a5a5] hover:text-[#f3f3f3] transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="px-4 pt-3 pb-2">
        <p className="text-[10px] text-[#a5a5a5]">Analise em tempo real do seu portfolio</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "rounded-lg px-3 py-2.5 text-[12px] leading-[1.6]",
            msg.role === "assistant"
              ? "border text-[#acacac]"
              : "text-[#00FF7A] font-mono text-[10px] ml-auto max-w-[85%]"
          )} style={msg.role === "assistant"
            ? { background: '#18181b', borderColor: '#27272a' }
            : { background: 'rgba(0,255,122,0.06)', border: '1px solid rgba(0,255,122,0.12)' }
          }>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="rounded-lg px-3 py-2.5 border" style={{ background: '#18181b', borderColor: '#27272a' }}>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF7A]/50 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF7A]/50 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF7A]/50 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t p-3" style={{ borderColor: '#27272a' }}>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Pergunte qualquer coisa..."
            className="flex-1 rounded-md px-3 py-2 text-[11px] text-[#f3f3f3] placeholder:text-[#a5a5a5] outline-none transition-colors"
            style={{ background: 'transparent', border: '1px solid #27272a' }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#00FF7A'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#27272a'}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-md bg-[#00FF7A] text-black flex items-center justify-center shrink-0 hover:bg-[#00cc62] disabled:opacity-40 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentPanel;
