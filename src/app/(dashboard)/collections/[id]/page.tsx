import { api } from "@/lib/api";
import { CollectionForm } from "@/components/collections/CollectionForm";
import { CollectionLinksEditor } from "@/components/collections/CollectionLinksEditor";
import { Collection } from "@/types";

interface EditCollectionPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
    const { id } = await params;
    let collection: Collection | null = null;

    try {
        collection = await api.collections.get(parseInt(id));
    } catch (error) {
        console.error("Failed to fetch collection:", error);
    }

    if (!collection) {
        return <div>Collection not found</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Collection</h1>
                <p className="text-muted-foreground mt-2">Manage settings and links for "{collection.title}".</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                    <div className="border border-border rounded-lg p-6 bg-card">
                        <h2 className="text-lg font-semibold mb-4">Settings</h2>
                        <CollectionForm initialData={collection} />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="border border-border rounded-lg p-6 bg-card">
                        <CollectionLinksEditor collection={collection} />
                    </div>
                </div>
            </div>
        </div>
    );
}
