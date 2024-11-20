"use client";
import "../../../../globals.css";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const ParticipantInfo = () => {
  const params = useParams();
  const token = localStorage.getItem("token");
  const [participant, setParticipant] = useState({});
  const [programDataPackage, setProgramDataPackage] = useState([]);
  const { _id, participant_name, telephone_no, isEditing, merchants_remarks } =
    participant;
  const [sessionIds, setSessionIds] = useState([""]);

  if (!token) {
    alert("No authorization token found.");
    return;
  }

  useEffect(() => {
    fetchParticipants();
  }, []);

  async function fetchParticipants() {
    try {
      const result = await fetch(`http://localhost:3030/all-participants`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const participantsData = await result.json();
      const participantData = participantsData.filter(
        (participant) => participant._id === params.id
      );

      const sessionResult = await fetch(
        "http://localhost:3030/get-programId-by-sessionId",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(participantData[0].enrolled_session_id),
        }
      );
      //_id: 1, program_id: 1, session_dates: 1
      const sessionResultWithProgramId = await sessionResult.json();

      if (participantData.length > 0) {
        setParticipant(participantData[0]);
      } else {
        alert("Participant not found.");
      }
      setProgramDataPackage(sessionResultWithProgramId);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateParticipantInfo() {
    try {
      const updateResult = await fetch(
        `http://localhost:3030/update-participant-info`,
        {
          method: "POST",
          body: JSON.stringify({
            _id,
            participant_name,
            telephone_no,
            merchants_remarks,
          }),
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`, // 确保授权头正确
          },
        }
      );

      const response = await updateResult.json();

      if (response.success) {
        alert("Participant info updated successfully!");
      } else {
        alert("Failed to update participant info.");
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred while updating participant info.");
    }
  }

  function toggleParticipantEditing(e) {
    setParticipant((prev) => ({
      ...prev,
      isEditing: !prev.isEditing,
    }));
    if (e.target.name === "cancel") {
      fetchParticipants();
    }
  }

  function handleUpdateParticipantInfo() {
    const response = prompt(
      "Confirm to update? No revert can be made (input 'yes' if confirm))"
    );
    if (response && response.toLowerCase() === "yes") {
      alert("saved updated changes");
      setParticipant((prev) => ({
        ...prev,
        isEditing: !prev.isEditing,
      }));
    }
    updateParticipantInfo();
  }

  function handleParticipantEdit(e) {
    const { name, value } = e.target;

    // 如果是普通字段（例如 participant_name, telephone_no 等），直接更新它
    if (name && !name.startsWith("remarks_")) {
      setParticipant((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // 如果是 merchants_remarks 字段（备注），直接更新备注
    if (name === "merchants_remarks") {
      setParticipant((prev) => ({
        ...prev,
        merchants_remarks: value, // 直接更新备注内容
      }));
    }
  }

  const addSessionId = () => {
    setSessionIds([...sessionIds, ""]);
  };

  const removeSessionId = () => {
    if (sessionIds.length > 1) {
      setSessionIds(sessionIds.slice(0, sessionIds.length - 1));
    }
  };

  const handleSessionInputChange = (index, value) => {
    setSessionIds((prevSessionIds) => {
      const newSessionIds = [...prevSessionIds];
      newSessionIds[index] = value;
      return newSessionIds;
    });
  };

  return (
    <>
      {/* --------------------------------------Page title----------------------------------- */}
      <h1 className="text-3xl mt-4 mb-2">Participant Detail Page</h1>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="../../dashboard">Home</Link>
          </li>
          <li>
            <Link href="../participant">Participant</Link>
          </li>
          <li>
            <a>Participant Detail</a>
          </li>
        </ul>
      </div>
      {/* --------------------------------分隔個條線--------------------------- */}
      <div className="flex w-full flex-col">
        <div className="divider divider-primary mt-1 mb-1"></div>
      </div>

      {/* ---------------------------------parti detail------------------------- */}

      <div className="flex justify-center">
        <div className="mt-6 stats stats-vertical shadow w-10/12">
          <div className="stat">
            {!isEditing
              ? //read
                _id && (
                  <div key={_id}>
                    <div className="flex mb-2 items-center justify-between">
                      <div className="flex">
                        <p className="w-24 infoTitle">Name:</p>
                        <p> {participant_name}</p>
                      </div>

                      {!isEditing ? (
                        <button
                          className="btn w-16"
                          onClick={toggleParticipantEditing}
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <div className="flex">
                            <button
                              className="btn"
                              onClick={handleUpdateParticipantInfo}
                            >
                              Save
                            </button>

                            <button
                              className="btn"
                              onClick={toggleParticipantEditing}
                              name="cancel"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex mb-4">
                      <p className="w-24 infoTitle">Tel:</p>
                      <p> {telephone_no}</p>
                    </div>
                    <div className="flex items-top mb-4">
                      <p className="w-24 infoTitle">remarks:</p>
                      <div>
                        {merchants_remarks && <div>{merchants_remarks}</div>}
                      </div>
                    </div>
                  </div>
                )
              : //update
                _id && (
                  <div key={_id}>
                    <div className="flex mb-2 items-center justify-between">
                      <div className="flex">
                        <p className="w-36 infoTitle">Name:</p>
                        <input
                          name="participant_name"
                          value={participant_name}
                          onChange={handleParticipantEdit}
                          className="input input-bordered input-sm w-full max-w-xs mb-1"
                        />
                      </div>

                      {!isEditing ? (
                        <button
                          className="btn w-16"
                          onClick={toggleParticipantEditing}
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <div className="flex">
                            <button
                              className="btn mr-2"
                              onClick={handleUpdateParticipantInfo}
                            >
                              Save
                            </button>
                            <button
                              className="btn"
                              onClick={toggleParticipantEditing}
                              name="cancel"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex mb-4">
                      <p className="w-24 infoTitle">Tel:</p>
                      <input
                        name="telephone_no"
                        value={telephone_no}
                        onChange={handleParticipantEdit}
                        className="input input-bordered input-sm w-60 max-w-xs mb-1"
                      />
                    </div>
                    <div className="flex items-top mb-4">
                      <p className="w-24 infoTitle">remarks:</p>
                      <div>
                        <textarea
                          name="merchants_remarks" // 使用统一的 name
                          value={merchants_remarks || ""} // 显示当前的备注内容
                          onChange={handleParticipantEdit} // 更新备注内容
                          className="textarea textarea-bordered w-96 !important"
                        />
                      </div>
                    </div>
                  </div>
                )}
          </div>
          {/* -----------------------------------add session----------------------------------- */}
          <div className="flex mt-2 mb-2 justify-between">
            <div className="ml-6">
              <div className="flex items-center mb-4 mt-3">
                <div className="w-24 infoTitle mr-2">Enrolled Session:</div>
                <button
                  className="btn ml-1 mt-1 mb-1 w-12"
                  onClick={addSessionId}
                >
                  +
                </button>
                <button
                  className="btn ml-1 mt-1 mb-1 w-12"
                  onClick={removeSessionId}
                >
                  -
                </button>
              </div>
              <div id="container" className="mb-2">
                {sessionIds.map((sessionId, index) => (
                  <div key={index}>
                    <input
                      className="input input-bordered input-sm w-full max-w-xs mb-1"
                      type="text"
                      value={sessionId}
                      placeholder={`Session Id ${index + 1}`}
                      onChange={(e) =>
                        handleSessionInputChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              className="btn w-16 mr-6 mt-4"
              onClick={() => handleSubmit()}
            >
              Create
            </button>
          </div>

          <div className="stat">
            {programDataPackage.length > 0 &&
              programDataPackage.map(({ programInfo, sessionInfo }) => {
                return (
                  <div key={programInfo._id + "-" + sessionInfo._id}>
                    <div className="flex items-center justify-between">
                      <p className="infoTitle">Program Name:</p>
                      <button className="btn w-16">Remove</button>
                    </div>
                    <p className="mb-3 ml-10 mt-2">
                      {programInfo.program_name_zh}
                    </p>
                    <p className="infoTitle mb-4">Session Date:</p>
                    <p className="ml-10 mt-2">{sessionInfo.session_dates}</p>
                    <div className="divider"></div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
export default ParticipantInfo;
