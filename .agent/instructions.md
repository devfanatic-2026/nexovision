# Float-V Agent Instructions

You are an expert developer in **Float-V**, the evolution of Float.js into an ultra-modern, Vibe-native, AI-resident web framework.

## 1. Nomenclature & Branding
- **Package Namespace**: Always use `@float-v/*` (e.g., `@float-v/core`, `@float-v/lite`).
- **CLI**: The command is `float-v` or `npx create-float-v`.
- **Framework Identity**: Refer to the framework as **Float-V**.

## 2. The Core Philosophy (Vibe Coding)
Float-V is built for **Visibility** and **Agent-Residance**.
- **State Identity**: Never use `useState`. Always use `useFloatState(key, initial)` or `useFloatStore(key, initial)`. The `key` must be semantic (e.g., `'user-session-active'`).
- **Observability**: All framework actions log via `[VibeDebug]` or `[VibeState]`.
- **Evidence-First**: If a build or render fails, check `.float/evidence/`.

## 3. Component Architecture
- **Client Components**: Mark with `'use client';`.
- **Shared UI**: Components in `@float-v/lite` are cross-platform by default.
- **Async Components**: No hooks allowed in `async function` components.

## 4. Migration & Debugging
- **Legacy Detection**: The framework will warn if `@float.js` imports are found. Update them immediately to `@float-v`.
- **Vibe Logs**: Use `VibeDebugger.dumpEvidence(type, data)` for custom agent-visible debugging artifacts.

## 5. Development Workflow
- **Validation**: Run `float-v check` to verify workspace integrity.
- **AI-Resident**: Keep this `.agent/instructions.md` updated as part of the project state.

## 6. Design Aesthetics (Liquid Glass & Apple-Tier)
Float-V follows a **Premium Digital Materiality** philosophy. Every UI element must respect the following:
- **Liquid Materiality**: Treat every surface as a refractive layer of glass. Use translucency (`rgba` with high alpha), background blurs where possible, and hairline borders (0.5pt - 1pt) with subtle contrast.
- **Hierarchy & Depth**: Use multi-layered shadows and Z-axis elevation to create a spatial UI. Layers closer to the user should be more blurred and translucent.
- **Continuous Radii**: Always use large, geometric-continous (squircle-like) corner radii. Avoid generic polar radii; prefer values between `16pt` and `32pt` for cards.
- **Micro-Animations**: All interactions must use **Physical Spring Curves**. Avoid linear and standard cubic ease-in-out. Use `spring` with high damping for a premium "analog" feel.
- **Typography & Scale**: Use generous negative space and a clear typographic hierarchy. Body text should be readable but secondary to semantic headers.
- **Color Harmony**: Use vibrant labels (semi-transparent text) instead of flat grays to ensure content blends harmoniously with the glass surface.
