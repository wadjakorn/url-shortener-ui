"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { Collection, Link } from "@/types";
import { useRouter } from "next/navigation";

interface CollectionLinksEditorProps {
    collection: Collection;
}

export function CollectionLinksEditor({ collection }: CollectionLinksEditorProps) {
    const router = useRouter();
    const [links, setLinks] = useState<Link[]>(collection.links || []);
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Link[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Filter out links already in the collection
    const availableLinks = searchResults.filter(
        (result) => !links.some((link) => link.id === result.id)
    );

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const res = await api.links.list(1, 10, query);
            setSearchResults(res.data);
        } catch (error) {
            console.error("Failed to search links:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddLink = async (link: Link) => {
        try {
            await api.collections.addLink(collection.id, link.id);
            setLinks([...links, link]);
            setSearchQuery("");
            setSearchResults([]);
            setIsAdding(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to add link:", error);
            alert("Failed to add link");
        }
    };

    const handleRemoveLink = async (linkId: number) => {
        if (!confirm("Remove this link from the collection?")) return;
        try {
            await api.collections.removeLink(collection.id, linkId);
            setLinks(links.filter((l) => l.id !== linkId));
            router.refresh();
        } catch (error) {
            console.error("Failed to remove link:", error);
            alert("Failed to remove link");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Links in Collection</h2>
                <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Link
                </Button>
            </div>

            {isAdding && (
                <div className="border border-border rounded-lg p-4 bg-muted/50 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search your links by title or URL..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {isSearching ? (
                            <p className="text-sm text-center text-muted-foreground py-4">Searching...</p>
                        ) : availableLinks.length > 0 ? (
                            availableLinks.map((link) => (
                                <div key={link.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-md hover:border-primary transition-colors cursor-pointer" onClick={() => handleAddLink(link)}>
                                    <div className="overflow-hidden">
                                        <p className="font-medium truncate">{link.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{link.original_url}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        ) : searchQuery.length >= 2 ? (
                            <p className="text-sm text-center text-muted-foreground py-4">No matching links found.</p>
                        ) : (
                            <p className="text-sm text-center text-muted-foreground py-2">Type to search existing links.</p>
                        )}
                    </div>
                </div>
            )}

            {links.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">No links in this collection yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {links.map((link) => (
                        <div key={link.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg group">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="space-y-1 min-w-0">
                                    <p className="font-medium truncate">{link.title}</p>
                                    <p className="text-xs text-muted-foreground truncate">{link.original_url}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveLink(link.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
