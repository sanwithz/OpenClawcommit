# React + Gemini App Generation Checklist

## Project skeleton
- [ ] `index.html` exists at root with Tailwind CDN script
- [ ] `index.tsx` uses `createRoot`
- [ ] `App.tsx` exists
- [ ] No `src/` prefixed paths
- [ ] No `.css` files

## TypeScript correctness
- [ ] Named imports only, top-level only
- [ ] No `const enum`
- [ ] Runtime enum values imported with normal `import`
- [ ] No implicit global constants/types

## React correctness
- [ ] Hook dependencies reviewed (no infinite loops)
- [ ] Mount-only effects use `[]` intentionally
- [ ] Helper components declared outside parent component
- [ ] `HashRouter` used if routing is required

## UI/UX
- [ ] Mobile-first Tailwind classes
- [ ] Sticky primary CTA exists
- [ ] Good contrast and readability

## Gemini SDK correctness
- [ ] `import { GoogleGenAI } from "@google/genai"`
- [ ] `new GoogleGenAI({ apiKey: process.env.API_KEY })`
- [ ] `ai.models.generateContent(...)` used directly
- [ ] Read output from `response.text`
- [ ] No deprecated SDK usage

## Grounding
- [ ] Search grounding config valid (no response schema/mime)
- [ ] Maps grounding config valid
- [ ] URLs extracted from grounding chunks and shown in UI

## Delivery format (if requested)
- [ ] XML `<changes>` format only
- [ ] `metadata.json` as first file
- [ ] Permissions only when needed
