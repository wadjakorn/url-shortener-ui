import { api } from "@/lib/api";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Link as LinkType } from "@/types";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

interface PublicCollectionPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicCollectionPageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const collection = await api.collections.getPublic(slug);
        if (!collection) {
            return { title: 'Collection Not Found' };
        }
        return {
            title: collection.title,
            description: collection.description || `Collection of links on ${collection.title}`,
            openGraph: {
                title: collection.title,
                description: collection.description || `Collection of links on ${collection.title}`,
                // No images as requested
            }
        };
    } catch (e) {
        return { title: 'Error' };
    }
}

export default async function PublicCollectionPage({ params }: PublicCollectionPageProps) {
    const { slug } = await params;
    const headersList = await headers();
    const referer = headersList.get('referer');
    let collection = null;

    try {
        collection = await api.collections.getPublic(slug);
    } catch (error) {
        console.error("Failed to fetch public collection:", error);
    }

    if (!collection) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-2">Collection Not Found</h1>
                <p className="text-muted-foreground mb-6">The collection you are looking for does not exist or has been removed.</p>
                <Link href="/">
                    <Button variant="outline">Go Home</Button>
                </Link>
            </div>
        );
    }

    // Sort links by current order (assuming backend returns sorted, but just in case)
    // The backend `GetCollectionLinks` already sorts by `sort_order`.
    // The collection.links might be undefined if not populated properly, but my backend changes ensured it.
    const links: LinkType[] = collection.links || [];

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        {collection.title}
                    </h1>
                    {collection.description && (
                        <p className="text-lg text-muted-foreground">
                            {collection.description}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    {links.length > 0 ? (
                        links.map((link) => (
                            <a
                                key={link.id}
                                href={`/open/${link.short_code}${referer ? `?custom_ref=${encodeURIComponent(referer)}` : ''}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <div className="w-full p-4 bg-card border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex items-center justify-between">
                                    <span className="font-medium text-lg pr-4 group-hover:text-primary transition-colors">
                                        {link.title}
                                    </span>
                                    <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="text-center p-8 border border-dashed border-border rounded-lg">
                            <p className="text-muted-foreground">No links available.</p>
                        </div>
                    )}
                </div>

                <div className="text-center pt-8">
                    <Link href="/" className="text-xs text-muted-foreground hover:underline">
                        Powered by Shortener
                    </Link>
                </div>
            </div>
        </div>
    );
}
