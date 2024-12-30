import { useState } from 'react';

export function LanguageSettings() {
  const [language, setLanguage] = useState('en');
  const [subtitleLanguage, setSubtitleLanguage] = useState('en');

  return (
    <section className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Language & Subtitles</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Display Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-md"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preferred Subtitle Language</label>
          <select
            value={subtitleLanguage}
            onChange={(e) => setSubtitleLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-md"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>
    </section>
  );
}