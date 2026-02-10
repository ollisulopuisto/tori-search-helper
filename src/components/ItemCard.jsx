import React from 'react';
import {
    Cpu,
    HardDrive,
    AlertTriangle,
    Wrench,
    Gem,
    Save,
} from 'lucide-react';
import Badge from './Badge';

export default function ItemCard({ item, preset, onTrack }) {
    const launchSearch = (term) => {
        const params = new URLSearchParams({
            q: term,
            sort: 'PRICE_ASC',
        });
        // Append multi-value params
        ['1', '2'].forEach(v => params.append('trade_type', v));
        ['1', '2', '3', '4'].forEach(v => params.append('condition', v));
        const url = `${preset.searchBaseUrl}${term}&${params.toString().replace(/q=[^&]+&/, '')}`;
        window.open(url, '_blank');
    };

    const categoryColor = preset.categoryColors?.[item.category] || 'blue';
    const isGold = categoryColor === 'gold';
    const isExpert = categoryColor === 'black';

    return (
        <div className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col h-full hover:shadow-md transition-shadow ${isGold ? 'border-yellow-300 ring-1 ring-yellow-200' :
                isExpert ? 'border-amber-200 ring-1 ring-amber-100' : 'border-gray-200'
            }`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 flex items-center">
                        {item.name}
                        {isGold && <Gem className="w-4 h-4 text-yellow-500 ml-2" />}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                        <Badge color={categoryColor}>{item.category}</Badge>
                        {item.fields?.wifi && <Badge color="blue">{item.fields.wifi}</Badge>}
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-3 my-4">
                {/* Render dynamic fields */}
                {item.fields && Object.entries(item.fields).map(([key, value]) => {
                    if (key === 'wifi') return null; // Already shown in badge
                    const Icon = key === 'chipset' ? Cpu : HardDrive;
                    return (
                        <div key={key} className="flex items-center text-sm text-gray-600">
                            <Icon className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{value}</span>
                        </div>
                    );
                })}

                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    {item.notes}
                </div>

                {item.warning && (
                    <div className={`flex items-start p-2 text-xs rounded border ${isExpert ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                        {isExpert
                            ? <Wrench className="w-4 h-4 mr-1.5 shrink-0 mt-0.5" />
                            : <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0 mt-0.5" />
                        }
                        <span>{item.warning}</span>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-500 w-full">Search Tori.fi by:</span>
                    {item.searchTerms.map((term, idx) => (
                        <button
                            key={idx}
                            onClick={() => launchSearch(term.query)}
                            className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs py-1.5 px-2 rounded border border-indigo-200 transition-colors whitespace-nowrap"
                        >
                            {term.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => onTrack(item)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Add to Candidates
                </button>
            </div>
        </div>
    );
}
