"use client";

import BasicTable, { Column } from "@/components/tables/BasicTableOne";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTravels, deleteTravel } from "@/api/travel";
import { Travel } from "@/api/types/travel";
import Link from "next/link";

export default function TravelPage() {
  const queryClient = useQueryClient();

  // Ambil data travel dari API pakai React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["travels"], // Key cache React Query
    queryFn: getTravels,   // Fungsi ambil data dari API
  });

  // Tambahkan nomor urut ke setiap item travel
  const travels: (Travel & { no: number })[] =
    (data?.data || []).map((t: Travel, i: number) => ({
      ...t,
      no: i + 1,
    }));

  // Mutation untuk delete
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTravel(id),
    onError: (error) => {
      console.error("Error deleting travel:", error);
      alert("Failed to delete travel. Please try again.");
    },
    onSuccess: () => {
      // Refetch data setelah delete berhasil
      queryClient.invalidateQueries({ queryKey: ["travels"] });
      alert("Travel deleted successfully!");
    },
  });

  // Definisi kolom tabel
  const columns: Column<Travel & { no: number }>[] = [
    { label: "No", data: "no" },
    { label: "Title", data: "title" },
    { label: "Description", data: "description" },
    { label: "Departure Date", data: "departure_date" },
    { label: "Return Date", data: "return_date" },
    {
      label: "Type",
      data: "type",
      render: (value) => (
        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      label: "Price",
      data: "price",
    },
    { label: "Capacity", data: "capacity" },
    {
      label: "Actions",
      data: "no", // Hanya placeholder supaya type Column<T> tidak error
      // Render tombol Update & Delete
      render: (_, row) => (
        <div className="flex gap-2">
          <a
            href={`/admin/travel/edit/${row.id}`}
            className="px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
          >
            Update
          </a>
          <button
            onClick={() => handleDelete(row)}
            disabled={deleteMutation.isPending}
            className="px-4 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  // Hapus data dengan implementasi API call
  const handleDelete = (row: Travel & { no: number }) => {
    if (confirm(`Are you sure you want to delete travel "${row.title}"?`)) {
      console.log("Deleting travel:", row);
      deleteMutation.mutate(row.id);
    }
  };

  // Kondisi loading & error
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <>
      <div className="mb-4 flex justify-start">
          <Link
            href="/admin/travel/add"
            className="inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            + Create
          </Link>
      </div>
      <BasicTable columns={columns} data={travels} />
    </>
  );
}

