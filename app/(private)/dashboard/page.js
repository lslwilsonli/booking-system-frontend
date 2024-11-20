"use client";

import { useState, useEffect, Fragment } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const Dashboard = () => {
  const [programNames, setProgramNames] = useState(null);
  const [programTypes, setProgramTypes] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("total_amount"); // 默認顯示收入

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      try {
        const result = await fetch(`http://localhost:3030/get-revenue`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const revenueDate = await result.json();
        // console.log("resultBySessionDate", revenueDate.resultBySessionDate);
        // console.log("resultGroupedByDate", revenueDate.resultGroupedByDate);
        console.log(
          "resultGroupedByYearMonth",
          revenueDate.resultGroupedByYearMonth
        );
        console.log(
          "resultGroupedByYearMonth_programTypes",
          revenueDate.resultGroupedByYearMonth_programTypes
        );
        console.log(
          "resultGroupedByYearMonth_programNames",
          revenueDate.resultGroupedByYearMonth_programNames
        );

        setProgramNames(revenueDate.resultGroupedByYearMonth_programNames);
        setProgramTypes(revenueDate.resultGroupedByYearMonth_programTypes);
        setDailyData(revenueDate.resultGroupedByYearMonth);
      } catch (err) {
        console.log("Fetch Stats Error");
      }
    };
    fetchProfileData();
  }, []);

  const years = dailyData
    ? [...new Set(dailyData.map((data) => data.year_month.split("-")[0]))]
    : [];

  const datas = programNames
    ? [
        ...new Set(
          programNames.flatMap((data) =>
            Object.keys(data).filter((key) => key !== "year_month")
          )
        ),
      ]
    : [];
  console.log("datas", datas);

  const filteredData = selectedYear
    ? programNames.filter((data) => data.year_month.startsWith(selectedYear))
    : programNames;
  console.log("filteredData", filteredData);
  return (
    <>
      <div>
        {dailyData && (
          <>
            <p>
              2 drop down lists, 1 control data period(year), 1 control program,
              by month
            </p>
            <p>Bar1: Revenue / Bar2: Unit Sold</p>

            <div>
              <label htmlFor="year-select">Select Year:</label>
              <select
                id="year-select"
                onChange={(e) => setSelectedYear(e.target.value)}
                value={selectedYear}
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <label htmlFor="dataset-select">Select Dataset:</label>
              <select
                id="dataset-select"
                onChange={(e) => setSelectedDataset(e.target.value)}
                value={selectedDataset}
              >
                <option value="">All Programs</option>
                {datas.map((data) => (
                  <option key={data} value={data}>
                    {data}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-3/5">
              <Bar
                data={{
                  labels: filteredData.map((data) => data.year_month),
                  datasets: [
                    {
                      label: "Revenue",
                      data: filteredData.map((data) => data[selectedDataset]),
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Custom Chart Title",
                      color: "white",
                      padding: {
                        top: 10,
                        bottom: 30,
                      },
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
      <div>
        {dailyData && (
          <>
            <p>
              2 drop down lists, 1 control data period(year), 1 control program,
              by month
            </p>
            <p>Bar1: Revenue / Bar2: Unit Sold</p>
            <div className="w-3/5">
              <Bar
                data={{
                  labels: dailyData.map((revenue) => revenue.year_month),
                  datasets: [
                    {
                      label: "Revenue",
                      data: dailyData.map((revenue) => revenue.total_amount),
                      borderRadius: 5,
                    },
                    {
                      label: "No. of Students",
                      data: dailyData.map((revenue) => revenue.total_count),
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Custom Chart Title",
                      color: "white", // see how to change by theme setting
                      padding: {
                        top: 10,
                        bottom: 30,
                      },
                    },
                  },
                }}
              />
            </div>
            {/* <div className="flex justify-center">
        <div className="mt-24 stats stats-vertical lg:stats-horizontal shadow w-11/12 ">
          <div className="stat">
            <div className="stat-title">Month's profit</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">1st - 31st Jan </div>
          </div>

          <div className="stat">
            <div className="stat-title">Month's Participant</div>
            <div className="stat-value">100</div>
            <div className="stat-desc">↗︎ 20 (22%)</div>
          </div>

          <div className="stat">
            <div className="stat-title">Average Participant per Program</div>
            <div className="stat-value">10</div>
            <div className="stat-desc">↘︎ 1 (14%)</div>
          </div>
        </div>
      </div> */}
            {/* <p>Pie Chart 全年 $$ by Program Type</p> */}
            {/* <Doughnut
              data={{
                labels: dailyRevenue.map((revenue) => revenue.date),
                datasets: [
                  {
                    label: "Revenue",
                    data: dailyRevenue.map((revenue) => revenue.total_amount),
                  },
                ],
              }}
            />
            <p>
              Line Chart 全年 $$ by year, lines = years , x axis (month), y axis
              ($$) <br />
              dropdown, program type, program name
            </p> */}
            {/* <Line
              data={{
                labels: dailyData.map((revenue) => revenue.year_month),
                datasets: [
                  {
                    label: "Revenue",
                    data: dailyData.map((revenue) => revenue.total_amount),
                    backgroundColor: "#064FF0",
                    borderColor: "#064FF0",
                  },
                  {
                    label: "No. of Students",
                    data: dailyData.map((revenue) => revenue.total_count),
                    backgroundColor: "#064FF0",
                    borderColor: "#064FF0",
                  },
                ],
              }}
              // options={{ elements: { line: { borderWidth: 1, tension: 0.5 } } }}
            /> */}
          </>
        )}
      </div>
      {/* <div>
        <p>Just Show All Revenue By Session & Date</p>
        {revenue && (
          <div>
            {revenue.map((data, idx) => {
              return (
                <Fragment key={idx}>
                  <div>{data.date}</div>
                  <div>{data.program_name}</div>
                  <div>{data.total_amount}</div>
                  <div>{data.total_count}</div>
                </Fragment>
              );
            })}
          </div>
        )}
        <p>Just Show All Revenue By Date</p>
        {dailyRevenue && (
          <div>
            {dailyRevenue.map((data, idx) => {
              return (
                <Fragment key={idx}>
                  <div>{data.date}</div>
                  <div>{data.total_amount}</div>
                  <div>{data.total_count}</div>
                </Fragment>
              );
            })}
          </div>
        )}
      </div> */}
    </>
  );
};

export default Dashboard;
