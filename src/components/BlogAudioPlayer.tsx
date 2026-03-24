import { useEffect, useState } from "react";
import { Headphones } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogAudioPlayerProps {
  postSlug: string;
}

export default function BlogAudioPlayer({ postSlug }: BlogAudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("voice_episodes")
        .select("audio_url")
        .eq("post_slug", postSlug)
        .eq("status", "published")
        .limit(1);
      if (data && data.length > 0) {
        setAudioUrl(data[0].audio_url);
      }
    };
    load();
  }, [postSlug]);

  if (!audioUrl) return null;

  return (
    <div className="mb-8 border border-primary/20 rounded-2xl p-4 bg-primary/5">
      <div className="flex items-center gap-2 mb-3">
        <Headphones size={14} className="text-primary" />
        <span className="font-display text-[10px] tracking-[0.15em] uppercase font-bold text-primary">
          Listen to this article
        </span>
      </div>
      <audio controls className="w-full h-10" preload="none">
        <source src={audioUrl} type="audio/mpeg" />
      </audio>
    </div>
  );
}
