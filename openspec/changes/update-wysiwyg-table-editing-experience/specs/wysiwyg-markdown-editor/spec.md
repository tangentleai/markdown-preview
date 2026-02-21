## ADDED Requirements

### Requirement: Table Floating Toolbar in WYSIWYG Mode
The system SHALL display a floating toolbar above the active table in WYSIWYG mode and SHALL keep the toolbar visible and operable within viewport constraints.

#### Scenario: Toolbar appears and tracks active table
- **WHEN** the user clicks inside a table or keyboard focus enters a table
- **THEN** a table toolbar is shown above that table within 100ms
- **AND** toolbar position updates with scroll/resize without obvious jitter

#### Scenario: Toolbar closes on context exit
- **WHEN** the selection leaves table context, user presses `Esc`, or user clicks outside the editor table region
- **THEN** the toolbar is dismissed
- **AND** focus remains in a valid editable context

### Requirement: Table Size Adjustment with Safe Shrink Semantics
The system SHALL provide a row-column grid control to resize tables, enforce configured limits, and protect non-empty content during shrink operations.

#### Scenario: Grid resize applies new dimensions
- **WHEN** the user confirms a target size from the toolbar grid selector
- **THEN** table rows and columns are resized to the selected dimensions
- **AND** markdown table structure remains valid with aligned header and separator columns

#### Scenario: Shrink with non-empty removed cells requires confirmation
- **WHEN** resize would remove rows or columns containing non-empty content
- **THEN** the system asks for explicit one-time confirmation before applying shrink
- **AND** canceling the confirmation keeps the original table unchanged

#### Scenario: Resize operation is undoable as a single transaction
- **WHEN** a resize operation is applied
- **THEN** undo restores the prior table size and content in one step
- **AND** redo reapplies the same resize result

### Requirement: Table Alignment Persistence and Deletion Consistency
The system SHALL support mutually exclusive table alignment controls and persist alignment in markdown using a table-scoped comment marker.

#### Scenario: Alignment is stored and restored via marker
- **WHEN** the user selects left, center, or right alignment for a table
- **THEN** markdown serialization writes or updates `<!-- table:align=left|center|right -->` immediately before that table
- **AND** reopening the document restores the same alignment state in WYSIWYG

#### Scenario: Deleting table removes associated alignment marker
- **WHEN** the user deletes a table from toolbar action
- **THEN** the table block and its associated alignment marker are removed together
- **AND** focus moves to the previous editable block end, or a new empty paragraph if no previous block exists

### Requirement: Content-Driven Column Width Allocation
The system SHALL compute and apply column widths from table content using min/preferred/max width modeling and container-aware allocation.

#### Scenario: Width allocation expands to use available space
- **WHEN** computed preferred total width is smaller than the available container width
- **THEN** remaining width is distributed across columns by growth potential
- **AND** resulting widths are applied through `<colgroup>` updates

#### Scenario: Width allocation shrinks under constrained space
- **WHEN** computed preferred total width exceeds the container width
- **THEN** columns shrink proportionally by compressible space down to per-column minimum width
- **AND** if minimum widths still overflow, overflow fallback remains enabled

### Requirement: Manual Column Resize in WYSIWYG Tables
The system SHALL allow users to manually resize table columns by dragging column separators and SHALL enforce configured width bounds.

#### Scenario: Dragging separator updates column width within bounds
- **WHEN** the user drags a table column separator handle
- **THEN** the target column width updates in real time
- **AND** resulting width is clamped to a minimum of `48px` and a maximum of `720px`

#### Scenario: Manual resize remains session-local
- **WHEN** one or more columns have been manually resized and the document view is reloaded
- **THEN** manual column widths are not persisted in markdown
- **AND** width calculation returns to content-driven auto-size behavior

#### Scenario: Manual and auto-size strategies cooperate
- **WHEN** auto-size recomputation runs after manual resizing in the same session
- **THEN** manually resized columns keep user-applied widths within bounds
- **AND** non-manual columns continue to follow content-driven allocation

### Requirement: Table Wrapping and Overflow Fallback Cooperation
The system SHALL combine improved cell wrapping behavior with existing horizontal overflow scroll fallback for very wide content.

#### Scenario: Long tokens wrap before forcing overflow
- **WHEN** cells contain long URLs, code fragments, or unbroken tokens
- **THEN** cell styles allow aggressive wrapping to reduce unnecessary column blowout
- **AND** table readability remains acceptable in common viewport sizes

#### Scenario: Horizontal scroll fallback remains available
- **WHEN** content still exceeds available width after wrapping and minimum shrink
- **THEN** existing horizontal scroll container and hint behavior are preserved
- **AND** users can access hidden columns through horizontal scrolling
