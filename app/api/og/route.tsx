import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Fetch fonts for Edge runtime
const interRegular = fetch(
  new URL('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-400-normal.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

const interBold = fetch(
  new URL('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-700-normal.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

interface GenerateParams {
  title: string
  description: string
  accentColor: string
  bgStyle: string
  logoUrl: string
  brandName: string
  tags: string[]
  preset: string
  bgImageBase64: string
}

async function generate(params: GenerateParams) {
  const { title, description, accentColor, bgStyle, logoUrl, brandName, tags, preset, bgImageBase64 } = params

  const interRegularData = await interRegular
  const interBoldData = await interBold

  // Determine background
  let background = 'white'
  let backgroundColor = '#0f172a'
  if (bgImageBase64) {
    background = `url(${bgImageBase64})`
  } else if (bgStyle === 'solid') {
    background = 'none' // solid color will be set by backgroundColor
    backgroundColor = preset === 'minimalist' ? '#ffffff' : '#0f172a'
  } else if (bgStyle === 'gradient') {
    background = preset === 'minimalist'
      ? `linear-gradient(to bottom right, #ffffff, #f1f5f9, #ffffff)`
      : preset === 'saas'
        ? `radial-gradient(circle at top right, ${accentColor}40, #0f172a 50%)`
        : `linear-gradient(to bottom right, #0f172a, ${accentColor}40, #0f172a)`
    backgroundColor = preset === 'minimalist' ? '#ffffff' : '#0f172a'
  } else if (bgStyle === 'pattern') {
    background = preset === 'minimalist'
      ? `repeating-linear-gradient(45deg, #ffffff, #ffffff 10px, #f8fafc 10px, #f8fafc 20px)`
      : `repeating-linear-gradient(45deg, #0f172a, #0f172a 10px, #1e293b 10px, #1e293b 20px)`
    backgroundColor = preset === 'minimalist' ? '#ffffff' : '#0f172a'
  }

  let content = null

  const textColor = preset === 'minimalist' ? '#0f172a' : 'white'
  const descColor = preset === 'minimalist' ? '#64748b' : '#94a3b8'

  if (preset === 'minimalist') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '60px', backgroundColor, backgroundImage: background }}>
        <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '24px', flex: 1, flexDirection: 'column', padding: '60px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'auto' }}>
             {logoUrl && <img src={logoUrl} alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '8px', marginRight: '16px' }} />}
             <span style={{ fontSize: '24px', fontWeight: 700, color: '#334155' }}>{brandName}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '72px', fontWeight: 700, color: '#0f172a', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>{title}</div>
            <div style={{ fontSize: '32px', color: '#64748b', lineHeight: 1.5 }}>{description}</div>
          </div>
        </div>
      </div>
    )
  } else if (preset === 'blog') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '80px', backgroundColor, backgroundImage: background }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          {tags.map((tag: string, i: number) => (
             <div key={i} style={{ display: 'flex', padding: '8px 24px', backgroundColor: accentColor, color: 'white', fontSize: '20px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tag}</div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontSize: '84px', fontWeight: 700, color: textColor, lineHeight: 1.1, marginBottom: '32px' }}>{title}</div>
          <div style={{ fontSize: '36px', color: descColor, lineHeight: 1.5, borderLeft: `6px solid ${accentColor}`, paddingLeft: '24px' }}>{description}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', borderTop: `1px solid ${descColor}40`, paddingTop: '40px' }}>
          {logoUrl && <img src={logoUrl} alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', marginRight: '24px' }} />}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: textColor }}>{brandName}</span>
            <span style={{ fontSize: '24px', color: descColor }}>5 min read</span>
          </div>
        </div>
      </div>
    )
  } else if (preset === 'ecommerce') {
    content = (
      <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor, backgroundImage: background }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '60%', padding: '80px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
             {logoUrl && <img src={logoUrl} alt="Logo" style={{ width: '56px', height: '56px', marginRight: '16px' }} />}
             <span style={{ fontSize: '32px', fontWeight: 700, color: textColor }}>{brandName}</span>
          </div>
          <div style={{ fontSize: '76px', fontWeight: 700, color: textColor, lineHeight: 1.1, marginBottom: '24px' }}>{title}</div>
          <div style={{ fontSize: '32px', color: descColor, lineHeight: 1.4, marginBottom: '48px' }}>{description}</div>
          <div style={{ display: 'flex', padding: '16px 48px', backgroundColor: accentColor, color: 'white', fontSize: '32px', fontWeight: 700, borderRadius: '999px', width: 'fit-content' }}>
             Shop Now
          </div>
        </div>
        <div style={{ display: 'flex', width: '40%', backgroundColor: `${accentColor}20`, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* placeholder for product image */}
           <div style={{ fontSize: '200px' }}>📦</div>
           <div style={{ position: 'absolute', top: '80px', right: '80px', backgroundColor: accentColor, color: 'white', padding: '16px 32px', borderRadius: '999px', fontSize: '36px', fontWeight: 700, transform: 'rotate(12deg)' }}>
             NEW
           </div>
        </div>
      </div>
    )
  } else {
    // saas or fallback
    content = (
      <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundImage: background, backgroundColor, padding: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 'auto' }}>
          {logoUrl && <img src={logoUrl} alt="Logo" style={{ width: '64px', height: '64px', borderRadius: '50%', marginRight: '20px' }} />}
          <span style={{ fontSize: '32px', fontWeight: 700, color: textColor, letterSpacing: '-0.02em' }}>{brandName}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-start' }}>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {tags.map((tag: string, i: number) => (
                <div key={i} style={{ display: 'flex', padding: '8px 16px', borderRadius: '9999px', backgroundColor: `${accentColor}30`, color: accentColor, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em' }}>{tag}</div>
              ))}
            </div>
          )}
          <div style={{ fontSize: '80px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px', color: textColor, maxWidth: '1000px' }}>{title}</div>
          <div style={{ fontSize: '36px', color: descColor, letterSpacing: '-0.01em', lineHeight: 1.4, maxWidth: '900px' }}>{description}</div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '16px', backgroundColor: accentColor }} />
      </div>
    )
  }

  return new ImageResponse(
    (
      <div style={{ display: 'flex', height: '100%', width: '100%', fontFamily: '"Inter"' }}>
        {content}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interRegularData,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: interBoldData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tagsParam = searchParams.get('tags')

    return await generate({
      title: searchParams.get('title') || 'OpenGraph Studio',
      description: searchParams.get('description') || 'The ultimate tool for generating beautiful, framework-ready OpenGraph images and SEO metadata.',
      accentColor: searchParams.get('accentColor') || '#3b82f6',
      bgStyle: searchParams.get('bgStyle') || 'gradient',
      logoUrl: searchParams.get('logoUrl') || '',
      brandName: searchParams.get('brandName') || 'OG Studio',
      tags: tagsParam ? tagsParam.split(',').map((t) => t.trim()) : ['Next.js', 'React', 'SEO'],
      preset: searchParams.get('preset') || 'saas',
      bgImageBase64: ''
    })
  } catch (e: unknown) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return await generate({
      title: body.title || 'OpenGraph Studio',
      description: body.description || 'The ultimate tool for generating beautiful, framework-ready OpenGraph images and SEO metadata.',
      accentColor: body.accentColor || '#3b82f6',
      bgStyle: body.bgStyle || 'gradient',
      logoUrl: body.logoUrl || '',
      brandName: body.brandName || 'OG Studio',
      tags: body.tags || ['Next.js', 'React', 'SEO'],
      preset: body.preset || 'saas',
      bgImageBase64: body.bgImageBase64 || ''
    })
  } catch (e: unknown) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
