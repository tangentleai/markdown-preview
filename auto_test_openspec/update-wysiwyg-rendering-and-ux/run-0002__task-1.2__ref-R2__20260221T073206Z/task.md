# Task Validation Bundle (RUN #2)

- change-id: `update-wysiwyg-rendering-and-ux`
- run#: `0002`
- task-id: `1.2`
- ref-id: `R2`
- scope: `MIXED`

## Task Target

Implement only task `1.2 [#R2]`: fix math rendering in WYSIWYG, support standard LaTeX syntax (including `\[ ... \]` and `\( ... \)`), and fallback to raw LaTeX text when render fails.

## How To Run

- macOS/Linux (GUI service only):
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0002__task-1.2__ref-R2__20260221T073206Z/run.sh`
- Windows (GUI service only):
  - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0002__task-1.2__ref-R2__20260221T073206Z\run.bat`
- CLI validation script:
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0002__task-1.2__ref-R2__20260221T073206Z/tests/test_cli_math_rendering.sh`

## Test Assets

- CLI test: `tests/test_cli_math_rendering.sh`
- GUI MCP runbook: `tests/gui_runbook_math_rendering.md`
- startup log: `logs/worker_startup.txt`
- CLI output log: `outputs/cli-math-rendering.log`
- GUI evidence target directory (Supervisor writes): `outputs/screenshots/`

## Inputs / Outputs

- Inputs: embedded test markdown fixtures inside `src/__tests__/markdownDocumentModel.test.ts`
- Outputs:
  - CLI: Jest output log at `outputs/cli-math-rendering.log`
  - GUI: screenshot artifacts and notes recorded by Supervisor under `outputs/screenshots/` and `logs/`

## Expected Results (Machine-Decidable + MCP Assertions)

- CLI checks (`tests/test_cli_math_rendering.sh`) MUST verify:
  - `npm test -- markdownDocumentModel.test.ts` exits with code `0`
  - log contains benchmark formula render test title:
    - `should render benchmark block LaTeX formula with \\[...\\] delimiters`
  - log contains invalid formula fallback test title:
    - `should fallback to raw LaTeX text when block formula render fails`
  - log contains inline standard syntax test title:
    - `should parse and render inline \\(...\\) math syntax`

- GUI checks MUST be executed only through MCP runbook:
  - `tests/gui_runbook_math_rendering.md`
  - Assertions include successful benchmark rendering across desktop/mobile widths and invalid formula raw-text fallback without surrounding content corruption.

## Hard Rules

- For MIXED scope, `run.sh` and `run.bat` are start-server only and MUST NOT run validation commands.
- GUI verification must be MCP-driven from `tests/gui_runbook_math_rendering.md` (no executable browser automation scripts in this bundle).
