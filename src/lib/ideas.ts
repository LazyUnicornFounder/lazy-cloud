import { createClient } from "@supabase/supabase-js";

const breakingMuseClient = createClient(
  "https://uslyjnwsptwscxuibdet.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbHlqbndzcHR3c2N4dWliZGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODk3MzIsImV4cCI6MjA5MDQ2NTczMn0.qKQdE99ApFq7Cs-bLfyB7iUJm4emIuhfmFWHdTXgCBo"
);

export interface IdeaEntry {
  title: string;
  description: string;
  sourceEvent: string;
  sourceUrl: string;
  tag: string;
  isFeatured: boolean;
}

export interface DayIdeas {
  date: string;
  ideas: IdeaEntry[];
}

function getAmmanDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });
}

export async function fetchIdeasForDate(date?: string): Promise<{
  featured: IdeaEntry[];
  all: Record<string, IdeaEntry[]>;
}> {
  const targetDate = date || getAmmanDate();

  const { data, error } = await breakingMuseClient
    .from("daily_ideas")
    .select("*")
    .eq("date", targetDate)
    .order("is_featured", { ascending: false })
    .order("tag");

  if (error) {
    console.error("Error fetching ideas:", error);
    return { featured: [], all: {} };
  }

  const featured: IdeaEntry[] = [];
  const all: Record<string, IdeaEntry[]> = {};

  for (const row of data || []) {
    const entry: IdeaEntry = {
      title: row.title,
      description: row.description,
      sourceEvent: row.source_event,
      sourceUrl: row.source_url,
      tag: row.tag,
      isFeatured: row.is_featured,
    };

    if (row.is_featured) {
      featured.push(entry);
    }

    if (!all[row.tag]) all[row.tag] = [];
    all[row.tag].push(entry);
  }

  return { featured, all };
}

export async function fetchArchiveIdeas(): Promise<DayIdeas[]> {
  const today = getAmmanDate();

  const { data, error } = await breakingMuseClient
    .from("daily_ideas")
    .select("*")
    .lt("date", today)
    .order("date", { ascending: false })
    .order("is_featured", { ascending: false });

  if (error) {
    console.error("Error fetching archive:", error);
    return [];
  }

  const dayMap = new Map<string, IdeaEntry[]>();

  for (const row of data || []) {
    const entry: IdeaEntry = {
      title: row.title,
      description: row.description,
      sourceEvent: row.source_event,
      sourceUrl: row.source_url,
      tag: row.tag,
      isFeatured: row.is_featured,
    };

    if (!dayMap.has(row.date)) dayMap.set(row.date, []);
    dayMap.get(row.date)!.push(entry);
  }

  return Array.from(dayMap.entries()).map(([date, ideas]) => ({ date, ideas }));
}
