import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "How are the engines doing?",
  "Show me recent errors",
  "Publish a blog post now",
  "What were the latest posts?",
  "Pause the blogger engine",
];

const AdminOpsAgent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ops-agent", {
        body: { messages: newMessages },
      });

      if (error) throw error;

      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `❌ Error: ${err.message || "Failed to reach agent"}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px]">
      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-display text-lg font-bold text-foreground mb-1">Ops Agent</h3>
              <p className="font-body text-sm text-muted-foreground max-w-sm">
                I monitor and manage your Lazy Blogger, SEO, and GEO engines. Ask me anything or try a suggestion below.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 text-xs font-body rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-foreground border border-border"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-foreground/60" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted/50 border border-border rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the ops agent..."
            disabled={loading}
            className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 hover:bg-primary/90 disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminOpsAgent;
