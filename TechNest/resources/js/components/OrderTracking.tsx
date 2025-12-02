import React from 'react';
import { CheckCircle, Circle, Clock, Truck, Package } from 'lucide-react';

interface TrackingStep {
    status: string;
    label: string;
    completed: boolean;
    timestamp?: string;
}

interface OrderTrackingProps {
    steps: TrackingStep[];
    currentStatus: string;
    large?: boolean;
}

export default function OrderTracking({ steps, currentStatus, large = false }: OrderTrackingProps) {
    const currentStepIndex = steps.findIndex(step => step.status === currentStatus);

    const iconFor = (status: string, className = '') => {
        // map basic semantic icons (can extend)
        switch (status) {
            case 'placed':
            case 'order_placed':
                return <Package className={className} />;
            case 'paid':
            case 'succeeded':
            case 'paid_success':
                return <CheckCircle className={className} />;
            case 'ready_to_ship':
            case 'ready':
                return <Truck className={className} />;
            default:
                return <Clock className={className} />;
        }
    };

    const size = large ? 12 : 8; // icon size in tailwind units (h-/w-)
    const iconPx = large ? 'w-12 h-12' : 'w-8 h-8';
    const circleSize = large ? 'w-14 h-14' : 'w-10 h-10';
    const leftOffset = large ? 'left-6' : 'left-4';
    const lineLeft = large ? 'left-10' : 'left-6';
    const labelClass = large ? 'text-lg' : 'text-sm';
    const timeClass = large ? 'text-sm' : 'text-xs';

    return (
        <div className={`py-6 ${large ? 'text-base' : 'text-sm'}`}>
            <div className="relative">
                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = step.completed;
                    const isLast = index === steps.length - 1;

                    const lineColor = isCompleted ? 'bg-green-500' : 'bg-gray-300';
                    const iconBg = isCompleted ? 'bg-green-50 text-green-600' : isActive ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-400';
                    const ring = isActive ? 'relative' : '';

                    return (
                        <div key={step.status} className={`relative pb-8 ${large ? 'mb-2' : ''}`}>
                            {!isLast && (
                                <div
                                    className={`absolute ${lineLeft} top-8 h-full w-1 rounded ${lineColor}`}
                                />
                            )}

                            <div className="flex items-start">
                                <div className={`relative flex items-center justify-center ${circleSize} flex-shrink-0`}>
                                    {/* animated ring for active */}
                                    {isActive && (
                                        <span className="absolute inline-flex rounded-full opacity-30 animate-ping bg-blue-300" style={{ width: (large ? 56 : 40), height: (large ? 56 : 40), left: -((large ? 56 : 40) - (large ? 56 : 40)) / 2 }} />
                                    )}

                                    <div className={`flex items-center justify-center rounded-full shadow-sm border ${iconBg} ${iconPx}`}>
                                        {/* choose semantic icon if possible */}
                                        {isCompleted ? (
                                            <CheckCircle className={`${iconPx} ${isCompleted ? 'text-green-600' : ''}`} />
                                        ) : isActive ? (
                                            <Clock className={`${iconPx} text-blue-600 animate-pulse`} />
                                        ) : (
                                            // fallback semantic icon
                                            iconFor(step.status, `${iconPx} ${isCompleted ? 'text-green-600' : 'text-gray-400'}`)
                                        )}
                                    </div>
                                </div>

                                <div className={`ml-4 flex-1 ${large ? 'pt-1' : ''}`}>
                                    <p className={`font-medium ${labelClass} ${
                                        isActive ? 'text-blue-600' :
                                        isCompleted ? 'text-green-600' :
                                        'text-gray-500'
                                    }`}>
                                        {step.label}
                                    </p>
                                    {step.timestamp && (
                                        <p className={`mt-1 ${timeClass} text-gray-500`}>
                                            {step.timestamp}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}