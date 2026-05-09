# MyApplication (Web Template)

Minimal TypeScript + Vite shell template. At eval time a **framework profile**
(see `profiles/`) is overlaid onto the workspace to switch between `vanilla`,
`vue3`, `vue2`, and `react` runtimes without forcing them to coexist.

Used by the TRTC AI integration evaluation toolchain (see `trtc-ai-integration` repo).

## Quick Start (manual / vanilla)

```bash
npm ci
npm run build                # smoke check
npm run dev                  # http://127.0.0.1:5173
```

## Configuration

TRTC test credentials for eval runs live in `.claude/skills/trtc-eval/config.json`
(see its README). The orchestrator writes them to `<case_dir>/.eval-meta/launch.env`,
and `scripts/log-bridge.mjs` translates the `TRTC_TEST_*` keys into
`VITE_TRTC_TEST_*` inside this workspace's `.env.local` before Vite starts —
Vite only exposes `VITE_*`-prefixed env to the browser.

For **manual** `npm run dev` outside the eval flow, create `.env.local` yourself
with `VITE_TRTC_TEST_SDKAPPID` / `VITE_TRTC_TEST_USERID` / `VITE_TRTC_TEST_USERSIG`.

## Framework Profiles

A single test run activates exactly one framework. `scripts/demo_runner.py`
chooses it from `case.framework` (explicit) or
`web_profile.detect_web_framework()` (auto). `scripts/lib/web_profile.py`
then overlays `profiles/<framework>/` onto the workspace **before `npm ci`**:

| Profile | Overlay produces | Expected entry (injected) |
|---------|------------------|---------------------------|
| `vanilla` | plain Vite + TS | `src/generated/index.ts` |
| `vue3` | vue ^3.4 + @vitejs/plugin-vue | `src/generated/App.vue` |
| `vue2` | vue ^2.7 + @vitejs/plugin-vue2 | `src/generated/App.vue` |
| `react` | react ^18 + @vitejs/plugin-react | `src/generated/App.tsx` |

Each profile is a directory of overlays:
`package.patch.json` (merged into `package.json`),
`vite.config.ts` (replaced outright), `main.ts`/`main.tsx` (replaces
`src/main.*`), optional `shim-*.d.ts` and `tsconfig.patch.json`.

## Auto-Run Mode

Set `VITE_EVAL_AUTO_RUN_FLOW=anchor_start_then_end` in `.env.local`, then
`npm run dev` and open the URL in a headless browser. The flow finishes
within 60s and closes the page.

## Injection Contract

See `INJECTION.json` and `scripts/lib/code_injector.py`. If `cases.json`
does not declare a `demo_injection_map`, the injector uses the default
routing rules from `scripts/lib/file_naming.py`:

1. Header-comment filename hint (`// auth.ts — …` / `<!-- App.vue —`)
2. Relative-import reverse inference (`import { x } from './auth'`)
3. Framework default entry (the profile's expected entry filename)
4. Original block name as fallback (`block_NN.<ext>`)

Non-code blocks (`.xml`, `.plist`, `.json`, …) are parked in
`case_dir/ai_unrouted/` for audit and NOT injected into workspace.

