import React, { useState } from 'react';

export default function AddMedModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    drug_name: '',
    dosage: '',
    frequency: 'Once daily',
    start_date: new Date().toISOString().split('T')[0],
    instructions: '',
  });
  const [safetyStatus, setSafetyStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkSafety = async () => {
    if (!formData.drug_name || !formData.dosage) return;
    setChecking(true);
    setSafetyStatus(null);
    try {
      const res = await fetch('http://localhost:3000/api/med/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'demo_patient_123',
          medication: formData
        })
      });
      const result = await res.json();
      console.log('Safety check result:', result); // DEBUG
      setSafetyStatus(result);
    } catch (err) {
      console.error('Safety check error:', err);
      setSafetyStatus({ status: 'ERROR', message: 'Network error' });
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = () => {
    if (safetyStatus?.status === 'CRITICAL') {
      if (window.confirm('CRITICAL: Continue anyway?')) {
        onSubmit(formData);
      }
    } else if (safetyStatus?.medication) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Medication</h2>
        
        <input
          placeholder="Medication Name *"
          value={formData.drug_name}
          onChange={(e) => setFormData({ ...formData, drug_name: e.target.value })}
          className="w-full p-3 border rounded-lg mb-3"
          required
        />
        
        <input
          placeholder="Dosage (e.g. 650mg) *"
          value={formData.dosage}
          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
          className="w-full p-3 border rounded-lg mb-3"
          required
        />

        <select
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          className="w-full p-3 border rounded-lg mb-3"
        >
          <option>Once daily</option>
          <option>Twice daily</option>
          <option>Thrice daily</option>
          <option>As needed</option>
        </select>

        <input
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          className="w-full p-3 border rounded-lg mb-3"
        />

        <input
          placeholder="Instructions (e.g. After Food)"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <button
          onClick={checkSafety}
          disabled={checking || !formData.drug_name || !formData.dosage}
          className="w-full bg-yellow-600 text-white py-2 rounded-lg mb-2 disabled:opacity-50"
        >
          {checking ? 'Checking...' : 'Check Safety'}
        </button>

        {safetyStatus && (
          <div className={`p-3 rounded-lg mb-3 text-sm font-medium ${
            safetyStatus.status === 'CRITICAL' ? 'bg-red-100 text-red-800' :
            safetyStatus.status === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
            safetyStatus.status === 'SAFE' || safetyStatus.medication ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {safetyStatus.message || 'Medication added safely!'}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!safetyStatus || checking}
          className="w-full bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
        >
          Add Medication
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 text-gray-600 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}