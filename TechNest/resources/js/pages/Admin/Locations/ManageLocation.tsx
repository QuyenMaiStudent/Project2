import React, { useEffect, useMemo, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// fix default marker icon (Leaflet + CRA/Vite)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

type Ward = { id: number; name: string; latitude?: number | null; longitude?: number | null };
type District = { id: number; name: string; wards: Ward[]; latitude?: number | null; longitude?: number | null };
type Province = { id: number; name: string; code?: string; districts: District[]; latitude?: number | null; longitude?: number | null };

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onClick(e.latlng.lat, e.latlng.lng); }
  });
  return null;
}

export default function ManageLocation() {
  const [tree, setTree] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [editingProvinceId, setEditingProvinceId] = useState<number | null>(null);

  const form = useForm({
    name: '',
    code: '',
    latitude: '' as string | number | null,
    longitude: '' as string | number | null,
  });

  useEffect(() => {
    fetchTree();
  }, []);

  function fetchTree() {
    setLoading(true);
    axios.get('/admin/api/locations/tree')
      .then(r => setTree(r.data || []))
      .finally(() => setLoading(false));
  }

  const markers = useMemo(() => {
    const res: { id: string; name: string; lat: number; lng: number }[] = [];
    tree.forEach(p => {
      if (p.latitude && p.longitude) res.push({ id: `p-${p.id}`, name: p.name, lat: Number(p.latitude), lng: Number(p.longitude) });
      p.districts.forEach(d => {
        if (d.latitude && d.longitude) res.push({ id: `d-${d.id}`, name: `${d.name} — ${p.name}`, lat: Number(d.latitude), lng: Number(d.longitude) });
        d.wards.forEach(w => {
          if (w.latitude && w.longitude) res.push({ id: `w-${w.id}`, name: `${w.name} — ${d.name}`, lat: Number(w.latitude), lng: Number(w.longitude) });
        });
      });
    });
    return res;
  }, [tree]);

  const mapCenter: [number, number] = markers.length ? [markers[0].lat, markers[0].lng] : [16.0544, 108.2022];

  function openCreateProvince() {
    setEditingProvinceId(null);
    form.reset('name', 'code', 'latitude', 'longitude');
    setShowProvinceModal(true);
  }

  function openEditProvince(p: Province) {
    setEditingProvinceId(p.id);
    form.setData({
      name: p.name || '',
      code: p.code || '',
      latitude: p.latitude ?? '',
      longitude: p.longitude ?? '',
    });
    setShowProvinceModal(true);
  }

  function onMapClickSetCoords(lat: number, lng: number) {
    form.setData('latitude', lat);
    form.setData('longitude', lng);
  }

  function submitProvince(e?: React.FormEvent) {
    e?.preventDefault();
    if (editingProvinceId) {
      Inertia.put(`/admin/api/provinces/${editingProvinceId}`, form.data, {
        onSuccess: () => {
          setShowProvinceModal(false);
          fetchTree();
        }
      });
    } else {
      Inertia.post('/admin/api/provinces', form.data, {
        onSuccess: () => {
          setShowProvinceModal(false);
          fetchTree();
        }
      });
    }
  }

  function deleteProvince(id: number) {
    if (!confirm('Xác nhận xóa tỉnh/thành phố này?')) return;
    Inertia.delete(`/admin/api/provinces/${id}`, {
      onSuccess: () => fetchTree()
    });
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Trang quản trị', href: '/admin/dashboard' },
        { title: 'Quản lý địa điểm', href: '/admin/locations' }
      ]}
    >
      <Head title="Quản lý địa điểm" />
      <div className="p-6">
        <div className="flex gap-4">
          <div className="w-1/3 bg-white rounded shadow p-4 overflow-auto" style={{ maxHeight: '78vh' }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Danh sách địa điểm</h3>
              <div className="flex gap-2">
                <button onClick={openCreateProvince} className="btn btn-primary">Thêm tỉnh</button>
                <button onClick={fetchTree} className="btn btn-secondary">Làm mới</button>
              </div>
            </div>

            {loading && <div>Đang tải...</div>}

            {!loading && tree.map(p => (
              <div key={p.id} className="border rounded p-2 mb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{p.name}</strong> <div className="text-xs text-gray-500">{p.code || ''}</div>
                    <div className="text-xs text-gray-500">
                      {p.latitude ? `${p.latitude}, ${p.longitude}` : <em>Chưa có tọa độ</em>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditProvince(p)} className="btn btn-sm">Sửa</button>
                    <button onClick={() => deleteProvince(p.id)} className="btn btn-sm btn-danger">Xóa</button>
                  </div>
                </div>

                <div className="mt-2 pl-3">
                  {p.districts.map(d => (
                    <div key={d.id} className="mb-1">
                      <div className="text-sm font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.wards.map(w => w.name).join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 bg-white rounded shadow p-2" style={{ height: '78vh' }}>
            <MapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ClickHandler onClick={onMapClickSetCoords} />
              {markers.map(m => (
                <Marker key={m.id} position={[m.lat, m.lng]}>
                  <Popup>{m.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
            <div className="text-xs text-gray-500 mt-2">Click lên bản đồ để gán tọa độ cho form đang mở.</div>
          </div>
        </div>
      </div>

      {showProvinceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={submitProvince} className="bg-white rounded shadow p-6 w-[420px]">
            <h4 className="text-lg font-semibold mb-3">{editingProvinceId ? 'Sửa tỉnh/thành' : 'Tạo tỉnh/thành'}</h4>

            <label className="block mb-2">
              <span className="text-sm">Tên</span>
              <input value={form.data.name as string} onChange={e => form.setData('name', e.target.value)} required className="input" />
            </label>

            <label className="block mb-2">
              <span className="text-sm">Code</span>
              <input value={form.data.code as string} onChange={e => form.setData('code', e.target.value)} required className="input" />
            </label>

            <label className="block mb-2">
              <span className="text-sm">Latitude</span>
              <input value={String(form.data.latitude ?? '')} onChange={e => form.setData('latitude', e.target.value)} className="input" />
            </label>

            <label className="block mb-4">
              <span className="text-sm">Longitude</span>
              <input value={String(form.data.longitude ?? '')} onChange={e => form.setData('longitude', e.target.value)} className="input" />
            </label>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowProvinceModal(false)} className="btn">Hủy</button>
              <button type="submit" className="btn btn-primary">{editingProvinceId ? 'Cập nhật' : 'Tạo'}</button>
            </div>
            <div className="text-xs text-gray-500 mt-2">Bạn có thể click lên bản đồ để tự gán tọa độ vào form.</div>
          </form>
        </div>
      )}
    </AppLayout>
  );
}