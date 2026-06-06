import { useState } from 'react';
import { Upload, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SmartLawyerRecommendation() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [lawyers, setLawyers] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('upload'); // upload, analyzing, location, results
  const [category, setCategory] = useState('Corporate');

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);
    setStage('analyzing');

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      // Step 1: Upload document
      const uploadRes = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        body: formData,
      });
      const { job_id } = await uploadRes.json();
      setJobId(job_id);

      // Step 2: Poll for analysis results
      const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`http://127.0.0.1:5000/api/status/${job_id}`);
        const statusData = await statusRes.json();

        if (statusData.status === 'completed') {
          clearInterval(pollInterval);
          setAnalysis(statusData.analysis);
          setCategory(statusData.analysis.legalCategory);
          setLoading(false);
          setStage('location');

        } else if (statusData.status === 'failed') {
          clearInterval(pollInterval);
          alert('Analysis failed: ' + statusData.error);
          setLoading(false);
          setStage('upload');
        }
      }, 2000);
    } catch (err) {
      alert('Upload failed: ' + err.message);
      setLoading(false);
      setStage('upload');
    }
  };


  const findLawyers = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            "http://127.0.0.1:5000/api/recommend-lawyers",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                legalCategory: category,
                latitude: latitude,
                longitude: longitude,
                radius: 10000,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch lawyers");
          }

          const data = await response.json();

          setLawyers(data.lawyers || []);
          setSpecializations(data.recommendedSpecializations || []);
          setStage("results");
        } catch (err) {
          console.error(err);
          alert("Failed to find lawyers: " + err.message);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Unable to get location");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };


  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Smart Lawyer Recommendation</h1>

        {/* Stage 1: Upload Document */}
        {stage === 'upload' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">Upload Legal Document</h3>
            <p className="text-gray-600 mb-4">We'll analyze it and recommend the right lawyer</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700"
            >
              Choose PDF File
            </label>
          </div>
        )}

        {/* Stage 2: Analyzing */}
        {stage === 'analyzing' && (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <h3 className="text-xl font-semibold mb-2">Analyzing Document...</h3>
            <p className="text-gray-600">Extracting text and identifying legal category</p>
          </div>
        )}

        {/* Stage 3: Analysis Complete - Get Location */}
        {stage === 'location' && analysis && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Document Analysis Complete</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <span className="ml-2 font-semibold">{analysis.legalCategory}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Score:</span>
                      <span className={`ml-2 font-semibold ${
                        analysis.riskScore > 70 ? 'text-red-600' :
                        analysis.riskScore > 30 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {analysis.riskScore}/100
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Urgency:</span>
                      <span className="ml-2 font-semibold">{analysis.urgencyLevel}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">{analysis.summary}</p>
                </div>
              </div>
            </div>

            {/* Category Override Selection */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <label className="block font-semibold mb-2 text-gray-700">
                Legal Category (Auto-detected: {analysis.legalCategory})
              </label>
              <p className="text-sm text-gray-600 mb-3">
                You can override the detected category if needed:
              </p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Corporate">Corporate</option>
                <option value="Criminal">Criminal</option>
                <option value="Employment">Employment</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Intellectual Property">Intellectual Property</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="text-center">
              <button
                onClick={findLawyers}
                disabled={loading}
                className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Finding Lawyers...
                  </>
                ) : (
                  <>
                    <MapPin size={24} />
                    Find {category} Lawyers Near Me
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Stage 4: Results */}
        {stage === 'results' && (
          <div className="space-y-6">
            {/* Recommended Specializations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">Recommended Specializations for {category}</h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Lawyers List */}
            <div>
              <h3 className="font-semibold text-xl mb-4">
                Found {lawyers.length} Lawyers Nearby
              </h3>
              <div className="space-y-4">
                {lawyers.map((lawyer, idx) => (
                  <div
                    key={idx}
                    className="border rounded-xl p-5 hover:shadow-lg transition bg-white"
                  >
                    
                    <h4 className="font-bold text-lg">
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
            </div>

            <button
              onClick={() => {
                setStage('upload');
                setFile(null);
                setAnalysis(null);
                setLawyers([]);
                setCategory('Corporate');
              }}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Analyze Another Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
