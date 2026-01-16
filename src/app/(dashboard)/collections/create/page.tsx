import { CollectionForm } from "@/components/collections/CollectionForm";

export default function CreateCollectionPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Collection</h1>
                <p className="text-muted-foreground mt-2">Create a new collection to group your links.</p>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
                <CollectionForm />
            </div>
        </div>
    );
}
