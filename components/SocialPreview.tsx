'use client'

import { useAppStore } from '../lib/store'
import { useState, useEffect } from 'react'
import { useTranslation } from '../lib/i18n'

export function SocialPreview() {
  const store = useAppStore()
  const t = useTranslation(store.uiLanguage)
  const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'facebook' | 'discord' | 'whatsapp' | 'instagram'>('twitter')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [waTheme, setWaTheme] = useState<'dark' | 'light'>('dark')
  const [igTheme, setIgTheme] = useState<'dark' | 'light'>('dark')

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

  // Extract a clean display domain
  const displayDomain = store.brandName 
    ? `${store.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
    : 'yourdomain.com'

  const downloadImage = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = 'og.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="flex flex-col h-full bg-slate-950/40">
      {/* Platform Switcher & Actions */}
      <div className="flex items-center justify-between gap-3 p-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => setPlatform('twitter')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
            platform === 'twitter' 
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          {t('xPreview')}
        </button>
        <button
          onClick={() => setPlatform('linkedin')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
            platform === 'linkedin' 
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          {t('linkedinPreview')}
        </button>
        <button
          onClick={() => setPlatform('facebook')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
            platform === 'facebook' 
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          {t('facebookPreview')}
        </button>
        <button
          onClick={() => setPlatform('discord')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
            platform === 'discord' 
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          {t('discordPreview')}
        </button>
        <button
          onClick={() => setPlatform('whatsapp')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
            platform === 'whatsapp' 
              ? 'bg-emerald-600/90 text-white shadow-sm border border-emerald-500/50' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          {t('whatsappPreview')}
        </button>
        <button
          onClick={() => setPlatform('instagram')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
            platform === 'instagram' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm border border-pink-500/40' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          {t('instagramPreview')}
        </button>
        </div>

        <button
          onClick={downloadImage}
          disabled={!imageUrl}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm ml-auto cursor-pointer"
          title={t('downloadImageDesc')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>{t('downloadImage')}</span>
        </button>
      </div>

      {/* Main Preview Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl flex justify-center">
          {/* X (Twitter) Preview */}
          {platform === 'twitter' && (
            <div className="w-full max-w-xl border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-black shadow-lg">
              <div className="aspect-[1.91/1] w-full bg-gray-100 dark:bg-slate-900 relative flex items-center justify-center">
                {imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 animate-pulse" />
                )}
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800/80">
                <div className="text-gray-500 dark:text-zinc-500 text-xs truncate">{displayDomain}</div>
                <div className="text-gray-900 dark:text-zinc-100 font-bold truncate mt-0.5 text-sm sm:text-base">{store.title}</div>
                <div className="text-gray-500 dark:text-zinc-400 text-xs sm:text-sm truncate mt-0.5">{store.description}</div>
              </div>
            </div>
          )}

          {/* LinkedIn Preview */}
          {platform === 'linkedin' && (
            <div className="w-full max-w-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1b1f23] rounded-md shadow-md overflow-hidden">
              <div className="aspect-[1.91/1] w-full bg-gray-100 dark:bg-slate-900 relative flex items-center justify-center">
                {imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 animate-pulse" />
                )}
              </div>
              <div className="p-4 bg-gray-50 dark:bg-[#1b1f23] border-t border-gray-200 dark:border-slate-800">
                <div className="text-gray-900 dark:text-slate-100 font-semibold truncate text-sm sm:text-base">{store.title}</div>
                <div className="text-gray-500 dark:text-slate-400 text-xs truncate mt-1">{displayDomain}</div>
              </div>
            </div>
          )}

          {/* Facebook Preview */}
          {platform === 'facebook' && (
            <div className="w-full max-w-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#242526] shadow-md overflow-hidden">
              <div className="aspect-[1.91/1] w-full bg-gray-100 dark:bg-slate-900 relative flex items-center justify-center">
                {imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 animate-pulse" />
                )}
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-[#242526] border-t border-gray-200 dark:border-slate-700">
                <div className="text-gray-500 dark:text-gray-400 text-[11px] uppercase tracking-wider truncate mb-0.5">{displayDomain}</div>
                <div className="text-gray-900 dark:text-gray-100 font-bold text-sm sm:text-base truncate">{store.title}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs truncate mt-0.5">{store.description}</div>
              </div>
            </div>
          )}

          {/* Discord Preview */}
          {platform === 'discord' && (
            <div className="w-full max-w-[500px] bg-[#2f3136] rounded-md overflow-hidden shadow-lg flex flex-col border-l-4" style={{ borderColor: store.accentColor }}>
              <div className="p-4 flex flex-col gap-1.5">
                <div className="text-[#00aff4] text-xs hover:underline cursor-pointer truncate">{displayDomain}</div>
                <div className="text-[#00aff4] font-semibold text-sm sm:text-base hover:underline cursor-pointer truncate">{store.title}</div>
                <div className="text-[#dcddde] text-xs sm:text-sm line-clamp-3">{store.description}</div>
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

          {/* WhatsApp Preview (Polished & Realistic) */}
          {platform === 'whatsapp' && (
            <div className="w-full max-w-[440px] flex flex-col gap-3">
              {/* WhatsApp Theme Switcher Bar */}
              <div className="flex items-center justify-between px-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#25D366]"></span>
                  WhatsApp Chat Preview
                </span>
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md p-0.5">
                  <button
                    onClick={() => setWaTheme('dark')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      waTheme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setWaTheme('light')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      waTheme === 'light' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Light
                  </button>
                </div>
              </div>

              {/* WhatsApp Chat Viewport */}
              <div 
                className={`relative p-4 sm:p-6 rounded-2xl border shadow-xl transition-colors overflow-hidden ${
                  waTheme === 'dark' 
                    ? 'bg-[#0b141a] border-slate-800' 
                    : 'bg-[#efeae2] border-stone-300'
                }`}
                style={{
                  backgroundImage: waTheme === 'dark' 
                    ? 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.02) 0%, transparent 20%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.02) 0%, transparent 20%)'
                    : 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 40%)'
                }}
              >
                {/* Outgoing Message Bubble */}
                <div className="flex justify-end">
                  <div 
                    className={`relative max-w-[340px] sm:max-w-[380px] p-1.5 rounded-2xl shadow-sm text-left ${
                      waTheme === 'dark' 
                        ? 'bg-[#005c4b] text-[#e9edef]' 
                        : 'bg-[#d9fdd3] text-[#111b21]'
                    }`}
                    style={{ borderTopRightRadius: '4px' }}
                  >
                    {/* Chat Bubble Tail */}
                    <div className="absolute -top-[1px] -right-[9px] w-[10px] h-[14px] overflow-hidden pointer-events-none">
                      <svg viewBox="0 0 10 14" width="10" height="14" fill={waTheme === 'dark' ? '#005c4b' : '#d9fdd3'}>
                        <path d="M0,0 C3,2 8,6 10,14 C8,10 6,4 0,0 Z" />
                      </svg>
                    </div>

                    {/* Rich Link Card Container */}
                    <div 
                      className={`rounded-xl overflow-hidden ${
                        waTheme === 'dark' ? 'bg-[#025144]' : 'bg-[#e7f8e8]'
                      }`}
                    >
                      {/* OG Image */}
                      <div className="aspect-[1.91/1] w-full bg-black/10 relative flex items-center justify-center overflow-hidden">
                        {imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={imageUrl} alt="WhatsApp Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-black/20 animate-pulse" />
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-2.5">
                        <div 
                          className={`text-[13.5px] font-semibold leading-snug line-clamp-1 ${
                            waTheme === 'dark' ? 'text-[#e9edef]' : 'text-[#111b21]'
                          }`}
                        >
                          {store.title}
                        </div>
                        {store.description && (
                          <div 
                            className={`text-[12px] leading-snug line-clamp-2 mt-1 ${
                              waTheme === 'dark' ? 'text-[#8696a0]' : 'text-[#667781]'
                            }`}
                          >
                            {store.description}
                          </div>
                        )}
                        <div 
                          className={`text-[11px] uppercase tracking-wider flex items-center gap-1 mt-1.5 font-medium ${
                            waTheme === 'dark' ? 'text-[#8696a0]' : 'text-[#667781]'
                          }`}
                        >
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span className="truncate">{displayDomain}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chat Text Message & Metadata */}
                    <div className="px-2 pt-2 pb-1">
                      <a 
                        href={`https://${displayDomain}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`text-[13px] hover:underline break-all block leading-tight ${
                          waTheme === 'dark' ? 'text-[#53bdeb]' : 'text-[#027eb5]'
                        }`}
                      >
                        https://{displayDomain}
                      </a>

                      <div className="flex items-center justify-end gap-1 mt-1 text-[11px] text-[#8696a0]">
                        <span>14:32</span>
                        {/* WhatsApp Blue Double Checkmark */}
                        <svg className="w-4 h-4 text-[#53bdeb]" viewBox="0 0 16 11" fill="currentColor">
                          <path d="M15.01 2.31L13.6 0.9l-5.66 5.66-2.83-2.83-1.41 1.41 4.24 4.25 7.07-7.08zm-3.53 0L10.07 0.9l-4.95 4.95-1.41-1.41-1.41 1.41 2.82 2.83 6.36-6.37z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instagram DM Preview (Modern & Pixel-perfect) */}
          {platform === 'instagram' && (
            <div className="w-full max-w-[440px] flex flex-col gap-3">
              {/* Instagram Header Indicator & Theme Switcher */}
              <div className="flex items-center justify-between px-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"></span>
                  Instagram Direct Message
                </span>
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md p-0.5">
                  <button
                    onClick={() => setIgTheme('dark')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      igTheme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setIgTheme('light')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      igTheme === 'light' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Light
                  </button>
                </div>
              </div>

              {/* Chat Viewport */}
              <div 
                className={`relative p-4 sm:p-6 rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
                  igTheme === 'dark' 
                    ? 'bg-[#121212] border-slate-800' 
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* Subtle Instagram DM ambient background glow */}
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />

                {/* Sent Message Row with Side Action Icons */}
                <div className="flex items-center justify-end gap-2.5 sm:gap-3">
                  {/* Left Action Buttons (Info & Share) */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {/* Info Button */}
                    <button 
                      aria-label="Info" 
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                        igTheme === 'dark' 
                          ? 'bg-white/10 hover:bg-white/20 border border-white/15 text-white' 
                          : 'bg-black/5 hover:bg-black/10 border border-black/10 text-gray-700'
                      }`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </button>

                    {/* Paper Airplane (DM Share) Button */}
                    <button 
                      aria-label="Share" 
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                        igTheme === 'dark' 
                          ? 'bg-white/10 hover:bg-white/20 border border-white/15 text-white' 
                          : 'bg-black/5 hover:bg-black/10 border border-black/10 text-gray-700'
                      }`}
                    >
                      <svg className="w-4 h-4 -translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>

                  {/* Main Instagram Link Card Bubble */}
                  <div className="relative w-full max-w-[320px] sm:max-w-[360px]">
                    <div 
                      className={`rounded-[22px] overflow-hidden shadow-lg border transition-all ${
                        igTheme === 'dark' 
                          ? 'bg-[#262626] border-[#363636] text-white' 
                          : 'bg-[#f0f2f5] border-gray-200 text-gray-900'
                      }`}
                    >
                      {/* 1. Full 1.91:1 Open Graph Image */}
                      <div className="aspect-[1.91/1] w-full bg-slate-900/30 relative flex items-center justify-center overflow-hidden">
                        {imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img 
                            src={imageUrl} 
                            alt="Instagram Preview" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800/40 animate-pulse" />
                        )}
                      </div>

                      {/* 2. Link Preview Details */}
                      <div className="p-3 sm:p-3.5 flex flex-col gap-1">
                        {/* Domain / Brand Header */}
                        <div className="flex items-center gap-1.5">
                          {store.logoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img 
                              src={store.logoUrl} 
                              alt="Logo" 
                              className="w-3.5 h-3.5 rounded-full object-contain shrink-0" 
                            />
                          ) : (
                            <svg className="w-3.5 h-3.5 shrink-0 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="2" y1="12" x2="22" y2="12" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                          )}
                          <span 
                            className={`text-[11px] font-medium tracking-wide uppercase truncate ${
                              igTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {displayDomain}
                          </span>
                        </div>

                        {/* Title */}
                        <div 
                          className={`font-semibold text-xs sm:text-[14px] leading-snug line-clamp-2 mt-0.5 ${
                            igTheme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {store.title}
                        </div>

                        {/* Description */}
                        {store.description && (
                          <div 
                            className={`text-[12px] leading-snug line-clamp-2 mt-0.5 ${
                              igTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {store.description}
                          </div>
                        )}
                      </div>

                      {/* 3. Sent Link URL Footer */}
                      <div 
                        className={`px-3.5 py-2 border-t flex items-center justify-between gap-2 ${
                          igTheme === 'dark' ? 'border-white/10 bg-[#1f1f1f]' : 'border-black/5 bg-[#e8ebed]'
                        }`}
                      >
                        <a 
                          href={`https://${displayDomain}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className={`text-xs hover:underline truncate ${
                            igTheme === 'dark' ? 'text-[#3897f0]' : 'text-[#00376b]'
                          }`}
                        >
                          https://{displayDomain}
                        </a>
                        <span 
                          className={`text-[10.5px] shrink-0 font-normal ${
                            igTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        >
                          14:32
                        </span>
                      </div>
                    </div>

                    {/* Instagram Double-tap Heart Reaction Badge */}
                    <div 
                      className={`absolute -bottom-2 -right-1.5 px-1.5 py-0.5 rounded-full border shadow-md flex items-center gap-1 text-[11px] font-medium ${
                        igTheme === 'dark' 
                          ? 'bg-[#262626] border-[#363636] text-white' 
                          : 'bg-white border-gray-200 text-gray-800'
                      }`}
                    >
                      <span>❤️</span>
                      <span className="text-[10px]">1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
