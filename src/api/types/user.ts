export type Role = "admin" | "driver" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Profile {
  id: number;
  user_id: number;
  phone?: string;
  address?: string;
  birth_date?: string;
  gender?: "male" | "female" | null;
}

// driver
export interface Driver extends User {
  role: "driver";
}

// user
export interface Customer extends User {
  role: "customer";
}