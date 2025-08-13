// 在 equipment-scanner 页面中
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function EquipmentScanner() {
  const supabase = useSupabaseClient();
  const [divers, setDivers] = useState([]);
  const [selectedDiver, setSelectedDiver] = useState(null);
  const [equipmentStatus, setEquipmentStatus] = useState({
    BCD: { status: '', remark: '' },
    Regulator: { status: '', remark: '' },
    Fin: { status: '', remark: '' },
    Goggle: { status: '', remark: '' }
  });

  // 加载潜水员列表
  useEffect(() => {
    const fetchDivers = async () => {
      const { data, error } = await supabase
        .from('divers')
        .select('*');
      
      if (!error) setDivers(data);
    };
    fetchDivers();
  }, []);

  // 更新设备状态
  const updateEquipmentStatus = (type, field, value) => {
    setEquipmentStatus(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  // 提交检查结果
  const submitCheckIn = async () => {
    const { error } = await supabase
      .from('equipment_checkins')
      .insert({
        diver_id: selectedDiver.id,
        equipment_data: equipmentStatus,
        checked_at: new Date().toISOString()
      });
    
    if (!error) {
      alert('设备检查完成！');
      setSelectedDiver(null);
      setEquipmentStatus({ /* 重置状态 */ });
    }
  };

  return (
    <div className="p-4">
      {!selectedDiver ? (
        <div>
          <h2 className="text-xl font-bold mb-4">SELECT DIVER</h2>
          <button 
            className="mb-4 bg-blue-500 text-white p-2 rounded"
            onClick={() => {/* 刷新功能 */}}
          >
            Refresh
          </button>
          
          <div className="space-y-2">
            {divers.map(diver => (
              <div 
                key={diver.id} 
                className="p-3 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedDiver(diver)}
              >
                {diver.full_name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-2">SELECTED DIVER</h2>
          <h3 className="text-lg mb-4">{selectedDiver.full_name}</h3>
          
          <div className="space-y-4">
            {['BCD', 'Regulator', 'Fin', 'Goggle'].map(type => (
              <div key={type} className="border p-4 rounded">
                <h4 className="font-semibold mb-2">{type}</h4>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Dirty', 'Faulty', 'Service'].map(status => (
                    <button
                      key={status}
                      className={`px-3 py-1 rounded ${
                        equipmentStatus[type].status === status 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200'
                      }`}
                      onClick={() => updateEquipmentStatus(type, 'status', status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                
                <textarea
                  placeholder="Remark"
                  className="w-full p-2 border rounded"
                  value={equipmentStatus[type].remark}
                  onChange={(e) => updateEquipmentStatus(type, 'remark', e.target.value)}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => setSelectedDiver(null)}
            >
              Back
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={submitCheckIn}
            >
              Complete Check-In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
