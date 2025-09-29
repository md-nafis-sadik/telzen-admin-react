import React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ChartArea = ({ title, data }) => {

  return (
    <div className="flex flex-col justify-between bg-white p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <p className="text-base smtext-lg lg:text-2xl text-blackHigh font-bold">
          {title}
        </p>
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
          <ComposedChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              bottom: 5,
              left: 5,
            }}
          >
            {/* <defs>
              <linearGradient
                id="gradientColor"
                x1="250.907"
                y1="-60.8982"
                x2="255.512"
                y2="156.531"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3790FA" />
                <stop offset="1" stopColor="white" stopOpacity="0.25" />
              </linearGradient>
            </defs> */}
            <defs>
              <linearGradient
                id="gradientColor"
                x1="250.907"
                y1="-60.8982"
                x2="255.512"
                y2="156.531"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3790FA" />
                <stop offset="1" stopColor="white" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E8E8E8" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="previous"
              fill="none"
              stroke="#F93A6E"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="current"
              fill="url(#gradientColor)"
              stroke="#3790FA"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default ChartArea;
