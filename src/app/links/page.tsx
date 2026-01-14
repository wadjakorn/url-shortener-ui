import { api } from "@/lib/api";
import { LinksTable } from "@/components/links/LinksTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Link as LinkType } from "@/types";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function LinksPage() {
    let links: LinkType[] = [];
    try {
        const res = await api.links.list(1, 100); // Fetch 100 for now, pagination to be implemented if needed
        links = res.data || [];
    } catch (error) {
        console.error("Failed to fetch links:", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Links</h1>
                    <p className="text-muted-foreground mt-2">Manage and track your shortened URLs.</p>
                </div>
                <Link href="/links/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Link
                    </Button>
                </Link>
            </div>

            <LinksTable initialLinks={links} />
        </div>
    );
}
