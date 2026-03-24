import AdminAnalytics from "@/components/AdminAnalytics";

export default function AdminAnalyticsPage() {
  const password = sessionStorage.getItem("admin_pw") || "";
  return (
    <div>
      <h1 className="font-display text-xl font-bold tracking-tight mb-6">Analytics</h1>
      <AdminAnalytics password={password} />
    </div>
  );
}
