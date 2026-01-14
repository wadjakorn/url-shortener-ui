export interface Link {
  id: number;
  original_url: string;
  short_code: string;
  title: string;
  tags: string[];
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_system_clicks: number;
  top_links: Link[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface LinkStats {
  total_clicks: number;
  referrers: Record<string, number>;
  daily_clicks: {
    date: string;
    count: number;
  }[];
}

export interface CreateLinkPayload {
  original_url: string;
  title: string;
  tags?: string[];
  custom_code?: string;
}

export interface UpdateLinkPayload {
  title?: string;
  tags?: string[];
}
