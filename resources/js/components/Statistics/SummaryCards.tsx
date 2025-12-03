import React from 'react';

type SummaryCard = {
    label: string;
    value: string | number;
    hint?: string;
};

type SummaryCardsProps = {
    cards: SummaryCard[];
    loading?: boolean;
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ cards, loading }) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div key={card.label} className="rounded-lg border bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                        {loading ? <span className="animate-pulse text-gray-300">•••</span> : card.value}
                    </p>
                    {card.hint && <p className="mt-1 text-xs text-gray-400">{card.hint}</p>}
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;