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
    Fin: { status: '', remark: '' },
    Mask: { status: '', remark: '' }
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
    console.log('Check-in submitted for:', selectedDiver);
    setSuccessMessage('Check-in successful!');
    
    // Reset state
    setSelectedDiver(null);
    setEquipmentStatus({
      BCD: { status: '', remark: '' },
      Regulator: { status: '', remark: '' },
      Fin: { status: '', remark: '' },
      Mask: { status: '', remark: '' }
    });
    
    // Redirect to home
    router.push('/');
  };

  return (
    <DashboardLayout>
      <div className="p-4 max-w-3xl mx-auto">
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
            {successMessage}
          </div>
        )}

        {!selectedDiver ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-800">选择潜水员</h2>
            <button 
              className="mb-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition flex items-center"
              onClick={() => window.location.reload()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              刷新列表
            </button>
            
            <div className="space-y-3">
              {divers.map(diver => (
                <div 
                  key={diver.id} 
                  className="p-4 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 transition flex items-center"
                  onClick={() => setSelectedDiver(diver)}
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">{diver.full_name}</h3>
                    <p className="text-sm text-gray-500">上次检查: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg mr-4 hover:bg-gray-400 transition flex items-center"
                onClick={() => setSelectedDiver(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                返回
              </button>
              <h2 className="text-2xl font-bold text-blue-800">设备检查</h2>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">{selectedDiver.full_name}</h3>
                <p className="text-gray-500">ID: {selectedDiver.id.slice(0, 8)}</p>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(equipmentStatus).map(([type, status]) => (
                <div key={type} className="bg-white p-6 rounded-xl shadow-md">
                  <h4 className="font-bold text-lg mb-4 text-blue-700">{type}</h4>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['Dirty', 'Faulty', 'Service'].map(option => (
                      <button
                        key={option}
                        className={`px-4 py-2 rounded-lg transition ${
                          status.status === option 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => updateEquipmentStatus(type, 'status', option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                    <textarea
                      placeholder="添加备注..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      value={status.remark}
                      onChange={(e) => updateEquipmentStatus(type, 'remark', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex gap-4">
              <button
                className="flex-1 bg-gray-300 px-4 py-3 rounded-lg text-lg hover:bg-gray-400 transition flex items-center justify-center"
                onClick={() => setSelectedDiver(null)}
              >
                取消
              </button>
              <button
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg text-lg hover:bg-green-700 transition shadow-md flex items-center justify-center"
                onClick={submitCheckIn}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                完成检查
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
