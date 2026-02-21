## Context
WYSIWYG MVP already provides baseline plain-text find/replace. This change expands to keyboard-first interaction, consistent no-match behavior, richer matching modes, and icon-based toolbar UI while preserving single-document editing scope.

## Goals / Non-Goals
- Goals:
  - Provide reliable, low-friction find/replace for long documents.
  - Keep traversal and replacement behavior deterministic and testable.
  - Align toolbar visuals with existing UI style through iconfont assets.
- Non-Goals:
  - Cross-file search.
  - Search history / recent replacement templates.
  - Dedicated analytics panel for search statistics.

## Decisions
- Decision: Keep search state local to WYSIWYG editor session.
  - Rationale: Search behavior is tightly coupled to current document DOM and selection state.
  - Alternatives considered:
    - Global store for all editor modes: rejected (adds coupling with no clear value for single-doc scope).

- Decision: Use normalized plain-text query when opening search from selected content.
  - Rationale: Avoid structural tokens leaking into query semantics.
  - Alternatives considered:
    - Raw selection text: rejected (multi-line/markup artifacts create inconsistent matching).

- Decision: Highlight model is dual-layer (all matches weak + active match strong).
  - Rationale: Preserves context in dense documents while keeping current target obvious.
  - Alternatives considered:
    - Active-only highlight: rejected (poor spatial context for navigation).

- Decision: Scrolling strategy is minimal-scroll (only if active match is outside viewport).
  - Rationale: Reduces visual jitter and preserves reading position.
  - Alternatives considered:
    - Always center active match: rejected (over-scrolling and disruptive view jumps).

- Decision: Regex mode uses JS RegExp with `i/m` and disables whole-word option while active.
  - Rationale: Aligns with platform semantics and avoids ambiguous combined rules.
  - Alternatives considered:
    - Keep whole-word active in regex mode: rejected (conflicting boundary semantics).

- Decision: Case-sensitive behavior is controlled only by explicit toggle.
  - Rationale: Keeps behavior predictable and avoids hidden inference logic.
  - Rule:
    - Case button ON: force case-sensitive.
    - Case button OFF: always case-insensitive.

## Data Model
- SearchState (editor-local)
  - `query: string`
  - `replaceText: string`
  - `isOpen: boolean`
  - `mode: "find" | "replace"`
  - `activeIndex: number` (0-based; `-1` for no match)
  - `matchCount: number`
  - `options: { caseToggle: boolean; wholeWord: boolean; regex: boolean; regexI: boolean; regexM: boolean }`
  - `isCaseSensitive: boolean` (derived directly from case toggle)
  - `error: string | null` (regex parse/compile failures)

## Interfaces
- Keyboard events:
  - `Ctrl+F` / `Cmd+F`: open toolbar and seed query from normalized selection if present.
  - `Enter` (find input): move to next match.
  - `Esc` (toolbar open): close toolbar and restore editor focus.
- Toolbar actions:
  - `previous`, `next`, `close`, `toggleReplaceMode`, `replaceCurrent`, `replaceAll`
  - option toggles: `caseSensitive`, `wholeWord`, `regex`, `regexI`, `regexM`

## Failure Handling
- Invalid regex:
  - Do not mutate content.
  - Preserve current highlight and selection state.
  - Show non-blocking inline error message.
- No match:
  - Render `0/N`.
  - Disable previous/next/replace actions.

## Security / Privacy
- Search/replace executes fully in local editor memory.
- No telemetry, upload, or persistence of search query/replacement text in this change.

## Observability
- Unit-level assertions for matcher behavior:
  - case toggle on/off behavior
  - whole-word Latin boundary behavior
  - regex valid/invalid flows
- GUI MCP runbooks verify:
  - keybindings (`Ctrl+F`/`Cmd+F`/`Enter`/`Esc`)
  - no-match disabled state
  - minimal-scroll + dual highlight
  - replace-mode default hidden/reset behavior

## Migration / Compatibility
- Backward compatible with existing document format and editor content model.
- No schema or persisted data migration required.

## Requirement Traceability
- R1-R3: shortcut entry + keyboard navigation + close behavior.
- R4-R6: bidirectional traversal + minimal-scroll/highlight + no-match disabled state.
- R7-R8: match options/regex engine + safe error handling.
- R9-R10: replace mode default hidden/reset + iconfont UI alignment.
