import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Dynamic params
    const title = searchParams.get('title') || 'OpenGraph Studio'
    const description = searchParams.get('description') || 'The ultimate tool for generating beautiful, framework-ready OpenGraph images and SEO metadata.'
    const accentColor = searchParams.get('accentColor') || '#3b82f6'
    const bgStyle = searchParams.get('bgStyle') || 'gradient'
    const logoUrl = searchParams.get('logoUrl') || ''
    const brandName = searchParams.get('brandName') || 'OG Studio'
    const tagsParam = searchParams.get('tags')
    const tags = tagsParam ? tagsParam.split(',').map((t) => t.trim()) : ['Next.js', 'React', 'SEO']

    // Determine background
    let background = 'white'
    if (bgStyle === 'solid') {
      background = '#0f172a' // slate-900
    } else if (bgStyle === 'gradient') {
      background = `linear-gradient(to bottom right, #0f172a, ${accentColor}40, #0f172a)`
    } else if (bgStyle === 'pattern') {
      // simple grid pattern
      background = `repeating-linear-gradient(45deg, #0f172a, #0f172a 10px, #1e293b 10px, #1e293b 20px)`
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundImage: background,
            backgroundColor: '#0f172a',
            padding: '80px',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              marginBottom: 'auto',
            }}
          >
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Logo"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  marginRight: '20px',
                }}
              />
            )}
            <span
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#e2e8f0', // slate-200
                letterSpacing: '-0.02em',
              }}
            >
              {brandName}
            </span>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: 'flex-start',
            }}
          >
            {/* Tags */}
            {tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '24px',
                }}
              >
                {tags.map((tag, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      backgroundColor: `${accentColor}30`,
                      color: accentColor,
                      fontSize: '20px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Title */}
            <div
              style={{
                fontSize: '80px',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: '24px',
                color: 'white',
                maxWidth: '1000px',
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '36px',
                fontWeight: 400,
                color: '#94a3b8', // slate-400
                letterSpacing: '-0.01em',
                lineHeight: 1.4,
                maxWidth: '900px',
              }}
            >
              {description}
            </div>
          </div>

          {/* Bottom decorative bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '16px',
              backgroundColor: accentColor,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
