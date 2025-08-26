"use client";

import BasicTable, { Column } from "@/components/tables/BasicTableOne";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTravels, deleteTravel } from "@/api/travel";
import { Travel } from "@/api/types/travel";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function TravelPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const successParam = searchParams.get("success");

  // Tampilkan toast kalau berhasil create/update
  useEffect(() => {
    if (successParam) {
      Swal.fire({
        icon: "success",
        title:
          successParam === "created"
            ? "Travel created successfully!"
            : "Travel updated successfully!",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        customClass: {
          popup: "mt-20", // biar gak ketutupan header
        },
        position: "top-end",
        didClose: () => {
          router.replace("/admin/travel"); // hapus query param setelah alert hilang
        },
      });
    }
  }, [successParam, router]);

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
  });

  // Hapus data dengan konfirmasi
  const handleDelete = (row: Travel & { no: number }) => {
    Swal.fire({
      title: `Delete travel "${row.title}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(row.id, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["travels"] });
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Travel deleted successfully.",
              timer: 1500,
              showConfirmButton: false,
              toast: true,
              position: "top-end",
              customClass: {
                popup: "mt-20",
              },
            });
          },
          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Failed!",
              text: "Failed to delete travel. Please try again.",
            });
          },
        });
      }
    });
  };

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
      data: "no",
      render: (_, row) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/travel/edit/${row.id}`}
            className="px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
          >
            Update
          </Link>
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

  // Kondisi loading & error
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <>
      <div className="mb-4 flex justify-start mb-6">
        <Link
          href="/admin/travel/add"
          className="inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          + Create
        </Link>
      </div>
      {travels.length > 0 ? (
        <BasicTable columns={columns} data={travels} />
      ) : (
        <p className="text-center text-gray-500 text-lg py-10">No data available.</p>
      )}
    </>
  );
}

