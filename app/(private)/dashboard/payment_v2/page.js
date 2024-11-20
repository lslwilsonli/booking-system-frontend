"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  SortedTable,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
    width: "auto",
    margin: "auto",
  },
});

export function AnotherTable({ data, isLoading }) {
  const router = useRouter();

  const rows = Array.isArray(data) ? data : [];
  const [searched, setSearched] = useState("");

  const classes = useStyles();
  console.log(rows[0]);

  // Memoize filteredRows to avoid unnecessary calculations
  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      row.participant_name.toLowerCase().includes(searched.toLowerCase())
    );
  }, [searched, rows]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearched(event.target.value);
  };

  // Table Layout
  return (
    <>
      <Paper>
        <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by name..."
            value={searched}
            onChange={handleSearchChange}
            style={{ marginRight: "8px", flex: 1 }}
          />
          <IconButton aria-label="search">
            <SearchIcon />
          </IconButton>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name and Telephone</TableCell>
                <TableCell align="left">Program Name</TableCell>
                <TableCell align="left">Session Dates</TableCell>
                <TableCell align="left">Payment Status</TableCell>
                <TableCell align="left">Payment Method</TableCell>
                <TableCell align="left">Create Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((datium, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      <span
                        className="hover cursor-pointer text-blue-500 hover:underline"
                        onClick={() =>
                          router.push(
                            `/dashboard/participant/${datium.participant_id}`
                          )
                        }
                      >
                        {datium.participant_name}
                      </span>
                      <br />
                      {datium.telephone_no}
                    </TableCell>
                    <TableCell align="left">{datium.program_name_zh}</TableCell>
                    <TableCell align="left">
                      {new Date(datium.session_dates).toLocaleString()}
                    </TableCell>
                    <TableCell align="left">{datium.payment_status}</TableCell>
                    <TableCell align="left">{datium.payment_method}</TableCell>
                    <TableCell align="left">
                      {new Date(datium.payment_date).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export function SimpleTable({ isLoading, data }) {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState(data); // Manage payment data
  const [selectedParticipant, setSelectedParticipant] = useState(null); // Track the participant being edited
  const [newStatus, setNewStatus] = useState(""); // Track the new payment status selection
  const token = localStorage.getItem("token");

  const handleStatusChange = async (participant_id) => {
    setPaymentData((prevData) =>
      prevData.map((item) => {
        if (item.participant_id === participant_id) {
          return { ...item, payment_status: newStatus || item.payment_status };
        }
        return item;
      })
    );
    const result = await updateDatabase(participant_id, newStatus);
    console.log("React here2", result);

    setSelectedParticipant(null); // Close the dropdown after selection
    setNewStatus(""); // Reset the new status
  };

  async function updateDatabase(participant_id, newStatus) {
    try {
      const response = await fetch(
        "http://localhost:3030/update-payment-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            participant_id,
            payment_status: newStatus, // Pass the new status here
          }),
        }
      ); // Closing the fetch call here
      const res = await response.json();
      if (res.ok) {
        console.log("update React here");
        return res;
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      return null;
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Program Name</th>
            <th>Session Data</th>
            <th>Payment Status</th>
            <th>Payment Method</th>
            <th>Create Time</th>
            <th>Action</th>
          </tr>
        </thead>
        {/* table body */}
        <tbody>
          {paymentData?.map(
            (
              {
                _id,
                participant_name,
                telephone_no,
                program_name_zh,
                session_dates,
                payment_status,
                payment_method,
                payment_date,
                participant_id,
              },
              idx
            ) => (
              <tr key={participant_id} className="hover">
                <td>
                  <span
                    className="hover cursor-pointer text-blue-500 hover:underline"
                    onClick={() =>
                      router.push(`/dashboard/participant/${participant_id}`)
                    }
                  >
                    {participant_name}
                  </span>
                </td>
                <td>{telephone_no}</td>
                <td>{program_name_zh}</td>
                <td>{new Date(session_dates).toLocaleString()}</td>
                <td>{payment_status}</td>
                <td>{payment_method}</td>
                <td>{new Date(payment_date).toLocaleString()}</td>
                <td>
                  <span
                    className="cursor-pointer text-blue-500 hover:underline"
                    onClick={() => setSelectedParticipant(participant_id)}
                  >
                    Change
                  </span>
                  {selectedParticipant === participant_id && (
                    <div className="absolute bg-white border rounded shadow-lg mt-2">
                      <select
                        className="p-2"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        {payment_status !== "pending" && (
                          <option value="pending">pending</option>
                        )}
                        {payment_status !== "completed" && (
                          <option value="completed">completed</option>
                        )}
                        {payment_status !== "received" && (
                          <option value="received">received</option>
                        )}
                      </select>
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => handleStatusChange(participant_id)}
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

const Payment = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getPaymentFromDatabase();
    };
    fetchData();
  }, []);

  const getPaymentFromDatabase = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3030/get-payment-info", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });
      if (res.ok) {
        console.log("Test OK");
        const result = await res.json();
        setData(result);
        setIsLoading(false);
        // console.log(result);
      } else {
        console.log("Fail");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Set loading to false after the fetch
    }
  };

  return (
    <>
      {/* --------------------------------------Page title----------------------------------- */}
      <h1 className="text-3xl mt-4 mb-2">Payment</h1>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/dashboard">Home</Link>
          </li>
          <li>
            <a>Payment</a>
          </li>
        </ul>
      </div>
      {/* --------------------------------分隔個條線--------------------------- */}
      <div className="flex w-full flex-col">
        <div className="divider divider-primary mt-1 mb-1"></div>
      </div>
      {/* -------------------data----------------------------- */}
      {!isLoading &&
        data.map((el, index) => {
          return (
            <div key={index}>
              <p>ID: {el._id.toString()}</p>
              <p>Participant Name: {el.participant_name}</p>
              {/* <p>Telephone No: {el.telephone_no}</p>
              <p>Program Name: {el.program_name_zh}</p>
              <p>Session Data: {new Date(el.session_dates).toLocaleString()}</p>
              <p>Payment Status: {el.payment_status}</p>
              <p>Payment Method: {el.payment_method}</p>
              <p>Create Time: {new Date(el.payment_date).toLocaleString()}</p> */}
            </div>
          );
        })}
      {isLoading && <p>I am loading now</p>}
      {/* {isLoading && <SimpleTable isLoading={loading} data={data} />} */}
      <AnotherTable data={data} isloading={isLoading} />
    </>
  );
};

export default Payment;

// Backup of how to visual the data in frontend
// {isLoading &&
//   data.map((el, index) => {
//     return (
//       <div key={index}>
//         <p>ID: {el._id.toString()}</p>
//         <p>Participant Name: {el.participant_name}</p>
//         <p>Telephone No: {el.telephone_no}</p>
//         <p>Program Name: {el.program_name_zh}</p>
//         {/* <p>Session Data: {el.session_dates}</p> */}
//         <p>Session Data: {new Date(el.session_dates).toLocaleString()}</p>
//         <p>Payment Status: {el.payment_status}</p>
//         <p>Payment Method: {el.payment_method}</p>
//         <p>Create Time: {new Date(el.payment_date).toLocaleString()}</p>
//       </div>
//     );
//   })}
