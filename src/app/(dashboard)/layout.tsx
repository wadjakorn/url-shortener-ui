import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
                {children}
            </main>
        </>
    );
}
