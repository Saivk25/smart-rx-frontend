import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import MedCard from './components/MedCard';
import AddMedModal from './components/AddMedModal';
import ScannerModal from './components/ScannerModal';

const PATIENT_ID = 'demo_patient_123';

function App() {
  const [currentView, setCurrentView] = useState('onboarding');
  const [medications, setMedications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProfile();
  }, []);

  useEffect(() => {
    if (currentView === 'dashboard') {
      loadMedications();
    }
  }, [currentView]);

  const checkProfile = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api//profile/get?id=${PATIENT_ID}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (data.name) {
          setCurrentView('dashboard');
        }
      }
    } catch (err) {
      console.error('Profile check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMedications = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api//med/list?id=${PATIENT_ID}`);
      const data = await res.json();
      setMedications(data || []);
    } catch (err) {
      toast.error('Failed to load medications');
    }
  };

  const handleProfileComplete = async (data) => {
  try {
    const res = await fetch('http://localhost:3000/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'demo_patient_123',
        profile: {
          name: data.name,
          age: Number(data.age),
          allergies: data.allergies ? data.allergies.split(',').map(a => a.trim()) : [],
          conditions: data.conditions ? data.conditions.split(',').map(c => c.trim()) : [],
        }
      })
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to save');
    }

    setProfile(data);
    setCurrentView('dashboard');
    toast.success('Profile saved!');
  } catch (err) {
    console.error('Save failed:', err);
    toast.error(err.message || 'Failed to save profile');
  }
};

  const handleAddMedSubmit = async (med) => {
  try {
    const res = await fetch('http://localhost:3000/api/med/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'demo_patient_123', medication: med })
    });
    const result = await res.json();
    console.log('Add result:', result); // DEBUG

    if (result.medication) {
      setMedications(prev => [result.medication, ...prev]);
      toast.success('Medication added!');
    } else if (result.status === 'CRITICAL') {
      toast.error('CRITICAL: Not added');
    } else {
      toast.error('Failed to add');
    }
    setShowAddModal(false);
  } catch (err) {
    console.error(err);
    toast.error('Network error');
  }
};
  const handleExtractData = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('http://localhost:3000/api//scanner/scan', {
      method: 'POST',
      body: formData
    });
    return await res.json();
  };

  const handleUseExtractedData = (data) => {
    handleAddMedSubmit({
      drug_name: formData.drug_name,
      dosage: formData.dosage,
      instructions: formData.instructions
    });
    setShowScanModal(false);
  };

  const handleTranslate = async (med) => {
    try {
      const res = await fetch('http://localhost:3000/api//translator/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drug_name: med.drug_name,
          dosage: med.dosage,
          instructions: med.instructions
        })
      });
      const { translation } = await res.json();
      toast.success('Translated!');
      return translation;
    } catch (err) {
      toast.error('Translation failed');
      return null;
    }
  };

  const selectedMed = medications.find(m => m.id === selectedMedId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {currentView === 'onboarding' && (
          <ProfileForm onComplete={handleProfileComplete} />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            medications={medications}
            profile={profile}
            onAdd={() => setShowAddModal(true)}
            onScan={() => setShowScanModal(true)}
            onMedClick={(id) => {
              setSelectedMedId(id);
              setCurrentView('detail');
            }}
          />
        )}

        {currentView === 'detail' && selectedMed && (
          <div className="p-6">
            <button onClick={() => setCurrentView('dashboard')} className="mb-4 text-blue-700 hover:underline">
              ← Back
            </button>
            <MedCard med={selectedMed} onTranslate={handleTranslate} />
          </div>
        )}

        {showAddModal && (
          <AddMedModal profile={profile} onClose={() => setShowAddModal(false)} onSubmit={handleAddMedSubmit} />
        )}

        {showScanModal && (
          <ScannerModal onClose={() => setShowScanModal(false)} onExtract={handleExtractData} onUse={handleUseExtractedData} />
        )}
      </div>
    </>
  );
}

export default App;