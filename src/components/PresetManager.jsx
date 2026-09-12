import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Copy, AlertTriangle } from 'lucide-react';
import PresetEditor from './PresetEditor';
import { saveLocalPreset, deleteLocalPreset } from '../data/presetLoader';

export default function PresetManager({
  presets,
  onClose,
  onRefresh
}) {
  const [editingPreset, setEditingPreset] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const localPresets = presets.filter(p => p.isLocal);
  const filePresets = presets.filter(p => !p.isLocal);

  const handleCreate = () => {
    setEditingPreset(null); // null = new preset
    setIsEditing(true);
  };

  const handleEdit = (preset) => {
    setEditingPreset(preset);
    setIsEditing(true);
  };

  const handleClone = (preset) => {
    const cloned = {
      ...preset,
      id: '',
      name: `${preset.name} (Copy)`,
      isLocal: true // ensure it's treated as local
    };
    setEditingPreset(cloned);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this preset?')) {
      deleteLocalPreset(id);
      onRefresh();
    }
  };

  const handleSave = (preset) => {
    saveLocalPreset(preset);
    onRefresh();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <PresetEditor
        initialPreset={editingPreset}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Manage Search Presets</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {/* Custom Presets Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-indigo-900">My Custom Presets</h3>
              <button
                onClick={handleCreate}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Preset
              </button>
            </div>

            {localPresets.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">No custom presets yet.</p>
                <button onClick={handleCreate} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-1">
                  Create one from scratch
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {localPresets.map(preset => (
                  <div key={preset.id} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg hover:border-indigo-200 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">{preset.name}</div>
                      <div className="text-xs text-gray-500">{preset.description || 'No description'}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(preset)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(preset.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Built-in Presets Section */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Built-in Presets</h3>
            <div className="space-y-2">
              {filePresets.map(preset => (
                <div key={preset.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-lg opacity-80 hover:opacity-100 transition-opacity">
                  <div>
                    <div className="font-medium text-gray-800 flex items-center gap-2">
                      {preset.name}
                      <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded uppercase tracking-wide font-bold">File</span>
                    </div>
                    <div className="text-xs text-gray-500">{preset.description}</div>
                  </div>
                  <button
                    onClick={() => handleClone(preset)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded"
                    title="Clone to Custom"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Custom presets are saved to your browser's local storage.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
