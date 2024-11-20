"use client";
import "../../../../globals.css";
import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "../../../../components/ImageUpload_v2";

const ProgramInfo = () => {
  const params = useParams();
  const [programInfo, setProgramInfo] = useState({});
  const [sessionsInfo, setSessionsInfo] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);

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
  useEffect(() => {
    fetchProgramInfo();
  }, []);

  // api starts
  async function fetchProgramInfo() {
    try {
      const result = await fetch(
        `http://localhost:3030/get-program-info/${params.id}`
      );
      const programInfoData = await result.json();
      const sessions_result = await fetch(
        `http://localhost:3030/get-session-info/${programInfoData._id}`
      );
      const sessionsInfoData = await sessions_result.json();
      console.log("sessionsInfoData", sessionsInfoData);
      setProgramInfo(programInfoData);
      setSessionsInfo(sessionsInfoData);
    } catch (err) {
      console.log(`fetchProgramInfo ${err}`);
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

  // 只傳一個session既data入去
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
  const copyToClipboard = (id) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        alert(`Session Id ${id} copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  function toggleSessionEditing(e) {
    const targetSessionIndex = sessionsInfo.findIndex(
      (session) => session._id === e.target.name
    );
    setSessionsInfo((prev) => {
      const updatedSessions = prev.map((session, index) => {
        if (index === targetSessionIndex) {
          return {
            ...session,
            isEditing: !session.isEditing,
            showButton: !session.isEditing,
          };
        }
        if (index !== targetSessionIndex) {
          return {
            ...session,
            showButton: false,
          };
        }
      });
      return updatedSessions;
    });
    if (e.target.name === "cancel") {
      const response = prompt(
        "all unsaved sessions changes will be cancelled, input 'Yes' to confirm"
      );
      response.toLowerCase() === "yes" && fetchProgramInfo();
    }
  }
  function handleUpdateSessionInfo(e) {
    toggleSessionEditing(e);
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
      {programInfo && (
        <>
          {!isEditing ? (
            <button className="btn" onClick={toggleProgramEditing}>
              Edit Program Detail
            </button>
          ) : (
            <>
              <button className="btn" onClick={handleUpdateProgramInfo}>
                Save Program Detail
              </button>
              <button
                className="btn btn-error"
                onClick={toggleProgramEditing}
                name="cancel"
              >
                Cancel
              </button>
            </>
          )}
          <div>
            {_id && (
              <div>
                <div>
                  {!isEditing ? (
                    // Read
                    <>
                      <div>{program_name_zh}</div>
                      <div>{program_type}</div>
                      {program_subtype && (
                        <div>
                          <div>{program_subtype.tag1}</div>
                          <div>{program_subtype.tag2}</div>
                          <div>{program_subtype.tag3}</div>
                        </div>
                      )}
                      <div>{description}</div>
                      <div>{program_notice}</div>
                      <div>{program_price_per_lesson}</div>
                      <div>{lesson_duration}</div>
                      <div>
                        <button className={"btn"} onClick={handleShowImage}>
                          {`${showImage ? "Hide" : "Show"} Program Images`}
                        </button>
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
                      </div>
                    </>
                  ) : (
                    // Update
                    <>
                      <div>
                        <input
                          name="program_name_zh"
                          value={program_name_zh}
                          onChange={handleProgramEdit}
                        />
                      </div>
                      <div>
                        <input
                          name="program_type"
                          value={program_type}
                          onChange={handleProgramEdit}
                        />
                      </div>
                      {program_subtype && (
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
                      )}
                      <div>
                        <input
                          name="description"
                          value={description}
                          onChange={handleProgramEdit}
                        />
                      </div>
                      <div>
                        <input
                          name="program_notice"
                          value={program_notice}
                          onChange={handleProgramEdit}
                        />
                      </div>
                      <div>
                        <input
                          name="program_price_per_lesson"
                          type="text"
                          value={program_price_per_lesson}
                          onChange={handleProgramEdit}
                        />
                      </div>
                      <div>
                        <input
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
                            <button className={"btn"} onClick={handleAddImage}>
                              Add New Image
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
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
              vacancy,
              session_notice,
              session_type,
              vacancy_participant,
              vacancy_timeslot,
              teacher,
              isEditing,
              showButton,
            },
            idx
          ) => {
            const dates = Object.values(session_dates).join(", ");
            return (
              <div key={_id}>
                <p>Session Type: {session_type}</p>
                <p>Teacher: {teacher}</p>
                <p>Dates: {dates}</p>
                <p>Timeslot Vacancy: {vacancy_timeslot}</p>
                <p>Participant Vacancy: {vacancy_participant}</p>
                <p>Session Notice: {session_notice}</p>
                <p>
                  Session Id: {_id}
                  <button
                    className={"btn"}
                    onClick={() => copyToClipboard(_id)}
                  >
                    Copy Session Id
                  </button>
                </p>
                <p>
                  {!isEditing && showButton ? (
                    <button
                      className={"btn"}
                      name={_id}
                      onClick={(e) => toggleSessionEditing(e)}
                    >
                      Edit Session
                    </button>
                  ) : (
                    <>
                      <button
                        className={"btn"}
                        name={_id}
                        onClick={(e) => handleUpdateSessionInfo(e)}
                      >
                        Save Session
                      </button>
                      <button
                        className={"btn btn-error"}
                        name={"cancel"}
                        onClick={(e) => toggleSessionEditing(e)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </p>
                <hr />
              </div>
            );
          }
        )}
    </>
  );
};
export default ProgramInfo;
