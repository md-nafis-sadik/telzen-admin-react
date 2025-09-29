import React from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ChartRecieve = ({ title, data }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-between ">
      <div className="flex items-center justify-between">
        <p className="text-base sm:text-lg lg:text-2xl text-blackHigh font-bold">
          {t(title)}
        </p>
        <span className="inline-block px-4 py-2 bg-primaryMainLight text-whiteHigh text-xs sm:text-sm rounded-full">
          {t("navigations.monthly")}
        </span>
      </div>
      <div className="flex items-center justify-start gap-6 mt-8 mb-10 text-xs sm:text-base">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primaryMainLight"></div>
          <p>{t("navigations.sales")}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full bg-secondaryMain"></div>
          <p>{t("navigations.recieve")}</p>
        </div>
      </div>
      <section className="overflow-x-auto overflow-y-hidden flex items-center justify-center">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="gradientLoan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#54ADAA" />
                <stop offset="100%" stopColor="rgba(84, 173, 170, 0.40)" />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient id="gradientLoanTwo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FD5D5D" />
                <stop offset="100%" stopColor="rgba(253, 93, 93, 0.40)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {/* <Legend /> */}
            <Bar
              dataKey="recieved"
              fill="url(#gradientLoanTwo)"
              radius={[24, 24, 0, 0]}
            />
            <Bar
              dataKey="sales"
              fill="url(#gradientLoan)"
              radius={[24, 24, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default ChartRecieve;
