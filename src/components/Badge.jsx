import React from 'react';

const COLORS = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-emerald-100 text-emerald-800',
    yellow: 'bg-amber-100 text-amber-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800',
    black: 'bg-gray-900 text-white',
    gold: 'bg-yellow-400 text-yellow-900',
};

export default function Badge({ children, color = 'blue' }) {
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${COLORS[color] || COLORS.gray}`}>
            {children}
        </span>
    );
}
