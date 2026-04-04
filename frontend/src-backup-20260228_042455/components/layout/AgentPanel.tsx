import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, X, Minimize2, Maximize2, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api-client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentPanelProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const AgentPanel = ({ collapsed = false, onToggle }: AgentPanelProps) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(["common", "dashboard"]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [insightsLoaded, setInsightsLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load initial insights
  useEffect(() => {
    if (insightsLoaded || collapsed) return;
    const loadInsights = async () => {
      try {
        const data = await api.post("/ai/insights", {
          language: i18n.language === "pt-BR" ? "pt" : "en",
        });
        if (data?.message) {
          setMessages([
            {
              id: "insight-0",
              role: "assistant",
              content: data.message,
              timestamp: new Date(),
            },
          ]);
        }
        setInsightsLoaded(true);
      } catch {
        setInsightsLoaded(true);
      }
    };
    loadInsights();
  }, [collapsed, insightsLoaded, i18n.language]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await api.post("/ai/chat", {
        message: trimmed,
        conversationId,
        language: i18n.language === "pt-BR" ? "pt" : "en",
      });
      if (data?.conversationId) setConversationId(data.conversationId);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data?.message || data?.response || "...",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I could not process your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, conversationId, i18n.language]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Collapsed state - just show toggle button
  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-105 transition-transform lg:static lg:bottom-auto lg:right-auto lg:h-full lg:w-[48px] lg:rounded-none lg:shadow-none lg:bg-transparent lg:border-l lg:border-sidebar-border lg:hover:bg-muted/30"
        aria-label="Open ZURT Agent"
      >
        <Sparkles className="h-5 w-5" />
      </button>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-[320px] h-full border-l border-sidebar-border bg-[var(--surface-1)] shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <Bot className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">ZURT Agent</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-dot" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onToggle}
          aria-label="Close agent panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto midnight-scrollbar px-4 py-4 space-y-3">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-60">
            <Sparkles className="h-8 w-8 text-primary/40" />
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Ask me about your finances, investments, or goals.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[90%] text-[13px] leading-relaxed",
              msg.role === "user"
                ? "ml-auto bg-primary/10 text-foreground border border-primary/10 rounded-xl rounded-br-sm px-3 py-2"
                : "agent-msg-bot rounded-xl rounded-bl-sm"
            )}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">Thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <div className="flex items-end gap-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border-1)] px-3 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ZURT Agent..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none max-h-[80px] leading-relaxed"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-primary hover:text-primary hover:bg-primary/10 disabled:opacity-30"
            disabled={!input.trim() || loading}
            onClick={sendMessage}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">
          ZURT Agent can make mistakes. Verify important info.
        </p>
      </div>
    </aside>
  );
};

export default AgentPanel;
