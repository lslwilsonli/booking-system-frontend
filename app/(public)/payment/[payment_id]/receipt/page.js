"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Payment() {
  const { payment_id } = useParams();
  const [paymentInfo, setPaymentInfo] = useState(null);

  //fetch paymentInfo GET
  const fetchPaymentInfo = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/get-invoice-info`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId: payment_id }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch payment info");
    }
    const data = await response.json();
    console.log(data);
    setPaymentInfo(data);
  };

  useEffect(() => {
    if (payment_id) {
      fetchPaymentInfo();
    }
  }, [payment_id]);

  //format date
  function formatDate(dateString) {
    if (!dateString) {
      return "Please select session";
    }

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      const day = String(date.getDate()).padStart(2, "0"); // Add leading zero to day
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero to month
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0"); // Add leading zero to minutes
      const period = hours >= 12 ? "pm" : "am";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert to 12-hour format
      const weekday = date.toLocaleString("en", { weekday: "short" });

      return `${day}/${month}/${year} ${formattedHours}:${minutes}${period} (${weekday})`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Wrong format";
    }
  }

  return (
    <div className="p-4">
      {/* Step Indicator */}
      <ul className="steps w-full mt-5">
        <li className="step step-primary">Session Selection</li>
        <li className="step step-primary">Fill-in Personal Details</li>
        <li className="step step-primary">Payment</li>
        <li className="step step-primary">Confirm Booking</li>
      </ul>

      {/* Success Message */}
      <div className="text-center my-12">
        <h1 className="text-2xl font-bold mb-2">
          Congratulations,{" "}
          <span className="text-primary italic">
            {paymentInfo?.participant_name}
          </span>{" "}
          !
        </h1>
        <h2 className="text-xl font-bold mb-4">Your enrollment is confirmed</h2>
        <div className="bg-base-100">
          <p className="badge badge-neutral badge-outline text-base p-5">
            Please save this receipt for your records
          </p>
        </div>
      </div>

      {/* Receipt Card */}
      <div className="card bg-base-100 shadow-xl lg:mx-72 mx-4 ">
        {/* Receipt Header */}
        <div className="card-body p-0">
          <div className="bg-primary text-primary-content p-5 rounded-t-md text-center">
            {/* <h3 className="font-bold text-lg">Enrollment Receipt</h3> */}
            <p className="text-lg font-bold">
              Order ID:{" "}
              <span className="text-base-100 text-xl">{payment_id}</span>
            </p>
          </div>

          {/* Receipt Content */}
          <div className="p-6 space-y-6 px-10">
            {paymentInfo && (
              <>
                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm opacity-75">Student Name</div>
                    <div className="font-semibold">
                      {paymentInfo.participant_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm opacity-75">Contact Number</div>
                    <div className="font-semibold">
                      {paymentInfo.telephone_no}
                    </div>
                  </div>
                </div>

                {/* Program Details */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm opacity-75">Program</div>
                    <div className="font-semibold">
                      {paymentInfo.program_name_zh}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm opacity-75">Duration</div>
                    <div className="font-semibold">
                      {paymentInfo.lesson_duration / 60 > 1
                        ? `${paymentInfo.lesson_duration / 60} hours`
                        : `${paymentInfo.lesson_duration / 60} hour`}
                      <span className="text-sm text-gray-500 italic">
                        {" "}
                        / per lesson
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Dates */}
                <div>
                  <div className="text-sm opacity-75 mb-2">
                    Session Schedule
                  </div>
                  <div className="space-y-1">
                    {paymentInfo.session_dates.map((date, i) => (
                      <div key={i} className="font-semibold flex items-center">
                        <span className="badge badge-neutral badge-sm mr-2">
                          {i + 1}
                        </span>
                        {formatDate(date)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="divider"></div>

                {/* Payment Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm opacity-75">
                    <span>Payment Status</span>
                    <span className="badge badge-success">
                      {paymentInfo.payment_status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm opacity-75">
                    <span>Payment Method</span>
                    <span className="pr-2">
                      {paymentInfo.payment_method.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg pt-2">
                    <span>Total Amount</span>
                    <span className="text-neutal">
                      HK ${paymentInfo.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Receipt Footer */}
          <div className="bg-base-200 p-4 text-center text-sm rounded-b-md">
            <p>Thank you for choosing our program!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
