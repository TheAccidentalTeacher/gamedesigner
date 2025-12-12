# Architecture Documentation
**Last Updated**: December 11, 2025  
**Version**: 1.0.0  
**Purpose**: System design, data flow, and architectural decisions

---

## Table of Contents
1. [High-Level Architecture](#high-level-architecture)
2. [Component Overview](#component-overview)
3. [Data Flow](#data-flow)
4. [State Management](#state-management)
5. [Rendering Pipeline](#rendering-pipeline)
6. [Event System](#event-system)
7. [File I/O Architecture](#file-io-architecture)
8. [Memory Management](#memory-management)
9. [Design Decisions](#design-decisions)
10. [Performance Considerations](#performance-considerations)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│  ┌───────────┬──────────────────┬─────────────────────────┐ │
│  │  Toolbar  │  Canvas Viewport │  Properties Panel       │ │
│  │  (Buttons)│  (Rendering)     │  (Live Editing)         │ │
│  └───────────┴──────────────────┴─────────────────────────┘ │
│                          ↓                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              GameEditor Class (Controller)             │  │
│  │  - Event Handlers                                      │  │
│  │  - State Management                                    │  │
│  │  - Rendering Loop                                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Data Layer                            │  │
│  │  - background: Image                                   │  │
│  │  - objects: Array<GameObject>                          │  │
│  │  - selectedObject: GameObject | null                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Browser APIs                              │  │
│  │  - Canvas 2D Context                                   │  │
│  │  - FileReader API                                      │  │
│  │  - Clipboard API                                       │  │
│  │  - localStorage                                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Architecture Pattern**: MVC-inspired monolithic class
- **Model**: `this.background`, `this.objects`, state properties
- **View**: Canvas rendering + DOM manipulation
- **Controller**: Event handlers + business logic

**Why Monolithic?**: 
- Simple mental model for AI comprehension
- All code in one place (editor.js)
- No module system needed
- Easy to debug and trace execution

---

## Component Overview

### 1. HTML Structure (`index.html`)
```
<body>
  <div class="container">
    <nav class="toolbar">        ← Action buttons
    <div class="workspace">
      <div class="canvas-wrapper">
        <canvas id="canvas">     ← Main rendering surface
      </div>
      <aside class="properties"> ← Live property editing
    </div>
    <footer class="status-bar">  ← Status + mouse coords
  </div>
  <input type="file" hidden>     ← File pickers (3x)
</body>
```

**Key Design Choices**:
- Semantic HTML5 elements
- Hidden file inputs (triggered programmatically)
- CSS Grid for layout (not flexbox)
- No JavaScript templating - direct DOM manipulation

### 2. Styling System (`style.css`)
```
CSS Variables (--bg-primary, --text-primary, etc.)
   ↓
Global Reset + Base Styles
   ↓
Layout Grid (toolbar + workspace + status-bar)
   ↓
Component Styles (buttons, inputs, panels)
   ↓
Utility Classes (.hidden, .disabled)
```

**Design System**:
- Dark theme: `#1e1e1e` (VS Code-inspired)
- Brand color: `#007acc` (blue accent)
- 60px toolbar, flexible workspace, 30px status bar
- Fixed 320px properties panel width

### 3. JavaScript Engine (`editor.js`)
```javascript
GameEditor Class
├── Constructor (initialize state + DOM references)
├── setupEventListeners() (bind all events)
├── startRenderLoop() (requestAnimationFrame)
│
├── File Loading
│   ├── loadBackground(file)
│   └── loadAsset(file)
│
├── Rendering
│   ├── render() (main loop)
│   ├── drawGrid()
│   ├── drawObject(obj)
│   └── drawSelection(obj)
│
├── Interaction
│   ├── onMouseDown(e)
│   ├── onMouseMove(e)
│   ├── onMouseUp(e)
│   └── onKeyDown(e)
│
├── Properties
│   ├── updateProperties()
│   └── updatePropertiesQuiet()
│
├── Persistence
│   ├── exportJSON()
│   ├── saveProject()
│   └── loadProject(file)
│
└── Utilities
    ├── updateStatus(msg)
    ├── updateObjectCount()
    ├── duplicateObject()
    ├── deleteSelected()
    └── clearAll()
```

---

## Data Flow

### User Action → State Change → Render

#### Example 1: Loading an Asset
```
User clicks "Add Asset" button
   ↓
File picker opens (assetInput.click())
   ↓
User selects image file(s)
   ↓
'change' event fires
   ↓
loadAsset(file) called
   ↓
FileReader reads file as Data URL
   ↓
Image object created, onload fires
   ↓
GameObject created with properties
   ↓
Added to this.objects array
   ↓
this.selectedObject = new object
   ↓
updateProperties() called
   ↓
updateObjectCount() called
   ↓
updateStatus() called
   ↓
Next render() cycle draws new object
```

#### Example 2: Dragging an Object
```
User clicks on object
   ↓
onMouseDown(e) fires
   ↓
isPointInObject() checks collision
   ↓
this.selectedObject = clicked object
   ↓
this.isDragging = true
   ↓
this.dragOffset = {x, y} stored
   ↓
User moves mouse
   ↓
onMouseMove(e) fires continuously
   ↓
if (isDragging) → update object.x, object.y
   ↓
updatePropertiesQuiet() updates panel
   ↓
Render loop draws object at new position
   ↓
User releases mouse
   ↓
onMouseUp(e) fires
   ↓
this.isDragging = false
   ↓
updateProperties() final update
```

#### Example 3: Exporting JSON
```
User presses Ctrl+E
   ↓
onKeyDown(e) catches event
   ↓
exportJSON() called
   ↓
Data object constructed:
  - meta (editor info, timestamp)
  - canvas (width, height)
  - background (filename or null)
  - objects (array of positions/sizes)
   ↓
JSON.stringify(data, null, 2)
   ↓
navigator.clipboard.writeText(json)
   ↓
Blob created from JSON string
   ↓
ObjectURL created from Blob
   ↓
Temporary <a> element created
   ↓
download attribute set → triggers download
   ↓
ObjectURL revoked (cleanup)
   ↓
updateStatus('✅ JSON copied!')
```

---

## State Management

### Core State Properties (this.*)

```javascript
// Canvas references
this.canvas: HTMLCanvasElement        // <canvas> element
this.ctx: CanvasRenderingContext2D    // 2D drawing context

// Editor state
this.background: Image | null         // Background image
this.objects: GameObject[]            // Array of all objects
this.selectedObject: GameObject | null // Currently selected
this.isDragging: boolean              // Drag state flag
this.dragOffset: {x: number, y: number} // Mouse offset during drag

// DOM element references
this.canvasContainer: HTMLElement
this.statusText: HTMLElement
this.mouseCoords: HTMLElement
this.objectCount: HTMLElement
this.propertiesContent: HTMLElement
this.backgroundInput: HTMLInputElement
this.assetInput: HTMLInputElement
this.projectInput: HTMLInputElement
```

### GameObject Structure
```javascript
{
  id: string,           // "asset_1702345678901" (Date.now() + random)
  name: string,         // "enemy-sprite" (filename without extension)
  image: Image,         // HTML Image object (for rendering)
  imageSrc: string,     // base64 data URL (for export/save)
  x: number,            // Left edge position (pixels)
  y: number,            // Top edge position (pixels)
  width: number,        // Display width (pixels)
  height: number,       // Display height (pixels)
  rotation: number      // Rotation in degrees (0-360)
}
```

### State Transitions

**Empty State** → Background Loaded
```javascript
this.background = null
   ↓ loadBackground(file)
this.background = Image
this.canvasContainer.classList.add('has-content')
```

**No Selection** → Object Selected
```javascript
this.selectedObject = null
   ↓ onMouseDown(e) [clicks object]
this.selectedObject = GameObject
updateProperties() → shows property panel
```

**Idle** → Dragging
```javascript
this.isDragging = false
   ↓ onMouseDown(e) [on selected object]
this.isDragging = true
this.dragOffset = {x, y}
   ↓ onMouseMove(e) [multiple times]
object.x += delta, object.y += delta
   ↓ onMouseUp(e)
this.isDragging = false
```

### State Validation Rules
1. `selectedObject` must exist in `objects` array (or be null)
2. `objects` array never contains duplicates (by reference)
3. `background` is either null or valid Image object
4. All GameObjects must have valid `image` property
5. Canvas dimensions must be positive integers

---

## Rendering Pipeline

### Main Loop (60 FPS target)
```javascript
startRenderLoop() {
  const render = () => {
    this.render();              // Draw frame
    requestAnimationFrame(render); // Schedule next frame
  };
  requestAnimationFrame(render);   // Start loop
}
```

### Frame Rendering Sequence
```
1. Clear canvas (fill with #2d2d2d)
   ↓
2. Draw background (if exists)
   OR
   Draw grid (if no background)
   ↓
3. Draw all objects (loop this.objects)
   - For each object:
     * Save canvas state
     * Translate to object center
     * Rotate by object.rotation
     * Draw image
     * Restore canvas state
   ↓
4. Draw selection highlight (if selectedObject)
   - Green stroke rectangle
   - Corner resize handles (8x8 green squares)
   ↓
5. Frame complete → wait for next requestAnimationFrame
```

### Transform Order (Critical!)
```javascript
// CORRECT ORDER (current implementation):
ctx.save()
ctx.translate(obj.x + obj.width/2, obj.y + obj.height/2)  // Move to center
ctx.rotate(obj.rotation * Math.PI / 180)                  // Rotate
ctx.translate(-obj.width/2, -obj.height/2)                // Move back
ctx.drawImage(obj.image, 0, 0, obj.width, obj.height)
ctx.restore()

// WHY: Rotation happens around object center, not top-left corner
```

### Coordinate Systems

**Screen Coordinates** (mouse events):
- Origin: Top-left of canvas element
- getMousePos(e) converts clientX/Y to canvas-relative

**Canvas Coordinates** (drawing):
- Origin: Top-left of canvas (0, 0)
- Positive X → Right, Positive Y → Down

**Object Coordinates**:
- (x, y) = top-left corner of object
- Center = (x + width/2, y + height/2)
- Rotation applied around center point

### Grid Drawing Algorithm
```javascript
gridSize = 50  // pixels
for (x = 0 to canvasWidth step 50)
  drawVerticalLine(x, 0, canvasHeight)
for (y = 0 to canvasHeight step 50)
  drawHorizontalLine(0, y, canvasWidth)
```

**Grid Visibility**:
- Only shown when no background loaded
- Subtle: `rgba(255,255,255,0.08)`
- Helps with object placement

---

## Event System

### Event Flow Architecture

```
Browser Event
   ↓
addEventListener callback
   ↓
GameEditor method (e.g., onMouseDown)
   ↓
State mutation (e.g., this.selectedObject = obj)
   ↓
UI update (e.g., updateProperties())
   ↓
Status message (e.g., updateStatus('Selected'))
   ↓
Next render cycle reflects changes
```

### Mouse Event Handling

**Event Chain**:
1. `mousedown` → Check collision → Set selection → Start drag
2. `mousemove` → Update cursor → Update object position (if dragging) → Update coords display
3. `mouseup` → End drag → Final property update
4. `mouseleave` → Treat as mouseup (prevent stuck drag state)

**Collision Detection**:
```javascript
isPointInObject(point, obj) {
  return point.x >= obj.x && 
         point.x <= obj.x + obj.width &&
         point.y >= obj.y && 
         point.y <= obj.y + obj.height;
}
// Simple AABB (Axis-Aligned Bounding Box)
// Does NOT account for rotation (good enough for MVP)
```

**Object Selection Priority**:
- Loop through objects in REVERSE order (top to bottom)
- First collision wins (objects rendered last are "on top")

### Keyboard Event Handling

**Global Shortcuts** (Ctrl/Cmd + Key):
- Always active, regardless of selection
- Prevent default to avoid browser shortcuts
- Examples: Ctrl+B (background), Ctrl+E (export)

**Selection-Dependent Shortcuts**:
- Only active when `this.selectedObject !== null`
- Arrow keys: Move 1px (or 10px with Shift)
- Delete/Backspace: Remove object

**Event Prevention Strategy**:
```javascript
if (e.ctrlKey || e.metaKey) {
  e.preventDefault();  // Prevent browser shortcut
  // Handle custom shortcut
}
```

### File Input Events

**Flow**:
```
Button click → fileInput.click() → File picker opens
   ↓
User selects file(s)
   ↓
'change' event fires
   ↓
e.target.files[0] accessed
   ↓
FileReader reads as Data URL
   ↓
onload callback processes result
```

**Multiple File Support**:
- Assets: `Array.from(e.target.files).forEach(loadAsset)`
- Background: Single file only
- Project: Single file only

---

## File I/O Architecture

### FileReader API (Input)

**Pattern**:
```javascript
const reader = new FileReader();
reader.onload = (e) => {
  const dataURL = e.target.result; // "data:image/png;base64,..."
  const img = new Image();
  img.onload = () => {
    // Image is ready to use
  };
  img.src = dataURL;
};
reader.readAsDataURL(file);
```

**Why Data URLs?**:
- No server needed
- Works offline
- Can be stored in JSON (project save)
- Can be embedded in export
- Browser handles decoding

### Blob API (Output)

**Export JSON**:
```javascript
const blob = new Blob([jsonString], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'filename.json';
a.click();
URL.revokeObjectURL(url); // Cleanup
```

**Why Blob + ObjectURL?**:
- Standard download mechanism
- Works in all modern browsers
- Auto-cleanup prevents memory leaks

### Clipboard API

**Copy to Clipboard**:
```javascript
navigator.clipboard.writeText(json)
  .then(() => success())
  .catch(() => fallback());
```

**Browser Compatibility**:
- Chrome 66+, Firefox 63+, Safari 13.1+
- Requires HTTPS (or localhost)
- May fail in older browsers → fallback to download only

### Export Format Design

**Level JSON** (for games):
```json
{
  "meta": {...},           // Editor info, timestamp
  "canvas": {...},         // Canvas dimensions
  "background": "file.png", // Filename reference
  "objects": [             // Object positions
    {"name": "...", "x": 100, "y": 200, ...}
  ]
}
```

**Project JSON** (for editor):
```json
{
  "meta": {...},
  "canvas": {...},
  "background": {
    "name": "file.png",
    "data": "data:image/png;base64,..." // Full image data
  },
  "objects": [
    {
      "id": "...", 
      "name": "...", 
      "imageSrc": "data:image/...",    // Full image data
      "x": 100, ...
    }
  ]
}
```

**Key Difference**:
- Level JSON: Small, game-ready, references files
- Project JSON: Large, complete state, includes images

---

## Memory Management

### Image Handling

**Storage Locations**:
1. `GameObject.image` (Image) - for rendering
2. `GameObject.imageSrc` (string) - base64 data URL
3. `this.background` (Image) - background reference

**Memory Footprint** (approximate):
- Image object: ~500KB (average sprite)
- Base64 string: ~700KB (33% overhead from encoding)
- Total per asset: ~1.2MB in memory

**Duplication Strategy**:
- `duplicateObject()` reuses same Image reference
- Only base64 string is duplicated
- Saves memory, shares pixel data

### Canvas State

**State Stack**:
```javascript
ctx.save()    // Push current state to stack
  // Apply transformations
  // Draw
ctx.restore() // Pop state from stack
```

**Why Save/Restore?**:
- Isolates transformations per object
- Prevents cumulative rotation/translation
- Cleans up automatically

**Performance Cost**:
- Minimal (browser-optimized)
- Only saves transform matrix, not pixel data

### Garbage Collection

**Automatic Cleanup**:
- Removed objects: `objects.splice(index, 1)` → GC collects
- No manual `delete` needed
- Image references released automatically

**Manual Cleanup**:
- ObjectURLs: `URL.revokeObjectURL(url)` after download
- Event listeners: Removed when element removed from DOM

---

## Design Decisions

### Why No Framework?

**Rationale**:
- Zero dependencies = zero maintenance burden
- Faster initial load (no framework overhead)
- Easier for AI to understand (no abstractions)
- Simpler deployment (just 3 files)
- Offline-capable by default

**Trade-offs**:
- Manual DOM manipulation (verbose)
- No reactive data binding
- More imperative code
- Limited scalability (OK for this scope)

### Why Canvas Over SVG?

**Rationale**:
- Better performance for many objects (bitmap vs vector)
- Simpler coordinate system (no viewBox complications)
- Easier image manipulation (drawImage API)
- requestAnimationFrame-friendly

**Trade-offs**:
- No DOM elements for objects (can't inspect in DevTools)
- Manual hit detection (no automatic event targets)
- Fixed resolution (can't zoom indefinitely)

### Why Monolithic Class?

**Rationale**:
- Simple mental model (one file, one class)
- Easy to trace execution flow
- No module system needed
- All state in one place

**Trade-offs**:
- 638-line file (large but manageable)
- Violates Single Responsibility (intentionally)
- Harder to unit test (would need refactoring)

### Why Data URLs for Images?

**Rationale**:
- No server required
- Complete portability (project file is self-contained)
- Works offline
- Simple serialization (JSON-friendly)

**Trade-offs**:
- Large file sizes (33% overhead from base64)
- Slow for huge images
- Can hit localStorage limits

---

## Performance Considerations

### Rendering Optimization

**Current Strategy**: Redraw everything every frame
- Simple and reliable
- No state tracking needed
- 60 FPS with <100 objects

**Why Not Dirty Rectangle?**:
- Added complexity
- Marginal benefit for this use case
- Premature optimization

### Event Handler Optimization

**Mouse Move Throttling**: None currently
- Browser handles natively (passive events)
- 60 FPS sufficient for smooth dragging
- Could add throttling if needed: `requestAnimationFrame(updatePosition)`

### File Loading

**Async Operations**:
- FileReader: Non-blocking (onload callback)
- Image loading: Non-blocking (img.onload)
- Multiple files: Load in parallel (forEach)

**No Loading Indicators** (MVP decision):
- Images typically load fast (<1 second)
- Could add progress bar in future

### localStorage Limits

**Typical Limits**: 5-10MB per domain
- Project with 10 sprites: ~7MB
- May hit limit with many large images
- Future: Compression or IndexedDB

---

## Extensibility Points

### Adding New Features (Minimal Changes)

**Grid Snapping**:
- Modify `onMouseMove` to round positions: `Math.round(x / gridSize) * gridSize`

**Undo/Redo**:
- Add `history` array
- Store state snapshots before mutations
- Implement `undo()` / `redo()` methods

**Layers**:
- Add `layer` property to GameObject
- Sort objects by layer before rendering
- Add layer controls to properties panel

**Zoom/Pan**:
- Add `zoom` and `panOffset` state
- Modify `getMousePos` to account for zoom/pan
- Apply transformations in `render()` before drawing

### Plugin Architecture (Future)

**Potential Hooks**:
```javascript
// Hypothetical plugin system
GameEditor.plugins = [];
GameEditor.registerPlugin({
  name: "GridSnapping",
  onMouseMove: (editor, pos) => { /* snap logic */ },
  onRender: (editor, ctx) => { /* draw grid */ }
});
```

**Not Implemented**: MVP doesn't need plugins

---

## Testing Architecture

**Current Approach**: Manual testing
- Critical path checklist (see TESTING_PROTOCOL.md)
- Browser matrix testing
- No automated tests

**Why No Automated Tests?**:
- MVP scope doesn't justify test infrastructure
- Canvas testing is non-trivial (pixel comparison)
- Manual testing sufficient for current complexity

**If Adding Tests** (future):
- Jest for unit tests (pure functions)
- Playwright for E2E (full browser automation)
- Canvas snapshot testing (regression detection)

---

## Security Architecture

**Threat Model**: Low risk (client-side only)

**No Server** → No server-side attacks
**No Database** → No SQL injection
**No Authentication** → No credential theft
**No Network Requests** → No MITM attacks

**Client-Side Risks**:
- XSS: Mitigated by no `innerHTML` usage
- File uploads: Limited to user's own files
- localStorage: Contains no sensitive data

**Content Security Policy** (compatible):
```
default-src 'self'; 
img-src 'self' data:; 
script-src 'self';
```

---

## Future Architecture Considerations

### If Application Grows...

**Modularization** (at ~2000 lines):
- Split GameEditor into multiple classes
- Use ES6 modules (type="module")
- Maintain single-file build option

**State Management** (if state becomes complex):
- Implement Redux-like pattern
- Immutable state updates
- Time-travel debugging

**Testing** (if automated tests needed):
- Extract pure functions first
- Mock Canvas API for unit tests
- E2E tests for integration

**Backend** (if collaboration needed):
- WebSocket for real-time sync
- Operational Transform for conflict resolution
- But keep offline mode!

---

## Diagram: Complete Data Flow

```
USER ACTION
   ↓
┌──────────────────────────────────────────┐
│           EVENT HANDLER                  │
│  (Mouse, Keyboard, File Input)           │
└──────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────┐
│         STATE MUTATION                   │
│  this.objects.push(...)                  │
│  this.selectedObject = ...               │
│  this.background = ...                   │
└──────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────┐
│          UI UPDATE                       │
│  updateProperties()                      │
│  updateObjectCount()                     │
│  updateStatus()                          │
└──────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────┐
│        RENDER CYCLE                      │
│  render() draws entire scene             │
│  (triggered by requestAnimationFrame)    │
└──────────────────────────────────────────┘
   ↓
SCREEN UPDATES (60 FPS)
```

---

**END OF ARCHITECTURE.MD**  
**Total Lines**: ~710  
**Read Time**: ~15 minutes  
**Cross-References**: AI_CONTEXT.md, API_REFERENCE.md  
**Next Review**: December 12, 2025
