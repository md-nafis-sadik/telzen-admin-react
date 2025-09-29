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

const { Option } = Select;

const SalesLineChart = ({
  data,
  year,
  currencyCode,
  setYear,
  setCurrency,
  isLoading,
}) => {
  const currency = getSymbol(currencyCode);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  const formatYAxisValue = (value) => {
    if (value >= 1000000000) {
      return `${currency}${(value / 1000000000).toFixed(0)}B`;
    }
    if (value >= 1000000) {
      return `${currency}${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `${currency}${(value / 1000).toFixed(0)}k`;
    }
    return `${currency}${value}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-800">Sales</h2>
        <div className="flex gap-2">
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
          {/* <div>
            <span className="text-black-600">Currency :</span>
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
              value={currencyCode}
              onChange={(value) => setCurrency(value)}
              disabled={isLoading}
            >
              <Option key="USD" value="USD">
                USD
              </Option>
              <Option key="EUR" value="EUR">
                EUR
              </Option>
            </Select>
          </div> */}
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
            />
            <YAxis
              tickFormatter={formatYAxisValue}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [
                `${currency}${value.toLocaleString()}`,
                "Sales",
              ]}
              labelFormatter={(name) => `Month: ${name}`}
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
