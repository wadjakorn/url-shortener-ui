"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Collection, CreateCollectionRequest } from "@/types";
import { api } from "@/lib/api";

interface CollectionFormProps {
    initialData?: Collection;
    onSubmitSuccess?: () => void;
}

export function CollectionForm({ initialData, onSubmitSuccess }: CollectionFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CreateCollectionRequest>({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
    });

    const isEditMode = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditMode) {
                await api.collections.update(initialData!.id, formData);
            } else {
                await api.collections.create(formData);
            }

            if (onSubmitSuccess) {
                onSubmitSuccess();
            } else {
                router.push("/collections");
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to save collection:", error);
            alert("Failed to save collection");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="My Links"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug (Public URL)</Label>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">/u/</span>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="my-links"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="A collection of my favorite links"
                    rows={4}
                />
            </div>

            <div className="flex items-center gap-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create Collection"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isLoading}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
