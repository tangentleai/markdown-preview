# Validation Bundle Task Card

- change-id: `update-wysiwyg-rendering-and-ux`
- run: `0001`
- task-id: `1.1`
- ref-id: `R1`
- scope: `MIXED`

## Task Goal

Fix WYSIWYG rendering so Markdown horizontal rule syntax (`---`) is represented as `<hr>` in editable DOM and remains semantically stable after markdown round-trip.

## Included Validation Assets

- CLI test assets:
  - `tests/test_cli_hr_rendering.sh`
  - `tests/test_cli_hr_rendering.bat`
- GUI MCP runbook:
  - `tests/gui_runbook_hr_rendering.md`
- Startup provenance log:
  - `logs/worker_startup.txt`

## How To Run

### macOS / Linux

1. Start local service for GUI validation:
   - `auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z/run.sh`
2. Run CLI assertions in a separate terminal:
   - `auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z/tests/test_cli_hr_rendering.sh`
3. Execute MCP GUI verification by following:
   - `auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z/tests/gui_runbook_hr_rendering.md`

### Windows

1. Start local service for GUI validation:
   - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0001__task-1.1__ref-R1__20260221T071726Z\run.bat`
2. Run CLI assertions in a separate terminal:
   - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0001__task-1.1__ref-R1__20260221T071726Z\tests\test_cli_hr_rendering.bat`
3. Execute MCP GUI verification by following:
   - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0001__task-1.1__ref-R1__20260221T071726Z\tests\gui_runbook_hr_rendering.md`

## Inputs / Outputs / Expected

- Inputs:
  - Source files and tests in repo (`src/utils/markdownDocumentModel.ts`, `src/utils/wysiwygBlockInputRules.ts`, related Jest tests).
- Outputs:
  - CLI logs are written to `outputs/cli-hr-rendering.log`.
  - GUI evidence should be captured by Supervisor under `outputs/` and indexed in `logs/`.
- Expected (machine-decidable for CLI):
  - CLI command exits with code `0`.
  - Jest reports passing assertions for:
    - document model includes `horizontalRule` AST node for `---`
    - editable HTML contains `<hr />`
    - block input rule matcher resolves `---` to `horizontal-rule`

## Acceptance Mapping

- ACCEPT: Input `---` in WYSIWYG renders as `<hr>`.
- ACCEPT: Markdown round-trip preserves horizontal rule semantics as `---`.
- TEST (CLI): covered by `tests/test_cli_hr_rendering.*`.
- TEST (GUI): covered by MCP-only runbook `tests/gui_runbook_hr_rendering.md`.
