export type TravelType = "inner_city" | "tourism";

// field harus sama dengan backend
export interface Travel {
    id: number;
    type: TravelType;
    title: string;
    description: string;
    departure_date: string;
    return_date: string;
    price: number;
    capacity: number;
    created_at?: string;
    updated_at?: string;
}

// Struktur response API generic
export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}