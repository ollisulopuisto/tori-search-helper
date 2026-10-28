import React, { useState, useEffect, useMemo } from 'react';
import { Search, Save, Trash2, X, ExternalLink, SlidersHorizontal, Settings, AlertTriangle } from 'lucide-react';
import { getAvailablePresets, getPresetById, getSafeSearchBaseUrl, DEFAULT_SEARCH_BASE_URL } from './data/presetLoader';
import ItemCard from './components/ItemCard';
import PresetSwitcher from './components/PresetSwitcher';
import PresetManager from './components/PresetManager'; // Import PresetManager

const buildSearchUrl = (searchBaseUrl, query) => {
  const base = getSafeSearchBaseUrl(searchBaseUrl);
  const url = `${base}${encodeURIComponent(query || '')}`;
  // Guarantee the navigable URL uses an http(s) scheme. A stored preset may carry
  // an unsafe scheme (javascript:/data:/vbscript:) that would execute when the
  // Check Tori.fi link is clicked (DOM XSS). Never render anything else.
  try {
    const protocol = new URL(url).protocol;
    return (protocol === 'http:' || protocol === 'https:') ? url : `${DEFAULT_SEARCH_BASE_URL}${encodeURIComponent(query || '')}`;
  } catch {
    return `${DEFAULT_SEARCH_BASE_URL}${encodeURIComponent(query || '')}`;
  }
};

export default function App() {
  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem('tori_scout_candidates');
    return saved ? JSON.parse(saved) : [];
  });

  const [availablePresets, setAvailablePresets] = useState(getAvailablePresets());
  const [activePresetId, setActivePresetId] = useState(() => {
    return localStorage.getItem('tori_scout_active_preset') || availablePresets[0]?.id;
  });

  const [isManagerOpen, setIsManagerOpen] = useState(false); // State for manager modal

  const [customSearch, setCustomSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All'); // Renamed from 'filter'

  // Ensure activePresetId is valid
  const effectiveActivePresetId = availablePresets.find(p => p.id === activePresetId)
    ? activePresetId
    : availablePresets[0]?.id;

  // Load the active preset object
  const activePreset = availablePresets.find(p => p.id === effectiveActivePresetId) || availablePresets[0];

  // Refresh presets (passed to Manager)
  const refreshPresets = () => {
    setAvailablePresets(getAvailablePresets());
  };

  // Switch preset handler
  const handlePresetSwitch = (newId) => {
    setActivePresetId(newId);
    setActiveCategory('All'); // Reset filter when switching
  };

  useEffect(() => {
    localStorage.setItem('tori_scout_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    if (effectiveActivePresetId) {
      localStorage.setItem('tori_scout_active_preset', effectiveActivePresetId);
    }
  }, [effectiveActivePresetId]);


  const handleTrack = (item) => {
    // Check if item is already tracked to prevent duplicates
    if (candidates.some(c => c.uniqueId === `${activePreset.id} -${item.id} `)) return;

    const newItem = {
      ...item,
      uniqueId: `${activePreset.id} -${item.id} `, // Unique ID for tracking
      presetId: activePreset.id,
      presetName: activePreset.name,
      addedAt: new Date().toISOString()
    };
    setCandidates([...candidates, newItem]);
  };

  const handleDelete = (uniqueId) => {
    setCandidates(candidates.filter(c => c.uniqueId !== uniqueId));
  };

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return activePreset.items || [];

    return (activePreset.items || []).filter(item => {
      if (activePreset.categoryFilters?.[activeCategory]) {
        const filterFn = activePreset.categoryFilters[activeCategory];
        if (typeof filterFn === 'function') {
          return filterFn(item);
        }
      }
      return item.category === activeCategory;
    });
  }, [activePreset, activeCategory]);

  // Calculate total cost (simple regex parsing)
  const totalCost = candidates.reduce((sum, item) => {
    const priceMatch = item.fields?.approxPrice?.match(/(\d+)/);
    return sum + (priceMatch ? parseInt(priceMatch[0]) : 0);
  }, 0);

  const launchCustomSearch = (e) => {
    e.preventDefault();
    if (!customSearch.trim()) return;
    const url = `${getSafeSearchBaseUrl(activePreset.searchBaseUrl)}${encodeURIComponent(customSearch)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Tori Scout</h1>
                <p className="text-indigo-200 text-xs">
                  {activePreset.name} · {activePreset.description}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <PresetSwitcher
                  presets={availablePresets}
                  activePresetId={activePresetId}
                  onSwitch={handlePresetSwitch}
                />
                <button
                  onClick={() => setIsManagerOpen(true)}
                  className="p-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-indigo-100 transition-colors"
                  title="Manage Presets"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Custom Search Bar */}
            <form onSubmit={launchCustomSearch} className="flex w-full md:w-auto relative group">
              <input
                type="text"
                placeholder={`Search ${activePreset.name}...`}
                className="w-full md:w-80 px-4 py-2 rounded-l-lg text-gray-900 border-0 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={customSearch}
                onChange={(e) => setCustomSearch(e.target.value)}
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-r-lg font-medium transition-colors flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Filters & Grid */}
        <div className="lg:col-span-8 space-y-6">


          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(activePreset.categories || ['All']).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px - 4 py - 2 rounded - full text - sm font - medium transition - all ${activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  } `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* New Item Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                preset={activePreset}
                onTrack={handleTrack}
              />
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                <p>No items found in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Candidates & Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Candidates Box */}
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden sticky top-24">
            <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
              <h2 className="font-semibold text-indigo-900 flex items-center">
                <Save className="w-4 h-4 mr-2" />
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
                <div className="space-y-3">
                  {candidates.map((candidate) => (
                    <div key={candidate.uniqueId} className="bg-gray-50 p-3 rounded-lg border border-gray-100 group relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs text-indigo-600 font-semibold mb-0.5">
                            {candidate.presetName}
                          </div>
                          <h3 className="font-medium text-sm text-gray-900">{candidate.name}</h3>
                          {candidate.fields?.approxPrice && (
                            <div className="text-xs text-gray-500 mt-1">
                              Est: {candidate.fields.approxPrice}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(candidate.uniqueId)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex gap-2">
                        <a
                          href={buildSearchUrl(getPresetById(candidate.presetId)?.searchBaseUrl, candidate.searchTerms?.[0]?.query || candidate.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-white hover:bg-gray-50 text-indigo-600 text-xs py-1.5 px-2 rounded border border-indigo-100 flex items-center justify-center transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Check Tori.fi
                        </a>
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total Est. Cost:</span>
                    <span className="text-lg font-bold text-indigo-900">~{totalCost}€</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Warning Banner (Dynamic) */}
          {activePreset.warningBanner && (
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 text-sm text-amber-900 space-y-3">
              <h3 className="font-bold flex items-center text-amber-700">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {activePreset.warningBanner.title}
              </h3>
              <ul className="space-y-2 list-disc pl-4 text-amber-800/80">
                {activePreset.warningBanner.rules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips (Dynamic) */}
          {activePreset.tips && (
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 text-sm text-blue-900 space-y-3">
              <h3 className="font-bold flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                {activePreset.tips.title}
              </h3>
              <ul className="space-y-2 list-disc pl-4 text-blue-800/80">
                {activePreset.tips.items.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Preset Manager Modal */}
      {isManagerOpen && (
        <PresetManager
          presets={availablePresets}
          onClose={() => setIsManagerOpen(false)}
          onRefresh={refreshPresets}
          activePresetId={activePresetId}
          onSwitchPreset={handlePresetSwitch}
        />
      )}
    </div>
  );
}