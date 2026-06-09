# Tarbiyatul Quran Academy — Website

A fully static, multi-page website for **Tarbiyatul Quran Academy** — an online Quran teaching service for Muslim families living in non-Muslim Western countries.

**Live site:** [tarbiyatulquran.org](https://tarbiyatulquran.org)  
**Contact:** ibnhosain014@gmail.com · WhatsApp: +880 140 249 9027

---

## Pages

| File | Page | Purpose |
|---|---|---|
| `index.html` | Home | Hero, why us, course previews, testimonials, CTA |
| `about.html` | About | Director profile, academy story, values |
| `courses.html` | Courses | All 5 courses with detail and topics |
| `syllabus.html` | Syllabus | Tabbed lesson-by-lesson breakdown |
| `books.html` | Books | Recommended texts and digital resources |
| `demo.html` | Demo Class | YouTube demo + free trial booking |
| `fees.html` | Fees | Pricing table in USD, GBP, EUR, CAD, BDT |
| `contact.html` | Contact | WhatsApp, email, enquiry form |
| `404.html` | 404 | Custom not-found page for GitHub Pages |

---

## File Structure

```
/
├── index.html
├── about.html
├── courses.html
├── syllabus.html
├── books.html
├── demo.html
├── fees.html
├── contact.html
├── 404.html
├── favicon.svg
├── sitemap.xml
├── robots.txt
├── .nojekyll          ← Required for GitHub Pages CSS to load
├── _config.yml        ← GitHub Pages config
│
├── css/
│   ├── min.css        ← Base styles (reset, navbar, buttons, modal, footer)
│   └── style.css      ← Theme variables, hero, page-specific, responsive
│
├── js/
│   └── app.js         ← Mobile menu, modal, forms, FAQ, WhatsApp, toast
│
└── images/
    ├── hero_calligraphy.png   ← Background-removed calligraphy (PNG, transparent)
    ├── hero_bg_f.jpg          ← Original calligraphy source photo
    ├── hero_bg.jpg            ← Previous hero background (kept as backup)
    ├── director.jpg           ← Ustad Faridur Rahman photo (About page)
    └── og-image.svg           ← Social share preview image (1200×630)
```

---

## CSS Architecture

The stylesheet is split into two files loaded in every page:

```html
<link rel="stylesheet" href="./css/min.css" />
<link rel="stylesheet" href="./css/style.css" />
```

**`min.css`** — Base layer, never needs editing:
- CSS reset
- Navbar, hamburger, mobile menu
- Button variants (`.btn`, `.primary`, `.gold`, `.btnWa`, `.outline`)
- Card, grid layouts (`.grid2`, `.grid3`, `.grid4`)
- Form fields and modal
- Footer
- Toast notification
- Utility classes

**`style.css`** — Theme layer, edit here for visual changes:
- CSS custom properties (all brand colors, shadows, radii)
- Hero section with calligraphy background and glow effect
- Inner page hero (`.pageHero`)
- All page-specific components (courses, books, fees, syllabus, etc.)
- Responsive breakpoints

> **To change brand colors:** edit the `:root` variables at the top of `style.css`.

---

## JavaScript (`js/app.js`)

All JS runs on `DOMContentLoaded`. Functions:

| Function | What it does |
|---|---|
| `setActiveNav()` | Highlights the current page link in the navbar |
| `initMobileMenu()` | Hamburger open/close with overlay and ESC key |
| `initModal()` | Admission form modal — open/close/backdrop click |
| `initAdmissionForm()` | Collects form data → pre-filled WhatsApp message |
| `initContactForm()` | Contact enquiry → WhatsApp message |
| `initWaButtons()` | All `[data-wa]` buttons → WhatsApp default message |
| `initFaq()` | Accordion open/close for FAQ sections |
| `showToast(msg)` | Bottom-right toast notification |
| `setYear()` | Updates footer copyright year automatically |

**WhatsApp number** is set once at the top of `app.js`:
```js
const WA_NUMBER = "8801402499027";
```

---

## SEO

Every page includes:

- Unique `<title>` and `<meta name="description">`
- `<link rel="canonical">` — prevents duplicate content penalties
- Open Graph tags (`og:title`, `og:description`, `og:image`) — WhatsApp/Facebook/LinkedIn previews
- Twitter Card tags
- `robots` meta: `index, follow`
- JSON-LD structured data:
  - `index.html` → `WebSite` + `EducationalOrganization`
  - `courses.html` → `ItemList` of courses
  - `about.html` → `Person` (teacher profile)
  - `contact.html` → `EducationalOrganization`
  - All others → `WebPage`

**`sitemap.xml`** — Lists all 8 pages with priority and change frequency.  
**`robots.txt`** — Allows all bots, points to sitemap.

---

## Hosting on GitHub Pages

### 1. Create repository

```bash
git init
git add .
git commit -m "Initial commit — Tarbiyatul Quran Academy website"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Enable GitHub Pages

Go to **Settings → Pages → Source** → select `main` branch, `/ (root)` folder → Save.

> The `.nojekyll` file in the root is **required** — without it, GitHub Pages will ignore the `css/` folder.

### 3. Custom domain (optional)

Create a `CNAME` file in the root:
```
tarbiyatulquran.org
```
Then in your domain registrar, add:
```
Type  Name   Value
A     @      185.199.108.153
A     @      185.199.109.153
A     @      185.199.110.153
A     @      185.199.111.153
CNAME www    YOUR_USERNAME.github.io
```

### 4. If hosting without a custom domain

Update **all** `<link rel="canonical">` URLs and `sitemap.xml` URLs from `https://tarbiyatulquran.org/` to your GitHub Pages URL, e.g. `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

Also update the image paths in `style.css` hero section if the repo is in a subfolder:
```css
/* Change this: */
url('../images/hero_calligraphy.png')
/* To this (if repo is at /tqa/): */
url('/tqa/images/hero_calligraphy.png')
```

---

## Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. **Add Property** → URL prefix → enter your live URL
3. Verify ownership — choose **HTML file** method, download the file, place it in the root folder alongside `index.html`, push to GitHub
4. Once verified: **Sitemaps** → enter `sitemap.xml` → Submit
5. Request indexing: open each URL in the URL Inspection tool → **Request Indexing**

---

## Making Changes

### Update contact details
Edit `js/app.js` — change `WA_NUMBER` and `ACADEMY_NAME` at the top.

### Update fees
Edit the `<table>` in `fees.html`.

### Add a new course
1. Add a card in `courses.html`
2. Add a tab panel in `syllabus.html`
3. Add the course as an `<option>` in the admission form modal in every HTML file

### Change the hero background
Replace `images/hero_calligraphy.png` with a new transparent PNG.  
Adjust the `filter` property in the `.hero::before` rule in `style.css` to tune the glow.

### Update sitemap dates
Edit `sitemap.xml` — change the `<lastmod>` dates when content is updated.

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome / Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari (iOS + macOS) | ✅ Full |
| Samsung Internet | ✅ Full |

Uses only standard CSS (Grid, Flexbox, custom properties, `clamp()`) and vanilla JS. No frameworks, no build step required.

---

## Credits

- **Fonts:** [Inter](https://fonts.google.com/specimen/Inter) + [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) via Google Fonts
- **Hero calligraphy:** "Iqra" ayah (Surah Al-Alaq 96:1) — background removed with PIL
- **Built by:** Claude (Anthropic) for Faridur Rahman / Tarbiyatul Quran Academy
