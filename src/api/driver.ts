import { api } from "./types/axios";

export const getAllDrivers = async () => {
    const response = await api.get("/driver");
    return response.data;
}

export const getDriverById = async (id: string) => {
    const response = await api.get(`/driver/${id}`);
    return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createDriver = async (payload: any) => {
    const response = await api.post("/driver", payload);
    return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateDriver = async (id: string, payload: any) => {
    const response = await api.put(`/driver/${id}`, payload);
    return response.data;
}

export const deleteDriver = async (id: string) => {
    const response = await api.delete(`/driver/${id}`);
    return response.data;
}
