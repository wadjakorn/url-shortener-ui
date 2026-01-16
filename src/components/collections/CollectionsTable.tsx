"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, ExternalLink, Trash2, Calendar, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/Button";
import { Collection } from "@/types";
import { api } from "@/lib/api";

interface CollectionsTableProps {
    initialCollections: Collection[];
}

export function CollectionsTable({ initialCollections }: CollectionsTableProps) {
    const router = useRouter();
    const [collections, setCollections] = useState<Collection[]>(initialCollections);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this collection?")) return;

        try {
            setIsLoading(true);
            await api.collections.delete(id);
            setCollections(collections.filter((c) => c.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Failed to delete collection:", error);
            alert("Failed to delete collection");
        } finally {
            setIsLoading(false);
        }
    };

    if (collections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg bg-card/50">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">No collections found</h3>
                <p className="text-muted-foreground text-center max-w-sm mt-2 mb-6">
                    Create your first collection to group links together for easy sharing.
                </p>
                <Link href="/collections/create">
                    <Button>Create Collection</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
            <div className="divide-y divide-border">
                {collections.map((collection) => (
                    <div key={collection.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{collection.title}</h3>
                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                    /u/{collection.slug}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                                {collection.description || "No description"}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(collection.created_at), { addSuffix: true })}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Link href={`/u/${collection.slug}`} target="_blank">
                                <Button variant="ghost" size="icon" title="View Public Page">
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Link>

                            <Link href={`/collections/${collection.id}`}>
                                <Button variant="ghost" size="icon" title="Edit">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </Link>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(collection.id)}
                                disabled={isLoading}
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
