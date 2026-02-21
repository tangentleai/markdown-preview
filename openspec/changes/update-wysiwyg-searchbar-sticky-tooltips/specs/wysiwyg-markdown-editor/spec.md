## ADDED Requirements

### Requirement: Sticky Search Bar Visibility in WYSIWYG
The system SHALL keep the WYSIWYG search bar visible at the top while the user scrolls long document content.

#### Scenario: Search bar remains visible during page scroll
- **WHEN** the user opens search in a long WYSIWYG document and scrolls downward
- **THEN** the search bar remains pinned at the top edge of the editor container
- **AND** the user can continue search actions without scrolling back to the original toolbar position

#### Scenario: Sticky behavior preserves natural layout expansion
- **WHEN** sticky visibility is enabled for the search bar
- **THEN** the editor content layout remains naturally expanded with page-level scrolling
- **AND** no fixed-height internal scrolling container is introduced for editor content

#### Scenario: Sticky behavior remains usable on mainstream browsers
- **WHEN** the editor runs on mainstream browser versions
- **THEN** sticky positioning keeps equivalent visible behavior for the search bar
- **AND** degraded behavior (if any) does not block search interactions

### Requirement: Search Session Reset on Close
The system SHALL reset transient search/replace session state when the search bar is closed.

#### Scenario: Closing search clears inputs and toggles
- **WHEN** the user closes the search bar using close action or `Esc`
- **THEN** find query and replace input values are cleared
- **AND** case-sensitive, whole-word, and regex toggles return to their default off state

#### Scenario: Closing search clears full transient session state
- **WHEN** the user closes the search bar after performing navigation, highlighting, or invalid-regex attempts
- **THEN** active match index, result counter, regex error message, and match highlights are cleared
- **AND** replace mode returns to default find-only mode

#### Scenario: Reopening starts from clean initial state
- **WHEN** the user reopens the search bar after closure
- **THEN** the toolbar appears in default find mode
- **AND** no previous session text or toggle state is carried over

### Requirement: Regex Toggle Iconization and Unified Hover Tooltips
The system SHALL represent regex toggle as an icon button and SHALL provide consistent hover tooltip labels for all search-toolbar icon actions.

#### Scenario: Regex toggle uses icon button with accessible name
- **WHEN** the search toolbar is rendered
- **THEN** regex mode control is displayed as an icon button instead of a text button
- **AND** the control exposes accessibility label `正则模式` and preserves regex toggle behavior

#### Scenario: Icon buttons show consistent hover tooltips
- **WHEN** the user hovers any icon button in the search toolbar
- **THEN** a tooltip label for that action is displayed
- **AND** tooltip background color, border radius, and font size are consistent across all icon buttons

#### Scenario: Tooltips are available for keyboard focus and mobile long-press
- **WHEN** the user navigates to an icon button via keyboard focus or triggers long-press on mobile
- **THEN** the same action tooltip is displayed for that control
- **AND** tooltip semantics remain consistent with mouse-hover behavior
