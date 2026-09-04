'use client'

import { Sidebar } from '../components/Sidebar'
import { SocialPreview } from '../components/SocialPreview'
import { CodeOutput } from '../components/CodeOutput'
import { useState } from 'react'
import { useAppStore } from '../lib/store'
import { useTranslation } from '../lib/i18n'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const store = useAppStore()
  const t = useTranslation(store.uiLanguage)

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Fixed width */}
      <div className="w-[380px] h-full flex-shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.5)] relative">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-900 min-w-0">

        {/* Top Header / Tabs */}
        <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center px-6 gap-6">
          <h1 className="font-bold text-slate-100 mr-auto text-lg flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs shadow-[0_0_10px_rgba(37,99,235,0.5)]">OG</div>
            {t('appTitle')}
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'preview'
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {t('socialPreviewTab')}
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'code'
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {t('codeOutputTab')}
              </button>
            </div>

            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => store.setUiLanguage('en')}
                className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                  store.uiLanguage === 'en'
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => store.setUiLanguage('tr')}
                className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                  store.uiLanguage === 'tr'
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TR
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'preview' ? <SocialPreview /> : <CodeOutput />}
        </div>
      </div>
    </div>
  )
}
