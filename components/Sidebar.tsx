'use client'

import { useAppStore, Framework, BgStyle } from '../lib/store'
import { ChangeEvent, useState } from 'react'

export function Sidebar() {
  const store = useAppStore()

  const [tagsInput, setTagsInput] = useState(store.tags.join(', '))
  const [prevTags, setPrevTags] = useState(store.tags)

  if (store.tags !== prevTags) {
    setPrevTags(store.tags)
    const currentInputArr = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    if (JSON.stringify(currentInputArr) !== JSON.stringify(store.tags)) {
      setTagsInput(store.tags.join(', '))
    }
  }

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value)
    store.setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))
  }

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-white border-r border-gray-200 text-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Settings</h2>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 uppercase tracking-wider text-xs">Metadata</h3>

          <div>
            <label className="block text-gray-600 mb-1">Title</label>
            <input
              type="text"
              value={store.title}
              onChange={(e) => store.setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Description</label>
            <textarea
              value={store.description}
              onChange={(e) => store.setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={handleTagsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Design Settings */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="font-semibold text-gray-700 uppercase tracking-wider text-xs">Design</h3>

          <div>
            <label className="block text-gray-600 mb-1">Brand Name</label>
            <input
              type="text"
              value={store.brandName}
              onChange={(e) => store.setBrandName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Logo URL</label>
            <input
              type="text"
              value={store.logoUrl}
              onChange={(e) => store.setLogoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={store.accentColor}
                onChange={(e) => store.setAccentColor(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={store.accentColor}
                onChange={(e) => store.setAccentColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Background Style</label>
            <select
              value={store.bgStyle}
              onChange={(e) => store.setBgStyle(e.target.value as BgStyle)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="solid">Solid</option>
              <option value="gradient">Gradient</option>
              <option value="pattern">Pattern</option>
            </select>
          </div>
        </div>

        {/* Export Settings */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="font-semibold text-gray-700 uppercase tracking-wider text-xs">Export & Code</h3>

          <div>
            <label className="block text-gray-600 mb-1">Framework</label>
            <select
              value={store.framework}
              onChange={(e) => store.setFramework(e.target.value as Framework)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="nextjs">Next.js (App Router)</option>
              <option value="react">React SPA (Vite/CRA)</option>
              <option value="vue">Vue 3 / Nuxt</option>
              <option value="laravel">Laravel (Blade)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={store.i18nEnabled}
                onChange={(e) => store.setI18nEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-gray-700">Enable Multi-language (i18n)</span>
            </label>

            {store.i18nEnabled && (
              <div className="pl-6 space-y-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Default Locale</label>
                  <input
                    type="text"
                    value={store.defaultLocale}
                    onChange={(e) => store.setDefaultLocale(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Alternate Locales (comma separated)</label>
                  <input
                    type="text"
                    value={store.secondaryLocales}
                    onChange={(e) => store.setSecondaryLocales(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
