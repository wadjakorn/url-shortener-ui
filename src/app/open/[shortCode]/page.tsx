import { api } from "@/lib/api";
import { Metadata } from "next";
import RedirectClient from "./RedirectClient";

interface Props {
    params: Promise<{ shortCode: string }>;
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
    const { shortCode } = await params;

    try {
        const link = await api.links.getPublic(shortCode);
        return <RedirectClient code={shortCode} destination={link.original_url} />;
    } catch (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Link Not Found</h1>
                <p className="text-muted-foreground">The link you are trying to access does not exist.</p>
            </div>
        );
    }
}
