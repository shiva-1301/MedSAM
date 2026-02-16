import React, { useState } from 'react';
import './MedicineScannerBot.css';

const MedicineScannerBot = () => {
  // Get API URL from environment or default to localhost for development
  const API_BASE_URL = process.env.REACT_APP_FASTAPI_URL || 'http://localhost:8000';
  
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('upload'); // upload, extracted, parsed, search, interaction
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for workflow
  const [uploadedImage, setUploadedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [drugSearchResults, setDrugSearchResults] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [currentMedication, setCurrentMedication] = useState('');
  const [interactionResult, setInteractionResult] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);

      // Extract text from image
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/extract-text`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setExtractedText(result.text);
        setStep('extracted');

        // Automatically parse the extracted text
        await parseExtractedText(result.text);
      } else {
        setError(result.error || 'Failed to extract text');
      }
    } catch (err) {
      setError('Error uploading image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseExtractedText = async (text) => {
    if (!text) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/parse-medicine-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (result.success) {
        const parsed = JSON.parse(result.parsed_data);
        setParsedData(parsed);
        setStep('parsed');

        // Automatically search drugs
        if (parsed.names && parsed.names.length > 0) {
          await searchDrugsInDatabase(parsed.names);
        }
      } else {
        setError(result.error || 'Failed to parse medicine data');
      }
    } catch (err) {
      setError('Error parsing text: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchDrugsInDatabase = async (names) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/search-drugs-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names }),
      });

      const result = await response.json();

      if (result.success) {
        setDrugSearchResults(result.results);
        setStep('search');
      } else {
        setError(result.error || 'Failed to search drugs');
      }
    } catch (err) {
      setError('Error searching drugs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectDrug = (drugData) => {
    setSelectedDrug(drugData);
    setStep('interaction');
    setCurrentMedication('');
  };

  const checkInteraction = async () => {
    if (!selectedDrug || !currentMedication) {
      setError('Please select a drug and enter your current medication');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/check-interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_med: currentMedication,
          new_drug: selectedDrug.drug_name,
        }),
      });

      const result = await response.json();
      setInteractionResult(result);
    } catch (err) {
      setError('Error checking interaction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetBot = () => {
    setStep('upload');
    setUploadedImage(null);
    setExtractedText('');
    setParsedData(null);
    setDrugSearchResults([]);
    setSelectedDrug(null);
    setCurrentMedication('');
    setInteractionResult(null);
    setError('');
  };

  const closeBot = () => {
    setIsOpen(false);
    resetBot();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center text-white"
        title="Medicine Scanner"
      >
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10.5 1.5H9.5V0h1v1.5zM14.5 4.5L13.8 3.8l1.06-1.06l.7.7l-1.06 1.06zM17 9.5h1.5v1h-1.5zM14.5 15.5l1.06-1.06.7.7-1.06 1.06-.7-.7zM9.5 18h1v1.5h-1V18zM5.5 15.5l-.7.7-1.06-1.06.7-.7 1.06 1.06zM3 9.5H1.5v1H3v-1zM5.5 4.5l1.06 1.06-.7.7L4.8 5.2l.7-.7zM10 5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          {/* Modal Container */}
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">💊 Medicine Scanner</h2>
              <button
                onClick={closeBot}
                className="text-2xl hover:text-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {step === 'upload' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">📸 Upload Medicine Image</h3>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="imageInput" className="cursor-pointer">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-gray-600">Click to upload or drag image</p>
                      <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                  {loading && <p className="text-center text-blue-600">Processing image...</p>}
                </div>
              )}

              {step === 'extracted' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">📝 Extracted Text</h3>
                  {uploadedImage && (
                    <img src={uploadedImage} alt="Uploaded" className="w-full rounded-lg max-h-40 object-cover" />
                  )}
                  <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{extractedText}</p>
                  </div>
                  {loading && <p className="text-center text-blue-600">Parsing medicine data...</p>}
                </div>
              )}

              {step === 'parsed' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">🔍 Parsed Medicine Information</h3>
                  {parsedData && (
                    <div className="space-y-3">
                      {parsedData.names && parsedData.names.length > 0 && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-blue-900">💊 Names</h4>
                          <ul className="text-sm text-blue-800 mt-1">
                            {parsedData.names.map((name, i) => <li key={i}>• {name}</li>)}
                          </ul>
                        </div>
                      )}
                      {parsedData.dosage && parsedData.dosage.length > 0 && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-green-900">⚖️ Dosage</h4>
                          <ul className="text-sm text-green-800 mt-1">
                            {parsedData.dosage.map((dose, i) => <li key={i}>• {dose}</li>)}
                          </ul>
                        </div>
                      )}
                      {parsedData.caution_notes && parsedData.caution_notes.length > 0 && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-yellow-900">⚠️ Caution Notes</h4>
                          <ul className="text-sm text-yellow-800 mt-1">
                            {parsedData.caution_notes.map((note, i) => <li key={i}>• {note}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  {loading && <p className="text-center text-blue-600">Searching drug database...</p>}
                </div>
              )}

              {step === 'search' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">🔎 Select Medicine from Database</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {drugSearchResults.map((result, idx) => (
                      result.found ? (
                        <button
                          key={idx}
                          onClick={() => selectDrug(result)}
                          className="w-full text-left p-3 bg-gray-50 hover:bg-blue-100 rounded-lg transition border-l-4 border-blue-500"
                        >
                          <p className="font-semibold text-gray-800">{result.drug_name}</p>
                          <p className="text-xs text-gray-600">Generic: {result.generic_name}</p>
                          <p className="text-xs text-gray-500 mt-1">Class: {result.pharm_class}</p>
                        </button>
                      ) : result.suggestions && result.suggestions.length > 0 ? (
                        <div key={idx} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                          <p className="text-xs font-semibold text-yellow-800 mb-2">
                            Similar matches for "{result.search_name}":
                          </p>
                          {result.suggestions.map((sugg, suggIdx) => (
                            <button
                              key={suggIdx}
                              onClick={() => selectDrug(sugg)}
                              className="w-full text-left text-xs p-2 bg-white hover:bg-yellow-100 rounded mb-1 transition"
                            >
                              {sugg.drug_name}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div key={idx} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                          <p className="text-xs text-red-600">❌ Not found: {result.search_name}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {step === 'interaction' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">⚠️ Check Drug Interactions</h3>
                  
                  {selectedDrug && (
                    <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                      <p className="text-sm font-semibold text-green-900">
                        Selected: {selectedDrug.drug_name}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Current Medication
                    </label>
                    <input
                      type="text"
                      value={currentMedication}
                      onChange={(e) => setCurrentMedication(e.target.value)}
                      placeholder="e.g., Aspirin, Warfarin"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {!interactionResult ? (
                    <button
                      onClick={checkInteraction}
                      disabled={loading || !currentMedication}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
                    >
                      {loading ? 'Checking...' : 'Check Interaction'}
                    </button>
                  ) : (
                    <div className={`p-4 rounded-lg ${interactionResult.interaction_found ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
                      {interactionResult.interaction_found ? (
                        <>
                          <h4 className="font-semibold text-red-900 mb-2">⚠️ Interaction Detected</h4>
                          <div className="text-sm text-red-800 space-y-2">
                            <div>
                              <strong>Severity:</strong> 
                              <span className={`ml-2 px-3 py-1 rounded font-semibold ${
                                interactionResult.ai_analysis?.severity === 'HIGH' ? 'bg-red-600 text-white' :
                                interactionResult.ai_analysis?.severity === 'MODERATE' ? 'bg-yellow-500 text-white' :
                                'bg-green-600 text-white'
                              }`}>
                                {interactionResult.ai_analysis?.severity}
                              </span>
                            </div>
                            <div>
                              <strong>Mechanism:</strong> {interactionResult.ai_analysis?.mechanism}
                            </div>
                            <div>
                              <strong>Risk:</strong> {interactionResult.ai_analysis?.risk}
                            </div>
                            <div>
                              <strong>Action:</strong> {interactionResult.ai_analysis?.action}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-green-900 font-semibold">✅ {interactionResult.message}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-between gap-3 bg-gray-50">
              <button
                onClick={resetBot}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Scan Another
              </button>
              <button
                onClick={closeBot}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicineScannerBot;
