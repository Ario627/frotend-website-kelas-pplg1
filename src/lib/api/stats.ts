import { apiClient } from './client';

export interface StatsData {
    announcements: number;
    gallery: number;
    members: number;
}

export async function getStats(): Promise<StatsData> {
    const response = await apiClient.get<StatsData>('/stats');
    return response.data;
}
