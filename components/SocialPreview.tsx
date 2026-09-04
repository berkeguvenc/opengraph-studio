'use client'

import { useAppStore } from '../lib/store'
import { useState } from 'react'

export function SocialPreview() {
  const store = useAppStore()
  const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'facebook' | 'discord'>('twitter')

  // Construct the URL for the iframe/image
  const searchParams = new URLSearchParams({
    title: store.title,
    description: store.description,
    accentColor: store.accentColor,
    bgStyle: store.bgStyle,
    logoUrl: store.logoUrl,
    brandName: store.brandName,
    tags: store.tags.join(','),
  })

  // We use a local relative path for the API
  const imageUrl = `/api/og?${searchParams.toString()}`

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-white">
        {(['twitter', 'linkedin', 'facebook', 'discord'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              platform === p
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {platform === 'twitter' && (
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="aspect-[1.91/1] w-full bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="text-gray-500 text-sm truncate">yourdomain.com</div>
                <div className="text-gray-900 font-bold truncate mt-0.5">{store.title}</div>
                <div className="text-gray-500 text-sm truncate mt-0.5">{store.description}</div>
              </div>
            </div>
          )}

          {platform === 'linkedin' && (
            <div className="border border-gray-200 bg-white shadow-sm" style={{ borderRadius: '2px' }}>
              <div className="aspect-[1.91/1] w-full bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="text-gray-900 font-semibold truncate text-base">{store.title}</div>
                <div className="text-gray-500 text-xs truncate mt-1">yourdomain.com</div>
              </div>
            </div>
          )}

          {platform === 'facebook' && (
            <div className="border border-gray-200 bg-white shadow-sm">
              <div className="aspect-[1.91/1] w-full bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="text-gray-500 text-[13px] uppercase tracking-wider truncate mb-1">YOURDOMAIN.COM</div>
                <div className="text-gray-900 font-bold text-base truncate">{store.title}</div>
                <div className="text-gray-500 text-sm truncate mt-1">{store.description}</div>
              </div>
            </div>
          )}

          {platform === 'discord' && (
            <div className="bg-[#2f3136] rounded-md overflow-hidden max-w-[520px] shadow-sm flex flex-col border-l-4" style={{ borderColor: store.accentColor }}>
              <div className="p-4 flex flex-col gap-2">
                <div className="text-[#00aff4] text-sm hover:underline cursor-pointer truncate">yourdomain.com</div>
                <div className="text-[#00aff4] font-semibold text-base hover:underline cursor-pointer truncate">{store.title}</div>
                <div className="text-[#dcddde] text-sm line-clamp-3">{store.description}</div>
              </div>
              <div className="px-4 pb-4">
                <div className="rounded-md overflow-hidden bg-black/20 w-fit">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Preview" className="w-full max-w-[400px] h-auto object-cover" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
