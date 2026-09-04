'use client'

import { useAppStore } from '../lib/store'
import { useState, useEffect } from 'react'
import { useTranslation } from '../lib/i18n'

export function SocialPreview() {
  const store = useAppStore()
  const t = useTranslation(store.uiLanguage)
  const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'facebook' | 'discord' | 'whatsapp'>('twitter')
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const generateImage = async () => {
      try {
        const res = await fetch('/api/og', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: store.title,
            description: store.description,
            accentColor: store.accentColor,
            bgStyle: store.bgStyle,
            logoUrl: store.logoUrl,
            brandName: store.brandName,
            tags: store.tags,
            preset: store.preset,
            bgImageBase64: store.bgImageBase64
          })
        })
        if (res.ok && active) {
          const blob = await res.blob()
          setImageUrl(URL.createObjectURL(blob))
        }
      } catch (e) {
        console.error(e)
      }
    }

    const timer = setTimeout(() => {
      generateImage()
    }, 250)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [
    store.title,
    store.description,
    store.accentColor,
    store.bgStyle,
    store.logoUrl,
    store.brandName,
    store.tags,
    store.preset,
    store.bgImageBase64
  ])

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => setPlatform('twitter')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${platform === 'twitter' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {t('xPreview')}
        </button>
        <button
          onClick={() => setPlatform('linkedin')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${platform === 'linkedin' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {t('linkedinPreview')}
        </button>
        <button
          onClick={() => setPlatform('facebook')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${platform === 'facebook' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {t('facebookPreview')}
        </button>
        <button
          onClick={() => setPlatform('discord')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${platform === 'discord' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {t('discordPreview')}
        </button>
        <button
          onClick={() => setPlatform('whatsapp')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${platform === 'whatsapp' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {t('whatsappPreview')}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {platform === 'twitter' && (
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="aspect-[1.91/1] w-full bg-gray-100 relative flex items-center justify-center">
                {imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                )}
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
              <div className="aspect-[1.91/1] w-full bg-gray-100 relative flex items-center justify-center">
                {imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                )}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="text-gray-900 font-semibold truncate text-base">{store.title}</div>
                <div className="text-gray-500 text-xs truncate mt-1">yourdomain.com</div>
              </div>
            </div>
          )}

          {platform === 'facebook' && (
            <div className="border border-gray-200 bg-white shadow-sm">
              <div className="aspect-[1.91/1] w-full bg-gray-100 relative flex items-center justify-center">
                {imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                )}
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
                  {imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={imageUrl} alt="Preview" className="w-full max-w-[400px] h-auto object-cover" />
                  ) : (
                    <div className="w-[360px] h-[189px] bg-white/5 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          )}

          {platform === 'whatsapp' && (
            <div className="bg-[#056162] p-2 rounded-lg max-w-[320px] shadow-sm relative text-[#E9EDEF] mx-auto">
               <div className="absolute right-0 top-0 w-0 h-0 border-t-8 border-t-[#056162] border-r-8 border-r-transparent -mr-2 mt-2"></div>
               <div className="bg-[#025151] rounded-md overflow-hidden mb-1 aspect-[1200/630] flex items-center justify-center">
                 {imageUrl ? (
                   /* eslint-disable-next-line @next/next/no-img-element */
                   <img src={imageUrl} alt="Preview" className="w-full aspect-[1200/630] object-cover" />
                 ) : (
                   <div className="w-full h-full bg-black/20 animate-pulse" />
                 )}
               </div>
               <div className="px-2 pb-1 bg-[#025151] rounded-md">
                 <div className="text-[15px] font-semibold truncate leading-tight text-[#E9EDEF] pt-1">{store.title}</div>
                 <div className="text-[13px] text-[#8696A0] truncate leading-snug">{store.description}</div>
                 <div className="text-[11px] text-[#8696A0] uppercase tracking-wider mt-1 pb-1">yourdomain.com</div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
