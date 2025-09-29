import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ChartLine = ({ title, data }) => {
  return (
    <div className="flex flex-col justify-between bg-white p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <p className="text-base sm:text-lg lg:text-2xl text-blackHigh font-bold">
          {title}
        </p>
        <span className="inline-block px-4 py-2 bg-primaryMainLight text-whiteHigh text-xs sm:text-sm rounded-full"></span>
      </div>
      <div className="flex items-center justify-start gap-6 mt-8 mb-10 text-xs sm:text-base">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full bg-infoHigh"></div>
          <p>This Month</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full bg-errorHigh"></div>
          <p>Last Month</p>
        </div>
      </div>
      <section className="overflow-x-auto overflow-y-hidden flex items-center justify-center">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient
                id="gradientLineTwo"
                x1="509.559"
                y1="1.18445"
                x2="2.48425"
                y2="68.2832"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F93A6E" />
                <stop offset="0.0001" stopColor="#F93A6E" />
                <stop offset="1" stopColor="#F93A6E" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient
                id="gradientLine"
                x1="256"
                y1="1.5004"
                x2="256"
                y2="165.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3790FA" />
                <stop offset="1" stopColor="#3790FA" stopOpacity="0.29" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {/* <Legend /> */}

            <Line
              type="monotone"
              dataKey="previous"
              stroke="url(#gradientLineTwo)"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="url(#gradientLine)"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default ChartLine;
