import { generateCode } from './templates'
import { AppState } from './store'

describe('generateCode', () => {
  const baseState: Omit<AppState, 'updateState' | 'setTitle' | 'setDescription' | 'setAccentColor' | 'setBgStyle' | 'setLogoUrl' | 'setBrandName' | 'setTags' | 'setFramework' | 'setI18nEnabled' | 'setDefaultLocale' | 'setSecondaryLocales' | 'setUiLanguage' | 'setPreset' | 'setBgImageBase64'> = {
    title: 'Test Title',
    description: 'Test Description',
    accentColor: '#000000',
    bgStyle: 'solid',
    logoUrl: '',
    brandName: 'Test Brand',
    tags: [],
    framework: 'nextjs',
    i18nEnabled: false,
    defaultLocale: 'en',
    secondaryLocales: '',
    uiLanguage: 'en',
    preset: 'saas',
    bgImageBase64: ''
  }

  const createMockState = (overrides: Partial<AppState>): AppState => {
    return {
      ...baseState,
      ...overrides,
      updateState: jest.fn(),
      setTitle: jest.fn(),
      setDescription: jest.fn(),
      setAccentColor: jest.fn(),
      setBgStyle: jest.fn(),
      setLogoUrl: jest.fn(),
      setBrandName: jest.fn(),
      setTags: jest.fn(),
      setFramework: jest.fn(),
      setI18nEnabled: jest.fn(),
      setDefaultLocale: jest.fn(),
      setSecondaryLocales: jest.fn(),
      setUiLanguage: jest.fn(),
      setPreset: jest.fn(),
      setBgImageBase64: jest.fn()
    }
  }

  it('should return nextjs template when framework is nextjs', () => {
    const state = createMockState({ framework: 'nextjs' })
    const result = generateCode(state)
    expect(result.length).toBe(2)
    expect(result[0].filename).toBe('app/opengraph-image.tsx')
    expect(result[1].filename).toBe('app/layout.tsx')
  })

  it('should return react template when framework is react', () => {
    const state = createMockState({ framework: 'react' })
    const result = generateCode(state)
    expect(result.length).toBe(2)
    expect(result[0].filename).toBe('public/index.html')
    expect(result[1].filename).toBe('worker.js')
  })

  it('should return vue template when framework is vue', () => {
    const state = createMockState({ framework: 'vue' })
    const result = generateCode(state)
    expect(result.length).toBe(2)
    expect(result[0].filename).toBe('app.vue')
    expect(result[1].filename).toBe('server/routes/og.ts')
  })

  it('should return laravel template when framework is laravel', () => {
    const state = createMockState({ framework: 'laravel' })
    const result = generateCode(state)
    expect(result.length).toBe(2)
    expect(result[0].filename).toBe('resources/views/components/meta-tags.blade.php')
    expect(result[1].filename).toBe('routes/web.php')
  })

  it('should return html template when framework is html', () => {
    const state = createMockState({ framework: 'html' })
    const result = generateCode(state)
    expect(result.length).toBe(1)
    expect(result[0].filename).toBe('index.html')
  })

  it('should return empty array for unknown framework', () => {
    const state = createMockState({ framework: 'unknown' as any })
    const result = generateCode(state)
    expect(result).toEqual([])
  })
})