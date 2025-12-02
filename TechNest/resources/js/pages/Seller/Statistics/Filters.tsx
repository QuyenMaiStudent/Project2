import React, { useState } from 'react';

export default function Filters({ initialFilters = {}, onApply, loading = false }: any) {
    // derive month from initialFilters.start_date (YYYY-MM-DD) or use current month
    const initialMonth = initialFilters?.start_date
        ? initialFilters.start_date.slice(0,7)
        : new Date().toISOString().slice(0,7);

    const [month, setMonth] = useState(initialMonth);
    const [group_by, setGroupBy] = useState(initialFilters?.group_by ?? 'day');

    function apply() {
        const [y, m] = month.split('-');
        const lastDay = new Date(Number(y), Number(m), 0).getDate();
        const start_date = `${y}-${m}-01`;
        const end_date = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;

        onApply({ start_date, end_date, group_by });
    }

    return (
        <div className="mb-4">
            <div className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Bộ lọc</h3>
                        <p className="text-sm text-gray-500">Chọn khoảng thời gian và cách gom dữ liệu</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Chọn tháng</span>
                        <input
                            type="month"
                            value={month}
                            onChange={e => setMonth(e.target.value)}
                            className="border rounded px-3 py-2 ml-2"
                        />
                    </label>

                    <label className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Gộp theo</span>
                        <select
                            value={group_by}
                            onChange={e => setGroupBy(e.target.value)}
                            className="border rounded px-3 py-2 ml-2"
                        >
                            <option value="week">Tuần</option>
                            <option value="month">Tháng</option>
                        </select>
                    </label>

                    <div className="ml-auto">
                        <button
                            onClick={apply}
                            disabled={loading}
                            className="px-4 py-2 bg-[#0AC1EF] text-white rounded disabled:opacity-50"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}