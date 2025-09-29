import React from "react";
import { Select } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const { Option } = Select;

const UserGrowthChart = ({ data, year, setYear, isLoading }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-800">User Growth</h2>
        <div>
          <span className="text-black-600">Year :</span>
          <Select
            popupMatchSelectWidth={false}
            className={`
              text-sm rounded-md inline-block w-auto ml-1
              [&_.ant-select-selector]:!h-7
              [&_.ant-select-selector]:!w-[66px]
              [&_.ant-select-selector]:!px-2
              [&_.ant-select-selector]:!flex
              [&_.ant-select-selector]:!items-center
            `}
            value={year.toString()}
            onChange={(value) => setYear(Number(value))}
            disabled={isLoading}
          >
            {years.map((yr) => (
              <Option key={yr} value={yr.toString()}>
                {yr}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value) => [value, "Users"]}
              labelFormatter={(name) => `Month: ${name}`}
            />
            <Bar
              dataKey="users"
              fill="#FF97A4"
              barSize={25}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;
