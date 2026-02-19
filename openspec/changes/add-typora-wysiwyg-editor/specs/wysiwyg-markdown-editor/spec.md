## ADDED Requirements

### Requirement: Dual-Mode Editing with WYSIWYG Option
The system SHALL preserve the existing dual-pane markdown workflow and SHALL provide a switchable WYSIWYG mode where users edit directly on rendered Markdown content.

#### Scenario: User switches modes without content drift
- **WHEN** a user switches between dual-pane mode and WYSIWYG mode
- **THEN** the underlying document content remains semantically equivalent
- **AND** no unintended markdown structure drift is introduced by the mode transition

#### Scenario: User edits formatted content in WYSIWYG mode
- **WHEN** a user opens or creates a Markdown document
- **THEN** the WYSIWYG mode presents one integrated surface for both reading and editing
- **AND** the user can place the cursor in headings, paragraphs, list items, and quotes to edit inline

### Requirement: Markdown Input Rules and Reversible Transformations
The system SHALL apply deterministic input rules for Markdown triggers and SHALL make each structural transformation reversible by one undo step.

#### Scenario: Heading trigger converts and can be undone
- **WHEN** a user types `#` followed by space at line start
- **THEN** the current block becomes a level-1 heading
- **AND** one undo operation restores the pre-transform plain text state

#### Scenario: List and quote continuation behaviors
- **WHEN** a user presses Enter inside a list item or block quote
- **THEN** the editor continues the corresponding structure
- **AND** pressing Enter on an empty item exits that structure

### Requirement: Markdown Round-Trip Equivalence
The system SHALL preserve structural equivalence for Markdown import, in-editor changes, and Markdown export across repeated open-edit-save cycles.

#### Scenario: Open-edit-save-reopen keeps structure stable
- **WHEN** a user opens a Markdown file, edits it, saves it, and reopens it
- **THEN** headings, list nesting, code fences, tables, links, and images remain structurally equivalent
- **AND** no unintended structure drift is introduced by serialization

### Requirement: Core Markdown Syntax Coverage for MVP
The system SHALL support MVP syntax coverage for block and inline Markdown elements.

#### Scenario: Block-level syntax is parsed and editable
- **WHEN** content contains paragraphs, headings, ordered/unordered lists, block quotes, horizontal rules, fenced code blocks, and basic pipe tables
- **THEN** these structures render correctly and remain editable in place

#### Scenario: Inline syntax is parsed and editable
- **WHEN** content contains bold, italic, inline code, links, and image references
- **THEN** these inline elements render correctly and support cursor movement/edit operations without boundary glitches

#### Scenario: Unsupported advanced syntax is handled safely
- **WHEN** content contains Mermaid, PlantUML, math formulas, or footnote-style extensions
- **THEN** the editor does not crash or corrupt surrounding content
- **AND** unsupported structures remain editable as markdown text or safe fallback blocks in MVP

### Requirement: Marker Visibility Strategy for Readability
The system SHALL provide an MVP marker visibility strategy that reduces visual noise while preserving editability.

#### Scenario: Syntax markers are de-emphasized when unfocused
- **WHEN** the cursor moves away from inline markdown markers (for example `**` and backticks)
- **THEN** markers are visually de-emphasized to improve reading flow
- **AND** markers remain recoverable/editable when the cursor returns

### Requirement: File Operations and Encoding Consistency
The system SHALL support opening, saving, and save-as for `.md` and `.markdown` files using UTF-8 encoding.

#### Scenario: Save output remains compatible with external Markdown tools
- **WHEN** a user saves a document with shortcut or menu actions
- **THEN** the generated file is valid UTF-8 Markdown text
- **AND** external Markdown renderers reproduce the same structure semantics

#### Scenario: MVP uses explicit save workflow
- **WHEN** a user triggers save from menu or shortcut
- **THEN** the system executes the explicit save/save-as workflow for MVP
- **AND** no hidden path migration or resource copy step is required

### Requirement: Essential Editing Productivity Features
The system SHALL provide undo/redo, find/replace, clipboard operations, and baseline editor shortcuts required for MVP authoring.

#### Scenario: Undo and redo include structural edits
- **WHEN** a user performs text edits and automatic structure transforms
- **THEN** undo and redo operate in a predictable sequence including those transforms

#### Scenario: Find and replace updates intended matches
- **WHEN** a user executes find/replace current or replace all
- **THEN** the editor updates only matching targets and keeps document structure valid

#### Scenario: MVP find/replace is plain-text only
- **WHEN** a user performs find/replace in MVP
- **THEN** matching behavior is based on plain text
- **AND** regex-based search/replace is out of scope for MVP

### Requirement: Outline Navigation from Headings
The system SHALL generate and maintain an outline from H1-H6 headings with click-to-jump navigation.

#### Scenario: Outline updates as document changes
- **WHEN** headings are added, removed, or changed
- **THEN** the outline updates within an acceptable interactive delay
- **AND** selecting an outline item positions the editor at the corresponding heading block

### Requirement: Drag-and-Drop Image Insertion
The system SHALL support local image drag-and-drop insertion and generate valid Markdown image references.

#### Scenario: Dropped image is inserted and rendered
- **WHEN** a user drags a local image into the editor
- **THEN** the editor inserts a Markdown image reference
- **AND** the image displays inline in the WYSIWYG surface

#### Scenario: MVP does not auto-copy dropped image assets
- **WHEN** an image is dropped in MVP
- **THEN** the system keeps an explicit markdown image reference workflow
- **AND** automatic copy-to-assets behavior is not required in this change
