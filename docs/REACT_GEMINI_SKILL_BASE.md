# React + Gemini Skill Base (Updated)

## Purpose
Operational rules for generating production-ready React 18 + TypeScript SPAs with Tailwind and correct `@google/genai` API usage.

## Core Build Contract
- Runtime: React 18+, TypeScript (`.tsx`), ESM only
- Required files at root: `index.html`, `index.tsx`, `App.tsx`
- No `src/` prefix in file paths
- No `.css` files; Tailwind CDN only in `index.html`
- Mobile-first responsive design with sticky primary CTA

## Response Packaging Mode (when requested)
- Output as one XML block:
  - `<changes><change><file>...` with CDATA file contents
- First file should be `metadata.json`
- Add `requestFramePermissions` only if camera/mic/geolocation is required

## TypeScript Safety Rules
- Top-level named imports only
- No object destructuring imports
- No `const enum`
- Do not use `import type` when enum runtime values are needed
- Explicitly import all constants/types from their module

## React Rules
- Use `createRoot` from `react-dom/client`
- Functional components + hooks
- Avoid hook infinite loops (`useEffect` mount-only when intended)
- Define child/helper components outside parent scope
- Use `HashRouter` if routing is needed (no `BrowserRouter`)
- Use `<input type="file">` for uploads (no `react-dropzone`)

## UI/UX Rules
- Tailwind-only styling
- Strong contrast + clean visual hierarchy
- Production-grade layouts; avoid generic UI

## Data-viz Libraries
- Prefer `recharts` for app charts
- Use `d3` where custom visual behavior is required

## Gemini SDK Rules (`@google/genai`)
- Correct init:
  - `const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });`
- Correct import:
  - `import { GoogleGenAI } from "@google/genai";`
- Use `ai.models.generateContent({ model, contents, ... })` directly
- Read text via `response.text`
- Do not use deprecated APIs (`GoogleGenerativeAI`, `models.getGenerativeModel`, etc.)

## Model Mapping Defaults
- Basic text: `gemini-2.5-flash`
- Complex reasoning/coding: `gemini-2.5-pro`
- General image: `gemini-2.5-flash-image`
- HQ image: `imagen-4.0-generate-001`
- Video fast: `veo-3.1-fast-generate-preview`

## Grounding Rules
- Google Search grounding:
  - use only `tools: [{ googleSearch: {} }]`
  - no `responseMimeType` / `responseSchema`
  - always extract and surface URLs from grounding chunks
- Google Maps grounding:
  - may combine with `googleSearch` only
  - always surface place/map URLs

## Reliability
- Add robust API error handling and retry/backoff
- Avoid unnecessary `maxOutputTokens`; if set on 2.5 Flash, set `thinkingBudget` too
