"use client"

import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import InputField from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useState } from "react";


export default function AddDriverPage() {
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <ComponentCard title="Create Driver">
        <form className="mt-4 space-y-4" onSubmit={() => {}}>
          {/* Title */}
          <Label>Name</Label>
          <InputField
            placeholder="Name"
          />

          {/* email */}
          <Label>Email</Label>
          <InputField
            placeholder="Email"
          />

          {/* password */}
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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

          {/* confirm password */}
          <Label>Confirm Password</Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter your confirm password"
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

          {/* telp */}
          <Label>Phone</Label>
          <Input
            placeholder="Phone"
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
            //   disabled={mutation.isPending || isSubmitting}
            >
              Create
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}