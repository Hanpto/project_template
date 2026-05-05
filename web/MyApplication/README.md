# MyApplication (Web Template)

Minimal TypeScript + Vite template, mirroring `ios/MyApplication` and `android/MyApplication`.
Used by the TRTC AI integration evaluation toolchain (see `trtc-ai-integration` repo).

## Quick Start

```bash
cp .env.example .env.local   # fill in VITE_TRTC_TEST_*
npm ci
npm run build                # smoke check: should succeed with empty src/generated/anchorView.ts
npm run dev                  # http://127.0.0.1:5173
```

## Auto-Run Mode

Set `VITE_EVAL_AUTO_RUN_FLOW=anchor_start_then_end` in `.env.local`, then `npm run dev` and open the URL in a headless browser. The flow finishes within 60s and closes the page.

## Injection Contract

See `INJECTION.json`. AI-generated files are written to `src/generated/*.ts` with `replace_mode = overwrite`. Do not merge —— always replace.

## Non-Goals

- No React / Vue / Svelte.
- No specific TRTC SDK in `dependencies` (consumers add their own).
