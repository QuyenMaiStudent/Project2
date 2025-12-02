import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, errors } = useForm({
        subject: '',
        message: '',
        priority: 'medium',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/support');
    };

    return (
        <>
            <Head title="Tạo Ticket Hỗ trợ" />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Tạo Ticket Hỗ trợ</h1>
                <form onSubmit={submit}>
                    <input type="text" placeholder="Chủ đề" value={data.subject} onChange={e => setData('subject', e.target.value)} className="border p-2 w-full mb-2" />
                    {errors.subject && <p className="text-red-500">{errors.subject}</p>}
                    <textarea placeholder="Nội dung" value={data.message} onChange={e => setData('message', e.target.value)} className="border p-2 w-full mb-2"></textarea>
                    {errors.message && <p className="text-red-500">{errors.message}</p>}
                    <select value={data.priority} onChange={e => setData('priority', e.target.value)} className="border p-2 mb-2">
                        <option value="low">Thấp</option>
                        <option value="medium">Trung bình</option>
                        <option value="high">Cao</option>
                    </select>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Gửi</button>
                </form>
            </div>
        </>
    );
}