'use client'

import { useAppStore, Framework } from '../lib/store'
import { generateCode, TemplateFile } from '../lib/templates'
import { useState, useEffect } from 'react'
import { codeToHtml } from 'shiki'
import { useTranslation } from '../lib/i18n'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function CodeOutput() {
  const store = useAppStore()
  const t = useTranslation(store.uiLanguage)
  const files: TemplateFile[] = generateCode(store)
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [html, setHtml] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)

  // Ensure active index is valid when framework changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveFileIndex(0)
  }, [store.framework])

  const activeFile = files[activeFileIndex] || files[0]

  useEffect(() => {
    async function highlight() {
      if (!activeFile) return
      try {
        const lang = activeFile.language === 'vue' ? 'vue'
                   : activeFile.language === 'php' ? 'php'
                   : activeFile.language === 'html' ? 'html'
                   : activeFile.language === 'javascript' ? 'javascript'
                   : activeFile.language === 'typescript' ? 'typescript'
                   : 'tsx'

        const result = await codeToHtml(activeFile.content, {
          lang,
          theme: 'github-dark'
        })
        setHtml(result)
      } catch (e) {
        console.error('Failed to highlight code:', e)
        // Fallback for simple display if highlighting fails
        setHtml(`<pre style="background:#0d1117;color:#c9d1d9;padding:16px;"><code>${activeFile.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
      }
    }
    highlight()
  }, [activeFile])

  const copyCode = async () => {
    if (!activeFile) return
    await navigator.clipboard.writeText(activeFile.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFile = () => {
    if (!activeFile) return

    // Determine extension from filename
    const extMatch = activeFile.filename.match(/\.[0-9a-z]+$/i)
    const ext = extMatch ? extMatch[0] : '.txt'

    // Determine filename for download, fallback to generic if not present
    const downloadName = activeFile.filename.split('/').pop() || `og-template${ext}`

    const blob = new Blob([activeFile.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = downloadName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyUrl = async () => {
    const searchParams = new URLSearchParams({
      title: store.title,
      description: store.description,
      accentColor: store.accentColor,
      bgStyle: store.bgStyle,
      logoUrl: store.logoUrl,
      brandName: store.brandName,
      tags: store.tags.join(','),
    }).toString()

    // Create an absolute URL if running in browser
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'
    const url = `${baseUrl}/api/og?${searchParams}`

    await navigator.clipboard.writeText(url)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const getGuideContent = () => {
    if (!activeFile) return null;
    const fw = store.framework;
    const tabName = activeFile.tabName;

    if (fw === 'nextjs') {
      if (tabName === 'opengraph-image.tsx') {
        return (
          <div className="space-y-2 text-gray-300">
            <p><strong>1. Placement:</strong> Place this file in your <code>app/</code> directory (or <code>app/[locale]/</code> if using i18n).</p>
            <p><strong>2. Edge Runtime:</strong> Next.js uses the Edge runtime for image generation, ensuring fast TTFB globally.</p>
            <p><strong>3. Verification:</strong> Run <code>npm run dev</code> and visit <code>http://localhost:3000/opengraph-image</code> to preview the generated image.</p>
          </div>
        );
      } else {
        return (
          <div className="space-y-2 text-gray-300">
            <p><strong>1. Placement:</strong> Add this <code>generateMetadata</code> (or <code>metadata</code> object) to your <code>app/layout.tsx</code> or specific page.</p>
            <p><strong>2. Absolute URLs:</strong> Make sure the <code>images</code> array points to an absolute URL for social crawlers to work properly.</p>
          </div>
        );
      }
    } else if (fw === 'html') {
      return (
        <div className="space-y-2 text-gray-300">
          <p><strong>1. Placement:</strong> Paste these meta tags inside the <code>&lt;head&gt;</code> section of your HTML document.</p>
          <p><strong>2. Absolute URLs:</strong> Ensure <code>og:image</code> and <code>twitter:image</code> use absolute URLs (e.g., <code>https://...</code>), as required by CDN crawlers.</p>
          <p><strong>3. Cache Invalidation:</strong> If you change the image later, social platforms might cache the old one. You can append a query parameter like <code>?v=2</code> to force an update.</p>
        </div>
      );
    } else if (fw === 'vue') {
      if (tabName === 'app.vue') {
        return (
          <div className="space-y-2 text-gray-300">
            <p><strong>1. <code>useSeoMeta</code>:</strong> This Nuxt 3 composable automatically injects meta tags into your document head.</p>
            <p><strong>2. Module Alternative:</strong> Consider installing <code>nuxt-seo</code> or <code>nuxt-og-image</code> for built-in component-based generation.</p>
          </div>
        );
      } else {
        return (
          <div className="space-y-2 text-gray-300">
            <p><strong>1. Nitro Route:</strong> Place this in <code>server/routes/</code> to create an API endpoint.</p>
            <p><strong>2. Implementation:</strong> You will need to install a library like <code>satori</code> or <code>resvg-js</code> to actually convert HTML/SVG to PNG in a Nuxt environment.</p>
          </div>
        );
      }
    } else if (fw === 'react') {
      if (tabName === 'index.html') {
        return (
          <div className="space-y-2 text-gray-300">
            <p><strong>1. CSR Limitation:</strong> Client-Side Rendering (e.g., React Helmet) does not work well for WhatsApp or Twitter bots, as they do not execute JavaScript.</p>
            <p><strong>2. Solution:</strong> The static HTML must contain the meta tags, or you must use Server-Side Rendering (SSR) / Edge Middleware.</p>
          </div>
        );
      } else {
        return (
          <div className="space-y-2 text-gray-300">
            <p><strong>1. Edge Worker:</strong> Deploy this as a Cloudflare Worker or Vercel Edge Middleware.</p>
            <p><strong>2. Bot Detection:</strong> It detects the <code>User-Agent</code> of social crawlers and serves them pre-rendered HTML containing your OG meta tags.</p>
          </div>
        );
      }
    } else if (fw === 'laravel') {
      if (tabName === 'meta-tags.blade.php') {
        return (
          <div className="space-y-2 text-gray-300">
            <p><strong>1. Component:</strong> Include this Blade component in your main layout (e.g., <code>layouts/app.blade.php</code>).</p>
            <p><strong>2. Usage:</strong> <code>&lt;x-meta-tags title=&quot;My Page&quot; description=&quot;Cool stuff&quot; /&gt;</code></p>
          </div>
        );
      } else {
        return (
          <div className="space-y-2 text-gray-300">
            <p><strong>1. Controller:</strong> This handles the dynamic generation of the image.</p>
            <p><strong>2. Packages:</strong> We recommend using <code>Spatie\Browsershot</code> (requires Puppeteer) or standard PHP GD/Imagick libraries to generate the PNG.</p>
          </div>
        );
      }
    }
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      {/* Framework Selector */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0d1117]">
        <div className="flex gap-1 bg-gray-900 p-1 rounded-md">
          {[
            { id: 'nextjs', label: 'Next.js' },
            { id: 'html', label: 'HTML' },
            { id: 'vue', label: 'Nuxt 3' },
            { id: 'react', label: 'React SPA' },
            { id: 'laravel', label: 'Laravel' },
          ].map((fw) => (
            <button
              key={fw.id}
              onClick={() => store.setFramework(fw.id as Framework)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                store.framework === fw.id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {fw.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyUrl}
            className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            {copiedUrl ? t('copiedUrl') : t('copyHostedUrl')}
          </button>
          <button
            onClick={downloadFile}
            className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            {t('download')}
          </button>
          <button
            onClick={copyCode}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            {copied ? t('copied') : t('copyCode')}
          </button>
        </div>
      </div>

      {/* File Sub-tabs */}
      {files.length > 1 && (
        <div className="flex border-b border-gray-800 bg-[#0d1117] px-4 pt-2">
          {files.map((file, index) => (
            <button
              key={index}
              onClick={() => setActiveFileIndex(index)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeFileIndex === index
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {file.tabName}
            </button>
          ))}
        </div>
      )}

      {/* Code Display */}
      <div className="flex-1 overflow-auto text-sm p-4 relative">
        <div dangerouslySetInnerHTML={{ __html: html }} className="[&>pre]:!bg-transparent [&>pre]:!p-0" />
      </div>

      {/* Educational Guide Drawer */}
      <div className="border-t border-gray-800 bg-[#161b22]">
        <button
          onClick={() => setGuideOpen(!guideOpen)}
          className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-300 hover:bg-gray-800/50 transition-colors"
        >
          <span>How to Implement ({activeFile?.tabName})</span>
          {guideOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>

        {guideOpen && (
          <div className="p-4 pt-0 text-sm border-t border-gray-800">
             {getGuideContent()}
          </div>
        )}
      </div>
    </div>
  )
}
