import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

interface Reply {
    id: number;
    message: string;
    user: { name: string };
    created_at: string;
}

interface Ticket {
    id: number;
    subject: string;
    message: string;
    status: string;
    replies: Reply[];
}

interface Props {
    ticket: Ticket;
}

export default function Show({ ticket }: Props) {
    const { data, setData, post } = useForm({ message: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/support/${ticket.id}/reply`);
    };

    return (
        <>
            <Head title={`Ticket: ${ticket.subject}`} />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">{ticket.subject}</h1>
                <p>Trạng thái: {ticket.status}</p>
                <p>{ticket.message}</p>
                <h2 className="text-xl mt-4">Trả lời</h2>
                {ticket.replies.map((reply) => (
                    <div key={reply.id} className="border p-2 mb-2">
                        <strong>{reply.user.name}:</strong> {reply.message} <small>({reply.created_at})</small>
                    </div>
                ))}
                <form onSubmit={submit}>
                    <textarea value={data.message} onChange={e => setData('message', e.target.value)} className="border p-2 w-full"></textarea>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Trả lời</button>
                </form>
            </div>
        </>
    );
}