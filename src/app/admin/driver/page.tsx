"use client";

import { getAllDrivers, deleteDriver } from "@/api/driver";
import { Driver } from "@/api/types/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import BasicTable, { Column } from "../../../components/tables/BasicTableOne";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import Loading from "@/components/ui/loading/page";

export default function DriverPage() {
  // Navigation and URL parameter hooks
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  // Extract success parameter from URL for showing success messages
  const successMessage = searchParams.get("success");

  /**
   * Display success notifications based on URL parameters
   * Shows toast notifications for create/update operations
   */
  useEffect(() => {
    if (successMessage) {
      const title = successMessage === "created" 
        ? "Driver created successfully!" 
        : "Driver updated successfully!";
      
      Swal.fire({
        icon: "success",
        title,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        customClass: { popup: "mt-20" },
        didClose: () => {
          // Clean URL by removing success parameter
          window.location.href = "/admin/driver";
        },
      });
    }
  }, [successMessage]);

  /**
   * Fetch all drivers data using React Query
   * Provides automatic caching, loading states, and error handling
   */
  const {
    data: driversResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["drivers"], // Unique cache key
    queryFn: getAllDrivers, // API function to fetch data
  });

  /**
   * Transform driver data for table display
   * Adds row numbers and flattens nested profile data
   */
  const transformedDrivers = (driversResponse?.drivers || []).map(
    (driver: Driver, index: number) => ({
      ...driver,
      no: index + 1, // Add sequential row number
      phone: driver.profile?.phone || "-", // Extract phone from profile
      address: driver.profile?.address || "-", // Extract address from profile
    })
  );

  /**
   * Delete driver mutation
   * Handles driver deletion with automatic cache invalidation
   */
  const deleteMutation = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      // Refresh the drivers list after successful deletion
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      
      // Show success notification
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Driver deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        customClass: { popup: "mt-20" },
      });
    },
    onError: () => {
      // Show error notification if deletion fails
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to delete driver. Please try again.",
        confirmButtonText: "OK",
      });
    },
  });

  /**
   * Handle driver deletion with confirmation dialog
  */
  const handleDeleteDriver = (driver: Driver) => {
    Swal.fire({
      title: `Delete driver "${driver.name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(driver.id.toString());
      }
    });
  };

  /**
   * Table column configuration
   * Defines how data should be displayed in the table
   */
  const tableColumns: Column<Driver & { no: number; phone: string; address: string }>[] = [
    { label: "No", data: "no" },
    { label: "Name", data: "name" },
    { label: "Email", data: "email" },
    { label: "Phone", data: "phone" },
    { label: "Address", data: "address" },
    {
      label: "Action",
      data: "no",
      render: (_, driver) => (
        <div className="flex gap-2">
          {/* Edit button */}
          <Link
            href={`/admin/driver/edit/${driver.id}`}
            className="px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs transition-colors"
          >
            Update
          </Link>
          
          {/* Delete button */}
          <button
            onClick={() => handleDeleteDriver(driver)}
            className="px-4 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs transition-colors"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  // Loading state
  if (isLoading) return <Loading />;

  // Error state
  if (isError) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-red-500">
          Error loading drivers data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1> */}
        
        <Link
          href="/admin/driver/add"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          + Add Driver
        </Link>
      </div>

      {/* Drivers table or empty state */}
      {transformedDrivers.length > 0 ? (
        <BasicTable 
          columns={tableColumns} 
          data={transformedDrivers} 
        />
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No drivers found
          </div>
          <div className="text-gray-400">
            Click Add Driver to create your first driver
          </div>
        </div>
      )}
    </div>
  );
}

