// custom tooltip component
const ChartTooltip = ({ active, payload, label, isPartial = false }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-main-500 py-4 px-3 text-white rounded-lg">
                <p className="label">
                    {!isPartial ? `${payload[0].value}` : `${(payload[0].value / 1000).toFixed(2)}K AED`}  { }
                </p>

            </div>
        );
    }
    return null;
};

export default ChartTooltip;