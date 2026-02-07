/**
 * Chart filter options for dashboard analytics
 */
export const getFilterOptions = () => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  return [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'Last 6 Months', value: '6_months' },
    { label: `${currentYear}`, value: currentYear.toString() },
    { label: `${lastYear}`, value: lastYear.toString() },
  ];
};

export const DEFAULT_FILTER = '6_months';
