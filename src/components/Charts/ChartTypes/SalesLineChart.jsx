import React from "react";
import { Select } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getSymbol } from "../../../utils/currency";
import { getFilterOptions } from "../../../utils/chartFilters";

const { Option } = Select;

const SalesLineChart = ({
  data,
  filter,
  currency,
  setFilter,
  isLoading,
}) => {
  const currencySymbol = getSymbol(currency);
  const filterOptions = getFilterOptions();

  const formatYAxisValue = (value) => {
    if (value >= 1000000000) {
      return `${currencySymbol}${(value / 1000000000).toFixed(0)}B`;
    }
    if (value >= 1000000) {
      return `${currencySymbol}${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `${currencySymbol}${(value / 1000).toFixed(0)}k`;
    }
    return `${currencySymbol}${value}`;
  };

  const formatXAxisLabel = (value) => {
    if (!value) return '';
    return String(value).substring(0, 3);
  };

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-800">Sales</h2>
        <div className="flex gap-2">
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
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatXAxisLabel}
            />
            <YAxis
              tickFormatter={formatYAxisValue}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [
                `${currencySymbol}${value.toLocaleString()}`,
                "Sales",
              ]}
              labelFormatter={(name) => `${name}`}
              labelStyle={{ fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="limegreen"
              strokeWidth={2}
              dot={{
                stroke: "limegreen",
                strokeWidth: 2,
                fill: "#fff",
                r: 5,
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesLineChart;
