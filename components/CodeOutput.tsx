'use client'

import { useAppStore, Framework } from '../lib/store'
import { generateCode } from '../lib/templates'
import { useState, useEffect } from 'react'
import { codeToHtml } from 'shiki'
import { useTranslation } from '../lib/i18n'

function EducationalGuide({ framework, activeFile }: { framework: Framework, activeFile: string }) {
  const [isOpen, setIsOpen] = useState(false);

  let title = "How to Implement";
  let content = null;

  if (framework === 'nextjs') {
    if (activeFile.includes('opengraph-image')) {
      content = (
        <div className="space-y-2">
          <p><strong>Placement:</strong> Place this file in your <code>app/</code> directory (or <code>app/[locale]/</code> for internationalization).</p>
          <p><strong>Edge Runtime:</strong> This file uses <code>export const runtime = 'edge'</code>, ensuring lightweight and fast execution on Edge networks like Vercel or Cloudflare.</p>
          <p><strong>Verification:</strong> Run your app locally and visit <code>http://localhost:3000/opengraph-image</code> to see the generated image.</p>
        </div>
      )
    } else {
      content = (
        <div className="space-y-2">
          <p><strong>Placement:</strong> Merge this code with your <code>app/layout.tsx</code> or page-level <code>page.tsx</code>.</p>
          <p><strong>Verification:</strong> Check the resulting <code>&lt;head&gt;</code> tags using browser dev tools or social preview sites.</p>
        </div>
      )
    }
  } else if (framework === 'html') {
    content = (
      <div className="space-y-2">
        <p><strong>Instructions:</strong> Paste these tags directly into your HTML document's <code>&lt;head&gt;</code> section.</p>
        <p><strong>Absolute URLs:</strong> The <code>og:image</code> URL must be an absolute path (e.g., <code>https://...</code>). Relative paths will not work on social networks.</p>
        <p><strong>Cache:</strong> If you change the image later, bots might cache the old one. Append a query parameter like <code>?v=2</code> to bust the cache.</p>
      </div>
    )
  } else if (framework === 'vue') {
    if (activeFile === 'app.vue') {
      content = (
        <div className="space-y-2">
          <p><strong>Usage:</strong> Place this <code>useSeoMeta</code> block in your <code>app.vue</code> or any page component.</p>
          <p><strong>Nuxt OG Image:</strong> Alternatively, install <code>nuxt-og-image</code> to generate social cards automatically without needing manual API routes.</p>
        </div>
      )
    } else {
      content = (
        <div className="space-y-2">
          <p><strong>Nitro Route:</strong> This is a boilerplate for an API route using Nuxt's Nitro engine.</p>
          <p><strong>Configuration:</strong> Place this file in <code>server/routes/</code> to serve dynamic images via <code>/api/og</code>.</p>
        </div>
      )
    }
  } else if (framework === 'react') {
    if (activeFile === 'worker.js') {
      content = (
        <div className="space-y-2">
          <p><strong>Edge Worker:</strong> Since CSR apps don't return HTML with meta tags immediately, use a Cloudflare Worker or Edge Middleware to intercept bots.</p>
          <p><strong>Detection:</strong> The worker detects bot User-Agents (e.g., Twitterbot) and returns a lightweight HTML stub containing only the necessary meta tags.</p>
        </div>
      )
    } else {
      content = (
        <div className="space-y-2">
          <p><strong>Limitation:</strong> Client-side rendering (CSR) tools like React Helmet will <strong>not</strong> work for WhatsApp, X (Twitter), or Discord bots because these crawlers don't execute JavaScript.</p>
          <p><strong>Solution:</strong> You must place these tags in your static <code>public/index.html</code> or serve them dynamically via an edge worker.</p>
        </div>
      )
    }
  } else if (framework === 'laravel') {
    if (activeFile.includes('meta-tags')) {
      content = (
        <div className="space-y-2">
          <p><strong>Blade Component:</strong> Create this component and include it in your main layout, e.g., <code>&lt;x-meta-tags title="My Page" /&gt;</code> in <code>layouts/app.blade.php</code>.</p>
        </div>
      )
    } else {
      content = (
        <div className="space-y-2">
          <p><strong>Dynamic Generation:</strong> You can generate OG images dynamically using Spatie Browsershot or standard GD/Imagick libraries.</p>
        </div>
      )
    }
  }

  if (!content) return null;

  return (
    <div className="border-t border-gray-800 bg-[#0a0d14]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors focus:outline-none"
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
  const filesResult = generateCode(store)
  const files = typeof filesResult === 'string' ? { 'code.txt': filesResult } : filesResult
  const fileKeys = Object.keys(files)

  const [activeFile, setActiveFile] = useState(fileKeys[0] || '')

  // Update active file if framework changes
  useEffect(() => {
    const f = generateCode(store);
    const keys = Object.keys(typeof f === 'string' ? { 'code.txt': f } : f);
    setActiveFile(keys[0] || '')
  }, [store.framework, store.i18nEnabled])

  // Ensure activeFile is valid
  const currentFile = fileKeys.includes(activeFile) ? activeFile : (fileKeys[0] || '')
  const currentCode = files[currentFile] || ''

  const [html, setHtml] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  useEffect(() => {
    async function highlight() {
      if (!currentCode) {
        setHtml('')
        return
      }
      try {
        let lang = 'tsx'
        if (currentFile.endsWith('.vue')) lang = 'vue'
        else if (currentFile.endsWith('.html')) lang = 'html'
        else if (currentFile.endsWith('.php')) lang = 'php'
        else if (currentFile.endsWith('.js')) lang = 'javascript'
        else if (currentFile.endsWith('.ts')) lang = 'ts'

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
  }, [currentCode, currentFile])

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

    // Extract filename from path
    const fileName = currentFile.split('/').pop() || 'og-template.txt'

    a.download = fileName
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

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'
    const url = `${baseUrl}/api/og?${searchParams}`

    await navigator.clipboard.writeText(url)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      <div className="flex flex-col p-4 border-b border-gray-800 bg-[#0d1117] gap-3">
        <div className="flex items-center justify-between">
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

        {fileKeys.length > 1 && (
          <div className="flex gap-2 border-b border-gray-800 pt-1">
            {fileKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveFile(key)}
                className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 ${
                  currentFile === key
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto text-sm p-4 relative">
        <div dangerouslySetInnerHTML={{ __html: html }} className="[&>pre]:!bg-transparent [&>pre]:!p-0" />
      </div>

      <EducationalGuide framework={store.framework} activeFile={currentFile} />
    </div>
  )
}
