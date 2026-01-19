import { Collection, CollectionListResponse, CreateCollectionRequest, CreateLinkPayload, DashboardStats, Link, LinkStats, PaginatedResponse, UpdateLinkPayload } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type RequestOptions = RequestInit & {
    params?: Record<string, string | number | undefined>;
};

async function fetchAPI<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;

    let url = endpoint;
    // Server-side needs absolute URL, Client-side uses relative (Proxy)
    if (typeof window === 'undefined') {
        url = `${API_BASE_URL}${endpoint}`;
    }
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    const isServer = typeof window === 'undefined';
    let headers: HeadersInit = {
        "Content-Type": "application/json",
        ...init.headers,
    };

    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();
        if (cookieHeader) {
            headers = {
                ...headers,
                Cookie: cookieHeader,
            };
        }
    } else {
        init.credentials = 'include';
    }

    // Prevent fetch from following redirects (like to Google Login) automatically
    // This allows us to intercept the redirect and handle it as a 401
    const res = await fetch(url, {
        headers,
        redirect: 'manual',
        ...init,
    });

    // Handle 401 Unauthorized OR manual redirects (indicates auth required)
    if (res.status === 401 || res.type === 'opaqueredirect' || (res.status >= 300 && res.status < 400)) {
        if (isServer) {
            const { redirect } = await import("next/navigation");
            redirect('/login');
        } else {
            window.location.href = '/login';
            return {} as T;
        }
    }

    if (!res.ok) {
        // Try to read text to give a better error message if possible, or just fail
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`API Error: ${res.status} ${text || res.statusText}`);
    }

    if (res.status === 204) {
        return {} as T;
    }

    // but res can be empty or plain text, not always json, should check first.
    try {
        return await res.json();
    } catch (error) {
        return "" as T;
    }
}

export const api = {
    dashboard: {
        get: (limit = 10) => fetchAPI<DashboardStats>("/api/v1/dashboard", { params: { limit } }),
    },
    links: {
        list: (page = 1, limit = 10, search?: string, tag?: string) =>
            fetchAPI<PaginatedResponse<Link>>("/api/v1/links", { params: { page, limit, search, tag } }),
        create: (data: CreateLinkPayload) =>
            fetchAPI<Link>("/api/v1/links", { method: "POST", body: JSON.stringify(data) }),
        update: (id: number, data: UpdateLinkPayload) =>
            fetchAPI<Link>(`/api/v1/links/${id}`, { method: "PUT", body: JSON.stringify(data) }),
        delete: (id: number) =>
            fetchAPI<void>(`/api/v1/links/${id}`, { method: "DELETE" }),
        getStats: (id: number) =>
            fetchAPI<LinkStats>(`/api/v1/links/${id}/stats`),
        getPublic: (code: string) =>
            fetchAPI<Link>(`/api/v1/public/links/${code}`),
        trackVisit: (code: string, customRef?: string) =>
            fetchAPI<void>(`/api/v1/public/links/${code}/track`, { method: "POST", body: JSON.stringify({ custom_ref: customRef }) }),
    },
    collections: {
        list: (page = 1, limit = 10, search?: string) =>
            fetchAPI<CollectionListResponse>("/api/v1/collections", { params: { page, limit, search } }),
        create: (data: CreateCollectionRequest) =>
            fetchAPI<Collection>("/api/v1/collections", { method: "POST", body: JSON.stringify(data) }),
        get: (id: number) =>
            fetchAPI<Collection>(`/api/v1/collections/${id}`),
        update: (id: number, data: CreateCollectionRequest) =>
            fetchAPI<Collection>(`/api/v1/collections/${id}`, { method: "PUT", body: JSON.stringify(data) }),
        delete: (id: number) =>
            fetchAPI<void>(`/api/v1/collections/${id}`, { method: "DELETE" }),
        addLink: (id: number, linkId: number) =>
            fetchAPI<void>(`/api/v1/collections/${id}/links`, { method: "POST", body: JSON.stringify({ link_id: linkId }) }),
        removeLink: (id: number, linkId: number) =>
            fetchAPI<void>(`/api/v1/collections/${id}/links/${linkId}`, { method: "DELETE" }),
        getPublic: (slug: string) =>
            fetchAPI<Collection>(`/u/${slug}`),
    },
};
