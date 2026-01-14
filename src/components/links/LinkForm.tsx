"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { Link } from "@/types";

interface LinkFormProps {
    initialData?: Link;
    isEditing?: boolean;
}

export function LinkForm({ initialData, isEditing = false }: LinkFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        original_url: initialData?.original_url || "",
        title: initialData?.title || "",
        custom_code: initialData?.short_code || "",
        tags: initialData?.tags?.join(", ") || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing && initialData) {
                await api.links.update(initialData.id, {
                    title: formData.title,
                    tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
                });
            } else {
                await api.links.create({
                    original_url: formData.original_url,
                    title: formData.title,
                    custom_code: formData.custom_code || undefined,
                    tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
                });
            }
            router.push("/links");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Original URL</label>
                        <Input
                            type="url"
                            required
                            placeholder="https://example.com/long-url"
                            value={formData.original_url}
                            onChange={(e) => setFormData({ ...formData, original_url: e.target.value })}
                            disabled={isEditing || loading}
                        />
                        {isEditing && <p className="text-xs text-muted-foreground">URL cannot be changed</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            required
                            placeholder="Marketing Campaign Q1"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Custom Code (Optional)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">/</span>
                            <Input
                                placeholder="summer-sale"
                                value={formData.custom_code}
                                onChange={(e) => setFormData({ ...formData, custom_code: e.target.value })}
                                disabled={isEditing || loading}
                            />
                        </div>
                        {isEditing && <p className="text-xs text-muted-foreground">Short code cannot be changed</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags (comma separated)</label>
                        <Input
                            placeholder="social, promo, 2024"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : isEditing ? "Update Link" : "Create Link"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
