import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useLocations } from '@/hooks/useLocations';
import TreeView from '@/components/locations/TreeView';
import LocationMap from '@/components/locations/LocationMap';
import Modal from '@/components/locations/Modal';
import ProvinceForm from './ProvinceForm';
import DistrictForm from './DistrictForm';
import WardForm from './WardForm';

export default function LocationsTree() {
  const { tree, loading, createP, updateP, deleteP, createD, updateD, deleteD, createW, updateW, deleteW } = useLocations();
  
  const [selectedTarget, setSelectedTarget] = useState<[number, number] | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [modalType, setModalType] = useState<'province' | 'district' | 'ward' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Generate markers for map
  const markers = useMemo(() => {
    const res: { id: string; name: string; lat: number; lng: number }[] = [];
    tree.forEach(p => {
      if (p.latitude && p.longitude) {
        res.push({ id: `p-${p.id}`, name: `🏛️ ${p.name}`, lat: Number(p.latitude), lng: Number(p.longitude) });
      }
      p.districts.forEach(d => {
        if (d.latitude && d.longitude) {
          res.push({ id: `d-${d.id}`, name: `🏢 ${d.name} (${p.name})`, lat: Number(d.latitude), lng: Number(d.longitude) });
        }
        d.wards.forEach(w => {
          if (w.latitude && w.longitude) {
            res.push({ id: `w-${w.id}`, name: `🏘️ ${w.name} (${d.name})`, lat: Number(w.latitude), lng: Number(w.longitude) });
          }
        });
      });
    });
    return res;
  }, [tree]);

  // Flatten all districts and provinces for form selectors
  const allProvinces = tree;
  const allDistricts = tree.flatMap(p => p.districts.map(d => ({ ...d, province_name: p.name })));

  const handleSelect = (type: string, item: any) => {
    if (item.latitude && item.longitude) {
      setSelectedTarget([Number(item.latitude), Number(item.longitude)]);
      setShowMap(true);
    }
  };

  const handleEdit = (type: string, item: any) => {
    setEditingItem(item);
    setModalType(type as any);
    setShowForm(true);
  };

  const handleDelete = async (type: string, item: any) => {
    if (!confirm(`Xác nhận xóa ${type === 'province' ? 'tỉnh/thành' : type === 'district' ? 'quận/huyện' : 'phường/xã'}: ${item.name}?`)) return;
    
    try {
      if (type === 'province') await deleteP(item.id);
      else if (type === 'district') await deleteD(item.id);
      else if (type === 'ward') await deleteW(item.id);
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa');
    }
  };

  const handleCreateDistrict = (provinceId: number) => {
    setEditingItem({ province_id: provinceId });
    setModalType('district');
    setShowForm(true);
  };

  const handleCreateWard = (districtId: number) => {
    setEditingItem({ district_id: districtId });
    setModalType('ward');
    setShowForm(true);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (showForm) {
      setEditingItem((prev: any) => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
    }
  };

  const handleFormSubmit = async (payload: any) => {
    try {
      if (modalType === 'province') {
        if (editingItem?.id) await updateP(editingItem.id, payload);
        else await createP(payload);
      } else if (modalType === 'district') {
        if (editingItem?.id) await updateD(editingItem.id, payload);
        else await createD(payload);
      } else if (modalType === 'ward') {
        if (editingItem?.id) await updateW(editingItem.id, payload);
        else await createW(payload);
      }
      closeForm();
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu');
    }
  };

  const closeForm = () => {
    setModalType(null);
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSearchLocation = async (lat: number, lng: number) => {
    setSelectedTarget([lat, lng]);
    setShowMap(true);
  };

  if (loading) {
    return (
      <AppLayout breadcrumbs={[
        { title: 'Bảng điều khiển quản trị', href: '/admin/dashboard' },
        { title: 'Quản lý địa điểm', href: '/admin/locations' }
      ]}>
        <Head title="Quản lý địa điểm" />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Bảng điều khiển quản trị', href: '/admin/dashboard' },
        { title: 'Quản lý địa điểm', href: '/admin/locations' }
      ]}
    >
      <Head title="Quản lý địa điểm" />
      
      <div className="p-4">
        <div className="flex gap-4 h-[calc(100vh-140px)]">
          {/* Tree Panel */}
          <div className={`${showMap ? 'w-1/2' : 'w-full'} bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col transition-all duration-300`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Cây địa điểm</h3>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                  onClick={() => { setEditingItem({}); setModalType('province'); setShowForm(true); }}
                >
                  + Thêm tỉnh/thành
                </button>
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? 'Ẩn bản đồ' : 'Hiện bản đồ'}
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <TreeView
                tree={tree}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreateDistrict={handleCreateDistrict}
                onCreateWard={handleCreateWard}
              />
            </div>
          </div>

          {/* Map Panel */}
          {showMap && (
            <div className="w-1/2 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Bản đồ</h3>
                <div className="text-sm text-gray-600 mt-1">
                  Click vào địa điểm để xem • Click trên bản đồ để chọn tọa độ
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="h-full rounded-lg overflow-hidden border border-gray-300">
                  <LocationMap
                    markers={markers}
                    target={selectedTarget}
                    onMapClick={handleMapClick}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal - Fullscreen */}
      <Modal 
        open={showForm} 
        onClose={closeForm}
        title={`${editingItem?.id ? 'Sửa' : 'Thêm'} ${modalType === 'province' ? 'tỉnh/thành' : modalType === 'district' ? 'quận/huyện' : 'phường/xã'}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Form Section */}
          <div className="flex flex-col">
            {modalType === 'province' && (
              <ProvinceForm
                initial={editingItem}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
                onSearchLocation={handleSearchLocation}
              />
            )}
            {modalType === 'district' && (
              <DistrictForm
                initial={editingItem}
                provinces={allProvinces}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
                onSearchLocation={handleSearchLocation}
              />
            )}
            {modalType === 'ward' && (
              <WardForm
                initial={editingItem}
                districts={allDistricts}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
                onSearchLocation={handleSearchLocation}
              />
            )}
          </div>

          {/* Map Section */}
          <div className="flex flex-col">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Chọn vị trí trên bản đồ</h4>
              <div className="text-sm text-gray-600">
                Click trên bản đồ để chọn tọa độ cho địa điểm
              </div>
            </div>
            <div className="flex-1 rounded-lg overflow-hidden border border-gray-300 min-h-[500px]">
              <LocationMap
                markers={markers}
                target={selectedTarget}
                onMapClick={handleMapClick}
              />
            </div>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}