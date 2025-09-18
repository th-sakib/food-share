import CountUp from "react-countup";
import Title from "../../../components/Title";

export default function ImpactStats() {
  const stats = [
    { id: 1, icon: "🥗", label: "Meals Shared", value: 500 },
    { id: 2, icon: "🌱", label: "Food Saved (tons)", value: 1.2, decimals: 1 },
    { id: 3, icon: "❤️", label: "Families Helped", value: 200 },
    { id: 4, icon: "🙎", label: "Lives Saved", value: 500 },
  ];

  return (
    <div className="py-12">
      <Title titleName="Our Impact" />

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-2">{stat.icon}</div>
            <h3 className="text-3xl font-bold text-green-700">
              <CountUp
                end={stat.value}
                duration={2.5}
                decimals={stat.decimals || 0}
              />
              +
            </h3>
            <p className="text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
