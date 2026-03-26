import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Volume2, VolumeX, Mic } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const GREETING = "Hey! I'm the Lazy Unicorn assistant. Ask me anything about the Lazy Stack — twenty autonomous engines that make your Lovable site run itself. What do you want to automate?";

export default function VoiceAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong. Try again in a moment." },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);

      // Play audio if not muted
      if (data.audio && !isMuted) {
        // Stop any currently playing audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        const audioUrl = `data:audio/mpeg;base64,${data.audio}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.addEventListener("play", () => setIsSpeaking(true));
        audio.addEventListener("ended", () => setIsSpeaking(false));
        audio.addEventListener("pause", () => setIsSpeaking(false));
        audio.play().catch(() => {});
      }
    } catch (err) {
      console.error("Voice agent error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection lost. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, isMuted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current && !isMuted) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[50vh] right-6 z-50 w-14 h-14 bg-foreground text-background flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity translate-y-1/2"
            aria-label="Open voice assistant"
          >
            <MessageCircle size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[50vh] right-6 z-50 w-[360px] max-h-[520px] bg-card border border-border shadow-2xl flex flex-col overflow-hidden translate-y-1/2"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border" style={{ backgroundColor: "#0a0a08" }}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-green-400 animate-pulse" : "bg-foreground/30"}`} />
                <span className="font-display text-xs font-bold tracking-[0.1em] uppercase text-foreground/70">
                  Lazy Unicorn
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-foreground/30 hover:text-foreground/60 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    audioRef.current?.pause();
                    setIsSpeaking(false);
                  }}
                  className="p-1.5 text-foreground/30 hover:text-foreground/60 transition-colors"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0" style={{ maxHeight: "380px" }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-foreground text-background font-body"
                        : "bg-accent/10 text-foreground/70 font-body border border-border"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-accent/10 border border-border px-3 py-2 text-xs">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="text-foreground/40"
                    >
                      Thinking...
                    </motion.span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-3 py-2 border-t border-border flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the Lazy Stack..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-xs font-body text-foreground placeholder:text-foreground/20 outline-none py-2 px-1"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 text-foreground/40 hover:text-foreground transition-colors disabled:opacity-30"
              >
                <Send size={14} />
              </button>
            </form>

            {/* Footer */}
            <div className="px-4 py-1.5 border-t border-border">
              <p className="font-body text-[9px] text-foreground/15 text-center">
                Powered by Lovable AI · ElevenLabs voice
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
