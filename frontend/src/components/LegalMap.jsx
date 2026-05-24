import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "500px"
};

function LegalMap({ initialLat, initialLng, prefillSearch }) {
  const [center, setCenter] = useState({ lat: initialLat || 18.5204, lng: initialLng || 73.8567 });
  const [lawyers, setLawyers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [radius, setRadius] = useState(3000);
  const [searchCity, setSearchCity] = useState(prefillSearch || '');
  const [userInput, setUserInput] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  // �️ Search by City Name (Uses Geocoding)
  const handleCitySearch = async (manualCity) => {
    const city = manualCity || searchCity;
    if (!city) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/geocode?address=${encodeURIComponent(city)}`);
      const data = await response.json();
      
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        setCenter({ lat, lng });
        fetchLawyers(lat, lng, radius);
      } else {
        console.error("Location not found:", city);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  // 📍 Get User Location (manual button)
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCenter({ lat, lng });
      fetchLawyers(lat, lng, radius);
    }, (err) => {
      console.warn("Geolocation failed:", err);
      fetchLawyers(center.lat, center.lng, radius);
    });
  };

  // 🚀 Category Detection Logic
  const detectCategory = (text) => {
    const input = text.toLowerCase();
    if (input.includes('divorce') || input.includes('marriage')) return { category: 'family lawyer', msg: 'Searching for family law specialists...' };
    if (input.includes('land') || input.includes('rent') || input.includes('property')) return { category: 'property lawyer', msg: 'Searching for property legal experts...' };
    if (input.includes('police') || input.includes('arrest')) return { category: 'criminal lawyer', msg: 'Searching for criminal defense counsel...' };
    if (input.includes('fraud') || input.includes('hacking')) return { category: 'cyber crime lawyer', msg: 'Finding cyber law experts...' };
    if (input.includes('business') || input.includes('company')) return { category: 'corporate lawyer', msg: 'Searching for corporate legal advisors...' };
    return { category: 'lawyer', msg: 'Finding general legal professionals near you.' };
  };

  const handleAiSearch = () => {
    if (!userInput) return;
    const { category, msg } = detectCategory(userInput);
    setAiMessage(msg);
    
    // Get location and then search
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setCenter({ lat, lng });
      fetchLawyers(lat, lng, radius, category);
    }, () => {
      // Fallback
      fetchLawyers(center.lat, center.lng, radius, category);
    });
  };

  // �🌐 Updated Fetch (Added keyword support)
  const fetchLawyers = (lat, lng, radius, keyword = 'lawyer') => {
    // UPDATED: Using keyword-based discovery
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const url = `${API_URL}/lawyers?lat=${lat}&lng=${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}`;
    console.log('📡 [LegalMap] API_URL:', API_URL);
    console.log('📡 [LegalMap] Fetching lawyers from:', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('✅ Received lawyers data:', data);
        setLawyers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        setLawyers([]);
      });
  };

  // 🚀 Auto-fetch data on component mount
  useEffect(() => {
    if (prefillSearch) {
      handleCitySearch(prefillSearch);
    } else if (initialLat && initialLng) {
      setCenter({ lat: initialLat, lng: initialLng });
      fetchLawyers(initialLat, initialLng, radius);
    } else {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCenter({ lat, lng });
        fetchLawyers(lat, lng, radius);
      }, (error) => {
        console.error('Geolocation error:', error);
        // Fallback to Pune
        fetchLawyers(18.5204, 73.8567, 5000);
      });
    }
  }, [initialLat, initialLng, prefillSearch]);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      loading="async"
    >
      
      {/* � AI LAWYER FINDER SECTION (ADD THIS) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">AI Lawyer Finder</h3>
        <p className="text-slate-500 text-sm font-medium mb-4">Describe your legal problem and we'll find the right specialist for your location.</p>
        
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Describe your legal problem (e.g. My landlord is not returning my deposit...)" 
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAiSearch()}
          />
          <button 
            onClick={handleAiSearch}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
          >
            Find Lawyer
          </button>
        </div>

        {aiMessage && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="text-xl">🤖</span>
            <p className="text-blue-900 font-bold text-sm leading-relaxed">{aiMessage}</p>
          </div>
        )}
      </div>

      {/* 🔍 Controls (UPDATE THIS) */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
        <div className="flex-1 flex gap-2">
          <input 
            type="text" 
            placeholder="Search by Court Location (e.g. Mumbai Court)" 
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
          />
          <button 
            onClick={handleCitySearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={getLocation}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-2 hover:bg-black transition-colors"
          >
            📍 My Location
          </button>

          <select 
            onChange={(e) => {
              setRadius(e.target.value);
              fetchLawyers(center.lat, center.lng, e.target.value);
            }}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white"
          >
            <option value="1000">1 KM Radius</option>
            <option value="3000" selected>3 KM Radius</option>
            <option value="5000">5 KM Radius</option>
            <option value="10000">10 KM Radius</option>
          </select>
        </div>
      </div>

      {/* 🗺️ Map */}
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        
        {/* User Location Marker */}
        <Marker 
          position={center} 
          icon={{
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
              </svg>
            `),
            scaledSize: { width: 24, height: 24 }
          }}
        />

        {/* Lawyer Markers */}
        {Array.isArray(lawyers) &&
          lawyers.map((lawyer, index) => (
            <Marker
              key={index}
              position={{
                lat: lawyer.geometry?.location?.lat || lawyer.lat,
                lng: lawyer.geometry?.location?.lng || lawyer.lng,
              }}
              onClick={() => setSelected(lawyer)}
            />
          ))}

        {/* Info Window */}
        {selected && (
          <InfoWindow
            position={{
              lat: selected.geometry?.location?.lat || selected.lat,
              lng: selected.geometry?.location?.lng || selected.lng,
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h3>{selected.name}</h3>
              <p>{selected.vicinity || selected.address || "Address not available"}</p>
              <p>📞 {selected.international_phone_number || selected.phone || "No phone available"}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* 📜 Lawyer List (ADD THIS) */}
      <div className="mt-8 space-y-4">
        <h4 className="text-lg font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-3">
          <span>📋</span> Nearby Specialists Found ({lawyers.length})
        </h4>
        
        {lawyers.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-sm">No specialists discovered in this radius yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lawyers.map((lawyer, index) => (
              <div 
                key={index} 
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selected === lawyer ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
                onClick={() => {
                  setSelected(lawyer);
                  setCenter({
                    lat: lawyer.geometry?.location?.lat || lawyer.lat,
                    lng: lawyer.geometry?.location?.lng || lawyer.lng
                  });
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{lawyer.name}</h5>
                  <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-black tracking-widest">
                    ⭐ {lawyer.rating || 'N/A'}
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                  {lawyer.vicinity || lawyer.address || "Address details currently unavailable"}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                  <span>📍 View on Map</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LoadScript>
  );
}

export default LegalMap;