import React from 'react';
import { Plus, Bell, User, Pill } from 'lucide-react';

export default function Dashboard({ medications, onAddMed, onMedClick, userName }) {
  const upcomingMeds = medications.filter(m => !m.taken);
  const takenToday = medications.filter(m => m.taken).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Hello, {userName}</h1>
            <p className="text-gray-600">Track your medications with ease</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-11 h-11 bg-white rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-11 h-11 bg-white rounded-xl shadow-md flex items-center justify-center hover:shadow-lg transition">
              <User className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Taken Today</span>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{takenToday}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Upcoming</span>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{upcomingMeds.length}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Medications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.map(med => (
              <div
                key={med.id}
                onClick={() => onMedClick(med.id)}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{med.name}</h3>
                    <p className="text-sm text-gray-600">{med.dosage}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    med.safety_status === 'safe' ? 'bg-green-500' :
                    med.safety_status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{med.frequency}</span>
                  <span className={`font-medium ${med.taken ? 'text-green-600' : 'text-blue-700'}`}>
                    {med.taken ? 'Taken' : med.next_dose}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onAddMed}
          className="fixed bottom-6 right-6 w-16 h-16 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-2xl hover:shadow-3xl transition duration-200 flex items-center justify-center group"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
