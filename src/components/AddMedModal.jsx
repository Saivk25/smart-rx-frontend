import React, { useState } from 'react';
import { X, Pill, AlertTriangle, Check, Loader } from 'lucide-react';

export default function AddMedModal({ onClose, onSubmit, onCheckSafety }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    instructions: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const [safetyResult, setSafetyResult] = useState(null);
  const [isCheckingSafety, setIsCheckingSafety] = useState(false);
  const [step, setStep] = useState('form');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckSafety = async () => {
    setIsCheckingSafety(true);
    try {
      const result = await onCheckSafety(formData);
      setSafetyResult(result);
      setStep('safety');
    } catch (error) {
      console.error('Safety check failed:', error);
    } finally {
      setIsCheckingSafety(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 'form') {
      handleCheckSafety();
    } else {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Add Medication</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-gray-100 rounded-xl flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 'form' ? (
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Medication Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none transition"
                  placeholder="e.g., Lisinopril"
                />
              </div>

              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage *
                </label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none transition"
                  placeholder="e.g., 10mg"
                />
              </div>

              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency *
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none transition"
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>Four times daily</option>
                  <option>Every other day</option>
                  <option>As needed</option>
                </select>
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none transition resize-none"
                  placeholder="Take with food, avoid alcohol, etc."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className={`p-5 rounded-xl border-2 ${
                safetyResult?.status === 'safe'
                  ? 'bg-green-50 border-green-200'
                  : safetyResult?.status === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    safetyResult?.status === 'safe'
                      ? 'bg-green-500'
                      : safetyResult?.status === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}>
                    {safetyResult?.status === 'safe' ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold mb-1 ${
                      safetyResult?.status === 'safe'
                        ? 'text-green-900'
                        : safetyResult?.status === 'warning'
                        ? 'text-yellow-900'
                        : 'text-red-900'
                    }`}>
                      {safetyResult?.status === 'safe' ? 'Safe to Add' : safetyResult?.status === 'warning' ? 'Warning' : 'Potential Risk'}
                    </h3>
                    <p className={`text-sm ${
                      safetyResult?.status === 'safe'
                        ? 'text-green-800'
                        : safetyResult?.status === 'warning'
                        ? 'text-yellow-800'
                        : 'text-red-800'
                    }`}>
                      {safetyResult?.message}
                    </p>
                  </div>
                </div>

                {safetyResult?.interactions && safetyResult.interactions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-900">Potential Interactions:</p>
                    <ul className="space-y-1">
                      {safetyResult.interactions.map((interaction, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span>{interaction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">Medication Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dosage:</span>
                    <span className="font-medium text-gray-900">{formData.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium text-gray-900">{formData.frequency}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step === 'safety' && (
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isCheckingSafety}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCheckingSafety ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Checking Safety...
                </>
              ) : step === 'form' ? (
                'Check Safety'
              ) : (
                'Add Medication'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
