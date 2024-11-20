"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Wilson = () => {
  // const merchantId = "672b7780fa8bcf1cc05e8d01";
  // const programId = "672b78d0fa8bcf1cc05e8d04";
  // const [program, setProgram] = useState({});
  // const [sessions, setSessions] = useState([]);
  // frances merchant id: 672b7780fa8bcf1cc05e8d01
  // andy merchant id: 672ad61e2455c91d8e65852e

  const [value, setValue] = useState("");
  function handleChange(e) {
    const { value } = e.target;
    if (/^(0|[1-9]\d*)(\.\d+)?$/.test(value) || value === "") {
      setValue(value);
    }
  }

  return <input type="text" value={value} onInput={handleChange} />;
};
//   useEffect(() => {
//     fetchProgramInfo();
//   }, []);

//   // 你公司既program info set up
//   async function fetchProgramInfo() {
//     try {
//       const program_result = await fetch(
//         `http://localhost:3030/get-program-info/${programId}`
//       );
//       const programInfo = await program_result.json();
//       const sessions_result = await fetch(
//         `http://localhost:3030/get-session-info/${programInfo._id}`
//       );
//       const sessionsInfo = await sessions_result.json();
//       setProgram(programInfo);
//       setSessions(sessionsInfo);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   function SessionInfo() {
//     return sessions.map(
//       (
//         {
//           _id,
//           session_dates,
//           vacancy,
//           description,
//           session_notice,
//           teacher,
//           program_id,
//         },
//         idx
//       ) => {
//         const dates = Object.values(session_dates);
//         return (
//           <div key={_id}>
//             Teacher: {teacher}
//             <br />
//             Dates: {dates}
//             <br />
//             Vacancy: {vacancy}
//             <br />
//             Description: {description}
//             <br />
//             Session Notice: {session_notice}
//           </div>
//         );
//       }
//     );
//   }

//   return (
//     <>
//       <p>你公司既program</p>
//       {program._id && <p>{program.program_name_zh}</p>}
//       {sessions && <SessionInfo />}
//     </>
//   );
// };

export default Wilson;

// 你公司有咩Participants?
// async function fetchParticipants() {
//   try {
//     const result = await fetch(
//       `http://localhost:3030/all-participants/${merchantId}`
//     );
//     const participantsData = await result.json();
//     console.log("participants fetched");
//     setParticipants(participantsData);
//   } catch (err) {
//     console.log(err);
//   }
// }

// 你公司有咩Program Type?

// function handleOnSelectType(e) {
// console.log(e.target.innerText);
// setSelectedProgram_type(e.target.innerText);
// fetchProgramSubType();
// }

// program sessions set up

// async function fetchProgramType() {
//   try {
//     const result = await fetch(
//       `http://localhost:3030/get-programs-type/${merchantId}`
//     );
//     const programData = await result.json();
//     console.log("ProgramType fetched");
//     setPrograms(programData);
//   } catch (err) {
//     console.log(`ProgramType ${err}`);
//   }
// }
// console.log("participants", participants);

<p>---------------------------我是分隔線-----------------------------</p>;
{
  /* <p>你公司有咩Participants?</p>
  <p>collections: programs, programs_sessions, participants</p>
  <div>
    {participants && (
      <div>
        {participants.map(
          ({ _id, participant_name, telephone_no }, idx) => {
            return (
              <Link href={`/dashboard/participant/${_id}`} key={_id}>
                <div>
                  Name: {participant_name}; Tel: {telephone_no}
                  <hr />
                </div>
              </Link>
            );
          }
        )}
      </div>
    )}
  </div> */
}
{
  /* <p>---------------------------我是分隔線-----------------------------</p> */
}
{
  /* <p>你公司有咩Program Type?</p>
  <p>暫時停左Fetch野</p>
  {programs && (
    <div>
      <ul>
        {programs.map((el, idx) => (
          <li key={idx}>
            <button onClick={handleOnSelectType}>{el}</button>
          </li>
        ))}
      </ul>
    </div>
  )}
  {selectedProgram_type && (
    <div>
      you have selected {selectedProgram_type}, next step filter out related
      program data that should be already fetched.
    </div>
  )} */
}
