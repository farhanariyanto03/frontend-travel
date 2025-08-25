import { api } from "./types/axios";
import { Driver } from "./types/user";

export const getAllDrivers = async () => {
    const response = await api.get("/driver");
    return response.data;
}

export const getDriverById = async (id: string) => {
    const response = await api.get(`/driver/${id}`);
    return response.data;
}

export const createDriver = async (payload: Omit<Driver, "id" | "created_at" | "updated_at">) => {
    const response = await api.post("/driver", payload);
    return response.data;
}

export const updateDriver = async (id: string, payload: Partial<Omit<Driver, "id" | "created_at" | "updated_at">>) => {
    const response = await api.put(`/driver/${id}`, payload);
    return response.data;
}

export const deleteDriver = async (id: string) => {
    const response = await api.delete(`/driver/${id}`);
    return response.data;
}
