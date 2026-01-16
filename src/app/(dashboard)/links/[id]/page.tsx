import { api } from "@/lib/api";
import { DailyClicksChart } from "@/components/analytics/DailyClicksChart";
import { ReferrersList } from "@/components/analytics/ReferrersList";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function LinkAnalyticsPage({ params }: PageProps) {
    const { id } = await params;
    let stats;
    // We also might want the link details (title, short_code) to show in the header.
    // Assuming we can fetch it, or just show stats for now.
    // The API guide doesn't explicitly guarantee link details in stats endpoint, 
    // so for a "premium" feel we should probably fetch the link details too if possible.
    // I will just fetch stats for now as per guide, and maybe show just the ID or rely on stats having some info? 
    // No, stats has total_clicks, referrers, daily_clicks.
    // I'll show "Analytics for Link #{id}" if I can't get the title easily without an extra call.
    // But wait, I can use the same assume-standard-GET logic I used for Edit page.

    let linkDetails;
    try {
        const linkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/links/${id}`);
        if (linkRes.ok) linkDetails = await linkRes.json();
    } catch (e) { }

    try {
        stats = await api.links.getStats(Number(id));
    } catch (error) {
        console.error("Failed to fetch stats:", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/links">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Link Analytics</h1>
                    {linkDetails && (
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-muted-foreground">{linkDetails.title}</p>
                            <a href={linkDetails.short_code} target="_blank" className="flex items-center text-primary text-sm hover:underline">
                                /{linkDetails.short_code} <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="text-sm font-medium text-muted-foreground">Total Clicks</div>
                    <div className="text-2xl font-bold">{stats?.total_clicks || 0}</div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                {stats?.daily_clicks && <DailyClicksChart data={stats.daily_clicks} />}
                {stats?.referrers && <ReferrersList data={stats.referrers} />}
            </div>
        </div>
    );
}
