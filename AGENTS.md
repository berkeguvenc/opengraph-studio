<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# OpenGraph Studio — AI Agent Kuralları ve Geliştirici Yönergeleri

Bu depo, çoklu framework destekli OpenGraph (OG) görseli ve SEO meta verisi üretimi sağlayan **OpenGraph Studio** projesidir. Projede değişiklik yaparken aşağıdaki kurallara ve mimari ilkelere kesinlikle uyulmalıdır.

---

## 1. Teknoloji Yığını ve Komutlar
- **Çekirdek:** Next.js 16 (App Router, Turbopack), React 19, TypeScript 5.
- **Stillendirme:** Tailwind CSS v4 (`@import "tailwindcss";`, `@theme inline`).
- **Durum Yönetimi:** Zustand 5 (`lib/store.ts`) ve Zod 4 şema doğrulama (`appStateSchema`).
- **Görsel Motoru:** `@vercel/og` (Satori + Resvg) Edge Route Handler (`app/api/og/route.tsx`).
- **Kod Renklendirme:** Shiki (`github-dark` teması).
- **Zorunlu Doğrulama Komutları:**
  - Tip Kontrolü: `npx tsc --noEmit` (Her değişiklik sonrası 0 hata vermelidir)
  - Lint Kontrolü: `npm run lint` (0 hata vermelidir)

---

## 2. Kod Üretim Motoru (`lib/templates.ts`) Kuralları
1. **`TemplateFile[]` Garantisi:** `generateCode(state: AppState)` fonksiyonu istisnasız her framework için geçerli bir `TemplateFile[]` nesne dizisi dönmelidir. Asla boş dizi, `null` veya `undefined` dönmemelidir.
2. **Alan Bütünlüğü:** Üretilen her dosya objesinde `tabName`, `filename`, `language` ve `content` alanları eksiksiz korunmalıdır.
3. **Exhaustive Mapping:** Yeni bir framework eklendiğinde `templateGenerators: Record<Framework, ...>` haritası güncellenmeli ve derleme zamanı tip kontrolü sağlanmalıdır.
4. **React SPA Bot Kuralı:** CSR uygulamalarında botların JavaScript çalıştırmadığı unutulmamalı, `worker.js` Cloudflare/Edge şablonu korunmalıdır.

---

## 3. Bileşen ve Arayüz (`components/CodeOutput.tsx`) Kuralları
1. **Tekil `activeFile` Tanımı:** Bileşende `activeFile` değişkeni scope içerisinde **yalnızca tek bir `const`** ile tanımlanmalıdır (`const activeFile: TemplateFile = files[safeIndex] || files[0]`).
2. **Sekme İndeksi Güvenliği:**
   - Framework veya dil değişiminde sekme indeksi sıfırlanmalıdır (`setActiveFileIndex(0)`).
   - Render anında `safeIndex` sınır kontrolü (`activeFileIndex < files.length ? activeFileIndex : 0`) korunmalıdır.
   - `useEffect` içinde doğrudan `setState` çağrılarak `react-hooks/set-state-in-effect` hatasına yol açılmamalı; render anında React state adjustment deseni kullanılmalıdır.
3. **JSX Varlıkları (Entities):** JSX içerisindeki tırnak işaretleri ve özel karakterler kaçış karakterleriyle yazılmalıdır (`&apos;`, `&quot;`, `&lt;`, `&gt;`).

---

## 4. Satori ve Görsel Üretim (`app/api/og/route.tsx`) Kuralları
1. **Flexbox Kısıtı:** Satori CSS Grid desteklemez. Tüm düzenler satır içi (inline) `display: 'flex'`, `flexDirection`, `alignItems` ve `justifyContent` ile kurulmalıdır.
2. **Görsel Etiketi:** Satori ortamında `next/image` değil, saf HTML `<img>` etiketi kullanılmalıdır (`// eslint-disable-next-line @next/next/no-img-element` ile işaretlenmelidir).
3. **Boş Kaynak Koruması:** `logoUrl` gibi alanlar boş metin (`""`) olduğunda `{logoUrl && <img ... />}` yerine `{Boolean(logoUrl) ? <img ... /> : null}` veya `{logoUrl ? <img ... /> : null}` kullanılmalıdır.
4. **Font Yükleme:** Edge ortamında `fs` çalışmadığından yazı tipleri jsDelivr CDN üzerinden binary buffer (`ArrayBuffer`) olarak yüklenmeye devam etmelidir.

---

## 5. Çoklu Dil (i18n) Kuralları
- Arayüze eklenen tüm yeni metinler `lib/i18n.ts` içerisindeki `translations.en` ve `translations.tr` sözlüklerine karşılıklı olarak eklenmelidir.
- Meta etiketlerinde `og:locale` ve `og:locale:alternate` yapısı korunmalıdır.
