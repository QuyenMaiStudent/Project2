import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

export type PackageFeature = string

export interface PackageItem {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    duration_days: number;
    features?: PackageFeature[] | null
}

interface Props {
    pkg: PackageItem;
    onSubscribe?: (pkg: PackageItem) => void;
    isActive?: boolean;
}

const PackageCard = ({ pkg, onSubscribe, isActive }: Props) => (
    <Card className={isActive ? "border-primary shadow-lg" : ""}>
        <CardHeader>
            <CardTitle>{pkg.name}</CardTitle>
            <p className='text-sm text-muted-foreground'>{pkg.description}</p>
        </CardHeader>
        <CardContent className='space-y-4'>
            <div>
                <span className='text-2xl font-semibold'>
                    {new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(pkg.price))}₫
                </span>
                <span className='text-xs text-muted-foreground ml-2'>/{pkg.duration_days} ngày</span>
            </div>
            {pkg.features?.length ? (
                <ul className='space-y-1 text-sm list-disc pl-5'>
                    {pkg.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                    ))}
                </ul>
            ): null}
            {onSubscribe ? (
                <Button className="w-full" disabled={isActive} onClick={() => onSubscribe(pkg)}>
                    {isActive ? "Đang hoạt động" : "Đăng ký ngay"}
                </Button>
            ) : null}
        </CardContent>
    </Card>
);

export default PackageCard;
