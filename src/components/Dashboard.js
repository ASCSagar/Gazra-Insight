import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Logo from "../images/Logo.webp";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#a05195",
  "#d45087",
];

const backgroundStyle = {
  backgroundImage: `url('BG-Main.jpg')`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
  minHeight: "100vh",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  backgroundColor: "rgba(243, 239, 230, 1)",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.5)",
  marginBottom: "20px",
};
const Dashboard = () => {
  const [surveyData, setSurveyData] = useState([]);
  const [ageFilter, setAgeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [educationFilter, setEducationFilter] = useState("All");

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://sheet.best/api/sheets/b5f76b27-1ad7-46ef-af15-c6ca176962be"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSurveyData(data);
    } catch (error) {
      console.log("Please try again later.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = useMemo(() => {
    return surveyData.filter(
      (item) =>
        (ageFilter === "All" || item.AgeGroup === ageFilter) &&
        (locationFilter === "All" || item.Location === locationFilter) &&
        (educationFilter === "All" || item.Education === educationFilter)
    );
  }, [surveyData, ageFilter, locationFilter, educationFilter]);

  const processData = useMemo(() => {
    const ageDistribution = [
      {
        name: "Under 18",
        value: filteredData.filter((item) => item.AgeGroup === "Under 18")
          .length,
      },
      {
        name: "18-24",
        value: filteredData.filter((item) => item.AgeGroup === "18–24").length,
      },
      {
        name: "25-34",
        value: filteredData.filter((item) => item.AgeGroup === "25–34").length,
      },
      {
        name: "35-44",
        value: filteredData.filter((item) => item.AgeGroup === "35–44").length,
      },
      {
        name: "45-54",
        value: filteredData.filter((item) => item.AgeGroup === "45–54").length,
      },
      {
        name: "55-64",
        value: filteredData.filter((item) => item.AgeGroup === "55–64").length,
      },
      {
        name: "65 and above",
        value: filteredData.filter((item) => item.AgeGroup === "65 and above")
          .length,
      },
    ];

    const violenceFamiliarity = [
      {
        name: "Very familiar",
        value: filteredData.filter(
          (item) => item.ViolenceFamiliarity === "Very familiar"
        ).length,
      },
      {
        name: "Somewhat familiar",
        value: filteredData.filter(
          (item) => item.ViolenceFamiliarity === "Somewhat familiar"
        ).length,
      },
      {
        name: "Not very familiar",
        value: filteredData.filter(
          (item) => item.ViolenceFamiliarity === "Not very familiar"
        ).length,
      },
      {
        name: "Not at all familiar",
        value: filteredData.filter(
          (item) => item.ViolenceFamiliarity === "Not at all familiar"
        ).length,
      },
    ];

    const violenceTypes = [
      {
        name: "Physical assault",
        value: filteredData.filter(
          (item) =>
            item.ViolenceAgainstWomenTypes &&
            item.ViolenceAgainstWomenTypes.includes("Physical assault")
        ).length,
      },
      {
        name: "Sexual assault",
        value: filteredData.filter(
          (item) =>
            item.ViolenceAgainstWomenTypes &&
            item.ViolenceAgainstWomenTypes.includes("Sexual assault or rape")
        ).length,
      },
      {
        name: "Verbal abuse",
        value: filteredData.filter(
          (item) =>
            item.ViolenceAgainstWomenTypes &&
            item.ViolenceAgainstWomenTypes.includes(
              "Verbal abuse or name-calling"
            )
        ).length,
      },
      {
        name: "Isolation",
        value: filteredData.filter(
          (item) =>
            item.ViolenceAgainstWomenTypes &&
            item.ViolenceAgainstWomenTypes.includes(
              "Isolating from friends/family, controlling finances"
            )
        ).length,
      },
      {
        name: "Stalking",
        value: filteredData.filter(
          (item) =>
            item.ViolenceAgainstWomenTypes &&
            item.ViolenceAgainstWomenTypes.includes(
              "Stalking or persistent unwanted attention"
            )
        ).length,
      },
      {
        name: "Online harassment",
        value: filteredData.filter(
          (item) =>
            item.ViolenceAgainstWomenTypes &&
            item.ViolenceAgainstWomenTypes.includes(
              "Online harassment or cyberbullying"
            )
        ).length,
      },
    ].sort((a, b) => b.value - a.value);

    const physicalViolencePrevalence = [
      {
        name: "Very common",
        value: filteredData.filter(
          (item) => item.PhysicalViolence === "Very common"
        ).length,
      },
      {
        name: "Somewhat common",
        value: filteredData.filter(
          (item) => item.PhysicalViolence === "Somewhat common"
        ).length,
      },
      {
        name: "Not very common",
        value: filteredData.filter(
          (item) => item.PhysicalViolence === "Not very common"
        ).length,
      },
      {
        name: "Not at all common",
        value: filteredData.filter(
          (item) => item.PhysicalViolence === "Not at all common"
        ).length,
      },
      {
        name: "Unsure",
        value: filteredData.filter((item) => item.PhysicalViolence === "Unsure")
          .length,
      },
    ];

    const violenceLocation = [
      {
        name: "At home",
        value: filteredData.filter(
          (item) =>
            item.PhysicalViolenceLocation &&
            item.PhysicalViolenceLocation.includes("At home")
        ).length,
      },
      {
        name: "In public spaces",
        value: filteredData.filter(
          (item) =>
            item.PhysicalViolenceLocation &&
            item.PhysicalViolenceLocation.includes("In public spaces")
        ).length,
      },
      {
        name: "At work",
        value: filteredData.filter(
          (item) =>
            item.PhysicalViolenceLocation &&
            item.PhysicalViolenceLocation.includes("At work")
        ).length,
      },
      {
        name: "In educational institutions",
        value: filteredData.filter(
          (item) =>
            item.PhysicalViolenceLocation &&
            item.PhysicalViolenceLocation.includes(
              "In educational institutions"
            )
        ).length,
      },
    ].sort((a, b) => b.value - a.value);

    const reportingBarriers = [
      {
        name: "Fear of retaliation",
        value: filteredData.filter(
          (item) =>
            item.SexualViolenceBarrier &&
            item.SexualViolenceBarrier.includes("Fear of retaliation")
        ).length,
      },
      {
        name: "Shame or stigma",
        value: filteredData.filter(
          (item) =>
            item.SexualViolenceBarrier &&
            item.SexualViolenceBarrier.includes("Shame or stigma")
        ).length,
      },
      {
        name: "Lack of trust in authorities",
        value: filteredData.filter(
          (item) =>
            item.SexualViolenceBarrier &&
            item.SexualViolenceBarrier.includes("Lack of trust in authorities")
        ).length,
      },
      {
        name: "Fear of not being believed",
        value: filteredData.filter(
          (item) =>
            item.SexualViolenceBarrier &&
            item.SexualViolenceBarrier.includes("Fear of not being believed")
        ).length,
      },
      {
        name: "Lack of awareness of rights",
        value: filteredData.filter(
          (item) =>
            item.SexualViolenceBarrier &&
            item.SexualViolenceBarrier.includes(
              "Lack of awareness of rights and resources"
            )
        ).length,
      },
    ].sort((a, b) => b.value - a.value);

    return {
      ageDistribution,
      violenceFamiliarity,
      violenceTypes,
      physicalViolencePrevalence,
      violenceLocation,
      reportingBarriers,
    };
  }, [filteredData]);

  // Destructure the processed data
  const {
    ageDistribution,
    violenceFamiliarity,
    violenceTypes,
    physicalViolencePrevalence,
    violenceLocation,
    reportingBarriers,
  } = processData;

  const mainInference = useMemo(() => {
    const totalResponses = filteredData.length;

    const experiencedViolence = filteredData.filter(
      (item) => item.ViolenceAgainstWomen === "Yes"
    ).length;

    const percentage =
      totalResponses > 0
        ? ((experiencedViolence / totalResponses) * 100).toFixed(1)
        : 0;

    return `${percentage}% of women surveyed have experienced some form of violence.`;
  }, [filteredData]);

  const generateInferences = useMemo(() => {
    const totalResponses = filteredData.length;

    // Calculate percentage only if totalResponses is greater than 0, otherwise set it to 0
    const physicalViolenceCommon = filteredData.filter(
      (item) =>
        item.PhysicalViolence === "Very common" ||
        item.PhysicalViolence === "Somewhat common"
    ).length;
    const physicalViolencePercentage =
      totalResponses > 0
        ? ((physicalViolenceCommon / totalResponses) * 100).toFixed(1)
        : 0;

    const homeViolence = filteredData.filter(
      (item) =>
        item.PhysicalViolenceLocation &&
        item.PhysicalViolenceLocation.includes("At home")
    ).length;
    const homeViolencePercentage =
      totalResponses > 0
        ? ((homeViolence / totalResponses) * 100).toFixed(1)
        : 0;

    const fearRetaliation = filteredData.filter(
      (item) =>
        item.SexualViolenceBarrier &&
        item.SexualViolenceBarrier.includes("Fear of retaliation")
    ).length;
    const fearRetaliationPercentage =
      totalResponses > 0
        ? ((fearRetaliation / totalResponses) * 100).toFixed(1)
        : 0;

    return [
      `${physicalViolencePercentage}% of respondents believe physical violence against women is common in their community.`,
      `${homeViolencePercentage}% of participants identify the home as a common location for violence against women.`,
      `${fearRetaliationPercentage}% of respondents cite fear of retaliation as a major barrier to reporting sexual violence.`,
    ];
  }, [filteredData]);

  return (
    <div style={backgroundStyle}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <img
          src={Logo}
          alt="SHRI MAHARANI CHIMNABAI STREE UDYOGALAYA"
          style={{ display: "block", margin: "0 auto 20px", maxWidth: "200px" }}
        />

        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#333",
            textAlign: "center",
          }}
        >
          Comprehensive Survey Insights: Violence Against Women
        </h1>
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ fontSize: "20px", color: "#333" }}>
              Total Responses: {filteredData?.length} / {surveyData?.length}
            </h2>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div>
                <label htmlFor="ageFilter" style={{ marginRight: "10px" }}>
                  Filter by Age:{" "}
                </label>
                <select
                  id="ageFilter"
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  style={{ padding: "5px", borderRadius: "4px" }}
                >
                  <option value="All">All</option>
                  <option value="Under 18">Under 18</option>
                  <option value="18–24">18-24</option>
                  <option value="25–34">25-34</option>
                  <option value="35–44">35-44</option>
                  <option value="45–54">45-54</option>
                  <option value="55–64">55-64</option>
                  <option value="65 and above">65 and above</option>
                </select>
              </div>

              <div>
                <label htmlFor="locationFilter" style={{ marginRight: "10px" }}>
                  Filter by Location:{" "}
                </label>
                <select
                  id="locationFilter"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  style={{ padding: "5px", borderRadius: "4px" }}
                >
                  <option value="All">All</option>
                  <option value="Urban">Urban</option>
                  <option value="Semi-Urban">Semi-Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="educationFilter"
                  style={{ marginRight: "10px" }}
                >
                  Filter by Education:{" "}
                </label>
                <select
                  id="educationFilter"
                  value={educationFilter}
                  onChange={(e) => setEducationFilter(e.target.value)}
                  style={{ padding: "5px", borderRadius: "4px" }}
                >
                  <option value="All">All</option>
                  <option value="No Formal Education">
                    No Formal Education
                  </option>
                  <option value="Primary Education">Primary Education</option>
                  <option value="Secondary Education">
                    Secondary Education
                  </option>
                  <option value="Higher Secondary Education">
                    Higher Secondary Education
                  </option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree or Higher">
                    Master's Degree or Higher
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div style={{ ...cardStyle, flex: 1, marginRight: "10px" }}>
            <h2
              style={{
                fontSize: "22px",
                marginBottom: "10px",
                color: "#e91e63",
              }}
            >
              Key Insight
            </h2>
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {mainInference}
            </p>
          </div>
          <div style={{ ...cardStyle, flex: 1, marginLeft: "10px" }}>
            <h2
              style={{
                fontSize: "22px",
                marginBottom: "10px",
                color: "#2e7d32",
              }}
            >
              Key Inferences
            </h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {generateInferences.map((inference, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "10px",
                    fontSize: "16px",
                    lineHeight: "1.5",
                  }}
                >
                  • {inference}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "10px",
                color: "#333",
                textAlign: "center",
              }}
            >
              Age Distribution of Respondents
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={ageDistribution}
                  fill="#8884d8"
                  label
                >
                  {ageDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "10px",
                color: "#333",
                textAlign: "center",
              }}
            >
              Prevalence of Physical Violence
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={physicalViolencePrevalence}
                  fill="#ffc658"
                  label
                >
                  {physicalViolencePrevalence.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "10px",
                color: "#333",
                textAlign: "center",
              }}
            >
              Common Locations of Violence
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={violenceLocation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "10px",
                color: "#333",
                textAlign: "center",
              }}
            >
              Familiarity with Violence Against Women
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={violenceFamiliarity}
                  fill="#82ca9d"
                  label
                >
                  {violenceFamiliarity.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "10px",
                color: "#333",
                textAlign: "center",
              }}
            >
              Recognized Forms of Violence Against Women
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart layout="vertical" data={violenceTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "10px",
                color: "#333",
                textAlign: "center",
              }}
            >
              Barriers to Reporting Sexual Violence
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart layout="vertical" data={reportingBarriers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
