import React, { useState } from 'react';
import { Pill, Clock, Calendar, CheckCircle, Circle, Languages, AlertCircle } from 'lucide-react';

export default function MedCard({ medication, onMarkTaken, onTranslate }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  const handleTranslate = () => {
    if (!showTranslation) {
      onTranslate(medication.id, selectedLanguage);
    }
    setShowTranslation(!showTranslation);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto">
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{medication.name}</h2>
            <p className="text-blue-100 text-lg">{medication.dosage}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            medication.safety_status === 'safe'
              ? 'bg-green-500/20 text-green-100'
              : medication.safety_status === 'warning'
              ? 'bg-yellow-500/20 text-yellow-100'
              : 'bg-red-500/20 text-red-100'
          }`}>
            <AlertCircle className="w-3 h-3" />
            {medication.safety_status === 'safe' ? 'Safe' : medication.safety_status === 'warning' ? 'Check Interactions' : 'Contraindication'}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Frequency</p>
              <p className="font-semibold">{medication.frequency}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Dose</p>
              <p className="font-semibold">{medication.next_dose}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Instructions</h3>
            <button
              onClick={handleTranslate}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm font-medium transition"
            >
              <Languages className="w-4 h-4" />
              {showTranslation ? 'Original' : 'Translate'}
            </button>
          </div>

          {showTranslation && (
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none"
            >
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="zh">Chinese</option>
              <option value="ar">Arabic</option>
            </select>
          )}

          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
            {showTranslation && medication.translated_instructions
              ? medication.translated_instructions
              : medication.instructions}
          </p>
        </div>

        <button
          onClick={() => onMarkTaken(medication.id)}
          disabled={medication.taken}
          className={`w-full py-3 rounded-xl font-semibold transition duration-200 flex items-center justify-center gap-2 ${
            medication.taken
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {medication.taken ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Marked as Taken
            </>
          ) : (
            <>
              <Circle className="w-5 h-5" />
              Mark as Taken
            </>
          )}
        </button>
      </div>
    </div>
  );
}

