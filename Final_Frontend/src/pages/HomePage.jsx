import { useEffect, useState } from "react";

export default function HomePage() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await fetch(apiUrl + 'api/charities');
        if (!response.ok) {
          throw new Error("Failed to fetch charities");
        }
        const data = await response.json();
        setCharities(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div className="flex flex-col md:flex-row items-center gap-10 mb-24">
        <div className="w-full md:w-1/2 transform transition-transform duration-300 hover:scale-105">
          <img
            src="/donation.jpg"
            alt="Donation Visual"
            className="w-full h-full object-cover rounded-xl shadow-xl"
          />
        </div>

        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-100 to-white rounded-xl p-8 shadow-lg text-center md:text-left transform transition-transform duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Giving is not just about making a donation — it’s about making a difference.
          </h2>
          <p className="text-gray-700 text-lg">
            QuickGive is your one-stop donation hub — connecting generous hearts with those in need. Join our mission to uplift communities, one act of kindness at a time.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border rounded-lg p-6 shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Charities</h2>
        {loading ? (
          <p className="text-gray-600">Loading charities...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : charities.length === 0 ? (
          <p className="text-gray-600">No charities available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-left border-t border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 font-medium text-gray-600">Category</th>
                  <th className="py-2 px-4 font-medium text-gray-600">Name</th>
                  <th className="py-2 px-4 font-medium text-gray-600">Email</th>
                  <th className="py-2 px-4 font-medium text-gray-600">Address</th>
                </tr>
              </thead>
              <tbody>
                {charities.map((charity) => (
                  <tr key={charity._id} className="border-t">
                    <td className="py-2 px-4">{charity.category}</td>
                    <td className="py-2 px-4">{charity.name}</td>
                    <td className="py-2 px-4">{charity.email}</td>
                    <td className="py-2 px-4">{charity.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
