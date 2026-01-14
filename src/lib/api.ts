import { CreateLinkPayload, DashboardStats, Link, LinkStats, PaginatedResponse, UpdateLinkPayload } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type RequestOptions = RequestInit & {
    params?: Record<string, string | number | undefined>;
};

async function fetchAPI<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;

    let url = `${API_BASE_URL}${endpoint}`;
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

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...init.headers,
        },
        ...init,
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    if (res.status === 204) {
        return {} as T;
    }

    return res.json();
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
    },
};
