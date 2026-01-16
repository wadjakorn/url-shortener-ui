"use client";

import { Link as LinkType } from "@/types";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link"; // Next.js Link
import { BarChart2, Edit2, ExternalLink, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface LinksTableProps {
    initialLinks: LinkType[];
}

export function LinksTable({ initialLinks }: LinksTableProps) {
    const router = useRouter();
    const [links, setLinks] = useState(initialLinks);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this link?")) return;

        setDeletingId(id);
        try {
            await api.links.delete(id);
            setLinks(links.filter((l) => l.id !== id));
            router.refresh(); // Refresh server data
        } catch (error) {
            alert("Failed to delete link");
        } finally {
            setDeletingId(null);
        }
    };

    if (links.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground mb-4">No links found</p>
                    <Link href="/links/create">
                        <Button>Create your first link</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {links.map((link) => (
                <Card key={link.id} className="overflow-hidden transition-all hover:border-primary/50">
                    <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                            <div className="space-y-1 overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <a href={`/open/${link.short_code}?no_stat=1`} target="_blank" className="text-lg font-bold text-primary hover:underline flex items-center gap-1">
                                        /open/{link.short_code}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                    {link.title && <span className="text-muted-foreground text-sm border-l pl-2 ml-2">{link.title}</span>}
                                </div>
                                <p className="text-sm text-muted-foreground truncate max-w-xl" title={link.original_url}>{link.original_url}</p>
                                <div className="flex gap-2 pt-1">
                                    {link.tags?.map(tag => (
                                        <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">#{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                                <div className="flex items-center gap-2">
                                    <Link href={`/links/${link.id}?title=${link.title}`}>
                                        <Button variant="ghost" size="icon" title="Analytics">
                                            <BarChart2 className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/links/${link.id}/edit`}>
                                        <Button variant="ghost" size="icon" title="Edit">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        title="Delete"
                                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => handleDelete(link.id)}
                                        disabled={deletingId === link.id}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
