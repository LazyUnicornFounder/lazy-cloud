export interface Company {
  name: string;
  url: string;
  description: string;
}

export const companies: Company[] = [
  {
    name: "Naive",
    url: "https://useNaive.ai",
    description: "Describe your company. Naive builds it.",
  },
  {
    name: "Polsia",
    url: "https://polsia.com",
    description: "AI that runs your company while you sleep.",
  },
];
