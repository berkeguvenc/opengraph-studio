'use client'

import { useAppStore } from '../lib/store'
import { generateCode } from '../lib/templates'
import { useState, useEffect } from 'react'
import { codeToHtml } from 'shiki'

export function CodeOutput() {
  const store = useAppStore()
  const code = generateCode(store)
  const [html, setHtml] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  useEffect(() => {
    async function highlight() {
      try {
        const lang = store.framework === 'vue' ? 'vue'
                   : store.framework === 'laravel' ? 'php'
                   : store.framework === 'react' ? 'html'
                   : 'tsx'

        const result = await codeToHtml(code, {
          lang,
          theme: 'github-dark'
        })
        setHtml(result)
      } catch (e) {
        console.error('Failed to highlight code:', e)
        // Fallback for simple display if highlighting fails
        setHtml(`<pre style="background:#0d1117;color:#c9d1d9;padding:16px;"><code>${code}</code></pre>`)
      }
    }
    highlight()
  }, [code, store.framework])

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFile = () => {
    const ext = store.framework === 'vue' ? '.vue'
              : store.framework === 'laravel' ? '.blade.php'
              : store.framework === 'react' ? '.html'
              : '.tsx'

    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `og-template${ext}`
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

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0d1117]">
        <div className="text-gray-300 font-medium text-sm">Generated Code</div>
        <div className="flex gap-2">
          <button
            onClick={copyUrl}
            className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            {copiedUrl ? 'Copied URL!' : 'Copy Hosted URL'}
          </button>
          <button
            onClick={downloadFile}
            className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            Download
          </button>
          <button
            onClick={copyCode}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto text-sm p-4 relative">
        <div dangerouslySetInnerHTML={{ __html: html }} className="[&>pre]:!bg-transparent [&>pre]:!p-0" />
      </div>
    </div>
  )
}
