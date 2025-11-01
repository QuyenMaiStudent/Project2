import React, { useState } from 'react';

// Geocoding service using Nominatim (OpenStreetMap)
const searchLocation = async (query: string) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Vietnam')}&limit=1`);
    const data = await response.json();
    if (data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
};

export default function ProvinceForm({
  initial = null,
  onSubmit,
  onCancel,
  onSearchLocation,
}: {
  initial?: any | null;
  onSubmit: (payload: any) => Promise<void>;
  onCancel: () => void;
  onSearchLocation?: (lat: number, lng: number) => void;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [code, setCode] = useState(initial?.code || '');
  const [latitude, setLatitude] = useState(initial?.latitude ?? '');
  const [longitude, setLongitude] = useState(initial?.longitude ?? '');
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!name.trim()) return;
    
    setSearching(true);
    try {
      const result = await searchLocation(name);
      if (result) {
        setLatitude(result.lat.toFixed(6));
        setLongitude(result.lng.toFixed(6));
        onSearchLocation?.(result.lat, result.lng);
      } else {
        alert('Không tìm thấy địa điểm');
      }
    } catch (error) {
      alert('Lỗi khi tìm kiếm địa điểm');
    } finally {
      setSearching(false);
    }
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ 
        name, 
        code, 
        latitude: latitude ? parseFloat(String(latitude)) : null, 
        longitude: longitude ? parseFloat(String(longitude)) : null 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={submit} className="space-y-6 flex-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên tỉnh/thành</label>
          <div className="flex gap-3">
            <input 
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder="Nhập tên tỉnh/thành"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching || !name.trim()}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors text-lg"
            >
              {searching ? '🔍...' : '🔍 Tìm kiếm'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mã code</label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" 
            value={code} 
            onChange={e => setCode(e.target.value)} 
            required 
            placeholder="Nhập mã code"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" 
              value={String(latitude)} 
              onChange={e => setLatitude(e.target.value)} 
              placeholder="Tự động điền khi tìm kiếm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" 
              value={String(longitude)} 
              onChange={e => setLongitude(e.target.value)} 
              placeholder="Tự động điền khi tìm kiếm"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-700">
            💡 <strong>Hướng dẫn:</strong>
            <ul className="mt-2 space-y-1">
              <li>• Nhập tên tỉnh/thành rồi bấm "🔍 Tìm kiếm" để tự động điền tọa độ</li>
              <li>• Hoặc click trực tiếp trên bản đồ bên phải để chọn vị trí</li>
              <li>• Có thể nhập tọa độ thủ công nếu cần thiết</li>
            </ul>
          </div>
        </div>
      </form>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
        <button 
          type="button" 
          className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-lg" 
          onClick={onCancel}
        >
          Hủy bỏ
        </button>
        <button 
          type="submit" 
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-lg font-medium" 
          disabled={saving}
          onClick={submit}
        >
          {saving ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </div>
    </div>
  );
}