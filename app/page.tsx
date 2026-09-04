'use client'

import { Sidebar } from '../components/Sidebar'
import { SocialPreview } from '../components/SocialPreview'
import { CodeOutput } from '../components/CodeOutput'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')

  return (
    <div className="flex h-screen w-full bg-white text-black overflow-hidden font-sans">
      {/* Sidebar - Fixed width */}
      <div className="w-[380px] h-full flex-shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.05)] relative">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-gray-50 min-w-0">

        {/* Top Header / Tabs */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-6">
          <h1 className="font-bold text-gray-900 mr-auto text-lg flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs">OG</div>
            OpenGraph Studio
          </h1>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              Social Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'code'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              Code Output
            </button>
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
