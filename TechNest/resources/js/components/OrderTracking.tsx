import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface TrackingStep {
    status: string;
    label: string;
    completed: boolean;
    timestamp?: string;
}

interface OrderTrackingProps {
    steps: TrackingStep[];
    currentStatus: string;
}

export default function OrderTracking({ steps, currentStatus }: OrderTrackingProps) {
    const currentStepIndex = steps.findIndex(step => step.status === currentStatus);

    return (
        <div className="py-6">
            <div className="relative">
                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = step.completed;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.status} className="relative pb-8">
                            {!isLast && (
                                <div
                                    className={`absolute left-4 top-8 h-full w-0.5 ${
                                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                />
                            )}
                            
                            <div className="flex items-start">
                                <div className="relative flex h-8 w-8 items-center justify-center">
                                    {isCompleted ? (
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                    ) : isActive ? (
                                        <Clock className="h-8 w-8 text-blue-500 animate-pulse" />
                                    ) : (
                                        <Circle className="h-8 w-8 text-gray-300" />
                                    )}
                                </div>
                                
                                <div className="ml-4 flex-1">
                                    <p className={`text-sm font-medium ${
                                        isActive ? 'text-blue-600' : 
                                        isCompleted ? 'text-green-600' : 
                                        'text-gray-500'
                                    }`}>
                                        {step.label}
                                    </p>
                                    {step.timestamp && (
                                        <p className="mt-1 text-xs text-gray-500">
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