import React from 'react';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

interface Ticket {
    id: number;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
}

interface Props {
    tickets: { data: Ticket[]; links: any[] };
}

export default function Index({ tickets }: Props) {
    return (
        <>
            <Head title="Hỗ trợ" />
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Tickets Hỗ trợ</h1>
                <Link href="/support/create" className="bg-blue-500 text-white px-4 py-2 rounded">Tạo Ticket</Link>
                <table className="w-full mt-4 border">
                    <thead>
                        <tr>
                            <th>Chủ đề</th>
                            <th>Trạng thái</th>
                            <th>Ưu tiên</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.data.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.subject}</td>
                                <td>{ticket.status}</td>
                                <td>{ticket.priority}</td>
                                <td>{ticket.created_at}</td>
                                <td><Link href={`/support/${ticket.id}`}>Xem</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}