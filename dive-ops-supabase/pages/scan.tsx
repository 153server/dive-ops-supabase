import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/DashboardLayout';

type EquipmentStatus = {
  status: string;
  remark: string;
};

type Diver = {
  id: string;
  full_name: string;
};

export default function EquipmentScanner() {
  const router = useRouter();
  const [divers, setDivers] = useState<Diver[]>([]);
  const [selectedDiver, setSelectedDiver] = useState<Diver | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [equipmentStatus, setEquipmentStatus] = useState<Record<string, EquipmentStatus>>({
    BCD: { status: '', remark: '' },
    Regulator: { status: '', remark: '' },
    Fins: { status: '', remark: '' },
    Mask: { status: '', remark: '' },
    Wetsuit: { status: '', remark: '' },
    Computer: { status: '', remark: '' },
    Tank: { status: '', remark: '' }
  });

  useEffect(() => {
    // Mock diver data
    const mockDivers: Diver[] = [
      { id: '1', full_name: 'Chandra Khatulasem' },
      { id: '2', full_name: 'Quek Long Shun' },
      { id: '3', full_name: 'Ali Bin Ahmad' },
      { id: '4', full_name: 'Kumar Kanivel' },
      { id: '5', full_name: 'Josline Ong' }
    ];
    setDivers(mockDivers);
  }, []);

  const updateEquipmentStatus = (type: string, field: keyof EquipmentStatus, value: string) => {
    setEquipmentStatus(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const submitCheckIn = async () => {
    if (!selectedDiver) return;
    
    // Mock submission
    setSuccessMessage('Check-in successful!');
    
    // Reset state after delay
    setTimeout(() => {
      setSelectedDiver(null);
      setEquipmentStatus({
        BCD: { status: '', remark: '' },
        Regulator: { status: '', remark: '' },
        Fins: { status: '', remark: '' },
        Mask: { status: '', remark: '' },
        Wetsuit: { status: '', remark: '' },
        Computer: { status: '', remark: '' },
        Tank: { status: '', remark: '' }
      });
      router.push('/');
    }, 1500);
  };

  const statusColors: Record<string, string> = {
    'Dirty': 'bg-yellow-100 text-yellow-800',
    'Faulty': 'bg-red-100 text-red-800',
    'Service': 'bg-orange-100 text-orange-800',
    'Good': 'bg-green-100 text-green-800'
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Dive Equipment Check</h1>
          <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>
        </div>

        {successMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg overflow-hidden">
          {!selectedDiver ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-blue-900">Select Diver</h2>
                <button 
                  className="flex items-center text-blue-700 hover:text-blue-900 transition"
                  onClick={() => window.location.reload()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Refresh List
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {divers.map(diver => (
                  <div 
                    key={diver.id} 
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-blue-100"
                    onClick={() => setSelectedDiver(diver)}
                  >
                    <div className="p-5 flex items-center">
                      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl w-14 h-14 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">{diver.full_name}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Last checked: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center mb-8">
                <button
                  className="flex items-center text-blue-700 hover:text-blue-900 transition"
                  onClick={() => setSelectedDiver(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to divers
                </button>
                <h2 className="text-2xl font-bold text-blue-900 ml-4">Equipment Check</h2>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg p-6 mb-8 flex items-center">
                <div className="bg-white/20 rounded-xl w-16 h-16 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">{selectedDiver.full_name}</h3>
                  <p className="text-cyan-100 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    ID: {selectedDiver.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(equipmentStatus).map(([type, status]) => (
                  <div key={type} className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-50">
                    <div className="bg-blue-50 px-6 py-3 border-b border-blue-100">
                      <h4 className="font-bold text-lg text-blue-900 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {type}
                      </h4>
                    </div>
                    
                    <div className="p-5">
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Condition</h5>
                        <div className="flex flex-wrap gap-2">
                          {['Good', 'Dirty', 'Faulty', 'Service'].map(option => (
                            <button
                              key={option}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                status.status === option 
                                  ? `${statusColors[option]} shadow-inner ring-2 ring-opacity-30 ${option === 'Good' ? 'ring-green-300' : option === 'Dirty' ? 'ring-yellow-300' : option === 'Faulty' ? 'ring-red-300' : 'ring-orange-300'}`
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              onClick={() => updateEquipmentStatus(type, 'status', option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                        <textarea
                          placeholder="Add notes about this equipment..."
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-sm transition"
                          rows={2}
                          value={status.remark}
                          onChange={(e) => updateEquipmentStatus(type, 'remark', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="flex-1 bg-white text-blue-700 border border-blue-300 px-4 py-3 rounded-xl text-lg hover:bg-blue-50 transition flex items-center justify-center shadow-sm"
                    onClick={() => setSelectedDiver(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-3 rounded-xl text-lg hover:opacity-90 transition flex items-center justify-center shadow-lg hover:shadow-xl"
                    onClick={submitCheckIn}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Complete Equipment Check
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>DiveOps Equipment Management System v1.0</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px) translateX(-50%); }
          100% { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </DashboardLayout>
  );
}
