import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface ReferrersListProps {
    data: Record<string, number>;
}

export function ReferrersList({ data }: ReferrersListProps) {
    const sortedReferrers = Object.entries(data).sort((a, b) => b[1] - a[1]);

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedReferrers.length > 0 ? (
                        sortedReferrers.map(([referrer, count]) => (
                            <div key={referrer} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="text-sm font-medium">{referrer}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{count} clicks</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No referrer data available.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
