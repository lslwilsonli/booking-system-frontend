"use client";
import "../../../../globals.css";
import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "../../../../components/ImageUpload_v2";

const ProgramInfo = () => {
  const params = useParams();

  // program
  const [programInfo, setProgramInfo] = useState({});
  const [showImage, setShowImage] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);
  // sessions
  const [sessionsInfo, setSessionsInfo] = useState([]);
  const [sessionAdding, setSessionAdding] = useState(false);
  const [newSessionInfo, setNewSessionInfo] = useState({
    session_type: "",
    teacher: "",
    session_dates: [isoDateFunction()],
    vacancy_timeslot: 0,
    vacancy_participant: 0,
    session_notice: "",
  });
  const [sessionCreateError, setSessionCreateError] = useState("");
  const [sessionCreateSuccess, setSessionCreateSuccess] = useState("");
  const [sessionUpdating, setSessionUpdating] = useState(false);
  const [sessionUpdateError, setSessionUpdateError] = useState("");
  const [sessionUpdateSuccess, setSessionUpdateSuccess] = useState("");

  const {
    _id,
    program_name_zh,
    program_type,
    program_subtype,
    description,
    program_notice,
    program_price_per_lesson,
    lesson_duration,
    program_image,
    isEditing,
  } = programInfo;

  const {
    session_type,
    teacher,
    session_dates,
    vacancy_timeslot,
    vacancy_participant,
    session_notice,
  } = newSessionInfo;

  useEffect(() => {
    fetchProgramInfo();
  }, []);

  // api starts
  async function fetchProgramInfo() {
    let programInfoData;
    try {
      const result = await fetch(
        `http://localhost:3030/get-program-info/${params.id}`
      );
      programInfoData = await result.json();
    } catch (err) {
      console.log(`fetchProgramInfo ${err}`);
    }
    try {
      const sessions_result = await fetch(
        `http://localhost:3030/get-session-info/${programInfoData._id}`
      );
      const sessionsInfoData = await sessions_result.json();
      setProgramInfo(programInfoData);
      setSessionsInfo(sessionsInfoData);
    } catch (err) {
      console.log(`fetchSessionInfo ${err}`);
    }
  }

  async function createSessionInfo() {
    try {
      const createSession = await fetch(
        "http://localhost:3030/create-session-info",
        {
          method: "POST",
          body: JSON.stringify({
            ...newSessionInfo,
            program_id: programInfo._id,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      setSessionCreateSuccess("create session successfully");
    } catch (err) {
      setSessionCreateError("create session failed");
    }
  }
  async function updateProgramInfo() {
    try {
      const updateResult = await fetch(
        `http://localhost:3030/update-program-info`,
        {
          method: "POST",
          body: JSON.stringify({
            programInfo,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function updateSessionInfo() {
    try {
      const updateResult = await fetch(
        `http://localhost:3030/update-session-info`,
        {
          method: "POST",
          body: JSON.stringify({
            sessionsInfo,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  // api ends

  // Sessions function starts
  function isoDateFunction() {
    const today = new Date();

    // 獲取當前日期和時間，格式化為不帶秒數的字串
    const year = today.getUTCFullYear();
    const month = String(today.getUTCMonth() + 1).padStart(2, "0"); // 月份從0開始
    const day = String(today.getUTCDate()).padStart(2, "0");
    const hours = String(today.getUTCHours()).padStart(2, "0");
    const minutes = String(today.getUTCMinutes()).padStart(2, "0");

    // 組合成 ISO 格式字串
    const isoDate = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
    return isoDate;
  }

  function newSessionInfoInitialization() {
    setSessionCreateError("");
    setSessionCreateSuccess("");
    setNewSessionInfo({
      session_type: "",
      teacher: "",
      session_dates: [isoDateFunction()],
      vacancy_timeslot: 0,
      vacancy_participant: 0,
      session_notice: "",
    });
  }

  function toggleCreateSessionEditing(e) {
    const { name } = e.target;
    setSessionAdding((prev) => !prev);
    newSessionInfoInitialization();
    if (e.target?.name === "cancel") {
      newSessionInfoInitialization();
    }
  }

  function handleCreateSessionInfo(e) {
    let sessionTypeError = false;
    try {
      if (
        !session_type ||
        !teacher ||
        session_dates.length === 0 ||
        !session_notice
      ) {
        setSessionCreateError("Please input all fields");
        sessionTypeError = true;
        return;
      }
      if (session_type === "timeslot" && session_dates.length > 1) {
        setSessionCreateError(
          "Only 1 session date can be added for type of timeslot"
        );
        setSessionCreateSuccess("");
        sessionTypeError = true;
      }
    } catch (err) {
      console.log("session type error");
    }
    if (sessionTypeError) return;
    try {
      createSessionInfo();
      setSessionCreateSuccess("Created Session Successfully");
      fetchProgramInfo();
      setSessionAdding((prev) => !prev);
    } catch (err) {
      console.log("failed to create session");
    }
  }

  function handleCreateSessionEdit(e) {
    const { name, value } = e.target;
    console.log("name", name);
    console.log("value", value);

    // session_type, teacher, session_notice
    if (
      name === "session_type" ||
      name === "teacher" ||
      name === "session_notice"
    ) {
      setNewSessionInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (name === "vacancy_timeslot" || name === "vacancy_participant") {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        alert("Please enter a valid non-negative decimal number");
      }
      if (numValue > 0 || value === "") {
        setNewSessionInfo((prev) => ({
          ...prev,
          [name]: numValue,
        }));
      }
    }
    // session_dates: [isoDateFunction()],
    //   vacancy_timeslot: 0,
    //   vacancy_participant: 0,
  }
  console.log("newSessionInfo", newSessionInfo);
  // Function to handle date changes for new session
  function handleNewDateChange(e, index) {
    const newDate = e.target.value; // Get the user-inputted date
    console.log("newDate", newDate);
    setNewSessionInfo((prev) => {
      const updatedDates = [...prev.session_dates];
      updatedDates[index] = `${newDate}T${updatedDates[index].split("T")[1]}`; // Combine new date with existing time
      return {
        ...prev,
        session_dates: updatedDates,
      };
    });
  }

  // Function to handle time changes for new session
  function handleNewTimeChange(e, index) {
    const newTime = e.target.value; // Get the user-inputted time
    setNewSessionInfo((prev) => {
      const updatedDates = [...prev.session_dates];
      const datePart = updatedDates[index].split("T")[0]; // Get existing date part
      updatedDates[index] = `${datePart}T${newTime}:00.000Z`; // Combine date with new time
      return {
        ...prev,
        session_dates: updatedDates,
      };
    });
  }

  // Function to handle adding a new date input for the new session
  function handleAddNewSessionDate() {
    setNewSessionInfo((prev) => ({
      ...prev,
      session_dates: [...prev.session_dates, isoDateFunction()], // Add current date
    }));
  }

  // Function to handle removing a date from the new session
  function handleRemoveNewSessionDate(index) {
    if (newSessionInfo.session_dates.length === 1) {
      setSessionCreateError(
        "This is the last session date; at least 1 date is required."
      );
      return;
    }
    setNewSessionInfo((prev) => {
      const updatedDates = [...prev.session_dates];
      updatedDates.splice(index, 1); // Remove specified date
      return {
        ...prev,
        session_dates: updatedDates,
      };
    });
  }

  function copyToClipboard(id) {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        alert(`Session Id ${id} copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }

  function toggleUpdateSessionEditing(e) {
    setSessionUpdating((prev) => !prev);
    setSessionsInfo((prev) => {
      const updatedSessions = prev.map((session) => {
        return {
          ...session,
          isEditing: !session.isEditing,
        };
      });
      return updatedSessions;
    });
    if (e.target.name === "cancel") {
      // const response = prompt(
      //   "all unsaved sessions changes will be cancelled, input 'Yes' to confirm"
      // );
      // response?.toLowerCase() === "yes" && fetchProgramInfo();
      setSessionUpdateSuccess("");
      setSessionUpdateError("");
      fetchProgramInfo();
    }
  }

  function handleUpdateSessionInfo(e) {
    toggleUpdateSessionEditing(e);
    setSessionUpdateSuccess("");
    setSessionUpdateError("");
    try {
      let sessionTypeError = false;
      sessionsInfo.forEach((session) => {
        if (
          session.session_type === "timeslot" &&
          session.session_dates.length > 1
        ) {
          setSessionUpdateError(
            "Only 1 session date can be added for type of timeslot"
          );
          setSessionUpdateSuccess("");
          sessionTypeError = true;
        }
      });
      if (sessionTypeError) return;
      updateSessionInfo();
      setSessionUpdateSuccess("Updated Session Successfully");
    } catch (err) {
      console.log("failed to update session");
    }
  }

  function handleUpdateSessionEdit(e, sessionId) {
    const { name, value } = e.target;

    // data validation
    const numValue = Number(value);
    if (name === "vacancy_timeslot" || name === "vacancy_participant") {
      if (isNaN(numValue)) {
        console.log("check");
        alert("Please enter a valid non-negative decimal number");
        return;
      }
    }

    const targetSessionIndex = sessionsInfo.findIndex(
      (session) => session._id === sessionId
    );

    setSessionsInfo((prev) => {
      const updatedSessions = prev.map((session, index) => {
        // session_type, teacher, session_notice
        if (index === targetSessionIndex) {
          if (
            name === "teacher" ||
            name === "session_type" ||
            name === "session_notice"
          ) {
            return {
              ...session,
              [name]: value,
            };
          }
          // vacancy_timeslot, vacancy_participant
          if (name === "vacancy_timeslot" || name === "vacancy_participant") {
            if (!isNaN(numValue) && (numValue > 0 || value === "")) {
              return {
                ...session,
                [name]: numValue,
              };
            }
          }
        }
        if (index !== targetSessionIndex) {
          return {
            ...session,
          };
        }
      });
      return updatedSessions;
    });
  }

  function handleDateChange(e, sessionId, index) {
    const newDate = e.target.value; // 獲取用戶輸入的日期
    setSessionsInfo((prev) =>
      prev.map((session) => {
        if (session._id === sessionId) {
          const updatedDates = [...Object.values(session.session_dates)];
          updatedDates[index] = `${newDate}T${
            updatedDates[index].split("T")[1]
          }`; // 保留時間部分與新的日期結合
          return {
            ...session,
            session_dates: updatedDates,
          };
        }
        return session; // 返回未改變的 session
      })
    );
  }

  function handleTimeChange(e, sessionId, index) {
    const newTime = e.target.value; // 獲取用戶輸入的時間
    setSessionsInfo((prev) =>
      prev.map((session) => {
        if (session._id === sessionId) {
          const updatedDates = [...Object.values(session.session_dates)];
          const datePart = updatedDates[index].split("T")[0]; // 獲取原本的日期部分
          // 組合成 ISO 格式，補全秒數和毫秒
          updatedDates[index] = `${datePart}T${newTime}:00.000Z`;
          return {
            ...session,
            session_dates: updatedDates,
          };
        }
        return session; // 返回未改變的 session
      })
    );
  }

  function handleRemoveSessionDate(sessionId, index, session_dates) {
    if (session_dates.length === 1) {
      alert("this is the last session, at least 1 session for 1 program");
      return;
    }
    setSessionsInfo((prev) =>
      prev.map((session) => {
        if (session._id === sessionId) {
          const updatedDates = [...Object.values(session.session_dates)];
          updatedDates.splice(index, 1); // 刪除指定的日期
          return {
            ...session,
            session_dates: updatedDates,
          };
        }
        return session; // 返回未改變的 session
      })
    );
  }

  function handleAddSessionDate(sessionId) {
    const isoDate = isoDateFunction();
    console.log("isoDate", isoDate);
    setSessionsInfo((prev) =>
      prev.map((session) => {
        if (session._id === sessionId) {
          const updatedDates = [...Object.values(session.session_dates)];
          updatedDates.push(isoDate); // 將當前日期添加到 session_dates
          return {
            ...session,
            session_dates: updatedDates,
          };
        }
        return session; // 返回未改變的 session
      })
    );
  }

  // Session function ends

  // Program function starts
  function toggleProgramEditing(e) {
    setProgramInfo((prev) => ({
      ...prev,
      isEditing: !prev.isEditing,
    }));
    if (e.target.name === "cancel") {
      fetchProgramInfo();
    }
  }

  function handleUpdateProgramInfo() {
    const response = prompt(
      "Confirm to update? No revert can be made (input 'yes' if confirm))"
    );
    if (response && response.toLowerCase() === "yes") {
      alert("saved updated changes");
      setProgramInfo((prev) => ({
        ...prev,
        isEditing: !prev.isEditing,
      }));
    }
    updateProgramInfo();
  }

  function handleProgramEdit(e) {
    const { name, value } = e.target;

    // lesson_duration or program_price_per_lesson
    if (name === "lesson_duration" || name === "program_price_per_lesson") {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        alert("Please enter a valid non-negative decimal number");
      }
      if (numValue > 0 || value === "") {
        setProgramInfo((prev) => ({
          ...prev,
          [name]: numValue,
        }));
      }
      return;
    }

    // program_image
    if (name.includes("program_image")) {
      const keys = name.split("+");
      const arrayIndex = parseInt(keys[1]);

      setProgramInfo((prev) => ({
        ...prev,
        [keys[0]]: prev[keys[0]].map((image, index) =>
          // if index === arrayIndex, update value,
          // if index !== arrayIndex, check image.length > 0, > 0 => image, < 0 => placeholder
          index === arrayIndex
            ? value
            : image.length > 0
            ? image
            : `https://via.placeholder.com/150?text=Placeholder`
        ),
      }));
      return;
    }

    // program_subtype
    if (name.includes(".")) {
      const keys = name.split(".");
      setProgramInfo((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      }));
      return;
    }

    // program_name_zh, program_type, description, program_notice
    if (name) {
      setProgramInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleShowImage() {
    setShowImage((prev) => !prev);
  }

  function handleRemoveImage(e) {
    if (programInfo.program_image.length === 1) {
      alert("this is the last image, at least 1 image for 1 program");
      return null;
    }
    const response = prompt('Delete Image: Input "Yes" to confirm');
    if (
      response &&
      response.toLowerCase() === "yes" &&
      programInfo.program_image.length > 1
    ) {
      setProgramInfo((prev) => ({
        ...prev,
        program_image: prev.program_image.filter(
          (_, idx) => idx !== parseInt(e.target.name, 10)
        ),
      }));
    }
  }

  function handleAddImage() {
    setProgramInfo((prev) => ({
      ...prev,
      program_image: [...prev.program_image, ""],
    }));
  }

  // update program image

  function handleUploadImage() {
    setUploadImage((prev) => !prev);
  }

  // Program function ends

  return (
    <>
      {/* Program */}
      {/* --------------------------------------Page title----------------------------------- */}
      <h1 className="text-3xl mt-4 mb-2">Program Detail Page</h1>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="../../dashboard">Home</Link>
          </li>
          <li>
            <Link href="../program">Program</Link>
          </li>
          <li>
            <a>Program Detail</a>
          </li>
        </ul>
      </div>
      {/* --------------------------------分隔個條線--------------------------- */}
      <div className="flex w-full flex-col">
        <div className="divider divider-primary mt-1 mb-1"></div>
      </div>
      {/* --------------------------------program detail--------------------------- */}
      <div className="flex justify-center">
        <div className="mt-6 stats stats-vertical shadow w-10/12">
          {programInfo && (
            <>
              <div className="relative">
                {/* -------------------------------EDIT---------------------------------- */}
                {!isEditing ? (
                  <button
                    className="btn absolute top-5 right-5"
                    onClick={toggleProgramEditing}
                  >
                    Edit Program Detail
                  </button>
                ) : (
                  <div className="relative">
                    <div className="absolute top-5 right-5">
                      <button className="btn" onClick={handleUpdateProgramInfo}>
                        Save
                      </button>
                      <button
                        className="btn btn-error"
                        onClick={toggleProgramEditing}
                        name="cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {/* ------------------------------program detail list------------------------------ */}
                {_id && (
                  <div>
                    <div className="m-6">
                      {!isEditing ? (
                        // Read
                        <>
                          <div className="flex">
                            <p className="w-28 infoTitle mb-3">Program Name:</p>
                            <p>{program_name_zh}</p>
                          </div>
                          <div className="flex">
                            <p className="w-28 infoTitle mb-3">Program Type:</p>
                            <p>{program_type}</p>
                          </div>
                          {/* {program_subtype && (
                            <p>
                              <p>{program_subtype.tag1}</p>
                              <p>{program_subtype.tag2}</p>
                              <p>{program_subtype.tag3}</p>
                            </p>
                          )} */}
                          <div className="flex">
                            <p className="w-28 infoTitle mb-3">Description:</p>
                            <p className="w-128 mb-3">{description}</p>
                          </div>
                          <div className="flex">
                            <p className="w-28 infoTitle mb-3">
                              Program Notice:
                            </p>
                            <p>{program_notice}</p>
                          </div>
                          <div className="flex">
                            <p className="w-44 infoTitle mb-3">
                              Program Price Per Lesson:
                            </p>
                            <p>${program_price_per_lesson}</p>
                          </div>
                          <div className="flex">
                            <p className="w-44 infoTitle mb-3">
                              {`Lesson Duration: (mins)`}
                            </p>
                            <p>{lesson_duration}mins</p>
                          </div>
                          {/* -----------------image button-------------------- */}
                          <div>
                            <button
                              className={"btn mt-2 mr-2 mb-2"}
                              onClick={handleShowImage}
                            >
                              {`Program Images`}
                            </button>
                            <button
                              className={"btn"}
                              onClick={handleUploadImage}
                            >
                              {`Upload Program Images`}
                            </button>
                            <div className="flex flex-wrap">
                              {program_image.length > 0 &&
                                showImage &&
                                program_image.map((image, idx) => {
                                  return (
                                    <img
                                      className="h-48"
                                      key={idx}
                                      src={
                                        image ||
                                        "https://via.placeholder.com/150?text=Placeholder"
                                      }
                                    />
                                  );
                                })}
                            </div>
                            {uploadImage && <ImageUpload />}
                          </div>
                        </>
                      ) : (
                        // Update
                        <>
                          <div className="flex">
                            <p className="w-28 infoTitle">Program Name:</p>
                            <input
                              className="input input-bordered input-sm w-full max-w-xs mb-1"
                              name="program_name_zh"
                              value={program_name_zh}
                              onChange={handleProgramEdit}
                            />
                          </div>
                          <div className="flex">
                            <p className="w-28 infoTitle">Program Type:</p>
                            <input
                              className="input input-bordered input-sm w-full max-w-xs mb-1"
                              name="program_type"
                              value={program_type}
                              onChange={handleProgramEdit}
                            />
                          </div>
                          {/* {program_subtype && (
                            <div>
                              <div>
                                <input
                                  name="program_subtype.tag1"
                                  value={program_subtype.tag1}
                                  onChange={handleProgramEdit}
                                />
                              </div>
                              <div>
                                <input
                                  name="program_subtype.tag2"
                                  value={program_subtype.tag2}
                                  onChange={handleProgramEdit}
                                />
                              </div>
                              <div>
                                <input
                                  name="program_subtype.tag3"
                                  value={program_subtype.tag3}
                                  onChange={handleProgramEdit}
                                />
                              </div>
                            </div>
                          )} */}
                          <div className="flex">
                            <p className="w-28 infoTitle">Description:</p>
                            <div>
                              <textarea
                                name="description" // 使用统一的 name
                                value={description} // 显示当前的备注内容
                                onChange={handleProgramEdit} // 更新备注内容
                                className="textarea textarea-bordered w-128 !important"
                              />
                            </div>
                          </div>
                          <div className="flex">
                            <p className="w-28 infoTitle">Program Notice:</p>
                            <input
                              className="input input-bordered input-sm w-full max-w-xs mb-1"
                              name="program_notice"
                              value={program_notice}
                              onChange={handleProgramEdit}
                            />
                          </div>
                          <div className="flex">
                            <p className="w-40 infoTitle">
                              Program Price Per Lesson:
                            </p>
                            <input
                              className="input input-bordered input-sm w-2/12 max-w-xs mb-1"
                              name="program_price_per_lesson"
                              type="text"
                              value={program_price_per_lesson}
                              onChange={handleProgramEdit}
                            />
                          </div>
                          <div className="flex">
                            <p className="w-40 infoTitle">
                              {`Lesson Duration: (mins)`}
                            </p>
                            <input
                              className="input input-bordered input-sm w-2/12 max-w-xs mb-1"
                              name="lesson_duration"
                              value={lesson_duration}
                              onChange={handleProgramEdit}
                              type="text"
                            />
                          </div>
                          <div>
                            <button className={"btn"} onClick={handleShowImage}>
                              {`${showImage ? "Hide" : "Show"} Program Images`}
                            </button>
                            {program_image.length > 0 &&
                              showImage &&
                              program_image.map((image, idx) => {
                                return (
                                  <Fragment key={idx}>
                                    {
                                      <img
                                        key={idx}
                                        src={
                                          image ||
                                          "https://via.placeholder.com/150?text=Placeholder"
                                        }
                                      />
                                    }
                                    <input
                                      name={`program_image+${idx}`}
                                      value={
                                        image ||
                                        "https://via.placeholder.com/150?text=Placeholder"
                                      }
                                      onChange={handleProgramEdit}
                                    />
                                    <button
                                      className={"btn"}
                                      onClick={handleRemoveImage}
                                      name={`${idx}`}
                                    >
                                      Remove Image
                                    </button>
                                  </Fragment>
                                );
                              })}
                            {showImage && (
                              <div>
                                <button
                                  className={"btn"}
                                  onClick={handleAddImage}
                                >
                                  Add New Image
                                </button>
                              </div>
                            )}
                          </div>
                          <button className={"btn"} onClick={handleUploadImage}>
                            {`${
                              uploadImage ? "Hide Upload" : "Show Upload"
                            } Program Images`}
                          </button>
                          {program_image.length > 0 &&
                            showImage &&
                            program_image.map((image, idx) => {
                              return (
                                <img
                                  key={idx}
                                  src={
                                    image ||
                                    "https://via.placeholder.com/150?text=Placeholder"
                                  }
                                />
                              );
                            })}
                          {uploadImage && <ImageUpload />}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {/* ------------------Session----------------- */}
          {/* -----------------Session Create Button-------------------- */}
          <div>
            {/* {!sessionAdding ? (
              <div>
                <button className="btn" onClick={toggleCreateSessionEditing}>
                  Add Session
                </button>
              </div>
            ) : (
              <div>
                <button className="btn" onClick={handleCreateSessionInfo}>
                  Save Session
                </button>
                <button
                  className="btn error"
                  name="cancel"
                  onClick={(e) => toggleCreateSessionEditing(e)}
                >
                  Cancel
                </button>
                System Message:{" "}
                {(sessionCreateSuccess && sessionCreateSuccess) ||
                  (sessionCreateError && sessionCreateError) ||
                  "None"}
              </div>
            )}
            {sessionAdding && (
              <div>
                <div>
                  Session Type:
                  <select
                    value={session_type}
                    onChange={(e) => handleCreateSessionEdit(e)}
                    name="session_type"
                  >
                    <option disabled defaultValue value="">
                      Select a type
                    </option>
                    <option value="participant">participant</option>
                    <option value="timeslot">timeslot</option>
                  </select>
                </div>
                <div>
                  Teacher:{" "}
                  <input
                    name="teacher"
                    value={teacher}
                    onChange={(e) => handleCreateSessionEdit(e)}
                  />
                </div>
                <div>
                  Dates:
                  {session_dates.map((date, index) => {
                    const [datePart, timePart] = date.split("T");
                    return (
                      <div key={index}>
                        <input
                          type="date"
                          value={datePart}
                          onChange={(e) => handleNewDateChange(e, index)}
                        />
                        <input
                          type="time"
                          value={timePart.split(".")[0]} // ignore ms
                          onChange={(e) => handleNewTimeChange(e, index)}
                        />
                        <button
                          className="btn"
                          onClick={() => handleRemoveNewSessionDate(index)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                  <button
                    className="btn"
                    onClick={(e) => handleAddNewSessionDate(e)}
                  >
                    Add New Session
                  </button>
                </div>
                {session_type === "timeslot" && (
                  <>
                    <div>
                      Timeslot Vacancy:{" "}
                      <input
                        name="vacancy_timeslot"
                        value={vacancy_timeslot}
                        onChange={(e) => handleCreateSessionEdit(e)}
                      />
                    </div>
                    <div>
                      Participant Vacancy:{" "}
                      <input
                        name="vacancy_participant"
                        value={vacancy_participant}
                        onChange={(e) => handleCreateSessionEdit(e)}
                      />
                    </div>
                  </>
                )}
                {session_type === "participant" && (
                  <>
                    <div>
                      Participant Vacancy:{" "}
                      <input
                        name="vacancy_participant"
                        value={vacancy_participant}
                        onChange={(e) => handleCreateSessionEdit(e)}
                      />
                    </div>
                  </>
                )}
                <div>
                  Session Notice:{" "}
                  <input
                    name="session_notice"
                    value={session_notice}
                    onChange={(e) => handleCreateSessionEdit(e)}
                  />
                </div>
              </div>
            )} */}
            <div>
              <button className="btn" onClick={handleCreateSessionInfo}>
                Create Session
              </button>
            </div>
            <div>
              <div>
                Session Type:
                <select
                  value={session_type}
                  onChange={(e) => handleCreateSessionEdit(e)}
                  name="session_type"
                  className="select select-bordered w-full max-w-xs select-sm"
                >
                  <option disabled defaultValue value="">
                    Select a type
                  </option>
                  <option value="participant">participant</option>
                  <option value="timeslot">timeslot</option>
                </select>
              </div>
              <div>
                Teacher:
                <input
                  name="teacher"
                  value={teacher}
                  onChange={(e) => handleCreateSessionEdit(e)}
                  className="input input-bordered input-sm w-full max-w-xs mb-1"
                />
              </div>
              <button
                className="btn"
                onClick={(e) => handleAddNewSessionDate(e)}
              >
                Add New Session
              </button>
              <div>
                Dates:
                {session_dates.map((date, index) => {
                  const [datePart, timePart] = date.split("T");
                  return (
                    <div key={index}>
                      <input
                        type="date"
                        value={datePart}
                        onChange={(e) => handleNewDateChange(e, index)}
                        className="input input-bordered input-sm w-56 max-w-xs mb-1"
                      />
                      <input
                        type="time"
                        value={timePart.split(".")[0]} // ignore ms
                        onChange={(e) => handleNewTimeChange(e, index)}
                        className="input input-bordered input-sm w-56 max-w-xs mb-1"
                      />
                      <button
                        className="btn"
                        onClick={() => handleRemoveNewSessionDate(index)}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
              {session_type === "timeslot" && (
                <>
                  <div>
                    Timeslot Vacancy:{" "}
                    <input
                      name="vacancy_timeslot"
                      value={vacancy_timeslot}
                      onChange={(e) => handleCreateSessionEdit(e)}
                    />
                  </div>
                  <div>
                    Participant Vacancy:{" "}
                    <input
                      name="vacancy_participant"
                      value={vacancy_participant}
                      onChange={(e) => handleCreateSessionEdit(e)}
                    />
                  </div>
                </>
              )}
              {session_type === "participant" && (
                <>
                  <div>
                    Participant Vacancy:{" "}
                    <input
                      name="vacancy_participant"
                      value={vacancy_participant}
                      onChange={(e) => handleCreateSessionEdit(e)}
                    />
                  </div>
                </>
              )}
              <div>
                Session Notice:{" "}
                <input
                  name="session_notice"
                  value={session_notice}
                  onChange={(e) => handleCreateSessionEdit(e)}
                  className="input input-bordered input-sm w-full max-w-xs mb-1"
                />
              </div>
              System Message:{" "}
              {(sessionCreateSuccess && sessionCreateSuccess) ||
                (sessionCreateError && sessionCreateError) ||
                "None"}
            </div>
          </div>

          {/* Session Edit Button */}
          <div>
            {!sessionUpdating ? (
              <button className="btn" onClick={toggleUpdateSessionEditing}>
                Edit Session Detail
              </button>
            ) : (
              <>
                <button className="btn" onClick={handleUpdateSessionInfo}>
                  Save Session Detail
                </button>
                <button
                  className="btn btn-error"
                  name="cancel"
                  onClick={toggleUpdateSessionEditing}
                >
                  Cancel
                </button>
                <div>
                  System Message:{" "}
                  {(sessionUpdateSuccess && sessionUpdateSuccess) ||
                    (sessionUpdateError && sessionUpdateError) ||
                    "None"}
                </div>
              </>
            )}
            {/* Session */}
            {sessionsInfo &&
              sessionsInfo.map(
                (
                  {
                    _id,
                    session_dates,
                    session_notice,
                    session_type,
                    vacancy_participant,
                    vacancy_timeslot,
                    numberOfParticipant,
                    availableSeats,
                    teacher,
                    isEditing,
                  },
                  idx
                ) => {
                  const dates = Object.values(session_dates).join(", ");
                  {
                    if (!isEditing) {
                      return (
                        <div key={_id}>
                          <div>Session Type: {session_type}</div>
                          <div>Teacher: {teacher}</div>
                          <div>Dates: {dates}</div>
                          {session_type === "timeslot" && (
                            <div>Timeslot Vacancy: {vacancy_timeslot}</div>
                          )}
                          <div>Participant Vacancy: {vacancy_participant}</div>
                          <div>
                            Number of Enrolled Participant(s):{" "}
                            {numberOfParticipant}
                          </div>
                          <div>
                            Available Seats:{" "}
                            {availableSeats !== 0 ? (
                              availableSeats
                            ) : (
                              <span className="text-red-500">
                                {availableSeats}
                              </span>
                            )}
                          </div>
                          <div>Session Notice: {session_notice}</div>
                          <div>
                            Session Id: {_id}
                            <button
                              className={"btn"}
                              onClick={() => copyToClipboard(_id)}
                            >
                              Copy Session Id
                            </button>
                          </div>
                          <hr />
                        </div>
                      );
                    }
                    if (isEditing) {
                      return (
                        <div key={_id}>
                          <div>
                            Session Type:{" "}
                            <select
                              value={session_type}
                              onChange={(e) => handleUpdateSessionEdit(e, _id)}
                              name="session_type"
                            >
                              <option value="participant">participant</option>
                              <option value="timeslot">timeslot</option>
                            </select>
                          </div>
                          <div>
                            Teacher:{" "}
                            <input
                              name="teacher"
                              value={teacher}
                              onChange={(e) => handleUpdateSessionEdit(e, _id)}
                            />
                          </div>
                          <div>
                            Dates:
                            {session_dates.map((date, index) => {
                              const [datePart, timePart] = date.split("T");
                              return (
                                <div key={index}>
                                  <input
                                    type="date"
                                    value={datePart}
                                    onChange={(e) =>
                                      handleDateChange(e, _id, index)
                                    }
                                  />
                                  <input
                                    type="time"
                                    value={timePart.split(".")[0]} // ignore ms
                                    onChange={(e) =>
                                      handleTimeChange(e, _id, index)
                                    }
                                  />
                                  <button
                                    className="btn"
                                    onClick={() =>
                                      handleRemoveSessionDate(
                                        _id,
                                        index,
                                        session_dates
                                      )
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              );
                            })}
                            <button
                              className="btn"
                              onClick={() => handleAddSessionDate(_id)}
                            >
                              Add New Session
                            </button>
                          </div>
                          {vacancy_timeslot && (
                            <div>
                              Timeslot Vacancy:{" "}
                              <input
                                name="vacancy_timeslot"
                                value={vacancy_timeslot}
                                onChange={(e) =>
                                  handleUpdateSessionEdit(e, _id)
                                }
                              />
                            </div>
                          )}
                          <div>
                            Participant Vacancy:{" "}
                            <input
                              name="vacancy_participant"
                              value={vacancy_participant}
                              onChange={(e) => handleUpdateSessionEdit(e, _id)}
                            />
                          </div>
                          <div>
                            Number of Enrolled Participant(s):{" "}
                            {numberOfParticipant}
                          </div>
                          <div>
                            Available Seats: N/A when session is updating
                          </div>
                          <div>
                            Session Notice:{" "}
                            <input
                              name="session_notice"
                              value={session_notice}
                              onChange={(e) => handleUpdateSessionEdit(e, _id)}
                            />
                          </div>
                          <div>
                            Session Id: {_id}
                            <button
                              className={"btn"}
                              onClick={() => copyToClipboard(_id)}
                            >
                              Copy Session Id
                            </button>
                          </div>
                          <hr />
                        </div>
                      );
                    }
                  }
                }
              )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ProgramInfo;
