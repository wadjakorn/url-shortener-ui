import { api } from "@/lib/api";
import { CollectionsTable } from "@/components/collections/CollectionsTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Collection } from "@/types";

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
    let collections: Collection[] = [];
    try {
        const res = await api.collections.list(1, 100);
        collections = res.data || [];
    } catch (error) {
        console.error("Failed to fetch collections:", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                    <p className="text-muted-foreground mt-2">Group your links into curated pages.</p>
                </div>
                <Link href="/collections/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Collection
                    </Button>
                </Link>
            </div>

            <CollectionsTable initialCollections={collections} />
        </div>
    );
}
