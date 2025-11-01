import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function LocationTest() {
    const [provinces, setProvinces] = useState<any[]>([])
    const [districts, setDistricts] = useState<any[]>([])
    const [wards, setWards] = useState<any[]>([])

    const [selectedProvince, setSelectedProvince] = useState<number | null>(null)
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)

    useEffect(() => {
        axios.get('/admin/locations/provinces')
            .then(res => setProvinces(res.data))
            .catch(() => console.error('Lỗi tải danh sách tỉnh'))
    }, [])

    useEffect(() => {
        if (selectedProvince) {
            axios.get(`/admin/locations/provinces/${selectedProvince}/districts`)
                .then(res => setDistricts(res.data))
                .catch(() => console.error('Lỗi tải danh sách huyện'))
        } else {
            setDistricts([])
            setWards([])
        }
    }, [selectedProvince])

    useEffect(() => {
        if (selectedDistrict) {
            axios.get(`/admin/locations/districts/${selectedDistrict}/wards`)
                .then(res => setWards(res.data))
                .catch(() => console.error('Lỗi tải danh sách xã'))
        } else {
            setWards([])
        }
    }, [selectedDistrict])

    return (
        <div style={{ padding: '20px' }}>
            <h2>Tra cứu địa lý hành chính</h2>

            <div style={{ marginTop: '20px' }}>
                <label>Tỉnh / Thành phố:</label>
                <select onChange={e => setSelectedProvince(Number(e.target.value) || null)}>
                    <option value="">-- Chọn tỉnh --</option>
                    {provinces.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginTop: '20px' }}>
                <label>Quận / Huyện:</label>
                <select onChange={e => setSelectedDistrict(Number(e.target.value) || null)} disabled={!selectedProvince}>
                    <option value="">-- Chọn huyện --</option>
                    {districts.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginTop: '20px' }}>
                <label>Phường / Xã:</label>
                <select disabled={!selectedDistrict}>
                    <option value="">-- Chọn xã --</option>
                    {wards.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}
