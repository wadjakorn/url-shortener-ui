"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn, Button } from "@/components/ui/Button"
import { LayoutDashboard, Link as LinkIcon, Plus } from "lucide-react"

export function Navbar() {
    const pathname = usePathname();

    const routes = [
        {
            href: "/",
            label: "Dashboard",
            icon: LayoutDashboard,
            active: pathname === "/",
        },
        {
            href: "/links",
            label: "Links",
            icon: LinkIcon,
            active: pathname === "/links" || pathname.startsWith("/links/"),
        },
    ];

    return (
        <nav className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl mr-8 text-primary">
                    <LinkIcon className="h-6 w-6" />
                    <span>Shortener</span>
                </Link>
                <div className="flex items-center space-x-4 lg:space-x-6 mr-auto">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                                route.active ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <route.icon className="mr-2 h-4 w-4" />
                            {route.label}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center space-x-4 ml-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            // Redirect to backend logout endpoint which clears cookies and redirects back to login
                            window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/auth/logout`;
                        }}
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        </nav>
    )
}
