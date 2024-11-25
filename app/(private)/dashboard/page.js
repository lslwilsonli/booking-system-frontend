"use client";

import { useState, useEffect, Fragment } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
// defaults.plugins.title.color = "white";
defaults.responsive = true;
defaults.maintainAspectRatio = false;

const Dashboard = () => {
  // Generic
  const [currentMonth, setCurrentMonth] = useState("--");
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [currentMonthAvgProfit, setCurrentMonthAvgProfit] = useState(0);
  const [lastMonthAvgProfit, setLastMonthAvgProfit] = useState(0);
  const [currentMonthAvgProfitFormatted, setCurrentMonthAvgProfitFormatted] =
    useState(0);
  const [currentMonthParticipant, setCurrentMonthParticipant] = useState("--");
  const [
    currentMonthParticipantFormatted,
    setCurrentMonthParticipantFormatted,
  ] = useState("--");
  const [lastMonthParticipant, setLastMonthParticipant] = useState("--");
  const [participantData_ProgramNames, setParticipantData_ProgramNames] =
    useState([["ProgramA", 0]]);
  const [participantData_ProgramTypes, setParticipantData_ProgramTypes] =
    useState([["TypeA", 0]]);
  console.log("participantData_ProgramNames", participantData_ProgramNames);
  console.log("participantData_ProgramTypes", participantData_ProgramTypes);
  // ALL
  const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };
  const [yearData, setYearData] = useState([
    { year_month: getCurrentYearMonth(), total_amount: 0 },
  ]);

  // programNames_Amount
  const [programNames_Amount, setProgramNames_Amount] = useState([
    { year_month: getCurrentYearMonth(), Name: 0 },
  ]);
  const [
    selectedYear_ProgramNames_Amount,
    setSelectedYear_ProgramNames_Amount,
  ] = useState("");
  const [
    selectedDataset_ProgramNames_Amount,
    setSelectedDataset_ProgramNames_Amount,
  ] = useState("All_Programs"); // 默認顯示收入

  // programTypes_Amount
  const [programTypes_Amount, setProgramTypes_Amount] = useState([
    { year_month: getCurrentYearMonth(), Type: 0 },
  ]);
  const [
    selectedYear_ProgramTypes_Amount,
    setSelectedYear_ProgramTypes_Amount,
  ] = useState("");
  const [
    selectedDataset_ProgramTypes_Amount,
    setSelectedDataset_ProgramTypes_Amount,
  ] = useState("All_Types"); // 默認顯示收入

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/get-revenue`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const revenueDate = await result.json();

        const getCurrentYearMonth = () => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          return `${year}-${month}`;
        };

        const getLastYearMonth = () => {
          const now = new Date();
          now.setMonth(now.getMonth() - 1);
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          return `${year}-${month}`;
        };

        const formatYearMonth = (dateString) => {
          const date = new Date(dateString + "-01");
          return date.toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          });
        };

        const formatNumber = (amount) => {
          return `${Number(amount).toLocaleString()}`;
        };
        const currMonthRevenue = Math.floor(
          revenueDate.resultGroupedByYearMonth.filter(
            (revenueData) => revenueData.year_month === getCurrentYearMonth()
          )[0].total_amount
        );

        const lastMonthRevenue = Math.floor(
          revenueDate.resultGroupedByYearMonth.filter(
            (revenueData) => revenueData.year_month === getLastYearMonth()
          )[0].total_amount
        );
        const currMonthParti = revenueDate.resultGroupedByYearMonth.filter(
          (revenueData) => revenueData.year_month === getCurrentYearMonth()
        )[0].total_count;
        const lastMonthParti = revenueDate.resultGroupedByYearMonth.filter(
          (revenueData) => revenueData.year_month === getLastYearMonth()
        )[0].total_count;
        setProgramNames_Amount(
          revenueDate.resultGroupedByYearMonth_programNames
        );
        setProgramTypes_Amount(
          revenueDate.resultGroupedByYearMonth_programTypes
        );
        setYearData(revenueDate.resultGroupedByYearMonth);
        setParticipantData_ProgramNames(
          revenueDate.resultGroupedByYearMonth_programNames_participantArray
        );
        setParticipantData_ProgramTypes(
          revenueDate.resultGroupedByYearMonth_programTypes_participantArray
        );
        setCurrentMonth(formatYearMonth(getCurrentYearMonth()));
        setCurrentMonthParticipantFormatted(formatNumber(currMonthParti));
        setCurrentMonthRevenue(formatNumber(currMonthRevenue));
        setCurrentMonthParticipant(currMonthParti);
        setLastMonthParticipant(lastMonthParti);
        setCurrentMonthAvgProfit(currMonthRevenue / currMonthParti);
        setLastMonthAvgProfit(lastMonthRevenue / lastMonthParti);
        setCurrentMonthAvgProfitFormatted(
          formatNumber(Math.floor(currMonthRevenue / currMonthParti))
        );
      } catch (err) {
        console.log("Fetch Stats Error");
        console.log(err);
      }
    };
    fetchProfileData();
  }, []);

  // ProgramNames Amount Starts
  const years_ProgramNames_Amount = programNames_Amount
    ? [
        ...new Set(
          programNames_Amount.map((data) => data.year_month.split("-")[0])
        ),
      ]
    : [];

  const filteredData_ProgramNames_Amount = selectedYear_ProgramNames_Amount
    ? programNames_Amount.filter((data) =>
        data.year_month.startsWith(selectedYear_ProgramNames_Amount)
      )
    : programNames_Amount;

  const datas_ProgramNames_Amount = filteredData_ProgramNames_Amount
    ? [
        ...new Set(
          filteredData_ProgramNames_Amount.flatMap((data) =>
            Object.keys(data).filter((key) => key !== "year_month")
          )
        ),
      ]
    : ["All_Programs"];

  // ProgramNames Amount Ends

  // ProgramTypes Amount Starts
  const years_ProgramTypes_Amount = programTypes_Amount
    ? [
        ...new Set(
          programTypes_Amount.map((data) => data.year_month.split("-")[0])
        ),
      ]
    : [];

  const filteredData_ProgramTypes_Amount = selectedYear_ProgramTypes_Amount
    ? programTypes_Amount.filter((data) =>
        data.year_month.startsWith(selectedYear_ProgramTypes_Amount)
      )
    : programTypes_Amount;

  const datas_ProgramTypes_Amount = filteredData_ProgramTypes_Amount
    ? [
        ...new Set(
          filteredData_ProgramTypes_Amount.flatMap((data) =>
            Object.keys(data).filter((key) => key !== "year_month")
          )
        ),
      ]
    : ["All_Programs"];

  // ProgramTypes Amount Ends

  // Pie Chart Data Preparation
  const [selectedMonth, setSelectedMonth] = useState(
    getCurrentYearMonth() || "-- Select Month --"
  );

  const pieData_ProgramNames_Amount = programNames_Amount
    ? programNames_Amount
        .filter((data) => data.year_month === selectedMonth)
        .map((data) =>
          Object.entries(data).filter(
            ([key]) => key !== "year_month" && key !== "All_Programs"
          )
        )
        .flat()
    : [["ProgramA", 0]];
  const pieData_ProgramTypes_Amount = programTypes_Amount
    ? programTypes_Amount
        .filter((data) => data.year_month === selectedMonth)
        .map((data) =>
          Object.entries(data).filter(
            ([key]) => key !== "year_month" && key !== "All_Types"
          )
        )
        .flat()
    : [["TypeA", 0]];
  console.log("pieData_ProgramNames_Amount", pieData_ProgramNames_Amount);
  console.log("pieData_ProgramTypes_Amount", pieData_ProgramTypes_Amount);
  return (
    <>
      <div className="flex flex-col items-center w-full">
        {/*-------------------------------- Key Numbers --------------------------------*/}
        <div className="flex justify-center w-full">
          <div className="mt-12 mb-4 stats stats-vertical lg:stats-horizontal shadow-md w-11/12 ">
            <div className="stat">
              <div className="stat-title">Month's profits</div>
              <div className="stat-value">${currentMonthRevenue}</div>
              <div className="stat-desc">{currentMonth}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Month's Participants</div>
              <div className="stat-value">
                {currentMonthParticipantFormatted}
              </div>
              <div className="stat-desc">
                {currentMonthParticipant - lastMonthParticipant >= 0 ? (
                  <span className="text-green-500">
                    ↗︎ {currentMonthParticipant - lastMonthParticipant} (+
                    {(currentMonthParticipant / lastMonthParticipant - 1) * 100}
                    %)
                  </span>
                ) : (
                  <span className="text-red-500">
                    ↘{" "}
                    {isNaN(currentMonthParticipant - lastMonthParticipant)
                      ? "--"
                      : currentMonthParticipant - lastMonthParticipant}{" "}
                    (
                    {(currentMonthParticipant / lastMonthParticipant - 1) * 100}
                    %)
                  </span>
                )}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Average Profit per Participant</div>
              <div className="stat-value">
                ${currentMonthAvgProfitFormatted}
              </div>
              <div className="stat-desc">
                {currentMonthAvgProfit - lastMonthAvgProfit >= 0 ? (
                  <span className="text-green-500">
                    ↗︎ ${Math.floor(currentMonthAvgProfit - lastMonthAvgProfit)}{" "}
                    (
                    {Math.floor(
                      currentMonthAvgProfit / lastMonthAvgProfit - 1
                    ) * 100}
                    %)
                  </span>
                ) : (
                  <span className="text-red-500">
                    ↘ ${Math.floor(currentMonthAvgProfit - lastMonthAvgProfit)}{" "}
                    (
                    {Math.floor(
                      currentMonthAvgProfit / lastMonthAvgProfit - 1
                    ) * 100}
                    %)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/*---------------------------------- Year-over-year data START ----------------------------------*/}

        <div className="flex justify-center text-2xl w-full font-semibold underline underline-offset-2 mb-4 mt-4">
          Year-Over-Year Data
        </div>
        <div className="flex justify-around bg-base-200 p-4 rounded-2xl w-11/12 mb-4 shadow-md">
          {/*-------------------------------- All Programs - Amount --------------------------------*/}
          <div className="flex flex-col items-center min-h-56 w-5/12 bg-base-100 p-4 rounded-2xl shadow-md">
            <>
              <div className="w-11/12 min-h-56">
                <Line
                  data={{
                    labels: [
                      "01",
                      "02",
                      "03",
                      "04",
                      "05",
                      "06",
                      "07",
                      "08",
                      "09",
                      "10",
                      "11",
                      "12",
                    ],
                    datasets: [
                      {
                        // Current Year
                        label: new Date().getFullYear(),
                        data: yearData
                          .filter((year) =>
                            year.year_month.startsWith(new Date().getFullYear())
                          )
                          .map((year) => year.total_amount),
                        borderRadius: 5,
                      },
                      {
                        // Current Year - 1
                        label: new Date().getFullYear() - 1,
                        data: yearData
                          .filter((year) =>
                            year.year_month.startsWith(
                              new Date().getFullYear() - 1
                            )
                          )
                          .map((year) => year.total_amount),
                        borderRadius: 5,
                      },
                      {
                        // Current Year - 2
                        label: new Date().getFullYear() - 2,
                        data: yearData
                          .filter((year) =>
                            year.year_month.startsWith(
                              new Date().getFullYear() - 2
                            )
                          )
                          .map((year) => year.total_amount),
                        borderRadius: 5,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "All Profits (HKD)",
                        align: "center",
                        padding: {
                          top: 10,
                        },
                      },
                    },
                  }}
                />
              </div>
            </>
          </div>
          {/*-------------------------------- All Programs - Participants --------------------------------*/}
          <div className="flex flex-col items-center min-h-56 w-5/12 bg-base-100 p-4 rounded-2xl shadow-md">
            {yearData && (
              <>
                <div className="w-11/12 min-h-56">
                  <Line
                    data={{
                      // labels: yearData.map((year) => year.year_month),
                      labels: [
                        "01",
                        "02",
                        "03",
                        "04",
                        "05",
                        "06",
                        "07",
                        "08",
                        "09",
                        "10",
                        "11",
                        "12",
                      ],
                      datasets: [
                        {
                          // Current Year
                          label: new Date().getFullYear(),
                          data: yearData
                            .filter((year) =>
                              year.year_month.startsWith(
                                new Date().getFullYear()
                              )
                            )
                            .map((year) => year.total_count),
                          borderRadius: 5,
                        },
                        {
                          // Current Year - 1
                          label: new Date().getFullYear() - 1,
                          data: yearData
                            .filter((year) =>
                              year.year_month.startsWith(
                                new Date().getFullYear() - 1
                              )
                            )
                            .map((year) => year.total_count),
                          borderRadius: 5,
                        },
                        {
                          // Current Year - 2
                          label: new Date().getFullYear() - 2,
                          data: yearData
                            .filter((year) =>
                              year.year_month.startsWith(
                                new Date().getFullYear() - 2
                              )
                            )
                            .map((year) => year.total_count),
                          borderRadius: 5,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: "All Participants",
                          align: "center",
                          padding: {
                            top: 10,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {/*---------------------------------- Year-over-year data END ----------------------------------*/}
        <div className="divider divider-secondary w-11/12 place-self-center"></div>
        {/*-------------------------------- Profit START --------------------------------*/}
        <div className="flex justify-center text-2xl w-full font-semibold underline underline-offset-2 mb-4 ">
          Profit Breakdown
        </div>
        <div className="flex justify-around bg-base-200 p-4 rounded-2xl w-11/12 mb-4 shadow-md">
          {/*-------------------------------- programNames Amount & Participant Number --------------------------------*/}
          <div className="flex flex-col items-center min-h-64 w-5/12 bg-base-100 p-4 rounded-2xl shadow-md">
            {programNames_Amount && (
              <>
                {/* select */}
                <div className="flex justify-between w-4/6">
                  {/* <label htmlFor="year-select">Select Year</label> */}
                  <select
                    id="year-select"
                    onChange={(e) =>
                      setSelectedYear_ProgramNames_Amount(e.target.value)
                    }
                    value={selectedYear_ProgramNames_Amount}
                    className="select select-bordered w-2/5 overflow-y-auto max-w-xs max-h-[200px] select-sm"
                  >
                    <option value="">All Years</option>
                    {years_ProgramNames_Amount.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  {/* <label htmlFor="dataset-select">Select Dataset</label> */}
                  <select
                    id="dataset-select"
                    onChange={(e) =>
                      setSelectedDataset_ProgramNames_Amount(e.target.value)
                    }
                    value={selectedDataset_ProgramNames_Amount}
                    className="select select-bordered w-3/5 overflow-y-auto max-w-xs max-h-[200px] select-sm"
                  >
                    {datas_ProgramNames_Amount.toSorted().map((data) => (
                      <option key={data} value={data}>
                        {data === "All_Programs" ? "All Programs" : data}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-11/12 min-h-56">
                  <Bar
                    data={{
                      labels: filteredData_ProgramNames_Amount.map(
                        (data) => data.year_month
                      ),
                      datasets: [
                        {
                          label: "Profits (HKD)",
                          data: filteredData_ProgramNames_Amount.map(
                            (data) => data[selectedDataset_ProgramNames_Amount]
                          ),
                          borderRadius: 5,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: `${
                            selectedYear_ProgramNames_Amount === ""
                              ? "All Years"
                              : selectedYear_ProgramNames_Amount
                          } - ${
                            selectedDataset_ProgramNames_Amount ===
                            "All_Programs"
                              ? "All Programs"
                              : selectedDataset_ProgramNames_Amount
                          }`,
                          align: "center",
                          padding: {
                            top: 10,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </>
            )}
          </div>
          {/*-------------------------------- programTypes Amount  & Participant Number--------------------------------*/}
          <div className="flex flex-col items-center min-h-64 w-5/12 bg-base-100 p-4 rounded-2xl shadow-md">
            {programTypes_Amount && (
              <>
                {/* select */}
                <div className="flex justify-between w-4/6">
                  {/* <label htmlFor="year-select">Select Year</label> */}
                  <select
                    id="year-select"
                    onChange={(e) =>
                      setSelectedYear_ProgramTypes_Amount(e.target.value)
                    }
                    value={selectedYear_ProgramTypes_Amount}
                    className="select select-bordered w-2/5 overflow-y-auto max-w-xs max-h-[200px] select-sm"
                  >
                    <option value="">All Years</option>
                    {years_ProgramTypes_Amount.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  {/* <label htmlFor="dataset-select">Select Dataset</label> */}
                  <select
                    id="dataset-select"
                    onChange={(e) =>
                      setSelectedDataset_ProgramTypes_Amount(e.target.value)
                    }
                    value={selectedDataset_ProgramTypes_Amount}
                    className="select select-bordered w-3/5 overflow-y-auto max-w-xs max-h-[200px] select-sm"
                  >
                    {datas_ProgramTypes_Amount.toSorted().map((data) => (
                      <option key={data} value={data}>
                        {data === "All_Types" ? "All Types" : data}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-11/12 min-h-56">
                  <Bar
                    data={{
                      labels: filteredData_ProgramTypes_Amount.map(
                        (data) => data.year_month
                      ),
                      datasets: [
                        {
                          label: "Profits (HKD)",
                          data: filteredData_ProgramTypes_Amount.map(
                            (data) => data[selectedDataset_ProgramTypes_Amount]
                          ),
                          borderRadius: 5,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: `${
                            selectedYear_ProgramTypes_Amount === ""
                              ? "All Years"
                              : selectedYear_ProgramTypes_Amount
                          } - ${
                            selectedDataset_ProgramTypes_Amount === "All_Types"
                              ? "All Types"
                              : selectedDataset_ProgramTypes_Amount
                          }`,
                          align: "center",
                          padding: {
                            top: 10,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {/*-------------------------------- Profit END --------------------------------*/}
        <div className="divider divider-secondary w-11/12 place-self-center"></div>
        {/*---------------------------------- Monthly Data Breakdown START ----------------------------------*/}
        <div className="flex justify-center text-2xl w-full font-semibold underline underline-offset-2 mb-4">
          Monthly Data Breakdown
        </div>
        <div className="flex justify-around bg-base-200 p-4 rounded-2xl w-11/12 mb-4 shadow-md">
          {/*---------------------------------- Select Bar ----------------------------------*/}
          <div className="flex flex-col w-full">
            <div className="flex justify-center w-full mb-4">
              {/* <label htmlFor="month-select">Select Month</label> */}
              <select
                id="month-select"
                onChange={(e) => setSelectedMonth(e.target.value)}
                value={selectedMonth}
                className="select select-bordered w-1/5 overflow-y-auto max-w-xs max-h-[200px] select-sm"
              >
                {/* <option value="">-- Select Month --</option> */}
                {programNames_Amount &&
                  [
                    ...new Set(
                      programNames_Amount.map((data) => data.year_month)
                    ),
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
              </select>
            </div>
            {/* Monthly Data Breakdown (ProgramNames & ProgramTypes) - Amount */}
            <div className="flex justify-around w-full mb-4">
              {selectedMonth && pieData_ProgramNames_Amount.length > 0 && (
                <div className="min-h-64 w-5/12 bg-base-100 p-4 rounded-2xl shadow-md">
                  <Doughnut
                    data={{
                      labels: pieData_ProgramNames_Amount.map(
                        ([label]) => label
                      ),
                      datasets: [
                        {
                          label: "Profits (HKD)",
                          data: pieData_ProgramNames_Amount.map(
                            ([, value]) => value
                          ),
                          backgroundColor: [
                            "#FF6384", // Pink
                            "#36A2EB", // Blue
                            "#FFCE56", // Yellow
                            "#4BC0C0", // Teal
                            "#9966FF", // Purple
                            "#FF9F40", // Orange
                            "#4DFFB8", // Mint Green
                            "#FF6B9E", // Soft Pink
                          ],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: `Profits by Program`,
                          align: "center",
                        },
                      },
                    }}
                  />
                </div>
              )}
              {selectedMonth && pieData_ProgramTypes_Amount.length > 0 && (
                <div className="min-h-64 w-5/12 bg-base-100 p-4 rounded-2xl shadow-md">
                  <Doughnut
                    data={{
                      labels: pieData_ProgramTypes_Amount.map(
                        ([label]) => label
                      ),
                      datasets: [
                        {
                          label: "Profits",
                          data: pieData_ProgramTypes_Amount.map(
                            ([, value]) => value
                          ),
                          backgroundColor: [
                            "#FF6384", // Pink
                            "#36A2EB", // Blue
                            "#FFCE56", // Yellow
                            "#4BC0C0", // Teal
                            "#9966FF", // Purple
                            "#FF9F40", // Orange
                            "#4DFFB8", // Mint Green
                            "#FF6B9E", // Soft Pink
                          ],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: `Profit by Type`,
                          align: "center",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
            {/* Monthly Data Breakdown (ProgramNames & ProgramTypes) - Participant */}
            <div className="flex  justify-around w-full">
              {selectedMonth && participantData_ProgramNames.length > 0 && (
                <div className="min-h-64 w-5/12 bg-base-100 p-4 rounded-2xl shadow-md">
                  <Doughnut
                    data={{
                      labels: participantData_ProgramNames
                        .filter((data) => data.year_month === selectedMonth)
                        .map((data) =>
                          Object.entries(data).filter(
                            ([key]) => key !== "year_month"
                          )
                        )
                        .flat()
                        .map(([label]) => label),
                      datasets: [
                        {
                          label: "Participants",
                          data: participantData_ProgramNames
                            .filter((data) => data.year_month === selectedMonth)
                            .map((data) =>
                              Object.entries(data).filter(
                                ([key]) => key !== "year_month"
                              )
                            )
                            .flat()
                            .map(([, value]) => value),
                          backgroundColor: [
                            "#FF6384", // Pink
                            "#36A2EB", // Blue
                            "#FFCE56", // Yellow
                            "#4BC0C0", // Teal
                            "#9966FF", // Purple
                            "#FF9F40", // Orange
                            "#4DFFB8", // Mint Green
                            "#FF6B9E", // Soft Pink
                          ],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: `Participants by Program`,
                          align: "center",
                        },
                      },
                    }}
                  />
                </div>
              )}

              {/* 新的 Doughnut Chart for Participants - Program Types */}
              {selectedMonth && participantData_ProgramTypes.length > 0 && (
                <div className="min-h-64 w-5/12 bg-base-100 p-4 rounded-2xl shadow-md">
                  <Doughnut
                    data={{
                      labels: participantData_ProgramTypes
                        .filter((data) => data.year_month === selectedMonth)
                        .map((data) =>
                          Object.entries(data).filter(
                            ([key]) => key !== "year_month"
                          )
                        )
                        .flat()
                        .map(([label]) => label),
                      datasets: [
                        {
                          label: "Participants",
                          data: participantData_ProgramTypes
                            .filter((data) => data.year_month === selectedMonth)
                            .map((data) =>
                              Object.entries(data).filter(
                                ([key]) => key !== "year_month"
                              )
                            )
                            .flat()
                            .map(([, value]) => value),
                          backgroundColor: [
                            "#FF6384", // Pink
                            "#36A2EB", // Blue
                            "#FFCE56", // Yellow
                            "#4BC0C0", // Teal
                            "#9966FF", // Purple
                            "#FF9F40", // Orange
                            "#4DFFB8", // Mint Green
                            "#FF6B9E", // Soft Pink
                          ],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: `Participants by Type`,
                          align: "center",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/*---------------------------------- Monthly Data Breakdown END ----------------------------------*/}
      </div>
      {/* )} */}
    </>
  );
};

export default Dashboard;
