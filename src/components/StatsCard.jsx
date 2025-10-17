// src/components/StatsCard.jsx

const StatsCard = ({ label, count, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between border-l-4" style={{ borderLeftColor: color }}>
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-4xl font-bold" style={{ color }}>{count}</p>
      </div>
      <div className="text-5xl">{icon}</div>
    </div>
  );
};

export default StatsCard;