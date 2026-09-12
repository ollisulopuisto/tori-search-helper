import React, { useState } from 'react';
import { Save, X, Plus, Trash2, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { validatePreset } from '../data/presetSchema';

const DEFAULT_PRESET = {
    id: '',
    name: '',
    description: '',
    icon: 'Search',
    searchBaseUrl: 'https://www.tori.fi/recommerce/forsale/search?q=',
    categories: ['All'],
    items: [],
};

const DEFAULT_ITEM = {
    id: '',
    name: '',
    category: 'All',
    fields: {},
    searchTerms: [],
    notes: '',
    warning: '',
};

export default function PresetEditor({ initialPreset, onSave, onCancel }) {
    const [preset, setPreset] = useState(initialPreset || { ...DEFAULT_PRESET, id: `custom-${Date.now()}` });
    const [activeTab, setActiveTab] = useState('settings');
    const [errors, setErrors] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});

    const toggleItem = (idx) => {
        setExpandedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const handleSave = () => {
        const validation = validatePreset(preset);
        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }
        onSave(preset);
    };

    const updateItem = (idx, field, value) => {
        const newItems = [...preset.items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        setPreset({ ...preset, items: newItems });
    };

    const addItem = () => {
        const newItem = { ...DEFAULT_ITEM, id: `item-${Date.now()}` };
        setPreset({ ...preset, items: [...preset.items, newItem] });
        setExpandedItems({ ...expandedItems, [preset.items.length]: true });
    };

    const removeItem = (idx) => {
        const newItems = preset.items.filter((_, i) => i !== idx);
        setPreset({ ...preset, items: newItems });
    };

    const addSearchTerm = (itemIdx) => {
        const newItems = [...preset.items];
        newItems[itemIdx].searchTerms.push({ label: '', query: '' });
        setPreset({ ...preset, items: newItems });
    };

    const updateSearchTerm = (itemIdx, termIdx, field, value) => {
        const newItems = [...preset.items];
        newItems[itemIdx].searchTerms[termIdx][field] = value;
        setPreset({ ...preset, items: newItems });
    };

    const removeSearchTerm = (itemIdx, termIdx) => {
        const newItems = [...preset.items];
        newItems[itemIdx].searchTerms = newItems[itemIdx].searchTerms.filter((_, i) => i !== termIdx);
        setPreset({ ...preset, items: newItems });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialPreset ? 'Edit Preset' : 'Create New Preset'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 px-3 py-1.5 font-medium">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-medium flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Preset
                        </button>
                    </div>
                </div>

                {/* Validation Errors */}
                {errors.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 text-sm text-red-800">
                        <div className="font-bold mb-1 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Validation Failed
                        </div>
                        <ul className="list-disc pl-5 space-y-1">
                            {errors.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings'
                                ? 'border-indigo-600 text-indigo-700 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Settings & Metadata
                    </button>
                    <button
                        onClick={() => setActiveTab('items')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'items'
                                ? 'border-indigo-600 text-indigo-700 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Items ({preset.items.length})
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preset Name</label>
                                <input
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={preset.name}
                                    onChange={e => setPreset({ ...preset, name: e.target.value })}
                                    placeholder="e.g. Vintage Cameras"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    rows={2}
                                    value={preset.description}
                                    onChange={e => setPreset({ ...preset, description: e.target.value })}
                                    placeholder="What is this preset for?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search Base URL</label>
                                <input
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                                    value={preset.searchBaseUrl}
                                    onChange={e => setPreset({ ...preset, searchBaseUrl: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Usually https://www.tori.fi/recommerce/forsale/search?q=</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categories (comma separated)</label>
                                <input
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={preset.categories.join(', ')}
                                    onChange={e => setPreset({ ...preset, categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    placeholder="All, Budget, Premium..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Items Tab */}
                    {activeTab === 'items' && (
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <button
                                onClick={addItem}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add Item
                            </button>

                            {preset.items.length === 0 && (
                                <div className="text-center text-gray-400 py-8">No items yet. Add one!</div>
                            )}

                            {preset.items.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div
                                        onClick={() => toggleItem(idx)}
                                        className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                                    >
                                        <div className="flex items-center gap-2 font-medium text-gray-800">
                                            {expandedItems[idx] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            {item.name || `Item ${idx + 1}`}
                                            <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 rounded-full">
                                                {item.category}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                                            className="text-gray-400 hover:text-red-600 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {expandedItems[idx] && (
                                        <div className="p-4 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                                                    <input
                                                        className="w-full text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                        value={item.name}
                                                        onChange={e => updateItem(idx, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                                                    <select
                                                        className="w-full text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                        value={item.category}
                                                        onChange={e => updateItem(idx, 'category', e.target.value)}
                                                    >
                                                        {preset.categories.map(cat => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-xs font-medium text-gray-700">Search Terms</label>
                                                {item.searchTerms.map((term, tIdx) => (
                                                    <div key={tIdx} className="flex gap-2">
                                                        <input
                                                            placeholder="Label (Button Text)"
                                                            className="flex-1 text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                            value={term.label}
                                                            onChange={e => updateSearchTerm(idx, tIdx, 'label', e.target.value)}
                                                        />
                                                        <input
                                                            placeholder="Search Query"
                                                            className="flex-1 text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                            value={term.query}
                                                            onChange={e => updateSearchTerm(idx, tIdx, 'query', e.target.value)}
                                                        />
                                                        <button onClick={() => removeSearchTerm(idx, tIdx)} className="text-red-400 hover:text-red-600">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addSearchTerm(idx)} className="text-xs text-indigo-600 font-medium hover:underline">
                                                    + Add Search Term
                                                </button>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                                                <textarea
                                                    className="w-full text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                                    rows={2}
                                                    value={item.notes}
                                                    onChange={e => updateItem(idx, 'notes', e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Warning (Optional)</label>
                                                <input
                                                    className="w-full text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-red-600"
                                                    value={item.warning || ''}
                                                    onChange={e => updateItem(idx, 'warning', e.target.value)}
                                                    placeholder="e.g. Watch out for fakes!"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
