import { describe, it, expect } from 'vitest'
import {
  generateNextjsTemplate,
  generateReactSpaTemplate,
  generateVueTemplate,
  generateLaravelTemplate,
  generateHtmlTemplate,
  generateCode
} from './templates'
import { AppState } from './store'

const mockState = (): AppState => ({
  title: 'Test Title',
  description: 'Test Description',
  accentColor: '#ff0000',
  bgStyle: 'gradient',
  logoUrl: 'https://example.com/logo.png',
  brandName: 'Test Brand',
  tags: ['tag1', 'tag2'],
  framework: 'nextjs',
  i18nEnabled: false,
  defaultLocale: 'en',
  secondaryLocales: 'es, fr',
  uiLanguage: 'en',
  preset: 'minimalist',
  bgImageBase64: '',
  updateState: () => {},
  setTitle: () => {},
  setDescription: () => {},
  setAccentColor: () => {},
  setBgStyle: () => {},
  setLogoUrl: () => {},
  setBrandName: () => {},
  setTags: () => {},
  setFramework: () => {},
  setI18nEnabled: () => {},
  setDefaultLocale: () => {},
  setSecondaryLocales: () => {},
  setUiLanguage: () => {},
  setPreset: () => {},
  setBgImageBase64: () => {}
})

describe('templates', () => {
  describe('generateNextjsTemplate', () => {
    it('generates standard templates when i18n is disabled', () => {
      const state = mockState()
      const templates = generateNextjsTemplate(state)

      expect(templates).toHaveLength(2)

      const [ogTemplate, layoutTemplate] = templates
      expect(ogTemplate.filename).toBe('app/opengraph-image.tsx')
      expect(layoutTemplate.filename).toBe('app/layout.tsx')

      expect(ogTemplate.content).toContain("export const alt = 'Test Title'")
      expect(ogTemplate.content).not.toContain("params.locale")

      expect(layoutTemplate.content).toContain("export const metadata: Metadata = {")
      expect(layoutTemplate.content).toContain("title: 'Test Title'")
    })

    it('generates localized templates when i18n is enabled', () => {
      const state = mockState()
      state.i18nEnabled = true
      const templates = generateNextjsTemplate(state)

      const [ogTemplate, layoutTemplate] = templates
      expect(ogTemplate.filename).toBe('app/[locale]/opengraph-image.tsx')
      expect(layoutTemplate.filename).toBe('app/[locale]/layout.tsx')

      expect(ogTemplate.content).toContain("export default async function Image({ params }: { params: { locale: string } })")

      expect(layoutTemplate.content).toContain("export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {")
      expect(layoutTemplate.content).toContain("alternateLocale: ['es', 'fr']")
    })

    it('handles different background styles', () => {
      const state = mockState()

      // solid
      state.bgStyle = 'solid'
      let templates = generateNextjsTemplate(state)
      expect(templates[0].content).toContain("backgroundColor: '#0f172a'")
      expect(templates[0].content).toContain("backgroundImage: undefined")

      // gradient
      state.bgStyle = 'gradient'
      templates = generateNextjsTemplate(state)
      expect(templates[0].content).toContain("backgroundImage: 'linear-gradient")
      expect(templates[0].content).toContain("backgroundColor: '#0f172a'")

      // pattern
      state.bgStyle = 'pattern'
      templates = generateNextjsTemplate(state)
      expect(templates[0].content).toContain("backgroundColor: '#0f172a'")
      expect(templates[0].content).toContain("backgroundImage: 'repeating-linear-gradient(45deg, #0f172a, #0f172a 10px, #1e293b 10px, #1e293b 20px)'")
    })

    it('escapes quotes correctly', () => {
      const state = mockState()
      state.title = "It's a title"
      const templates = generateNextjsTemplate(state)

      expect(templates[0].content).toContain("export const alt = 'It\\'s a title'")
    })
  })

  describe('generateReactSpaTemplate', () => {
    it('generates correct HTML and Worker when i18n disabled', () => {
      const state = mockState()
      const templates = generateReactSpaTemplate(state)

      expect(templates).toHaveLength(2)
      expect(templates[0].filename).toBe('public/index.html')
      expect(templates[1].filename).toBe('worker.js')

      expect(templates[0].content).toContain('<meta property="og:locale" content="en" />')
      expect(templates[0].content).not.toContain('<meta property="og:locale:alternate"')
    })

    it('generates correct HTML and Worker when i18n enabled', () => {
      const state = mockState()
      state.i18nEnabled = true
      const templates = generateReactSpaTemplate(state)

      expect(templates[0].content).toContain('<meta property="og:locale" content="en" />')
      expect(templates[0].content).toContain('<meta property="og:locale:alternate" content="es" />')
      expect(templates[0].content).toContain('<meta property="og:locale:alternate" content="fr" />')
    })
  })

  describe('generateVueTemplate', () => {
    it('generates correct app.vue and nitro code when i18n disabled', () => {
      const state = mockState()
      const templates = generateVueTemplate(state)

      expect(templates).toHaveLength(2)
      expect(templates[0].filename).toBe('app.vue')
      expect(templates[1].filename).toBe('server/routes/og.ts')

      expect(templates[0].content).toContain("ogLocale: 'en',")
      expect(templates[0].content).not.toContain("ogLocaleAlternate")
    })

    it('generates correct app.vue and nitro code when i18n enabled', () => {
      const state = mockState()
      state.i18nEnabled = true
      const templates = generateVueTemplate(state)

      expect(templates[0].content).toContain("ogLocale: 'en',")
      expect(templates[0].content).toContain("ogLocaleAlternate: ['es', 'fr']")
    })
  })

  describe('generateLaravelTemplate', () => {
    it('generates blade component and routes without i18n', () => {
      const state = mockState()
      const templates = generateLaravelTemplate(state)

      expect(templates).toHaveLength(2)
      expect(templates[0].filename).toBe('resources/views/components/meta-tags.blade.php')
      expect(templates[1].filename).toBe('routes/web.php')

      expect(templates[0].content).toContain("<meta property=\"og:locale\" content=\"{{ str_replace('_', '-', app()->getLocale()) }}\" />")
      expect(templates[0].content).not.toContain("@foreach")
    })

    it('generates blade component and routes with i18n', () => {
      const state = mockState()
      state.i18nEnabled = true
      const templates = generateLaravelTemplate(state)

      expect(templates[0].content).toContain("@foreach(config('app.alternate_locales', []) as $locale)")
    })
  })

  describe('generateHtmlTemplate', () => {
    it('generates HTML without i18n', () => {
      const state = mockState()
      const templates = generateHtmlTemplate(state)

      expect(templates).toHaveLength(1)
      expect(templates[0].filename).toBe('index.html')

      expect(templates[0].content).toContain('<meta property="og:locale" content="en" />')
      expect(templates[0].content).not.toContain('<meta property="og:locale:alternate"')
    })

    it('generates HTML with i18n', () => {
      const state = mockState()
      state.i18nEnabled = true
      const templates = generateHtmlTemplate(state)

      expect(templates[0].content).toContain('<meta property="og:locale:alternate" content="es" />')
      expect(templates[0].content).toContain('<meta property="og:locale:alternate" content="fr" />')
    })

    it('escapes double quotes in HTML attributes', () => {
      const state = mockState()
      state.title = 'Title with "quotes"'
      const templates = generateHtmlTemplate(state)

      expect(templates[0].content).toContain('<meta name="title" content="Title with &quot;quotes&quot;" />')
    })
  })

  describe('generateCode', () => {
    it('routes correctly based on framework', () => {
      const state = mockState()

      state.framework = 'nextjs'
      let templates = generateCode(state)
      expect(templates[0].filename).toContain('opengraph-image')

      state.framework = 'react'
      templates = generateCode(state)
      expect(templates[0].filename).toContain('index.html')
      expect(templates[1].filename).toContain('worker.js')

      state.framework = 'vue'
      templates = generateCode(state)
      expect(templates[0].filename).toContain('app.vue')

      state.framework = 'laravel'
      templates = generateCode(state)
      expect(templates[0].filename).toContain('meta-tags.blade.php')

      state.framework = 'html'
      templates = generateCode(state)
      expect(templates[0].filename).toBe('index.html')
    })
  })
})
