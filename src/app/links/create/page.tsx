import { LinkForm } from "@/components/links/LinkForm";

export default function CreateLinkPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Link</h1>
                <p className="text-muted-foreground">Shorten a new URL and start tracking clicks.</p>
            </div>
            <LinkForm />
        </div>
    );
}
