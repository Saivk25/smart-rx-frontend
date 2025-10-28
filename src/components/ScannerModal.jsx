import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';

export default function ScannerModal({ onClose, onExtract, onUseExtracted }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const data = await onExtract(file);
      setExtractedData(data);
    } catch (err) {
      setError('Failed to extract medication information. Please try again or enter manually.');
      console.error('Extraction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseData = () => {
    if (extractedData) {
      onUseExtracted(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Scan Prescription</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-gray-100 rounded-xl flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {!extractedData && !isProcessing && (
            <>
              <p className="text-gray-600 mb-6 text-center">
                Take a photo or upload an image of your prescription label
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 rounded-xl transition duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 rounded-xl transition duration-200 flex items-center justify-center gap-3 border-2 border-gray-300"
                >
                  <Upload className="w-5 h-5" />
                  Upload Image
                </button>

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>

              <div className="mt-8 bg-blue-50 rounded-xl p-5">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Tips for Best Results
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Ensure good lighting without glare</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Keep the label flat and in focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Include the entire prescription label</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Avoid shadows and reflections</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {isProcessing && (
            <div className="text-center py-12">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />
              )}
              <Loader className="w-12 h-12 text-blue-700 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Processing Image...</h3>
              <p className="text-gray-600">Using AI to extract medication information</p>
            </div>
          )}

          {extractedData && (
            <div className="space-y-5">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Scanned prescription"
                  className="w-full h-48 object-cover rounded-xl"
                />
              )}

              <div className={`p-4 rounded-xl border-2 flex items-start gap-3 ${
                extractedData.confidence >= 0.8
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <CheckCircle className={`w-5 h-5 mt-0.5 ${
                  extractedData.confidence >= 0.8 ? 'text-green-600' : 'text-yellow-600'
                }`} />
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${
                    extractedData.confidence >= 0.8 ? 'text-green-900' : 'text-yellow-900'
                  }`}>
                    Confidence: {Math.round(extractedData.confidence * 100)}%
                  </p>
                  <p className={`text-xs mt-1 ${
                    extractedData.confidence >= 0.8 ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {extractedData.confidence >= 0.8
                      ? 'High confidence - information extracted successfully'
                      : 'Medium confidence - please verify the information'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-gray-900">Extracted Information</h3>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={extractedData.name}
                    onChange={(e) => setExtractedData({ ...extractedData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Dosage</label>
                  <input
                    type="text"
                    value={extractedData.dosage}
                    onChange={(e) => setExtractedData({ ...extractedData, dosage: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Frequency</label>
                  <input
                    type="text"
                    value={extractedData.frequency}
                    onChange={(e) => setExtractedData({ ...extractedData, frequency: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Instructions</label>
                  <textarea
                    value={extractedData.instructions}
                    onChange={(e) => setExtractedData({ ...extractedData, instructions: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setExtractedData(null);
                    setPreviewUrl(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Scan Again
                </button>
                <button
                  onClick={handleUseData}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
                >
                  Use This Data
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900 mb-1">Extraction Failed</p>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setPreviewUrl(null);
                  }}
                  className="mt-3 text-sm font-medium text-red-700 hover:text-red-800"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
