import { api } from "@/lib/api";
import { Metadata } from "next";

interface Props {
    params: Promise<{ shortCode: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { shortCode } = await params;
    try {
        const link = await api.links.getPublic(shortCode);
        return {
            title: link.title,
            description: `Link to ${link.original_url}`,
            openGraph: {
                title: link.title,
                description: `Link to ${link.original_url}`,
                type: "website",
            },
            twitter: {
                card: "summary",
                title: link.title,
                description: `Link to ${link.original_url}`,
            }
        };
    } catch (error) {
        return {
            title: "Link Not Found",
        };
    }
}

export default async function OpenLinkPage({ params }: Props) {
    // If Middleware works, we never reach here for valid links.
    // We only reach here if the link was NOT found.
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Link Not Found</h1>
            <p className="text-muted-foreground">The link you are trying to access does not exist.</p>
        </div>
    );
}
