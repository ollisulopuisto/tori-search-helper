import React, { useState, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  Info,
  CheckCircle2,
  Filter,
  X,
  Share2,
  ShieldAlert,
} from 'lucide-react';
import { getAvailablePresets, getPresetById } from './data/presetLoader';
import ItemCard from './components/ItemCard';
import PresetSwitcher from './components/PresetSwitcher';

export default function App() {
  const [availablePresets] = useState(getAvailablePresets());
  // Default to first preset if no saved preference
  const [activePresetId, setActivePresetId] = useState(() => {
    return localStorage.getItem('toriwrt_active_preset') || availablePresets[0]?.id;
  });

  const activePreset = getAvailablePresets().find(p => p.id === activePresetId) || availablePresets[0];

  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState('All');
  const [customSearch, setCustomSearch] = useState('');

  // Save/Load candidates
  useEffect(() => {
    const saved = localStorage.getItem('toriwrt_candidates');
    if (saved) setCandidates(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('toriwrt_candidates', JSON.stringify(candidates));
  }, [candidates]);

  // Save active preset preference
  useEffect(() => {
    localStorage.setItem('toriwrt_active_preset', activePresetId);
  }, [activePresetId]);

  // Reset filter when preset changes
  useEffect(() => {
    setFilter('All');
  }, [activePresetId]);

  const handleTrack = (item) => {
    const newCandidate = {
      ...item,
      uniqueId: Date.now(),
      link: '',
      price: '',
      foundDate: new Date().toLocaleDateString()
    };
    setCandidates([...candidates, newCandidate]);
  };

  const handleDelete = (uniqueId) => {
    setCandidates(candidates.filter(c => c.uniqueId !== uniqueId));
  };

  const handleUpdate = (uniqueId, field, value) => {
    setCandidates(candidates.map(c =>
      c.uniqueId === uniqueId ? { ...c, [field]: value } : c
    ));
  };

  const performCustomSearch = (e) => {
    e.preventDefault();
    if (!customSearch.trim()) return;
    const url = `${activePreset.searchBaseUrl}${encodeURIComponent(customSearch)}`;
    window.open(url, '_blank');
  };

  // Filter items based on active preset's logic
  const filteredItems = activePreset.items.filter(item => {
    if (filter === 'All') return true;

    // If preset has custom filter logic (like routers.js), use it
    if (activePreset.categoryFilters?.[filter]) {
      return activePreset.categoryFilters[filter](item.category);
    }

    // Default strict equality check
    return item.category === filter;
  });

  const totalPrice = candidates.reduce((sum, c) => sum + (Number(c.price) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Dynamic Icon from Preset would go here if we mapped string names to components, 
                  for now using simple logic or just the title */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Tori Scout</h1>
                <p className="text-indigo-200 text-xs">
                  {activePreset.name} · {activePreset.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <PresetSwitcher
                presets={availablePresets}
                activePresetId={activePresetId}
                onSwitch={setActivePresetId}
              />

              <div className="bg-indigo-800 rounded-lg p-1 flex items-center">
                <form onSubmit={performCustomSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Custom Search..."
                    className="bg-transparent border-none text-white placeholder-indigo-300 focus:ring-0 text-sm w-48"
                    value={customSearch}
                    onChange={(e) => setCustomSearch(e.target.value)}
                  />
                  <button type="submit" className="p-2 text-indigo-200 hover:text-white">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Database & filters */}
        <div className="lg:col-span-8 space-y-6">

          {/* Warning Banner (if preset has one) */}
          {activePreset.warningBanner && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start">
              <ShieldAlert className="w-6 h-6 text-amber-600 mr-3 shrink-0" />
              <div>
                <h4 className="font-bold text-amber-800 text-sm">{activePreset.warningBanner.title}</h4>
                <ul className="text-xs text-amber-800 list-disc pl-4 mt-1 space-y-1">
                  {activePreset.warningBanner.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center pb-4 border-b border-gray-200">
            <Filter className="w-4 h-4 text-gray-500 mr-2" />
            {activePreset.categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filter === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                preset={activePreset}
                onTrack={handleTrack}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Candidates & Info */}
        <div className="lg:col-span-4 space-y-6">

          {/* Candidates Box */}
          <div className={`bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden sticky top-24`}>
            <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
              <h2 className="font-semibold text-indigo-900 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Procurement List
              </h2>
              <span className="bg-white text-indigo-600 px-2 py-0.5 rounded text-xs font-bold">
                {candidates.length}
              </span>
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {candidates.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No items tracked yet.</p>
                  <p className="text-xs mt-1">Search models and click the save icon.</p>
                </div>
              ) : (
                candidates.map(candidate => (
                  <div key={candidate.uniqueId} className="bg-gray-50 rounded-lg p-3 relative group border border-gray-100">
                    <button
                      onClick={() => handleDelete(candidate.uniqueId)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="font-medium text-sm text-gray-900 pr-6">{candidate.name}</div>

                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        placeholder="Paste URL..."
                        className="w-full text-xs border-gray-200 rounded bg-white px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        value={candidate.link}
                        onChange={(e) => handleUpdate(candidate.uniqueId, 'link', e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-2 top-1 text-gray-400 text-xs">€</span>
                          <input
                            type="number"
                            placeholder="Price"
                            className="w-full pl-5 text-xs border-gray-200 rounded bg-white px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            value={candidate.price}
                            onChange={(e) => handleUpdate(candidate.uniqueId, 'price', e.target.value)}
                          />
                        </div>
                        {candidate.link && (
                          <a href={candidate.link} target="_blank" className="bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {candidates.length > 0 && (
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Total Estimated Cost:</span>
                  <span className="text-lg text-indigo-700 font-bold">{totalPrice} €</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tips Box (if preset has tips) */}
          {activePreset.tips && (
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 text-sm text-blue-900 space-y-3">
              <h3 className="font-bold flex items-center">
                <Info className="w-4 h-4 mr-2" />
                {activePreset.tips.title}
              </h3>
              <ul className="space-y-2 list-disc pl-4 text-blue-800/80">
                {activePreset.tips.items.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}