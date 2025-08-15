import axios from "axios";

// Membuat instance axios agar baseURL dan headers konsisten
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api", // URL backend Laravel
  headers: {
    "Content-Type": "application/json", // Kirim data JSON
  },
});
