"use client";
import { useState } from "react";
import { presetThemes, findPresetByName } from "../data/presets";

interface PresetsProps {
  onPresetSelect: (array: number[]) => void;
  onThemeChange?: (theme: string) => void;
  onPresetChange?: (preset: string) => void;
}

export default function Presets({ onPresetSelect, onThemeChange, onPresetChange }: PresetsProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>("Chess Pieces");
  const [selectedPreset, setSelectedPreset] = useState<string>("King");

  const handleThemeChange = (themeName: string) => {
    setSelectedTheme(themeName);
    const theme = presetThemes.find(t => t.name === themeName);
    if (theme && theme.items.length > 0) {
      setSelectedPreset(theme.items[0].name);
      onPresetSelect(theme.items[0].array);
      onThemeChange?.(themeName);
      onPresetChange?.(theme.items[0].name);
    }
  };

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = findPresetByName(presetName);
    if (preset) {
      onPresetSelect(preset.array);
      onPresetChange?.(presetName);
    }
  };

  const currentTheme = presetThemes.find(t => t.name === selectedTheme);

  return (
    <div className="mb-4 p-3 bg-white border rounded-lg shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Presets</h3>
      
      {/* Theme Selection */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Theme:
        </label>
        <select
          value={selectedTheme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className="w-full p-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-colors duration-200 cursor-pointer"
        >
          {presetThemes.map((theme) => (
            <option key={theme.name} value={theme.name}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>

      {/* Preset Selection */}
      {currentTheme && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {currentTheme.name}:
          </label>
          <select
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="w-full p-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-colors duration-200 cursor-pointer"
          >
            {currentTheme.items.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name} ({item.array.length} elements)
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
} 