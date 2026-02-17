---
description: Scaffold a new OpenSpec change and validate strictly.
---
The user has requested the following change proposal. Use the openspec instructions to create their change proposal.
<UserRequest>
  $ARGUMENTS
</UserRequest>
<!-- OPENSPEC:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `openspec/AGENTS.md` (located inside the `openspec/` directory—run `ls openspec` or `openspec update` if you don't see it) if you need additional OpenSpec conventions or clarifications.
- Identify any vague or ambiguous details and ask the necessary follow-up questions before editing files.
- Do not write any code during the proposal stage. Only create design documents (proposal.md, tasks.md, design.md, and spec deltas). Implementation happens in the apply stage after approval.

**Steps**
1. Review `openspec/project.md`, run `openspec list` and `openspec list --specs`, and inspect related code or docs (e.g., via `rg`/`ls`) to ground the proposal in current behaviour; note any gaps that require clarification.
2. Choose a unique verb-led `change-id` and scaffold `proposal.md`, `tasks.md`, and `design.md` (when needed) under `openspec/changes/<id>/`.
3. Map the change into concrete capabilities or requirements, breaking multi-scope efforts into distinct spec deltas with clear relationships and sequencing.
4. Capture architectural reasoning in `design.md` when the solution spans multiple systems, introduces new patterns, or demands trade-off discussion before committing to specs.
5. Draft spec deltas in `changes/<id>/specs/<capability>/spec.md` (one folder per capability) using `## ADDED|MODIFIED|REMOVED Requirements` with at least one `#### Scenario:` per requirement and cross-reference related capabilities when relevant.
6. Draft `tasks.md` as an ordered list of small, verifiable work items that deliver user-visible progress, include validation (tests, tooling), and highlight dependencies or parallelizable work.
- When drafting `openspec/changes/<id>/tasks.md`, you MUST follow:
  - `openspec/project.md` → `## tasks.md Checklist Format` (canonical; do not invent a parallel format).

- Hard gate reminders (do not expand here; see canonical spec above):
  - Every task MUST include `ACCEPT:` and `TEST:`.
  - Every checkbox task line MUST include EXACTLY ONE `[#R<n>]` token, unique across the file.
  - `TEST:` MUST include `SCOPE: CLI|GUI|MIXED` and MUST enable a human-reproducible validation bundle
    (all bundle rules + role split + evidence rules live ONLY in `openspec/project.md`).

  - Role split (mandatory; see `openspec/project.md` → “Validation bundle requirements”):
    - Worker produces bundle assets only; Supervisor executes and records PASS/FAIL evidence.

  - GUI/MIXED constraint (mandatory; see `openspec/project.md` → “CLI/GUI/MIXED validation requirements”):
    - GUI verification must be driven via MCP service `playwright-mcp` and evidence must be archived; do NOT use any browser automation scripts (Python/Node/Playwright test runner).
7. Validate with `openspec validate <id> --strict --no-interactive` and resolve every issue before sharing the proposal.

**Reference**
- Use `openspec show <id> --json --deltas-only` or `openspec show <spec> --type spec` to inspect details when validation fails.
- Search existing requirements with `rg -n "Requirement:|Scenario:" openspec/specs` before writing new ones.
- Explore the codebase with `rg <keyword>`, `ls`, or direct file reads so proposals align with current implementation realities.
<!-- OPENSPEC:END -->
