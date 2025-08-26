"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import InputField from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getDriverById, createDriver, updateDriver } from "@/api/driver";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";

// Schema validation with Zod
export const DriverFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isCreate = !window.location.pathname.includes('/edit/');
    
    // For create mode: password is required
    if (isCreate && (!data.password || data.password.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required",
        path: ["password"],
      });
      return;
    }
    
    // If password is provided, validate it
    if (data.password && data.password.length > 0) {
      // Check minimum length
      if (data.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters",
          path: ["password"],
        });
      }
      
      // Check password confirmation
      if (data.password !== data.password_confirmation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match",
          path: ["password_confirmation"],
        });
      }
    }
  });

export type DriverFormData = z.infer<typeof DriverFormSchema>;

export default function DriverFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const isUpdate = Boolean(id);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(DriverFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone: "",
      address: "",
    },
  });

  // Fetch driver data if updating
  const { data, isLoading } = useQuery({
    queryKey: ["driver", id],
    queryFn: () => getDriverById(id!),
    enabled: isUpdate,
  });

  // Populate form with existing data
  useEffect(() => {
    if (data?.driver && isUpdate) {
      reset({
        name: data.driver.name ?? "",
        email: data.driver.email ?? "",
        phone: data.driver.profile?.phone ?? "",
        address: data.driver.profile?.address ?? "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [data, isUpdate, reset]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: (payload: DriverFormData) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const driverPayload: any = {
        name: payload.name,
        email: payload.email,
        role: "driver",
        phone: payload.phone || null,
        address: payload.address || null,
      };

      // Only include password fields if password is provided and not empty
      if (payload.password && payload.password.trim().length > 0) {
        driverPayload.password = payload.password;
        driverPayload.password_confirmation = payload.password_confirmation;
      }

      return isUpdate
        ? updateDriver(id!, driverPayload)
        : createDriver(driverPayload);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Error saving driver:", error);
      
      // Show error message
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || `Failed to ${isUpdate ? 'update' : 'create'} driver`,
        icon: "error",
        confirmButtonText: "OK"
      });
    },
    onSuccess: () => {
      // Clear form on successful create
      if (!isUpdate) {
        reset();
      }
      
      // Redirect with success parameter
      router.push(
        isUpdate
          ? "/admin/driver?success=updated"
          : "/admin/driver?success=created"
      );
    },
  });

  const onSubmit = (formData: DriverFormData) => {
    mutation.mutate(formData);
  };

  if (isUpdate && isLoading) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <ComponentCard title={isUpdate ? "Edit Driver" : "Create Driver"}>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <Label>Name</Label>
          <InputField
            placeholder="Driver Name"
            {...register("name")}
            error={!!errors.name}
            hint={errors.name?.message}
          />

          {/* Email */}
          <Label>Email</Label>
          <InputField
            type="email"
            placeholder="driver@example.com"
            {...register("email")}
            error={!!errors.email}
            hint={errors.email?.message}
          />

          {/* Password */}
          <Label>
            Password{" "}
            {isUpdate 
              ? "(Leave blank to keep current password)" 
              : "*Required"
            }
          </Label>
          <div className="relative">
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder={isUpdate ? "Leave blank to keep current" : "Enter password"}
              {...register("password")}
              error={!!errors.password}
              hint={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer z-10"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <Label>
            Confirm Password
            {isUpdate && " (Only if changing password)"}
          </Label>
          <div className="relative">
            <InputField
              type={showConfirmPassword ? "text" : "password"}
              placeholder={isUpdate ? "Confirm new password" : "Confirm password"}
              {...register("password_confirmation")}
              error={!!errors.password_confirmation}
              hint={errors.password_confirmation?.message}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer z-10"
            >
              {showConfirmPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
              )}
            </button>
          </div>

          {/* Phone */}
          <Label>Phone</Label>
          <InputField
            placeholder="Phone number"
            {...register("phone")}
            error={!!errors.phone}
            hint={errors.phone?.message}
          />

          {/* Address */}
          <Label>Address</Label>
          <InputField
            placeholder="Driver address"
            {...register("address")}
            error={!!errors.address}
            hint={errors.address?.message}
          />

          {/* Buttons */}
          <div className="flex space-x-4 justify-center">
            <Link
              href="/admin/driver"
              className="bg-transparent border-2 border-gray-300 text-gray-500 py-3 rounded-xl w-full flex justify-center items-center hover:bg-gray-400 hover:text-white"
            >
              Cancel
            </Link>
            <button
              className="bg-brand-500 text-white py-3 rounded-xl w-full"
              type="submit"
              disabled={mutation.isPending || isSubmitting}
            >
              {isUpdate ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}