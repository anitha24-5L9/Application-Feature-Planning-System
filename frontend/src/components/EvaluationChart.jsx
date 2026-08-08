import { useEffect, useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getAnalytics } from "../services/analyticsService";

import "../styles/EvaluationChart.css";

export default function EvaluationChart({ flagKey, refresh }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, [flagKey, refresh]);

  async function loadAnalytics() {
    try {
      const analytics = await getAnalytics();

      const filtered = analytics
        .filter((item) => item.flag_key === flagKey)
        .map((item) => ({
          date: `${item.date} ${String(item.hour).padStart(2, "0")}:00`,
          count: Number(item.evaluation_count) || 0,
        }));

      setData(filtered);
    } catch (error) {
      console.error("Analytics loading failed", error);
      setData([]);
    }
  }

  const totalEvaluations = data.reduce(
    (total, item) => total + item.count,
    0
  );

  const highestCount =
    data.length > 0
      ? Math.max(...data.map((item) => item.count))
      : 0;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h3>Evaluation Analytics</h3>
          <p>Feature flag evaluation activity over time</p>
        </div>

        <div className="analytics-summary">
          <div className="analytics-stat">
            <span>Total Evaluations</span>
            <strong>{totalEvaluations}</strong>
          </div>

          <div className="analytics-stat">
            <span>Peak</span>
            <strong>{highestCount}</strong>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="analytics-empty">
          <div className="analytics-empty-icon">📊</div>
          <h4>No evaluation data yet</h4>
          <p>
            Evaluate this feature flag to start generating analytics.
          </p>
        </div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={330}>
            <AreaChart
              data={data}
              margin={{
                top: 15,
                right: 20,
                left: 5,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient
                  id="evaluationGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#60a5fa"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="100%"
                    stopColor="#60a5fa"
                    stopOpacity={0.03}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="var(--chart-grid)"
                strokeDasharray="4 5"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{
                  fill: "var(--chart-text)",
                  fontSize: 12,
                }}
                axisLine={{
                  stroke: "var(--chart-axis)",
                }}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "var(--chart-text)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  stroke: "#60a5fa",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  background: "var(--tooltip-bg)",
                  border: "1px solid var(--tooltip-border)",
                  borderRadius: "10px",
                  boxShadow: "var(--shadow)",
                  color: "var(--text-primary)",
                }}
                labelStyle={{
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  marginBottom: "5px",
                }}
                itemStyle={{
                  color: "#60a5fa",
                  fontWeight: 700,
                }}
              />

              <Area
                type="monotone"
                dataKey="count"
                stroke="#60a5fa"
                strokeWidth={3}
                fill="url(#evaluationGradient)"
                activeDot={{
                  r: 6,
                  strokeWidth: 3,
                  stroke: "var(--card-bg)",
                  fill: "#60a5fa",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}