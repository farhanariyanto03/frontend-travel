"use client"

import ComponentCard from "@/components/common/ComponentCard";
import DatePicker from "@/components/form/date-picker";
import InputField from "@/components/form/input/InputField";
import Radio from "@/components/form/input/Radio";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Link from "next/link";

export default function TravelFormPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
          <ComponentCard title="Create Travel">
            <div className="mt-4 space-y-4">
                <Label>Tiltle</Label>
                <InputField placeholder="Title" />
                <Label>Description</Label>
                <TextArea />
                <Label>Departure Date</Label>
                <DatePicker id="departure_date" placeholder="Departure Date" />
                <Label>Return Date</Label>
                <DatePicker id="return_date" placeholder="Return Date" />
                <Label>Type</Label>
                <div className="flex space-x-4">
                    <Radio id="tourism" name="type" value="tourism" label="Tourism" checked={false} onChange={() => {}}  />
                    <Radio id="inner_city" name="type" value="inner_city" label="Inner City" checked={true} onChange={() => {}} />
                </div>
                <Label>Price</Label>
                <InputField type="number" placeholder="Price" />
                <Label>Capacity</Label>
                <InputField type="number" placeholder="Capacity" />
                <div className="flex space-x-4 justify-center">
                    <Link href="/admin/travel" className="bg-transparent border-2 border-gray-300 text-gray-500 py-3 rounded-xl w-full flex justify-center items-center hover:bg-gray-400 hover:text-white">Cancel</Link>
                    <button className="bg-brand-500 text-white py-3 rounded-xl w-full" type="submit">Create</button>
                </div>
            </div>
        </ComponentCard>
    </div>
  );
}
