'use client'

import { useAppStore, Framework, OgExportMode } from '../lib/store'
import { generateCode, TemplateFile } from '../lib/templates'
import { useState, useEffect } from 'react'
import { codeToHtml } from 'shiki'
import { useTranslation, TranslationKey } from '../lib/i18n'

function formatGuideText(text: string) {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="text-gray-200 bg-gray-800/80 px-1 py-0.5 rounded text-xs font-mono">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

function EducationalGuide({
  framework,
  activeFile,
  exportMode,
  isI18n,
  t,
}: {
  framework: Framework
  activeFile: string
  exportMode: OgExportMode
  isI18n: boolean
  t: (key: TranslationKey) => string
}) {
  const [isOpen, setIsOpen] = useState(false)

  const title = t('howToImplement')
  let content = null

  if (exportMode === 'static') {
    content = (
      <div className="space-y-2">
        <p><strong>{t('guidePlacement')}:</strong> {formatGuideText(t('guideStaticStep1'))}</p>
        <p><strong>{t('guideInstructions')}:</strong> {formatGuideText(t('guideStaticStep2'))}</p>
        {isI18n && (
          <p className="pt-2 border-t border-gray-800/80"><strong>{t('guideI18nTitle')}:</strong> {formatGuideText(t('guideI18nExplanation'))}</p>
        )}
      </div>
    )
  } else if (framework === 'nextjs') {
    if (activeFile.includes('opengraph-image')) {
      content = (
        <div className="space-y-2">
          <p><strong>{t('guidePlacement')}:</strong> {formatGuideText(t('guideNextImagePlacement'))}</p>
          <p><strong>{t('guideEdgeRuntime')}:</strong> {formatGuideText(t('guideNextImageEdge'))}</p>
          <p><strong>{t('guideVerification')}:</strong> {formatGuideText(t('guideNextImageVerify'))}</p>
          {isI18n && (
            <p className="pt-2 border-t border-gray-800/80"><strong>{t('guideI18nTitle')}:</strong> {formatGuideText(t('guideI18nExplanation'))}</p>
          )}
        </div>
      )
    } else {
      content = (
        <div className="space-y-2">
          <p><strong>{t('guidePlacement')}:</strong> {formatGuideText(t('guideNextLayoutPlacement'))}</p>
          <p><strong>{t('guideVerification')}:</strong> {formatGuideText(t('guideNextLayoutVerify'))}</p>
          {isI18n && (
            <p className="pt-2 border-t border-gray-800/80"><strong>{t('guideI18nTitle')}:</strong> {formatGuideText(t('guideI18nExplanation'))}</p>
          )}
        </div>
      )
    }
  } else if (framework === 'html') {
    content = (
      <div className="space-y-2">
        <p><strong>{t('guideInstructions')}:</strong> {formatGuideText(t('guideHtmlInstructions'))}</p>
        <p><strong>{t('guideAbsoluteUrls')}:</strong> {formatGuideText(t('guideHtmlAbsoluteUrls'))}</p>
        <p><strong>{t('guideCache')}:</strong> {formatGuideText(t('guideHtmlCache'))}</p>
      </div>
    )
  } else if (framework === 'vue') {
    if (activeFile === 'app.vue') {
      content = (
        <div className="space-y-2">
          <p><strong>{t('guideUsage')}:</strong> {formatGuideText(t('guideVueUsage'))}</p>
          <p><strong>{t('guideNuxtOgImage')}:</strong> {formatGuideText(t('guideVueNuxtOg'))}</p>
        </div>
      )
    } else {
      content = (
        <div className="space-y-2">
          <p><strong>{t('guideNitroRoute')}:</strong> {formatGuideText(t('guideVueNitroRoute'))}</p>
          <p><strong>{t('guideConfiguration')}:</strong> {formatGuideText(t('guideVueNitroConfig'))}</p>
        </div>
      )
    }
  } else if (framework === 'react') {
    if (activeFile === 'worker.js') {
      content = (
        <div className="space-y-2">
          <p><strong>{t('guideEdgeWorker')}:</strong> {formatGuideText(t('guideReactEdgeWorker'))}</p>
          <p><strong>{t('guideDetection')}:</strong> {formatGuideText(t('guideReactDetection'))}</p>
        </div>
      )
    } else {
      content = (
        <div className="space-y-2">
          <p><strong>{t('guideLimitation')}:</strong> {formatGuideText(t('guideReactLimitation'))}</p>
          <p><strong>{t('guideSolution')}:</strong> {formatGuideText(t('guideReactSolution'))}</p>
        </div>
      )
    }
  } else if (framework === 'laravel') {
    if (activeFile.includes('meta-tags')) {
      content = (
        <div className="space-y-2">
          <p><strong>{t('guideBladeComponent')}:</strong> {formatGuideText(t('guideLaravelBlade'))}</p>
        </div>
      )
    } else {
      content = (
        <div className="space-y-2">
          <p><strong>{t('guideDynamicGeneration')}:</strong> {formatGuideText(t('guideLaravelDynamic'))}</p>
        </div>
      )
    }
  }

  if (!content) return null

  return (
    <div className="border-t border-gray-800 bg-[#0a0d14]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors focus:outline-none cursor-pointer"
      >
        <span>💡 {title}</span>
        <span className="text-gray-500">{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-gray-400 text-sm leading-relaxed border-t border-gray-800/50 bg-[#0a0d14]">
          <div className="mt-4">{content}</div>
        </div>
      )}
    </div>
  )
}

export function CodeOutput() {
  const store = useAppStore()
  const t = useTranslation(store.uiLanguage)
  const files: TemplateFile[] = generateCode(store)
  const [activeFileIndex, setActiveFileIndex] = useState(0)

  // Reset active index when framework, i18n, or export mode changes (standard React pattern without effect)
  const [prevFramework, setPrevFramework] = useState(store.framework)
  const [prevI18n, setPrevI18n] = useState(store.i18nEnabled)
  const [prevMode, setPrevMode] = useState(store.ogExportMode)

  if (store.framework !== prevFramework || store.i18nEnabled !== prevI18n || store.ogExportMode !== prevMode) {
    setPrevFramework(store.framework)
    setPrevI18n(store.i18nEnabled)
    setPrevMode(store.ogExportMode)
    setActiveFileIndex(0)
  }

  // Out-of-bounds protection ensuring the index is always valid
  const safeIndex = activeFileIndex < files.length ? activeFileIndex : 0

  // activeFile is defined strictly once with a single const in this scope
  const activeFile: TemplateFile = files[safeIndex] || files[0]
  const currentCode = activeFile.content

  const [html, setHtml] = useState('')
  const [copied, setCopied] = useState(false)
  const [downloadingImage, setDownloadingImage] = useState(false)

  useEffect(() => {
    async function highlight() {
      if (!currentCode) {
        setHtml('')
        return
      }
      try {
        const lang = activeFile ? activeFile.language : 'tsx'

        const result = await codeToHtml(currentCode, {
          lang,
          theme: 'github-dark'
        })
        setHtml(result)
      } catch (e) {
        console.error('Failed to highlight code:', e)
        setHtml(`<pre style="background:#0d1117;color:#c9d1d9;padding:16px;"><code>${currentCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
      }
    }
    highlight()
  }, [currentCode, activeFile])

  const copyCode = async () => {
    await navigator.clipboard.writeText(currentCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFile = () => {
    const blob = new Blob([currentCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url

    const fileName = activeFile.filename.split('/').pop() || 'og-template.txt'

    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadOgImage = async () => {
    try {
      setDownloadingImage(true)
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
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'og.png'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (e) {
      console.error('Failed to download OG image:', e)
    } finally {
      setDownloadingImage(false)
    }
  }

  const handleFrameworkChange = (fw: Framework) => {
    setActiveFileIndex(0)
    store.setFramework(fw)
  }

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      <div className="flex flex-col p-4 border-b border-gray-800 bg-[#0d1117] gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Framework Switcher */}
          <div className="flex gap-1 bg-gray-900 p-1 rounded-md">
            {[
              { id: 'nextjs', label: 'Next.js' },
              { id: 'html', label: 'HTML' },
              { id: 'react', label: 'React SPA' },
              { id: 'vue', label: 'Nuxt 3' },
              { id: 'laravel', label: 'Laravel' },
            ].map((fw) => (
              <button
                key={fw.id}
                onClick={() => handleFrameworkChange(fw.id as Framework)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${store.framework === fw.id
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                  }`}
              >
                {fw.label}
              </button>
            ))}
          </div>

          {/* Mode Switcher & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode Switcher */}
            <div className="flex bg-gray-900 p-1 rounded-md border border-gray-800">
              <button
                onClick={() => store.setOgExportMode('static')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  store.ogExportMode === 'static'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title={t('guideStaticStep1')}
              >
                🖼️ {t('staticModeBadge')}
              </button>
              <button
                onClick={() => store.setOgExportMode('dynamic')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  store.ogExportMode === 'dynamic'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title={t('guideEdgeRuntime')}
              >
                ⚡ {t('dynamicModeBadge')}
              </button>
            </div>

            {/* Download Image Button */}
            <button
              onClick={downloadOgImage}
              disabled={downloadingImage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              title={t('downloadImageDesc')}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloadingImage ? '...' : t('downloadImage')}
            </button>

            {/* Download Code File */}
            <button
              onClick={downloadFile}
              className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors cursor-pointer"
            >
              {t('download')}
            </button>

            {/* Copy Code */}
            <button
              onClick={copyCode}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
            >
              {copied ? t('copied') : t('copyCode')}
            </button>
          </div>
        </div>

        {/* Tab selection for multi-file templates */}
        {files.length > 1 && (
          <div className="flex gap-2 border-b border-gray-800 pt-1">
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => setActiveFileIndex(index)}
                className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 cursor-pointer ${safeIndex === index
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
              >
                {file.tabName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-auto text-sm p-4 relative">
        <div dangerouslySetInnerHTML={{ __html: html }} className="[&>pre]:!bg-transparent [&>pre]:!p-0" />
      </div>

      <EducationalGuide
        framework={store.framework}
        activeFile={activeFile.filename}
        exportMode={store.ogExportMode}
        isI18n={store.i18nEnabled}
        t={t}
      />
    </div>
  )
}
