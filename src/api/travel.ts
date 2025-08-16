import { api } from './types/axios';
import { ApiResponse, Travel } from "./types/travel";


// get all travel
export const getTravels = async (): Promise<ApiResponse<Travel[]>> => {
  const res = await api.get("/travel");
  return res.data;
};

// get travel by id
export const getTravelById = async (id:number): Promise<ApiResponse<Travel>> => {
    const res = await api.get(`admin/travel/${id}`)
    return res.data;
}

// create travel
export const createTravel = async (payload: Omit<Travel, "id">) => {
    const res = await api.post("admin/travel", payload);
    return res.data;
}

// update travel by id
export const updateTravel = async (id:number, payload: Omit<Travel, "id">) => {
    const res = await api.put(`admin/travel/${id}`, payload);
    return res.data;
}

// delete travel by id
export const deleteTravel = async (id: number) => {
  const res = await api.delete(`/admin/travel/${id}`);
  return res.data;
};