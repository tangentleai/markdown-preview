## ADDED Requirements

### Requirement: Horizontal Rule Rendering Consistency in WYSIWYG
The system SHALL render Markdown horizontal rule syntax (`---`) as a visible horizontal rule in WYSIWYG mode and SHALL preserve semantic round-trip consistency.

#### Scenario: Triple hyphen renders as horizontal rule
- **WHEN** the user inputs a standalone line containing `---` in WYSIWYG mode
- **THEN** the editor renders a horizontal rule block
- **AND** the markdown serialization remains semantically equivalent to horizontal rule syntax

### Requirement: Standards-Compliant Math Formula Rendering
The system SHALL render standard LaTeX math syntax in WYSIWYG mode for both block and inline formulas and SHALL fail safely when formulas are invalid.

#### Scenario: Given benchmark formula renders correctly
- **WHEN** the user inserts `\[\text{MOM}_{i,t} = \frac{P_{i,t-1}}{P_{i,t-1-N}} - 1\]`
- **THEN** the formula is rendered correctly without escaping artifacts
- **AND** the rendered output remains legible across supported screen sizes

#### Scenario: Invalid formula does not corrupt surrounding content
- **WHEN** a formula contains invalid LaTeX syntax
- **THEN** the editor shows the original LaTeX source text for that formula block
- **AND** surrounding document content remains editable and unchanged

#### Scenario: Existing math engine may be upgraded if required
- **WHEN** the benchmark formula cannot be rendered correctly by the current math engine
- **THEN** the implementation replaces the engine with a more complete compatible alternative
- **AND** existing valid formula rendering behavior remains backward compatible

### Requirement: Interactive Math Editing with Monaco Mount Lifecycle
The system SHALL support click-to-edit math formulas by mounting a Monaco editor above the formula and SHALL keep editor text and rendered formula synchronized in real time.

#### Scenario: Click formula mounts Monaco and syncs preview
- **WHEN** the user clicks a rendered math formula
- **THEN** a Monaco editor is mounted above that formula using the established mount lifecycle
- **AND** updating editor text updates the rendered formula in real time

#### Scenario: Only one Monaco instance is active
- **WHEN** the user clicks another formula while one formula editor is already open
- **THEN** the previous Monaco instance is dismissed before mounting the new one
- **AND** only one active Monaco instance exists at any time

#### Scenario: Dismiss restores editor focus flow
- **WHEN** the user dismisses math editing via outside click, escape key, or mode change
- **THEN** the Monaco instance is unmounted cleanly
- **AND** focus is restored to the WYSIWYG document context without losing formula content

### Requirement: Overflow-Aware Table Container with Horizontal Scroll Hint
The system SHALL detect table overflow in WYSIWYG mode and SHALL wrap overflow tables in a horizontal scroll container with visible affordance.

#### Scenario: Wide table is wrapped in horizontal scroll container
- **WHEN** a rendered table width exceeds the current editor viewport width
- **THEN** the table is wrapped in a horizontal scroll container
- **AND** horizontal scrolling is available without breaking vertical scrolling within table content

#### Scenario: Horizontal overflow hint reflects scroll state
- **WHEN** the table is wider than the viewport
- **THEN** the UI displays an icon hint that horizontal content exists
- **AND** the hint updates when the user scrolls to the far edge

### Requirement: Readable Multi-Line Outline Titles with Hierarchy Clarity
The system SHALL display long outline titles with automatic line wrapping and SHALL preserve heading level indentation for structural readability.

#### Scenario: Long heading wraps instead of truncating
- **WHEN** an outline item title exceeds one line
- **THEN** the title wraps to multiple lines with a maximum of 3 visible lines
- **AND** line height and spacing keep the item readable and clickable

#### Scenario: Hierarchy remains clear for wrapped titles
- **WHEN** wrapped titles exist across multiple heading levels
- **THEN** level-based indentation remains visually distinguishable
- **AND** users can still recognize document structure at a glance

### Requirement: Responsive WYSIWYG Layout Proportion and Drag-Resize Coupling
The system SHALL provide a left-aligned outline panel and a centered editing content area with proportional default width, and SHALL synchronize content layout when outline width is drag-resized.

#### Scenario: Default layout achieves centered proportional reading area
- **WHEN** WYSIWYG mode is opened on a supported desktop viewport
- **THEN** the outline panel is aligned tightly to the left edge
- **AND** the main content area is centered with a target width of 68% of the editor viewport

#### Scenario: Dragging outline width updates editor area in real time
- **WHEN** the user drags the outline width handle
- **THEN** outline width changes within configured min/max bounds
- **AND** the editor content width and horizontal position update synchronously
- **AND** width state is not persisted to local storage between sessions

#### Scenario: Mobile viewport uses drawer outline behavior
- **WHEN** the editor is viewed on a mobile breakpoint
- **THEN** the outline panel is presented as a drawer interaction
- **AND** the editing area remains centered and usable without permanent outline occupation

#### Scenario: Focus styling avoids blue highlight frame in edit mode
- **WHEN** the editor enters focused editing state
- **THEN** the blue highlight frame is not displayed
- **AND** focus remains visible via a light shadow styling across responsive breakpoints

### Requirement: Formula Editing Performance Budget
The system SHALL keep formula editing interactions within the defined main-thread performance budget during continuous input.

#### Scenario: Continuous formula typing stays under long-task threshold
- **WHEN** the user continuously edits formula content in WYSIWYG mode
- **THEN** formula rendering is debounce-controlled
- **AND** observed main-thread long tasks remain below 50ms under the defined validation dataset
