## ADDED Requirements

### Requirement: Context-Aware Find Entry and Keyboard Navigation
The system SHALL support context-aware find entry in WYSIWYG mode and SHALL provide keyboard-first navigation for match traversal.

#### Scenario: Ctrl+F uses selected text as initial query
- **WHEN** the user selects text in the editor and presses `Ctrl+F` or `Cmd+F`
- **THEN** the find bar opens with the selected text prefilled as the find query
- **AND** the first matching result is activated

#### Scenario: Selected text is normalized as plain text query
- **WHEN** selected content includes multiple lines or markdown markers
- **THEN** the prefilled query uses normalized plain text content
- **AND** markup syntax characters are not treated as formatting commands in this conversion

#### Scenario: Enter moves to next match
- **WHEN** focus is in the find input and the user presses Enter
- **THEN** the active match moves to the next result
- **AND** navigation wraps at document boundaries

#### Scenario: Esc closes find bar
- **WHEN** the find bar is visible and the user presses Esc
- **THEN** the find bar is closed
- **AND** editing focus returns to the WYSIWYG surface

#### Scenario: Esc behavior is consistent across focus targets
- **WHEN** focus is on find input, replace input, or editor surface while find bar is open
- **THEN** pressing Esc closes the find bar in all three focus contexts
- **AND** the editor can continue receiving input immediately after closure

### Requirement: Bidirectional Match Traversal with Visible Positioning
The system SHALL provide next/previous traversal controls and SHALL keep the active match visible with clear highlight feedback.

#### Scenario: Previous and next controls traverse in both directions
- **WHEN** the user activates previous or next traversal controls
- **THEN** the active match moves in the requested direction
- **AND** traversal wraps consistently at the first or last match

#### Scenario: Traversal scrolls to and highlights active match
- **WHEN** the active match changes via previous or next traversal
- **THEN** the editor scrolls only when the active match is outside the viewport
- **AND** all matches remain lightly highlighted while the active match is strongly highlighted

#### Scenario: No-match state disables traversal and replace actions
- **WHEN** no matches are found for the current query
- **THEN** the toolbar displays `0/N` result state
- **AND** previous, next, replace-current, and replace-all actions are disabled

### Requirement: Find/Replace Toolbar Modes and Match Options
The system SHALL provide a default find-only toolbar mode, an explicit replace mode, and configurable match options for case sensitivity, whole-word matching, and regex mode.

#### Scenario: Replace controls are hidden by default and shown in replace mode
- **WHEN** the user opens the search toolbar
- **THEN** only find controls are visible by default
- **AND** replace input plus `Replace Current` and `Replace All` controls appear only after switching to replace mode

#### Scenario: Reopening search returns to default mode
- **WHEN** the user closes the search toolbar and opens it again
- **THEN** the toolbar starts in find-only mode
- **AND** replace controls are hidden until replace mode is explicitly enabled again

#### Scenario: Case-sensitive and whole-word options affect matching
- **WHEN** the user toggles case-sensitive and whole-word options
- **THEN** result counting and active-match traversal update according to the enabled options
- **AND** option effects apply to both find-only and replace mode flows

#### Scenario: Case-sensitive button controls sensitivity explicitly
- **WHEN** the case-sensitive button is off
- **THEN** matching remains case-insensitive regardless of query text
- **AND** enabling the case-sensitive button forces case-sensitive matching

#### Scenario: Whole-word option applies to Latin words only
- **WHEN** whole-word matching is enabled
- **THEN** boundary matching is applied only for Latin word tokens
- **AND** non-Latin scripts are not split with Latin whole-word boundary rules

#### Scenario: Regex mode supports JS options and disables whole-word
- **WHEN** regex mode is enabled
- **THEN** matching uses JavaScript regular expression semantics with `i` and `m` options
- **AND** whole-word matching is disabled while regex mode is active

#### Scenario: Invalid regex input fails safely
- **WHEN** the user enters an invalid regex pattern
- **THEN** the toolbar shows a readable error state without applying replacement
- **AND** editor content and selection state remain unchanged

#### Scenario: Toolbar action buttons use iconfont assets
- **WHEN** the find/replace toolbar is rendered
- **THEN** buttons for previous, next, replace current, replace all, close, case-sensitive, and whole-word use icon assets sourced via the iconfont MCP workflow
- **AND** each icon button remains keyboard-accessible and exposes a readable label for accessibility
