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
    'Dirty': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Faulty': 'bg-red-100 text-red-800 border-red-200',
    'Service': 'bg-orange-100 text-orange-800 border-orange-200',
    'Good': 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dive Equipment Check</h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {successMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {!selectedDiver ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Select Diver</h2>
                <button 
                  className="text-blue-600 hover:text-blue-800 transition font-medium"
                  onClick={() => window.location.reload()}
                >
                  Refresh List
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {divers.map(diver => (
                  <div 
                    key={diver.id} 
                    className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200"
                    onClick={() => setSelectedDiver(diver)}
                  >
                    <div className="p-5">
                      <div className="bg-gray-100 rounded-xl w-14 h-14 flex items-center justify-center mb-3 text-gray-500 font-bold">
                        D
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{diver.full_name}</h3>
                        <p className="text-sm text-gray-500">
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
              <div className="mb-8">
                <button
                  className="text-blue-600 hover:text-blue-800 transition font-medium mb-4"
                  onClick={() => setSelectedDiver(null)}
                >
                  ← Back to divers
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Equipment Check</h2>
              </div>
              
              <div className="bg-blue-50 text-gray-800 rounded-xl shadow p-6 mb-8">
                <div className="flex items-center">
                  <div className="bg-gray-200 rounded-xl w-14 h-14 flex items-center justify-center mr-4 font-bold">
                    D
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedDiver.full_name}</h3>
                    <p className="text-gray-600">
                      ID: {selectedDiver.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(equipmentStatus).map(([type, status]) => (
                  <div key={type} className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <h4 className="font-bold text-lg text-gray-800">
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
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                status.status === option 
                                  ? `${statusColors[option]} font-bold`
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-sm transition"
                          rows={2}
                          value={status.remark}
                          onChange={(e) => updateEquipmentStatus(type, 'remark', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="flex-1 bg-white text-gray-700 border border-gray-300 px-4 py-3 rounded-xl text-lg hover:bg-gray-50 transition font-medium"
                    onClick={() => setSelectedDiver(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl text-lg hover:bg-blue-700 transition font-medium shadow"
                    onClick={submitCheckIn}
                  >
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
