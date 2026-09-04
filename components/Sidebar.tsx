'use client'

import { useAppStore, BgStyle } from '../lib/store'
import { ChangeEvent, useState } from 'react'
import { useTranslation } from '../lib/i18n'

export function Sidebar() {
  const store = useAppStore()
  const t = useTranslation(store.uiLanguage)

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

  const inputClass = "w-full px-3 py-2 border border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-slate-900 text-slate-100"
  const labelClass = "block text-slate-400 mb-1"

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-slate-950 border-r border-slate-800 text-sm">
      <h2 className="text-xl font-bold mb-6 text-slate-100">{t('settings')}</h2>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-xs">{t('metadata')}</h3>

          <div>
            <label className={labelClass}>{t('title')}</label>
            <input
              type="text"
              value={store.title}
              onChange={(e) => store.setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>{t('description')}</label>
            <textarea
              value={store.description}
              onChange={(e) => store.setDescription(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>{t('tags')}</label>
            <input
              type="text"
              value={tagsInput}
              onChange={handleTagsChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Design Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-xs">{t('design')}</h3>

          <div>
            <label className={labelClass}>{t('designPresets')}</label>
            <select
              value={store.preset}
              onChange={(e) => store.setPreset(e.target.value as any)}
              className={inputClass}
            >
              <option value="minimalist">{t('minimalist')}</option>
              <option value="saas">{t('saas')}</option>
              <option value="blog">{t('blog')}</option>
              <option value="ecommerce">{t('ecommerce')}</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>{t('brandName')}</label>
            <input
              type="text"
              value={store.brandName}
              onChange={(e) => store.setBrandName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>{t('logoUrl')}</label>
            <input
              type="text"
              value={store.logoUrl}
              onChange={(e) => store.setLogoUrl(e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={labelClass}>{t('logoUpload')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    store.setLogoUrl(event.target?.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>

          <div>
            <label className={labelClass}>{t('accentColor')}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={store.accentColor}
                onChange={(e) => store.setAccentColor(e.target.value)}
                className="h-9 w-9 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <input
                type="text"
                value={store.accentColor}
                onChange={(e) => store.setAccentColor(e.target.value)}
                className={`${inputClass} uppercase flex-1`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>{t('bgStyle')}</label>
            <select
              value={store.bgStyle}
              onChange={(e) => store.setBgStyle(e.target.value as BgStyle)}
              className={inputClass}
            >
              <option value="solid">{t('solid')}</option>
              <option value="gradient">{t('gradient')}</option>
              <option value="pattern">{t('pattern')}</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>{t('bgUpload')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    store.setBgImageBase64(event.target?.result as string)
                  }
                  reader.readAsDataURL(file)
                } else {
                  store.setBgImageBase64('')
                }
              }}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Export Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-xs">{t('exportCode')}</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={store.i18nEnabled}
                onChange={(e) => store.setI18nEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-slate-300">{t('enableI18n')}</span>
            </label>

            {store.i18nEnabled && (
              <div className="pl-6 space-y-3">
                <div>
                  <label className="block text-slate-500 text-xs mb-1">{t('defaultLocale')}</label>
                  <input
                    type="text"
                    value={store.defaultLocale}
                    onChange={(e) => store.setDefaultLocale(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1">{t('alternateLocales')}</label>
                  <input
                    type="text"
                    value={store.secondaryLocales}
                    onChange={(e) => store.setSecondaryLocales(e.target.value)}
                    className={inputClass}
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
