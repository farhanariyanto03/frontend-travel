"use client";

import React, { useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import DatePicker from "@/components/form/date-picker";
import InputField from "@/components/form/input/InputField";
import Radio from "@/components/form/input/Radio";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTravelById, updateTravel } from "@/api/travel";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// schema dengan conditional validation
export const TravelFormSchema = z
  .object({
    type: z.enum(["inter_city", "tourism"]),
    city_to: z.string().optional().nullable(),
    city_from: z.string().optional().nullable(),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    departure_date: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Date format must be YYYY-MM-DD",
    }),
    return_date: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
        message: "Date format must be YYYY-MM-DD",
      }),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  })
  .refine(
    (data) =>
      data.type !== "inter_city" ||
      (data.city_from?.trim() && data.city_to?.trim()),
    {
      message: "City From and City To are required for inter city travel",
      path: ["city_from"], // bisa diarahkan ke field city_from
    }
  );

export type TravelFormData = z.infer<typeof TravelFormSchema>;

export default function TravelEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params?.id as string;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(TravelFormSchema),
    defaultValues: {
      title: "",
      description: "",
      departure_date: "",
      return_date: "",
      type: "tourism",
      city_from: "",
      city_to: "",
      price: 0,
      capacity: 1,
    },
  });

  // pantau type
  const selectedType = watch("type");

  // ambil data untuk update
  const { data, isLoading, isError } = useQuery({
    queryKey: ["travel", id],
    queryFn: () => getTravelById(Number(id)),
    enabled: Boolean(id),
  });

  // isi ulang form
  useEffect(() => {
    if (data?.data) {
      reset({
        title: data.data.title ?? "",
        description: data.data.description ?? "",
        departure_date: data.data.departure_date ?? "",
        return_date: data.data.return_date ?? "",
        type: data.data.type ?? "inter_city",
        city_from: data.data.city_from ?? "",
        city_to: data.data.city_to ?? "",
        price: Number(data.data.price ?? 0),
        capacity: Number(data.data.capacity ?? 1),
      });
    }
  }, [data, reset]);

  // mutation untuk update dengan error handling yang lebih baik
  const mutation = useMutation({
    mutationFn: (payload: TravelFormData) => {
      // Ensure city_to and city_from are string or null, never undefined
      const safePayload = {
        ...payload,
        city_to: payload.city_to ?? null,
        city_from: payload.city_from ?? null,
      };
      return updateTravel(Number(id), safePayload);
    },
    onError: (error) => {
      console.error("Error updating travel:", error);
      alert("Failed to update travel. Please try again.");
    },
    onSuccess: () => {
      console.log("Travel updated successfully");
      // setUpdateSuccess(true);
      
      // Invalidate dan refetch data travel
      queryClient.invalidateQueries({ queryKey: ["travels"] });
      queryClient.invalidateQueries({ queryKey: ["travel", id] });

      // Redirect setelah delay untuk user feedback
      // setTimeout(() => {
      //   router.push("/admin/travel");
      // }, 1500);
      
      // Redirect with success parameter like the add page does
      router.push("/admin/travel?success=updated");
    },
  });

  const onSubmit = (formData: TravelFormData) => {
    console.log("Submitting form data:", formData);
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="text-center p-6">Loading travel data...</div>;
  if (isError) return <div className="text-center p-6 text-red-500">Error loading travel data</div>;
  if (!data?.data) return <div className="text-center p-6">Travel not found</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <ComponentCard title="Edit Travel">
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <Label>Title</Label>
          <InputField
            placeholder="Title"
            {...register("title")}
            error={!!errors.title}
            hint={errors.title?.message}
          />

          {/* Description */}
          <Label>Description</Label>
          <TextArea
            {...register("description")}
            className={errors.description ? "border-error-500" : ""}
          />
          {errors.description && (
            <p className="text-xs text-error-500">
              {errors.description.message}
            </p>
          )}

          {/* Departure Date */}
          <Label>Departure Date</Label>
          <Controller
            control={control}
            name="departure_date"
            render={({ field }) => (
              <>
                <DatePicker
                  id="departure_date"
                  placeholder="Departure Date"
                  value={field.value}
                  onChange={(selectedDates, dateStr) => {
                    field.onChange(dateStr);
                  }}
                />
                {errors.departure_date && (
                  <p className="text-xs text-error-500">
                    {errors.departure_date.message}
                  </p>
                )}
              </>
            )}
          />

          {/* Return Date */}
          <Label>Return Date</Label>
          <Controller
            control={control}
            name="return_date"
            render={({ field }) => (
              <>
                <DatePicker
                  id="return_date"
                  placeholder="Return Date"
                  value={field.value}
                  onChange={(selectedDates, dateStr) => {
                    field.onChange(dateStr);
                  }}
                />
                {errors.return_date && (
                  <p className="text-xs text-error-500">
                    {errors.return_date.message}
                  </p>
                )}
              </>
            )}
          />

          {/* Type */}
          <Label>Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div className="flex gap-4">
                <Radio
                  id="tourism"
                  label="Tourism"
                  value="tourism"
                  checked={field.value === "tourism"}
                  onChange={() => field.onChange("tourism")}
                />
                <Radio
                  id="inter_city"
                  label="Inner City"
                  value="inter_city"
                  checked={field.value === "inter_city"}
                  onChange={() => field.onChange("inter_city")}
                />
              </div>
            )}
          />
          {errors.type && (
            <p className="text-xs text-error-500">{errors.type.message}</p>
          )}

          {/* City From & City To hanya muncul kalau inter_city */}
          {selectedType === "inter_city" && (
            <>
              <Label>City From</Label>
              <InputField
                placeholder="City From"
                {...register("city_from")}
                error={!!errors.city_from}
                hint={errors.city_from?.message}
              />

              <Label>City To</Label>
              <InputField
                placeholder="City To"
                {...register("city_to")}
                error={!!errors.city_to}
                hint={errors.city_to?.message}
              />
            </>
          )}

          {/* Price */}
          <Label>Price</Label>
          <InputField
            type="number"
            placeholder="Price"
            {...register("price")}
            error={!!errors.price}
            hint={errors.price?.message}
          />

          {/* Capacity */}
          <Label>Capacity</Label>
          <InputField
            type="number"
            placeholder="Capacity"
            {...register("capacity")}
            error={!!errors.capacity}
            hint={errors.capacity?.message}
          />

          {/* Buttons */}
          <div className="flex space-x-4 justify-center">
            <Link
              href="/admin/travel"
              className="bg-transparent border-2 border-gray-300 text-gray-500 py-3 rounded-xl w-full flex justify-center items-center hover:bg-gray-400 hover:text-white"
            >
              Cancel
            </Link>
            <button
              className="bg-brand-500 text-white py-3 rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={mutation.isPending || isSubmitting}
            >
              {mutation.isPending ? "Updating..." : "Update"}
            </button>
          </div>

          {mutation.isError && (
            <div className="text-center text-red-500 text-sm mt-2">
              Failed to update travel. Please check your connection and try again.
            </div>
          )}
        </form>
      </ComponentCard>
    </div>
  );
}
