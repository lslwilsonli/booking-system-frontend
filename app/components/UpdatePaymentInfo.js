"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const UpdatePaymentInfo = ({ userData, onUpdateUserData }) => {
  const [newFPSNumber, setNewFPSNumber] = useState("");
  const [newPayMeNumber, setNewPayMeNumber] = useState("");
  const [FPSError, setFPSError] = useState("");
  const [PayMeError, setPayMeError] = useState("");

  const router = useRouter();
  const token = localStorage.getItem("token");
  const handleOnChange = (ev) => {
    const { name, value } = ev.target;
    if (name === "fps") {
      setNewFPSNumber(value);
      console.log(newFPSNumber);
    } else if (name === "payme") {
      setNewPayMeNumber(value);
      console.log(newPayMeNumber);
    }
  };

  const handleFPSOnSubmit = async () => {
    setNewFPSNumber("");
    let FPSerr = "";
    if (!newFPSNumber) {
      FPSerr = "FPS number cannot be empty";
    }

    if (!FPSerr) {
      try {
        const res = await fetch(
          "http://localhost:3030/update-payment-details",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fpsNumber: newFPSNumber,
              username: userData.merchant_username,
            }),
          }
        );
        setFPSError("Successful to update FPS number");
        setNewFPSNumber("");
      } catch (error) {
        console.log(error);
      }
    } else {
      setFPSError(FPSerr);
    }
  };

  const handlePayMeOnSubmit = async () => {
    setPayMeError("");
    let PayMeErr = "";
    if (!newPayMeNumber) {
      PayMeErr = "PayMe number cannot be empty";
    }

    if (!PayMeErr) {
      try {
        const res = await fetch(
          "http://localhost:3030/update-payment-details",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payMeNumber: newPayMeNumber,
              username: userData.merchant_username,
            }),
          }
        );

        if (res.ok) {
          setPayMeError("Successfully updated PayMe number");
          setNewPayMeNumber("");
        } else {
          setPayMeError("Failed to update PayMe number");
        }
      } catch (error) {
        console.log(error);
        setPayMeError("Database Error");
      }
    } else {
      setPayMeError(PayMeErr);
    }
  };

  return (
    <>
      <div className="flex-col">
        <div>Update Payment Details</div>
        <div>
          <p>New FPS Number</p>
          <input
            name="fps"
            value={newFPSNumber}
            onChange={handleOnChange}
            className="input input-bordered input-sm w-full max-w-xs mr-2"
            placeholder="Enter you FPS number here"
          />
          {FPSError && <div style={{ color: "red" }}>{FPSError}</div>}
          <button
            className="btn mt-2"
            type="button"
            onClick={handleFPSOnSubmit}
          >
            Update FPS
          </button>
        </div>
        <div>
          <p>New PayMe Number</p>
          <input
            name="payme"
            value={newPayMeNumber}
            onChange={handleOnChange}
            className="input input-bordered input-sm w-full max-w-xs mr-2"
            placeholder="Enter you PayMe number here"
          />
          {PayMeError && <div style={{ color: "red" }}>{PayMeError}</div>}
          <button
            className="btn mt-2"
            type="button"
            onClick={handlePayMeOnSubmit}
          >
            Update PayMe
          </button>
        </div>
      </div>
    </>
  );
};
export default UpdatePaymentInfo;
