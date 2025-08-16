// field harus sama dengan backend
export interface Travel {
  id: number;
  type: "inter_city" | "tourism";
  title: string;
  description?: string | null;
  price: number;
  departure_date: string;
  return_date?: string;
  capacity: number;
}


// Struktur response API generic
export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}