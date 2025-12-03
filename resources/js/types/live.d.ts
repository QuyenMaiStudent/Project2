export interface LiveStream {
    id: number;
    title: string;
    description?: string;
    seller_id: number;
    seller_name: string;
    room_id: string;
    status: 'live' | 'ended' | 'scheduled';
    viewer_count: number;
    started_at?: string;
    ended_at?: string;
    created_at: string;
    updated_at: string;
}

export interface ZegoConfig {
    appID: number; // Đảm bảo là number
    serverSecret: string;
}

export interface ZegoUser {
    userID: string;
    userName: string;
}

export interface ZegoStream {
    streamID: string;
    user: ZegoUser;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}