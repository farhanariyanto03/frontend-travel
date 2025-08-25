"use client";

import { getAllDrivers } from "@/api/driver";
import { Driver } from "@/api/types/user";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import BasicTable, { Column } from "../../../components/tables/BasicTableOne";

export default function DriverPage() {
  // Fetch drivers data using React Query
  const { 
    data: driversResponse,  // ambil data atau aslias data
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ["drivers"], // key unik untuk cache React Query
    queryFn: () => getAllDrivers()
  });

  // Transform data: add row numbers to each driver
  const driversWithRowNumbers: (Driver & { no: number; phone: string; address: string })[] =
    (driversResponse?.drivers || []).map((driver: Driver, index: number) => ({
      ...driver,
      no: index + 1,
      phone: driver.profile?.phone || "-",
      address: driver.profile?.address || "-",
  }));

  // Define table columns configuration
  const tableColumns: Column<Driver & { no: number, phone: string, address: string }>[] = [
    { label: "No", data: "no" },
    { label: "Name", data: "name" },
    { label: "Email", data: "email" },
    { label: "Phone", data: "phone" },
    { label: "Address", data: "address" },
    {
      label: "Action",
      data: "no",
      render: (_, row) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/travel/edit/${row.id}`}
            className="px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
          >
            Update
          </Link>
        </div>
      ),
    },
  ];

  // Handle loading state
  if (isLoading) {
    return <div className="p-4">Loading drivers...</div>;
  }

  // Handle error state
  if (isError) {
    return <div className="p-4 text-red-500">Error loading drivers data</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header with create button */}
      <div className="flex justify-between items-center">
        <Link
          href="/admin/driver/add"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          + Driver
        </Link>
      </div>

      {/* Drivers table or empty state */}
      {driversWithRowNumbers.length > 0 ? (
        <BasicTable 
          columns={tableColumns} 
          data={driversWithRowNumbers} 
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          No drivers found. Click Add New Driver to create one.
        </div>
      )}
    </div>
  );
}

