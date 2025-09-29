import React from "react";
import {
  Bar,
  CartesianGrid,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ChartBarNew = ({ title, data }) => {
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
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              bottom: 5,
              left: 5,
            }}
          >
            <CartesianGrid stroke="#E8E8E8" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="previous" fill="#F93A6E" />
            <Bar dataKey="current" fill="#3790FA" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default ChartBarNew;
