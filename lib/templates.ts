import { AppState } from './store'

export function generateNextjsTemplate(state: AppState): Record<string, string> {
  const isI18n = state.i18nEnabled

  const ogFilename = isI18n ? 'app/[locale]/opengraph-image.tsx' : 'app/opengraph-image.tsx'
  const layoutFilename = isI18n ? 'app/[locale]/layout.tsx' : 'app/layout.tsx'

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
}
`

  const ogContent = `import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = '${escapeStr(state.title)}'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image(${isI18n ? '{ params }: { params: { locale: string } }' : ''}) {
${isI18n ? '  // You can use params.locale to load localized strings here\n  // const locale = params.locale\n' : ''}
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
      url: 'https://yourdomain.com',
      siteName: '${escapeStr(state.brandName)}',
      locale: params.locale,
      alternateLocale: [${state.secondaryLocales.split(',').map(l => `'${l.trim()}'`).join(', ')}],
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
    url: 'https://yourdomain.com',
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

  return {
    [ogFilename]: ogContent.trim(),
    [layoutFilename]: metaContent.trim()
  }
}
// Helper to escape single quotes in strings for JS/TS code generation
function escapeStr(str: string) {
  return str.replace(/'/g, "\\'")
}

// Helper to escape double quotes in strings for HTML/Blade generation
function escapeHtmlAttr(str: string) {
  return str.replace(/"/g, "&quot;")
}

export function generateReactSpaTemplate(state: AppState): Record<string, string> {
  const eTitle = escapeHtmlAttr(state.title)
  const eDesc = escapeHtmlAttr(state.description)
  const eBrand = escapeHtmlAttr(state.brandName)

  let i18nTags = ''
  if (state.i18nEnabled) {
    i18nTags = `  <meta property="og:locale" content="${state.defaultLocale}" />\n` +
      state.secondaryLocales.split(',').map(l => `  <meta property="og:locale:alternate" content="${l.trim()}" />`).join('\n')
  } else {
    i18nTags = `  <meta property="og:locale" content="${state.defaultLocale}" />`
  }

  const searchParams = new URLSearchParams({
    title: state.title,
    description: state.description,
    accentColor: state.accentColor,
    bgStyle: state.bgStyle,
    logoUrl: state.logoUrl,
    brandName: state.brandName,
    tags: state.tags.join(','),
  }).toString()

  const hostedUrl = `https://yourdomain.com/api/og?${searchParams}`

  const htmlContent = `<head>
  <title>${eTitle}</title>
  <meta name="description" content="${eDesc}" />

  <!-- OpenGraph -->
  <meta property="og:title" content="${eTitle}" />
  <meta property="og:description" content="${eDesc}" />
  <meta property="og:image" content="${hostedUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${eBrand}" />
${i18nTags}

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${eTitle}" />
  <meta name="twitter:description" content="${eDesc}" />
  <meta name="twitter:image" content="${hostedUrl}" />
</head>`

  const workerContent = `export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get("User-Agent") || "";

    // Check if bot
    if (userAgent.includes("Twitterbot") || userAgent.includes("facebookexternalhit") || userAgent.includes("WhatsApp")) {
      return new Response(
        \`<!DOCTYPE html><html><head>
          <meta property="og:title" content="${escapeHtmlAttr(state.title)}">
          <meta property="og:image" content="${hostedUrl}">
          <meta name="twitter:card" content="summary_large_image">
        </head><body></body></html>\`,
        { headers: { "content-type": "text/html" } }
      );
    }

    return fetch(request);
  }
};`

  return {
    'public/index.html': htmlContent,
    'worker.js': workerContent
  }
}
export function generateVueTemplate(state: AppState): Record<string, string> {
  const eTitle = escapeStr(state.title)
  const eDesc = escapeStr(state.description)
  const eBrand = escapeStr(state.brandName)

  let i18nConfig = ''
  if (state.i18nEnabled) {
    i18nConfig = `  // When using @nuxtjs/i18n, og:locale is typically handled automatically,
  // but you can set defaults here or per-page:
  ogLocale: '${state.defaultLocale}',
  ogLocaleAlternate: [${state.secondaryLocales.split(',').map(l => `'${l.trim()}'`).join(', ')}],`
  } else {
    i18nConfig = `  ogLocale: '${state.defaultLocale}',`
  }

  const searchParams = new URLSearchParams({
    title: state.title,
    description: state.description,
    accentColor: state.accentColor,
    bgStyle: state.bgStyle,
    logoUrl: state.logoUrl,
    brandName: state.brandName,
    tags: state.tags.join(','),
  }).toString()

  const hostedUrl = `https://yourdomain.com/api/og?${searchParams}`

  const vueContent = `<script setup lang="ts">
useSeoMeta({
  title: '${eTitle}',
  description: '${eDesc}',
  ogTitle: '${eTitle}',
  ogDescription: '${eDesc}',
  ogImage: '${hostedUrl}', // Absolute URL is required for crawlers
  ogSiteName: '${eBrand}',
  twitterCard: 'summary_large_image',
${i18nConfig}
})

// If using nuxt-seo module / nuxt-og-image
// defineOgImageComponent('NuxtSeo', {
//   title: '${eTitle}',
//   description: '${eDesc}',
//   theme: '${state.accentColor}',
// })
</script>`

  const nitroContent = `import { defineEventHandler } from 'h3'
// Example implementation using Satori or resvg-js in Nuxt server routes
// Requires appropriate packages installed in your Nuxt project

export default defineEventHandler((event) => {
  // Render similar to Next.js ImageResponse using satori
})`

  return {
    'app.vue': vueContent,
    'server/routes/og.ts': nitroContent
  }
}
export function generateLaravelTemplate(state: AppState): Record<string, string> {
  const eTitle = escapeStr(state.title)
  const eDesc = escapeStr(state.description)
  const eBrand = escapeHtmlAttr(state.brandName)

  let i18nTags = ''
  if (state.i18nEnabled) {
    i18nTags = `  <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}" />
  {{-- Iterate over alternate locales --}}
  @foreach(config('app.alternate_locales', []) as $locale)
    <meta property="og:locale:alternate" content="{{ $locale }}" />
  @endforeach`
  } else {
    i18nTags = `  <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}" />`
  }

  const searchParams = new URLSearchParams({
    title: state.title,
    description: state.description,
    accentColor: state.accentColor,
    bgStyle: state.bgStyle,
    logoUrl: state.logoUrl,
    brandName: state.brandName,
    tags: state.tags.join(','),
  }).toString()

  const hostedUrl = `https://yourdomain.com/api/og?${searchParams}`

  const bladeContent = `@props([
  'title' => '${eTitle}',
  'description' => '${eDesc}',
  'image' => '${hostedUrl}'
])

<title>{{ $title }}</title>
<meta name="description" content="{{ $description }}" />

<!-- OpenGraph -->
<meta property="og:title" content="{{ $title }}" />
<meta property="og:description" content="{{ $description }}" />
<meta property="og:image" content="{{ $image }}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${eBrand}" />
${i18nTags}

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{ $title }}" />
<meta name="twitter:description" content="{{ $description }}" />
<meta name="twitter:image" content="{{ $image }}" />`

  const webContent = `use Illuminate\\Support\\Facades\\Route;

Route::get('/api/og', function () {
    // Implement Spatie Browsershot or standard GD/Imagick generation here
    // Example with Browsershot:
    // return response(
    //     \\Spatie\\Browsershot\\Browsershot::html('<h1>OG Image</h1>')->screenshot()
    // )->header('Content-Type', 'image/png');
});`

  return {
    'resources/views/components/meta-tags.blade.php': bladeContent,
    'routes/web.php': webContent
  }
}
export function generateHtmlTemplate(state: AppState): Record<string, string> {
  const eTitle = escapeHtmlAttr(state.title)
  const eDesc = escapeHtmlAttr(state.description)
  const eBrand = escapeHtmlAttr(state.brandName)

  let i18nTags = ''
  if (state.i18nEnabled) {
    i18nTags = `  <meta property="og:locale" content="${state.defaultLocale}" />\n` +
      state.secondaryLocales.split(',').map(l => `  <meta property="og:locale:alternate" content="${l.trim()}" />`).join('\n')
  } else {
    i18nTags = `  <meta property="og:locale" content="${state.defaultLocale}" />`
  }

  const searchParams = new URLSearchParams({
    title: state.title,
    description: state.description,
    accentColor: state.accentColor,
    bgStyle: state.bgStyle,
    logoUrl: state.logoUrl,
    brandName: state.brandName,
    tags: state.tags.join(','),
  }).toString()

  const hostedUrl = `https://yourdomain.com/api/og?${searchParams}`

  const htmlContent = `<head>
  <!-- Primary Meta Tags -->
  <title>${eTitle}</title>
  <meta name="title" content="${eTitle}" />
  <meta name="description" content="${eDesc}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://yourdomain.com/" />
  <meta property="og:title" content="${eTitle}" />
  <meta property="og:description" content="${eDesc}" />
  <meta property="og:image" content="${hostedUrl}" />
  <meta property="og:site_name" content="${eBrand}" />
${i18nTags}

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://yourdomain.com/" />
  <meta property="twitter:title" content="${eTitle}" />
  <meta property="twitter:description" content="${eDesc}" />
  <meta property="twitter:image" content="${hostedUrl}" />
</head>`

  return {
    'index.html': htmlContent
  }
}

export function generateCode(state: AppState): TemplateFile[] {
  switch (state.framework) {
    case 'nextjs': return generateNextjsTemplate(state)
    case 'react': return generateReactSpaTemplate(state)
    case 'vue': return generateVueTemplate(state)
    case 'laravel': return generateLaravelTemplate(state)
    case 'html': return generateHtmlTemplate(state)
    default: return []
  }
}
