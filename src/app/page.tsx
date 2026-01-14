import { api } from "@/lib/api";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Activity, MousePointer2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Force dynamic rendering since data changes frequently
export const dynamic = 'force-dynamic';

export default async function Home() {
  let dashboardData;
  try {
    dashboardData = await api.dashboard.get();
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Fallback data or error handling
    dashboardData = null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Link href="/links">
            <Button>Manage Links</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clicks"
          value={dashboardData?.total_system_clicks || 0}
          icon={MousePointer2}
          description="All time system-wide clicks"
        />
        <StatsCard
          title="Active Links"
          value={dashboardData?.top_links?.length || 0} // Approximate or needs another endpoint
          icon={Activity}
          description="Top performing links"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.top_links && dashboardData.top_links.length > 0 ? (
              <div className="space-y-8">
                {dashboardData.top_links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        <a href={link.short_code} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">
                          /{link.short_code}
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {link.original_url}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{(link.clicks || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">clicks</p>
                      </div>
                      <Link href={`/links/${link.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {dashboardData ? "No links found." : "Failed to load dashboard data. Is the backend running?"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
