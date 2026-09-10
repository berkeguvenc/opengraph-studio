import { AppState, Framework } from './store'

export interface TemplateFile {
  tabName: string;
  filename: string;
  language: string;
  content: string;
}

// Helper to escape single quotes in strings for JS/TS code generation
function escapeStr(str: string): string {
  return str.replace(/'/g, "\\'")
}

// Helper to escape double quotes in strings for HTML/Blade generation
function escapeHtmlAttr(str: string): string {
  return str.replace(/"/g, "&quot;")
}

// Helper to clean user-supplied domain URL
function getCleanSiteUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return 'https://yourdomain.com'
  return trimmed.replace(/\/+$/, '')
}

// Builds the dynamic query params string for self-hosted API endpoints
function buildSearchParams(state: AppState): string {
  return new URLSearchParams({
    title: state.title,
    description: state.description,
    accentColor: state.accentColor,
    bgStyle: state.bgStyle,
    logoUrl: state.logoUrl,
    brandName: state.brandName,
    tags: state.tags.join(','),
    preset: state.preset,
  }).toString()
}

export function generateNextjsTemplate(state: AppState): TemplateFile[] {
  const isI18n = state.i18nEnabled
  const isStatic = state.ogExportMode === 'static'
  const siteUrl = getCleanSiteUrl(state.siteUrl)

  const ogFilename = isI18n ? 'app/[locale]/opengraph-image.tsx' : 'app/opengraph-image.tsx'
  const layoutFilename = isI18n ? 'app/[locale]/layout.tsx' : 'app/layout.tsx'

  if (isStatic) {
    const metaContent = isI18n
      ? `import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: '${escapeStr(state.title)}',
    description: '${escapeStr(state.description)}',
    openGraph: {
      title: '${escapeStr(state.title)}',
      description: '${escapeStr(state.description)}',
      url: '${siteUrl}',
      siteName: '${escapeStr(state.brandName)}',
      images: [
        {
          url: \`${siteUrl}/og.png\`,
          width: 1200,
          height: 630,
          alt: '${escapeStr(state.title)}',
        },
      ],
      locale: params.locale,
      alternateLocale: [${state.secondaryLocales.split(',').map(l => `'${escapeStr(l.trim())}'`).filter(Boolean).join(', ')}],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '${escapeStr(state.title)}',
      description: '${escapeStr(state.description)}',
      images: [\`${siteUrl}/og.png\`],
      creator: '@yourhandle',
    },
  }
}`
      : `import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${escapeStr(state.title)}',
  description: '${escapeStr(state.description)}',
  openGraph: {
    title: '${escapeStr(state.title)}',
    description: '${escapeStr(state.description)}',
    url: '${siteUrl}',
    siteName: '${escapeStr(state.brandName)}',
    images: [
      {
        url: '${siteUrl}/og.png',
        width: 1200,
        height: 630,
        alt: '${escapeStr(state.title)}',
      },
    ],
    locale: '${escapeStr(state.defaultLocale)}',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${escapeStr(state.title)}',
    description: '${escapeStr(state.description)}',
    images: ['${siteUrl}/og.png'],
    creator: '@yourhandle',
  },
}`

    const instructionsContent = `# Statik Görsel Entegrasyon Adımları (Next.js)

1. Sayfanın üstündeki "Görseli İndir (PNG)" butonuna tıklayın.
2. İndirdiğiniz dosyayı projenizin \`public/og.png\` konumuna kaydedin.
3. Aşağıdaki \`${layoutFilename}\` kodunu projenize ekleyin.
4. Görseliniz doğrudan ${siteUrl}/og.png adresinden sunulacak ve hiçbir sunucu/API gerektirmeyecektir.`

    return [
      {
        tabName: isI18n ? '[locale]/layout.tsx' : 'layout.tsx',
        filename: layoutFilename,
        language: 'tsx',
        content: metaContent.trim(),
      },
      {
        tabName: 'public/og.png (README)',
        filename: 'public/og.png.txt',
        language: 'markdown',
        content: instructionsContent.trim(),
      },
    ]
  }

  // Dynamic mode: self-hosted Edge opengraph-image.tsx
  let background = "'white'"
  if (state.bgStyle === 'solid') background = "'#0f172a'"
  else if (state.bgStyle === 'gradient') background = `'linear-gradient(to bottom right, #0f172a, ${state.accentColor}40, #0f172a)'`
  else if (state.bgStyle === 'pattern') background = `'repeating-linear-gradient(45deg, #0f172a, #0f172a 10px, #1e293b 10px, #1e293b 20px)'`

  const componentCode = `  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: ${background.includes('gradient') ? background : 'undefined'},
          backgroundColor: ${!background.includes('gradient') ? background : "'#0f172a'"},
          padding: '80px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 'auto' }}>
          ${state.logoUrl ? `// eslint-disable-next-line @next/next/no-img-element
          <img src="${state.logoUrl}" alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', marginRight: '20px' }} />` : ''}
          <span style={{ fontSize: '32px', fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
            ${escapeStr(state.brandName)}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-start' }}>
          ${state.tags.length > 0 ? `<div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            ${state.tags.map(tag => `<div style={{ display: 'flex', padding: '8px 16px', borderRadius: '9999px', backgroundColor: '${state.accentColor}30', color: '${state.accentColor}', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.01em' }}>${tag}</div>`).join('\n            ')}
          </div>` : ''}
          <div style={{ fontSize: '80px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px', color: 'white', maxWidth: '1000px' }}>
            ${escapeStr(state.title)}
          </div>
          <div style={{ fontSize: '36px', fontWeight: 400, color: '#94a3b8', letterSpacing: '-0.01em', lineHeight: 1.4, maxWidth: '900px' }}>
            ${escapeStr(state.description)}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '16px', backgroundColor: '${state.accentColor}' }} />
      </div>
    ),
    {
      ...size,
    }
  )
}`

  const ogContent = `import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = '${escapeStr(state.title)}'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image(${isI18n ? '{ params }: { params: { locale: string } }' : ''}) {
${isI18n ? '  // You can read params.locale to customize localized strings dynamically\n  // const { locale } = params\n' : ''}
${componentCode}`

  const metaContent = isI18n
    ? `import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: '${escapeStr(state.title)}',
    description: '${escapeStr(state.description)}',
    openGraph: {
      title: '${escapeStr(state.title)}',
      description: '${escapeStr(state.description)}',
      url: '${siteUrl}',
      siteName: '${escapeStr(state.brandName)}',
      locale: params.locale,
      alternateLocale: [${state.secondaryLocales.split(',').map(l => `'${escapeStr(l.trim())}'`).filter(Boolean).join(', ')}],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '${escapeStr(state.title)}',
      description: '${escapeStr(state.description)}',
      creator: '@yourhandle',
    },
  }
}`
    : `import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${escapeStr(state.title)}',
  description: '${escapeStr(state.description)}',
  openGraph: {
    title: '${escapeStr(state.title)}',
    description: '${escapeStr(state.description)}',
    url: '${siteUrl}',
    siteName: '${escapeStr(state.brandName)}',
    locale: '${escapeStr(state.defaultLocale)}',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${escapeStr(state.title)}',
    description: '${escapeStr(state.description)}',
    creator: '@yourhandle',
  },
}`

  return [
    {
      tabName: isI18n ? '[locale]/opengraph-image.tsx' : 'opengraph-image.tsx',
      filename: ogFilename,
      language: 'tsx',
      content: ogContent.trim(),
    },
    {
      tabName: isI18n ? '[locale]/layout.tsx' : 'layout.tsx',
      filename: layoutFilename,
      language: 'tsx',
      content: metaContent.trim(),
    },
  ]
}

export function generateReactSpaTemplate(state: AppState): TemplateFile[] {
  const eTitle = escapeHtmlAttr(state.title)
  const eDesc = escapeHtmlAttr(state.description)
  const eBrand = escapeHtmlAttr(state.brandName)
  const isStatic = state.ogExportMode === 'static'
  const siteUrl = getCleanSiteUrl(state.siteUrl)

  const imageUrl = isStatic
    ? `${siteUrl}/og.png`
    : `${siteUrl}/api/og?${buildSearchParams(state)}`

  let i18nTags = ''
  if (state.i18nEnabled) {
    i18nTags = `  <meta property="og:locale" content="${state.defaultLocale}" />\n` +
      state.secondaryLocales.split(',').map(l => `  <meta property="og:locale:alternate" content="${l.trim()}" />`).filter(Boolean).join('\n')
  } else {
    i18nTags = `  <meta property="og:locale" content="${state.defaultLocale}" />`
  }

  const htmlContent = `<head>
  <title>${eTitle}</title>
  <meta name="description" content="${eDesc}" />

  <!-- OpenGraph -->
  <meta property="og:title" content="${eTitle}" />
  <meta property="og:description" content="${eDesc}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${siteUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${eBrand}" />
${i18nTags}

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${eTitle}" />
  <meta name="twitter:description" content="${eDesc}" />
  <meta name="twitter:image" content="${imageUrl}" />
</head>`

  const workerContent = `// Cloudflare Worker / Edge Middleware
// Social bots (Twitter, WhatsApp, Facebook) do not execute JavaScript.
// This worker intercepts crawlers and responds with static HTML metadata.

export default {
  async fetch(request, env, ctx) {
    const userAgent = request.headers.get("User-Agent") || "";

    // Detect social crawler User-Agents
    const isBot = /Twitterbot|facebookexternalhit|WhatsApp|LinkedInBot|Discordbot/i.test(userAgent);

    if (isBot) {
      return new Response(
        \`<!DOCTYPE html>
<html lang="${state.defaultLocale}">
<head>
  <meta charset="utf-8">
  <title>${eTitle}</title>
  <meta name="description" content="${eDesc}">
  <meta property="og:title" content="${eTitle}">
  <meta property="og:description" content="${eDesc}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${siteUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${eTitle}">
  <meta name="twitter:image" content="${imageUrl}">
</head>
<body></body>
</html>\`,
        { headers: { "content-type": "text/html;charset=UTF-8" } }
      );
    }

    return fetch(request);
  }
};`

  return [
    {
      tabName: 'index.html',
      filename: 'public/index.html',
      language: 'html',
      content: htmlContent,
    },
    {
      tabName: 'worker.js',
      filename: 'worker.js',
      language: 'javascript',
      content: workerContent,
    },
  ]
}

export function generateVueTemplate(state: AppState): TemplateFile[] {
  const eTitle = escapeStr(state.title)
  const eDesc = escapeStr(state.description)
  const eBrand = escapeStr(state.brandName)
  const isStatic = state.ogExportMode === 'static'
  const siteUrl = getCleanSiteUrl(state.siteUrl)

  const imageUrl = isStatic
    ? `${siteUrl}/og.png`
    : `${siteUrl}/api/og?${buildSearchParams(state)}`

  let i18nConfig = ''
  if (state.i18nEnabled) {
    i18nConfig = `  // When using @nuxtjs/i18n, og:locale is automatically handled
  ogLocale: '${state.defaultLocale}',
  ogLocaleAlternate: [${state.secondaryLocales.split(',').map(l => `'${escapeStr(l.trim())}'`).filter(Boolean).join(', ')}],`
  } else {
    i18nConfig = `  ogLocale: '${state.defaultLocale}',`
  }

  const vueContent = `<script setup lang="ts">
useSeoMeta({
  title: '${eTitle}',
  description: '${eDesc}',
  ogTitle: '${eTitle}',
  ogDescription: '${eDesc}',
  ogImage: '${imageUrl}', // Absolute URL required by social crawlers
  ogUrl: '${siteUrl}',
  ogSiteName: '${eBrand}',
  twitterCard: 'summary_large_image',
${i18nConfig}
})
</script>`

  if (isStatic) {
    return [
      {
        tabName: 'app.vue',
        filename: 'app.vue',
        language: 'vue',
        content: vueContent,
      },
      {
        tabName: 'public/og.png (README)',
        filename: 'public/og.png.txt',
        language: 'markdown',
        content: `# Nuxt 3 Statik Görsel Kullanımı\n\n1. "Görseli İndir" butonuna tıklayıp og.png dosyasını indirin.\n2. Projenizin \`public/og.png\` dizinine yerleştirin.\n3. \`app.vue\` dosyanıza \`useSeoMeta\` bloğunu ekleyin.`.trim(),
      },
    ]
  }

  const nitroContent = `// server/routes/og.ts
// Nuxt Nitro Edge / Server route for dynamic OpenGraph generation
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const title = query.title || '${eTitle}'
  
  // You can use @vercel/og or resvg-js/satori here on your own server
  return {
    message: "Self-hosted dynamic image endpoint for " + title
  }
})`

  return [
    {
      tabName: 'app.vue',
      filename: 'app.vue',
      language: 'vue',
      content: vueContent,
    },
    {
      tabName: 'server/routes/og.ts',
      filename: 'server/routes/og.ts',
      language: 'ts',
      content: nitroContent,
    },
  ]
}

export function generateLaravelTemplate(state: AppState): TemplateFile[] {
  const eTitle = escapeStr(state.title)
  const eDesc = escapeStr(state.description)
  const eBrand = escapeHtmlAttr(state.brandName)
  const isStatic = state.ogExportMode === 'static'
  const siteUrl = getCleanSiteUrl(state.siteUrl)

  const imageUrl = isStatic
    ? `${siteUrl}/og.png`
    : `${siteUrl}/api/og?${buildSearchParams(state)}`

  let i18nTags = ''
  if (state.i18nEnabled) {
    i18nTags = `  <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}" />
  @foreach(config('app.alternate_locales', []) as $locale)
    <meta property="og:locale:alternate" content="{{ $locale }}" />
  @endforeach`
  } else {
    i18nTags = `  <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}" />`
  }

  const bladeContent = `@props([
  'title' => '${eTitle}',
  'description' => '${eDesc}',
  'image' => '${imageUrl}'
])

<title>{{ $title }}</title>
<meta name="description" content="{{ $description }}" />

<!-- OpenGraph -->
<meta property="og:title" content="{{ $title }}" />
<meta property="og:description" content="{{ $description }}" />
<meta property="og:image" content="{{ $image }}" />
<meta property="og:url" content="${siteUrl}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${eBrand}" />
${i18nTags}

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{ $title }}" />
<meta name="twitter:description" content="{{ $description }}" />
<meta name="twitter:image" content="{{ $image }}" />`

  const files: TemplateFile[] = [
    {
      tabName: 'meta-tags.blade.php',
      filename: 'resources/views/components/meta-tags.blade.php',
      language: 'php',
      content: bladeContent,
    },
  ]

  if (isStatic) {
    files.push({
      tabName: 'public/og.png (README)',
      filename: 'public/og.png.txt',
      language: 'markdown',
      content: `# Laravel Statik Görsel Kullanımı\n\n1. "Görseli İndir" butonuna tıklayıp og.png dosyasını indirin.\n2. Projenizin \`public/og.png\` dizinine kopyalayın.\n3. Şablonunuzda \`<x-meta-tags />\` bileşenini kullanın.`.trim(),
    })
  } else {
    files.push({
      tabName: 'web.php',
      filename: 'routes/web.php',
      language: 'php',
      content: `use Illuminate\\Support\\Facades\\Route;

// Self-hosted dynamic image endpoint
Route::get('/api/og', function () {
    // Generate dynamic image with Spatie Browsershot or Intervention Image:
    // return response($imageData)->header('Content-Type', 'image/png');
});`,
    })
  }

  return files
}

export function generateHtmlTemplate(state: AppState): TemplateFile[] {
  const eTitle = escapeHtmlAttr(state.title)
  const eDesc = escapeHtmlAttr(state.description)
  const eBrand = escapeHtmlAttr(state.brandName)
  const isStatic = state.ogExportMode === 'static'
  const siteUrl = getCleanSiteUrl(state.siteUrl)

  const imageUrl = isStatic
    ? `${siteUrl}/og.png`
    : `${siteUrl}/api/og?${buildSearchParams(state)}`

  let i18nTags = ''
  if (state.i18nEnabled) {
    i18nTags = `  <meta property="og:locale" content="${state.defaultLocale}" />\n` +
      state.secondaryLocales.split(',').map(l => `  <meta property="og:locale:alternate" content="${l.trim()}" />`).filter(Boolean).join('\n')
  } else {
    i18nTags = `  <meta property="og:locale" content="${state.defaultLocale}" />`
  }

  const htmlContent = `<head>
  <!-- Primary Meta Tags -->
  <title>${eTitle}</title>
  <meta name="title" content="${eTitle}" />
  <meta name="description" content="${eDesc}" />

  <!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${siteUrl}/" />
  <meta property="og:title" content="${eTitle}" />
  <meta property="og:description" content="${eDesc}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="${eBrand}" />
${i18nTags}

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${siteUrl}/" />
  <meta name="twitter:title" content="${eTitle}" />
  <meta name="twitter:description" content="${eDesc}" />
  <meta name="twitter:image" content="${imageUrl}" />
</head>`

  const files: TemplateFile[] = [
    {
      tabName: 'index.html',
      filename: 'index.html',
      language: 'html',
      content: htmlContent,
    },
  ]

  if (isStatic) {
    files.push({
      tabName: 'public/og.png (README)',
      filename: 'public/og.png.txt',
      language: 'markdown',
      content: `# Statik HTML Görsel Kullanımı\n\n1. Üstteki "Görseli İndir (PNG)" butonuna tıklayarak og.png dosyasını indirin.\n2. Web sitenizin kök dizinine (veya public klasörüne) \`og.png\` olarak kaydedin.\n3. \`index.html\` dosyanızın \`<head>\` etiketleri arasına yukarıdaki meta tagleri ekleyin.`.trim(),
    })
  }

  return files
}

const templateGenerators: Record<Framework, (state: AppState) => TemplateFile[]> = {
  nextjs: generateNextjsTemplate,
  react: generateReactSpaTemplate,
  vue: generateVueTemplate,
  laravel: generateLaravelTemplate,
  html: generateHtmlTemplate,
}

export function generateCode(state: AppState): TemplateFile[] {
  const generator = templateGenerators[state.framework]
  if (generator) {
    const result = generator(state)
    if (Array.isArray(result) && result.length > 0) {
      return result
    }
  }
  return generateHtmlTemplate(state)
}
