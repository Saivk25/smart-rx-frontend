import React from 'react';

export default function Dashboard({ medications, profile, onAdd, onScan, onMedClick }) {
  const takenToday = medications.filter(m => m.taken).length || 0;
  const upcoming = medications.length - takenToday;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
         \ <h1 className="text-3xl font-bold text-gray-900">Hello, {profile?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-gray-600">Track your medications with ease</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2">Taken Today</p>
            <p className="text-3xl font-bold text-green-600">{takenToday}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2">Upcoming</p>
            <p className="text-3xl font-bold text-blue-600">{upcoming}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Your Medications</h2>

        {medications.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            No medications yet. Tap the + button to add one!
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map(med => (
              <div
                key={med.id}
                onClick={() => onMedClick(med.id)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{med.drug_name}</h3>
                    <p className="text-sm text-gray-600">{med.dosage} • {med.instructions}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Next dose</p>
                    <p className="font-medium text-blue-700">
                      {med.ai_schedule?.schedule?.[0]?.time || '—'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating + Button */}
        <button
          onClick={onAdd}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center text-2xl font-bold hover:bg-blue-800 transition"
        >
          +
        </button>

        {/* Scan Button */}
        <button
          onClick={onScan}
          className="fixed bottom-24 right-8 w-14 h-14 bg-white border-2 border-blue-700 text-blue-700 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
} 
