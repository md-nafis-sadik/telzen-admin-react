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
import { getFilterOptions } from "../../../utils/chartFilters";

const { Option } = Select;

const UserGrowthChart = ({ data, filter, setFilter, isLoading }) => {
  const filterOptions = getFilterOptions();

  const formatXAxisLabel = (value) => {
    if (!value) return '';
    return String(value).substring(0, 3);
  };

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-800">User Growth</h2>
        <div>
          <span className="text-black-600">Filter:</span>
          <Select
            popupMatchSelectWidth={false}
            className={`
              text-sm rounded-md inline-block w-auto ml-1
              [&_.ant-select-selector]:!h-7
              [&_.ant-select-selector]:!min-w-[120px]
              [&_.ant-select-selector]:!px-2
              [&_.ant-select-selector]:!flex
              [&_.ant-select-selector]:!items-center
            `}
            value={filter}
            onChange={(value) => setFilter(value)}
            disabled={isLoading}
          >
            {filterOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
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
              tickFormatter={formatXAxisLabel}
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value) => [value, "Users"]}
              labelFormatter={(name) => `${name}`}
            />
            <Bar
              dataKey="users"
              fill="#00C896"
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
