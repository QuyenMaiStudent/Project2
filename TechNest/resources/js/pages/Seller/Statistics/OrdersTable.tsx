import React from 'react';

export default function OrdersTable({ activity }: any) {
    if (!activity) return <div>No activity</div>;

    const labels = activity.labels ?? [];
    const orders = activity.series?.find((s: any) => s.name === 'Orders')?.data ?? [];
    const revenue = activity.series?.find((s: any) => s.name === 'Revenue')?.data ?? [];
    const users = activity.series?.find((s: any) => s.name === 'New Users')?.data ?? [];

    return (
        <table border={1} cellPadding={6}>
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                    <th>New Users</th>
                </tr>
            </thead>
            <tbody>
                {labels.map((label: string, idx: number) => (
                    <tr key={idx}>
                        <td>{label}</td>
                        <td>{orders[idx] ?? 0}</td>
                        <td>{revenue[idx] ?? 0}</td>
                        <td>{users[idx] ?? 0}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}