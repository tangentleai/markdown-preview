## Context
This change refines the existing WYSIWYG search toolbar behavior without changing search algorithm semantics. The focus is visibility, state reset reliability, and icon tooltip consistency across pointer, keyboard, and mobile interactions.

## Goals / Non-Goals
- Goals:
  - Keep search toolbar visible by pinning it to the editor container top during page scroll.
  - Achieve zero state contamination after close and reopen.
  - Replace regex text toggle with icon button while preserving accessibility semantics.
  - Provide consistent tooltip behavior for hover, focus, and mobile long-press.
- Non-Goals:
  - No change to match engine rules or replace semantics.
  - No cross-document search.
  - No CLI automation expansion; GUI-only validation remains.

## Decisions
- Decision: Use container-relative sticky positioning.
  - Rationale: User explicitly requires sticky anchoring to editor container top, not viewport/global header.
- Decision: Reset full transient session state on close.
  - Rationale: Success metric requires contamination rate to be zero after reopen.
- Decision: Regex control becomes icon button with label `正则模式`.
  - Rationale: Align with existing iconized toolbar while preserving screen-reader discoverability.
- Decision: Tooltip trigger matrix includes hover, keyboard focus, and mobile long-press.
  - Rationale: Improves parity across desktop and mobile interaction modes.
- Decision: Tooltip visual baseline standardizes background color, border radius, and font size.
  - Rationale: User requested style consistency using these properties as required baseline.

## Architecture Notes
- UI state ownership remains in `src/components/WysiwygEditor.tsx` search-toolbar state.
- Styling updates are expected in `src/index.css` and existing toolbar classes.
- If additional icon glyph is required for regex toggle, iconfont assets are sourced under `src/assets/iconfont/`.

## Failure Handling
- Closing the toolbar is the canonical reset event and MUST clear all transient search session UI state.
- If tooltip interaction is unsupported in a browser edge case, search actions remain operable (non-blocking degradation).

## Security / Privacy
- No new data persistence or external transmission introduced.
- Tooltip and sticky behavior changes are client-side presentation updates only.

## Observability and Verification
- Validation scope is GUI-only via MCP runbook.
- Acceptance evidence should include:
  - sticky visibility under long-page scroll,
  - before/after close state reset screenshots,
  - regex icon + accessibility label checks,
  - hover/focus/long-press tooltip checks.

## Rollout / Backward Compatibility
- Rollout replaces current toolbar rendering and interactions in place.
- Backward compatibility expectation: search and replace outcomes remain functionally unchanged.
- Rollback can revert toolbar layout and tooltip interaction layers without touching match engine code.

## Alternatives Considered
- Alternative: Viewport-relative sticky toolbar.
  - Rejected: Conflicts with explicit container-relative requirement.
- Alternative: Partial reset (only inputs/toggles).
  - Rejected: Conflicts with zero contamination metric.
- Alternative: Hover-only tooltip behavior.
  - Rejected: Does not satisfy keyboard and mobile interaction requirements.

## Open Questions
- Open Question: What long-press duration threshold should be used on mobile before tooltip appears?
