import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export default function LawyerFinder() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState("Corporate");

  const findNearbyLawyers = async () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setLocation({
          latitude,
          longitude
        });

        try {
          const response = await fetch(
            'http://127.0.0.1:5000/api/recommend-lawyers',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                legalCategory: 'Corporate',
                latitude: latitude,
                longitude: longitude,
                radius: 10000
              })
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch lawyers');
          }

          const data = await response.json();

          setLawyers(data.lawyers || []);

        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Find Nearby Lawyers</h2>

        <button
          onClick={findNearbyLawyers}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Searching...
            </>
          ) : (
            <>
              <MapPin size={20} />
              Find Lawyers Near Me
            </>
          )}
        </button>

        {location && (
          <p className="mt-4 text-sm text-gray-600">
            Searching near: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {lawyers.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">Found {lawyers.length} lawyers nearby</h3>
            {lawyers.map((lawyer, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
                <h4 className="font-semibold text-lg">
                  {lawyer.name}
                </h4>

                <p className="text-blue-600">
                  {lawyer.specialization}
                </p>

                <p className="text-gray-600">
                  Experience: {lawyer.experience_years} years
                </p>

                <p className="text-gray-600">
                  Phone: {lawyer.phone}
                </p>

                <p className="text-green-600 font-semibold mt-2">
                  {(lawyer.distance / 1000).toFixed(2)} km away
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
