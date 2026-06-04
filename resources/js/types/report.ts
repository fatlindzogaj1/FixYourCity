export type City = {
    id: number;
    name: string;
};

export type ReportImage = {
    id: number;
    report_id: number;
    image_path: string;
};

export type ReportComment = {
    id: number;
    report_id: number;
    user_id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
};

export type ReportVerification = {
    id: number;
    report_id: number;
    verified_by: number;
    status: 'approved' | 'rejected';
    note: string | null;
    verified_at: string;
    verifier: {
        id: number;
        name: string;
    };
};

export type ReportStatusHistory = {
    id: number;
    report_id: number;
    status: 'pending' | 'verified' | 'rejected' | 'resolved';
    changed_by: number;
    changed_at: string;
    user: {
        id: number;
        name: string;
    };
};

export type Report = {
    id: number;
    user_id: number;
    title: string;
    description: string;
    category: 'trash' | 'road' | 'light' | 'other';
    status: 'pending' | 'verified' | 'rejected' | 'resolved';
    latitude: number;
    longitude: number;
    city_id: number | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
    };
    city?: City | null;
    images?: ReportImage[];
    comments?: ReportComment[];
    verifications?: ReportVerification[];
    status_histories?: ReportStatusHistory[];
    comments_count?: number;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
};

