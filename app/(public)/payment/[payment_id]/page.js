"use client";
import React from "react";
import { useParams } from "next/navigation";
import ImageUpload_Payment from "@/app/components/ImageUpload_Payment";

export default function Payment() {
  const { payment_id } = useParams();

  //POST Payment
  const handleImageUpload = async (image) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("payment_id", payment_id);

      const response = await fetch("http://localhost:3030/api/upload", {
        // Add full URL
        method: "POST",
        body: formData,
        // Remove any JSON headers since we're sending FormData
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      return data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  return (
    <div className="p-4">
      <div className="text-lg font-semibold mb-4">Payment ID: {payment_id}</div>

      {/* Step Indicator */}
      <ul className="steps w-full mt-5">
        <li className="step step-primary">Session Selection</li>
        <li className="step step-primary">Fill-in Personal Details</li>
        <li className="step step-primary">Payment</li>
        <li className="step">Confirm Booking</li>
      </ul>

      {/* Payment Method */}
      <div className="form-control mt-6">
        <label className="label cursor-pointer flex flex-row border rounded-[30px] px-5 py-5 mb-2 bg-white hover:bg-slate-100 ease-in-out duration-300 items-start">
          <span className="label-text">FPS Payment</span>
          <input
            type="radio"
            name="radio-10"
            className="radio checked:bg-blue-500"
            checked
            readOnly
          />
        </label>
      </div>

      {/* Upload Photo */}
      <ImageUpload_Payment
        onImageUpload={handleImageUpload}
        label="Upload Payment Proof"
        required={true}
        maxSizeMB={5}
        className="max-w-md mx-auto mt-6"
      />

      {/* Buttons */}
      <div className="btn-container flex flex-col gap-5 my-5 lg:mx-32">
        <button className="btn btn-block btn-neutral">Confirm Payment</button>
        <button className="btn btn-block">Back</button>
      </div>
    </div>
  );
}
