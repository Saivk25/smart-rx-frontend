import React, { useState } from 'react';

export default function ProfileForm({ onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    allergies: '',
    conditions: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Your Health Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="allergies"
            placeholder="Allergies (comma-separated)"
            value={formData.allergies}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="conditions"
            placeholder="Conditions (comma-separated)"
            value={formData.conditions}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}