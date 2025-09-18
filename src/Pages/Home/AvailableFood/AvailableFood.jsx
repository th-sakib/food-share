import Title from "../../../components/Title";
import bread from "../../../assets/images/foods/top-view-bread-slices-wheat-spikes-grains-dark-table-with-free-space.jpg"
import vagetables from "../../../assets/images/foods/healthy-ingredients-included-salad.jpg"

const foodItems = [
  {
    id: 1,
    name: "Fresh Bread",
    expiry: "Today 8 PM",
    location: "Downtown",
    image: bread,
  },
  {
    id: 2,
    name: "Vegetables",
    expiry: "Tomorrow",
    location: "City Market",
    image: vagetables,
  },
  {
    id: 4,
    name: "Fresh Bread",
    expiry: "Tomorrow",
    location: "City Market",
    image: bread,
  },
];

function AvailableFood() {
  return (
    <div>
      <Title titleName="Available Food" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foodItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4"
          >
            {/* Food Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />

            {/* Food Info */}
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">📍 {item.location}</p>
            <p className="text-sm text-red-500">⏰ {item.expiry}</p>

            {/* Action */}
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
              Request Food
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableFood;
