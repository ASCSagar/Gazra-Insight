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

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088FE",
  "#00C49F",
];

const SurveyInsightsDashboard = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState([]);
  const [ageFilter, setAgeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

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
      setError("Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = useMemo(() => {
    return surveyData.filter(
      (item) =>
        (ageFilter === "All" || item.AgeGroup === ageFilter) &&
        (locationFilter === "All" || item.Location === locationFilter)
    );
  }, [surveyData, ageFilter, locationFilter]);

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
    ].sort((a, b) => b.value - a.value); // Sort from highest to lowest

    return { ageDistribution, violenceFamiliarity, violenceTypes };
  }, [filteredData]);

  const generateInferences = useMemo(() => {
    const totalResponses = filteredData.length;
    const under25 = filteredData.filter(
      (item) => item.AgeGroup === "Under 18" || item.AgeGroup === "18–24"
    );
    const unsafeAtWork = under25.filter(
      (item) =>
        item.ViolenceAgainstWomenTypes &&
        item.ViolenceAgainstWomenTypes.includes(
          "Denial of education or employment opportunities"
        )
    );
    const unsafeAtWorkPercentage = (
      (unsafeAtWork.length / under25.length) *
      100
    ).toFixed(1);

    const verbalAbuse = filteredData.filter(
      (item) =>
        item.ViolenceAgainstWomenTypes &&
        item.ViolenceAgainstWomenTypes.includes("Verbal abuse or name-calling")
    );
    const verbalAbusePercentage = (
      (verbalAbuse.length / totalResponses) *
      100
    ).toFixed(1);

    const onlineHarassment = filteredData.filter(
      (item) =>
        item.ViolenceAgainstWomenTypes &&
        item.ViolenceAgainstWomenTypes.includes(
          "Online harassment or cyberbullying"
        )
    );
    const onlineHarassmentPercentage = (
      (onlineHarassment.length / totalResponses) *
      100
    ).toFixed(1);

    return [
      `${unsafeAtWorkPercentage}% of women under the age of 25 feel unsafe at their workplace or educational institution.`,
      `${verbalAbusePercentage}% of respondents recognize verbal abuse as a form of violence against women.`,
      `${onlineHarassmentPercentage}% of participants identify online harassment as a significant issue for women.`,
    ];
  }, [filteredData]);

  const mainInference = useMemo(() => {
    const totalResponses = filteredData.length;
    const experiencedViolence = filteredData.filter(
      (item) => item.ViolenceAgainstWomen === "Yes"
    ).length;
    const percentage = ((experiencedViolence / totalResponses) * 100).toFixed(
      1
    );
    return `${percentage}% of women surveyed have experienced some form of violence.`;
  }, [filteredData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const { ageDistribution, violenceFamiliarity, violenceTypes } = processData;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#333",
          textAlign: "center",
        }}
      >
        Survey Insights: Violence Against Women
      </h1>

      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: "22px", marginBottom: "10px", color: "#e91e63" }}
        >
          Key Insight
        </h2>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>{mainInference}</p>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "10px", color: "#333" }}>
          Total Responses: {filteredData.length}
        </h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
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
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
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
              <Pie dataKey="value" data={ageDistribution} fill="#8884d8" label>
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

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
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

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            gridColumn: "1 / -1",
          }}
        >
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
      </div>

      <div
        style={{
          marginTop: "30px",
          backgroundColor: "#e8f5e9",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            marginBottom: "15px",
            color: "#2e7d32",
            textAlign: "center",
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
                textAlign: "center",
              }}
            >
              • {inference}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SurveyInsightsDashboard;
