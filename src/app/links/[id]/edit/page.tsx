import { LinkForm } from "@/components/links/LinkForm";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditLinkPage({ params }: PageProps) {
    const { id } = await params;
    let link;

    try {
        // Try direct fetch first
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/links/${id}`);
        if (res.ok) {
            link = await res.json();
        } else {
            // Fallback: Fetch list and find by ID (since API might not support GET /links/{id})
            // We'll fetch a larger page size to increase chance of finding it, or implement search if possible.
            // But search guide says "search by title or URL", not ID.
            // We'll try fetching list with a decent limit.
            const listRes = await api.links.list(1, 100);
            link = listRes.data.find((l: any) => l.id === Number(id));

            if (!link) {
                notFound();
            }
        }
    } catch (error) {
        console.error("Error fetching link:", error);
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Link</h1>
                <p className="text-muted-foreground">Update link details and settings.</p>
            </div>
            <LinkForm initialData={link} isEditing />
        </div>
    );
}
