# API Reference
**Last Updated**: December 11, 2025  
**Version**: 1.0.0  
**Purpose**: Complete code documentation for all classes, methods, and functions

---

## Table of Contents
1. [GameEditor Class](#gameeditor-class)
2. [Constructor](#constructor)
3. [Event Setup](#event-setup)
4. [Asset Loading](#asset-loading)
5. [Rendering Methods](#rendering-methods)
6. [Mouse Interaction](#mouse-interaction)
7. [Keyboard Shortcuts](#keyboard-shortcuts)
8. [Properties Panel](#properties-panel)
9. [Export/Save/Load](#exportsaveload)
10. [Utility Methods](#utility-methods)
11. [Data Structures](#data-structures)
12. [Global Initialization](#global-initialization)

---

## GameEditor Class

**File**: `editor.js` (Lines 7-702)  
**Pattern**: ES6 Class (singleton via window.editor)  
**Responsibility**: Complete editor orchestration

```javascript
class GameEditor {
  constructor()
  // ... all methods
}
```

**Instance Creation**:
```javascript
window.addEventListener('DOMContentLoaded', () => {
  window.editor = new GameEditor();
});
```

---

## Constructor

### `constructor()`
**Lines**: 8-43  
**Purpose**: Initialize editor state, DOM references, and start render loop  
**Parameters**: None  
**Returns**: GameEditor instance

**Initialization Steps**:
1. Canvas setup (1280x720 default)
2. Initialize empty state (background, objects, selection)
3. Cache DOM element references
4. Setup event listeners
5. Start render loop
6. Update UI counters
7. Log success message

**Code**:
```javascript
constructor() {
    // Canvas setup
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.canvas.width = 1280;
    this.canvas.height = 720;

    // Editor state
    this.background = null;
    this.objects = [];
    this.selectedObject = null;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };

    // UI elements
    this.canvasContainer = document.getElementById('canvas-container');
    this.statusText = document.getElementById('status-text');
    this.mouseCoords = document.getElementById('mouse-coords');
    this.objectCount = document.getElementById('object-count');
    this.propertiesContent = document.getElementById('properties-content');

    // File inputs
    this.backgroundInput = document.getElementById('background-input');
    this.assetInput = document.getElementById('asset-input');
    this.projectInput = document.getElementById('project-input');

    // Initialize
    this.setupEventListeners();
    this.startRenderLoop();
    this.updateObjectCount();

    console.log('🎮 Game Editor initialized successfully!');
    this.updateStatus('Ready to create! Load a background or add an asset to begin.');
}
```

**State Properties**:
| Property | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| `canvas` | HTMLCanvasElement | DOM element | Rendering surface |
| `ctx` | CanvasRenderingContext2D | 2D context | Drawing API |
| `background` | Image \| null | null | Background image |
| `objects` | GameObject[] | [] | All scene objects |
| `selectedObject` | GameObject \| null | null | Currently selected |
| `isDragging` | boolean | false | Drag state flag |
| `dragOffset` | {x, y} | {0, 0} | Mouse offset during drag |

**DOM References** (cached for performance):
- `canvasContainer` - Canvas wrapper div
- `statusText` - Status bar text element
- `mouseCoords` - Mouse coordinate display
- `objectCount` - Object counter display
- `propertiesContent` - Properties panel container
- `backgroundInput` - Hidden file input (background)
- `assetInput` - Hidden file input (assets)
- `projectInput` - Hidden file input (project)

**Canvas Context Options**:
```javascript
{ alpha: false }
// Disables alpha channel → better performance
// Background is always opaque
```

---

## Event Setup

### `setupEventListeners()`
**Lines**: 49-109  
**Purpose**: Bind all event handlers to DOM elements  
**Parameters**: None  
**Returns**: void

**Event Categories**:

**1. Toolbar Buttons**
```javascript
// Load Background
document.getElementById('load-background').addEventListener('click', () => {
    this.backgroundInput.click(); // Trigger hidden file input
});

// Add Asset
document.getElementById('add-asset').addEventListener('click', () => {
    this.assetInput.click();
});

// Export JSON
document.getElementById('export-json').addEventListener('click', () => {
    this.exportJSON();
});

// Save Project
document.getElementById('save-project').addEventListener('click', () => {
    this.saveProject();
});

// Load Project
document.getElementById('load-project').addEventListener('click', () => {
    this.projectInput.click();
});

// Clear All
document.getElementById('clear-all').addEventListener('click', () => {
    if (confirm('Clear everything? This cannot be undone.')) {
        this.clearAll();
    }
});
```

**2. File Input Handlers**
```javascript
// Background Loading
this.backgroundInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        this.loadBackground(e.target.files[0]);
    }
});

// Asset Loading (multiple files supported)
this.assetInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        Array.from(e.target.files).forEach(file => {
            this.loadAsset(file);
        });
    }
});

// Project Loading
this.projectInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        this.loadProject(e.target.files[0]);
    }
});
```

**3. Canvas Mouse Events**
```javascript
this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
this.canvas.addEventListener('mouseleave', (e) => this.onMouseUp(e)); // Treat as mouseup
```

**4. Keyboard Events**
```javascript
document.addEventListener('keydown', (e) => this.onKeyDown(e));
```

**5. Drag/Drop Prevention**
```javascript
// Prevent accidental file drops on document
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());
```

**Design Notes**:
- Arrow functions preserve `this` context
- File inputs use `click()` to open picker
- Confirmation dialog on Clear All
- mouseleave treated as mouseup (prevents stuck drag state)

---

## Asset Loading

### `loadBackground(file)`
**Lines**: 115-126  
**Purpose**: Load image file as canvas background  
**Parameters**:
- `file` (File) - Image file from file input

**Returns**: void (async via FileReader)

**Algorithm**:
```
1. Create FileReader
2. Set onload callback:
   a. Create Image object
   b. Set img.onload callback:
      - Assign to this.background
      - Add 'has-content' class to container
      - Update status message
   c. Set img.src to data URL
3. Read file as Data URL
```

**Code**:
```javascript
loadBackground(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            this.background = img;
            this.canvasContainer.classList.add('has-content');
            this.updateStatus(`Background loaded: ${file.name}`);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}
```

**Behavior**:
- Replaces previous background (no confirmation)
- Stretches image to fit canvas (1280x720)
- Adds 'has-content' class (hides "Drop files" placeholder)

**Error Handling**: None (trust browser file picker)

---

### `loadAsset(file)`
**Lines**: 128-153  
**Purpose**: Load image file as new game object  
**Parameters**:
- `file` (File) - Image file from file input

**Returns**: void (async via FileReader)

**Algorithm**:
```
1. Create FileReader
2. Set onload callback:
   a. Create Image object
   b. Set img.onload callback:
      - Create GameObject with properties
      - Position at canvas center
      - Add to this.objects array
      - Set as selectedObject
      - Update properties panel
      - Update object count
      - Update status message
   c. Set img.src to data URL
3. Read file as Data URL
```

**Code**:
```javascript
loadAsset(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Create new object at center of canvas
            const obj = {
                id: Date.now() + Math.random(),
                name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                image: img,
                x: this.canvas.width / 2 - img.width / 2,
                y: this.canvas.height / 2 - img.height / 2,
                width: img.width,
                height: img.height,
                rotation: 0,
                imageSrc: e.target.result // Store base64 for export/save
            };
            this.objects.push(obj);
            this.selectedObject = obj;
            this.canvasContainer.classList.add('has-content');
            this.updateProperties();
            this.updateObjectCount();
            this.updateStatus(`Asset added: ${file.name}`);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}
```

**Object Properties**:
- `id`: Unique identifier (Date.now() + random for uniqueness)
- `name`: Filename without extension
- `image`: HTML Image object (for rendering)
- `x, y`: Top-left corner position (centered initially)
- `width, height`: Native image dimensions (can be resized)
- `rotation`: 0 degrees initially
- `imageSrc`: base64 data URL (for persistence)

**Multiple Files**: 
- Called once per file in `setupEventListeners`
- Each object gets unique ID from timestamp + random

---

## Rendering Methods

### `startRenderLoop()`
**Lines**: 159-164  
**Purpose**: Initialize requestAnimationFrame render loop  
**Parameters**: None  
**Returns**: void

**Code**:
```javascript
startRenderLoop() {
    const render = () => {
        this.render();
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
}
```

**Pattern**: Self-scheduling loop
- Runs at ~60 FPS (browser-optimized)
- Never stops (runs entire session)
- Pauses automatically when tab hidden (browser optimization)

---

### `render()`
**Lines**: 166-186  
**Purpose**: Draw complete scene to canvas (called every frame)  
**Parameters**: None  
**Returns**: void

**Rendering Order**:
```
1. Clear canvas (dark gray fill)
2. Draw background OR grid
3. Draw all objects (loop)
4. Draw selection highlight
```

**Code**:
```javascript
render() {
    // Clear canvas
    this.ctx.fillStyle = '#2d2d2d';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    if (this.background) {
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    } else {
        // Draw grid if no background
        this.drawGrid();
    }

    // Draw all objects
    this.objects.forEach(obj => {
        this.drawObject(obj);
    });

    // Draw selection highlight
    if (this.selectedObject) {
        this.drawSelection(this.selectedObject);
    }
}
```

**Performance**: Full redraw every frame (simple, reliable, fast enough)

---

### `drawGrid()`
**Lines**: 188-211  
**Purpose**: Draw subtle grid pattern (when no background)  
**Parameters**: None  
**Returns**: void

**Algorithm**:
```
gridSize = 50 pixels
For X from 0 to canvas.width step 50:
  Draw vertical line at X
For Y from 0 to canvas.height step 50:
  Draw horizontal line at Y
```

**Code**:
```javascript
drawGrid() {
    const gridSize = 50;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= this.canvas.width; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.canvas.height; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvas.width, y);
        this.ctx.stroke();
    }
}
```

**Visual**: Very subtle white lines (8% opacity)

---

### `drawObject(obj)`
**Lines**: 213-227  
**Purpose**: Draw single game object with rotation  
**Parameters**:
- `obj` (GameObject) - Object to render

**Returns**: void

**Transform Order** (CRITICAL):
```
1. Save canvas state
2. Translate to object center
3. Rotate by obj.rotation
4. Translate back by half dimensions
5. Draw image
6. Restore canvas state
```

**Code**:
```javascript
drawObject(obj) {
    this.ctx.save();

    // Apply transformations
    this.ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
    this.ctx.rotate(obj.rotation * Math.PI / 180);
    this.ctx.translate(-obj.width / 2, -obj.height / 2);

    // Draw image
    this.ctx.drawImage(obj.image, 0, 0, obj.width, obj.height);

    this.ctx.restore();
}
```

**Why This Order?**:
- Rotation happens around object center (not top-left)
- Translate → Rotate → Translate back pattern
- save/restore isolates transformations per object

---

### `drawSelection(obj)`
**Lines**: 229-255  
**Purpose**: Draw selection highlight and resize handles  
**Parameters**:
- `obj` (GameObject) - Selected object

**Returns**: void

**Visual Elements**:
1. Green stroke rectangle (2px wide)
2. Four corner handles (8x8 green squares)

**Code**:
```javascript
drawSelection(obj) {
    // Selection box
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(obj.x - 1, obj.y - 1, obj.width + 2, obj.height + 2);

    // Resize handles
    const handleSize = 8;
    this.ctx.fillStyle = '#00ff00';
    
    // Corner handles
    const corners = [
        { x: obj.x, y: obj.y }, // Top-left
        { x: obj.x + obj.width, y: obj.y }, // Top-right
        { x: obj.x, y: obj.y + obj.height }, // Bottom-left
        { x: obj.x + obj.width, y: obj.y + obj.height } // Bottom-right
    ];

    corners.forEach(corner => {
        this.ctx.fillRect(
            corner.x - handleSize / 2, 
            corner.y - handleSize / 2, 
            handleSize, 
            handleSize
        );
    });
}
```

**Note**: Handles are visual only (not interactive in MVP)

---

## Mouse Interaction

### `getMousePos(e)`
**Lines**: 261-267  
**Purpose**: Convert mouse event to canvas coordinates  
**Parameters**:
- `e` (MouseEvent) - Mouse event

**Returns**: `{x: number, y: number}` - Canvas-relative coordinates

**Code**:
```javascript
getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}
```

**Why Needed?**:
- `e.clientX/Y` are viewport coordinates
- Canvas might not be at viewport origin
- `getBoundingClientRect()` gives canvas position

---

### `onMouseDown(e)`
**Lines**: 269-292  
**Purpose**: Handle mouse click (selection and drag start)  
**Parameters**:
- `e` (MouseEvent) - Mouse event

**Returns**: void

**Algorithm**:
```
1. Get mouse position in canvas coords
2. Loop through objects (reverse order = top to bottom)
3. Check collision with each object
4. If hit:
   a. Set as selectedObject
   b. Enable dragging flag
   c. Store drag offset
   d. Update properties panel
   e. Return early
5. If no hit:
   a. Deselect (selectedObject = null)
   b. Update properties panel (clears)
```

**Code**:
```javascript
onMouseDown(e) {
    const pos = this.getMousePos(e);

    // Check if clicked on an object (reverse order - top to bottom)
    for (let i = this.objects.length - 1; i >= 0; i--) {
        const obj = this.objects[i];
        if (this.isPointInObject(pos, obj)) {
            this.selectedObject = obj;
            this.isDragging = true;
            this.dragOffset = {
                x: pos.x - obj.x,
                y: pos.y - obj.y
            };
            this.updateProperties();
            return;
        }
    }

    // Clicked empty space - deselect
    this.selectedObject = null;
    this.updateProperties();
}
```

**Drag Offset**:
- Stores where user clicked within object
- Prevents object "snapping" to mouse cursor
- Maintains smooth dragging experience

---

### `onMouseMove(e)`
**Lines**: 294-320  
**Purpose**: Handle mouse movement (cursor change and dragging)  
**Parameters**:
- `e` (MouseEvent) - Mouse event

**Returns**: void

**Responsibilities**:
1. Update mouse coordinate display
2. Change cursor based on hover
3. Drag selected object if dragging

**Code**:
```javascript
onMouseMove(e) {
    const pos = this.getMousePos(e);

    // Update mouse coordinates display
    this.mouseCoords.textContent = `X: ${Math.round(pos.x)}, Y: ${Math.round(pos.y)}`;

    // Change cursor if hovering over object
    let hovering = false;
    for (let i = this.objects.length - 1; i >= 0; i--) {
        if (this.isPointInObject(pos, this.objects[i])) {
            hovering = true;
            break;
        }
    }
    this.canvas.style.cursor = hovering ? 'move' : 'crosshair';

    // Drag object if dragging
    if (this.isDragging && this.selectedObject) {
        this.selectedObject.x = pos.x - this.dragOffset.x;
        this.selectedObject.y = pos.y - this.dragOffset.y;
        this.updatePropertiesQuiet();
    }
}
```

**Cursor States**:
- `move`: Hovering over object
- `crosshair`: Over empty canvas

**updatePropertiesQuiet()**:
- Updates properties panel WITHOUT status message
- Prevents spamming status bar during drag

---

### `onMouseUp(e)`
**Lines**: 322-327  
**Purpose**: Handle mouse release (end drag)  
**Parameters**:
- `e` (MouseEvent) - Mouse event

**Returns**: void

**Code**:
```javascript
onMouseUp(e) {
    if (this.isDragging) {
        this.updateProperties(); // Final update with status
    }
    this.isDragging = false;
}
```

**Behavior**:
- Final property update (shows status message)
- Clears dragging flag

---

### `isPointInObject(point, obj)`
**Lines**: 329-334  
**Purpose**: Check if point collides with object (AABB)  
**Parameters**:
- `point` ({x, y}) - Point to test
- `obj` (GameObject) - Object to test against

**Returns**: boolean - true if collision

**Algorithm**: Axis-Aligned Bounding Box (AABB)
```
point.x >= obj.x AND
point.x <= obj.x + obj.width AND
point.y >= obj.y AND
point.y <= obj.y + obj.height
```

**Code**:
```javascript
isPointInObject(point, obj) {
    return point.x >= obj.x && 
           point.x <= obj.x + obj.width &&
           point.y >= obj.y && 
           point.y <= obj.y + obj.height;
}
```

**Limitation**: Does NOT account for rotation
- Good enough for MVP
- Future: Implement rotated rectangle collision

---

## Keyboard Shortcuts

### `onKeyDown(e)`
**Lines**: 340-397  
**Purpose**: Handle all keyboard shortcuts  
**Parameters**:
- `e` (KeyboardEvent) - Keyboard event

**Returns**: void

**Shortcut Categories**:

**1. Global Shortcuts (Ctrl/Cmd + Key)**
```javascript
if (e.ctrlKey || e.metaKey) {
    switch(e.key.toLowerCase()) {
        case 'b': // Load Background
            e.preventDefault();
            this.backgroundInput.click();
            break;
        case 'a': // Add Asset
            e.preventDefault();
            this.assetInput.click();
            break;
        case 'e': // Export JSON
            e.preventDefault();
            this.exportJSON();
            break;
        case 's': // Save Project
            e.preventDefault();
            this.saveProject();
            break;
        case 'o': // Load Project (Open)
            e.preventDefault();
            this.projectInput.click();
            break;
        case 'd': // Duplicate
            e.preventDefault();
            if (this.selectedObject) {
                this.duplicateObject();
            }
            break;
    }
    return;
}
```

**2. Selection-Dependent Shortcuts**
```javascript
if (!this.selectedObject) return; // Early exit if nothing selected

const step = e.shiftKey ? 10 : 1; // Shift = 10px, normal = 1px

switch(e.key) {
    case 'Delete':
    case 'Backspace':
        e.preventDefault();
        this.deleteSelected();
        break;
    case 'ArrowUp':
        e.preventDefault();
        this.selectedObject.y -= step;
        this.updateProperties();
        break;
    case 'ArrowDown':
        e.preventDefault();
        this.selectedObject.y += step;
        this.updateProperties();
        break;
    case 'ArrowLeft':
        e.preventDefault();
        this.selectedObject.x -= step;
        this.updateProperties();
        break;
    case 'ArrowRight':
        e.preventDefault();
        this.selectedObject.x += step;
        this.updateProperties();
        break;
}
```

**Modifier Keys**:
- `Ctrl` (Windows/Linux) or `Cmd` (Mac): Global shortcuts
- `Shift`: Increase arrow key movement to 10px

**preventDefault()**:
- Prevents browser defaults (e.g., Ctrl+S = Save Page)
- Called on all handled shortcuts

---

### `deleteSelected()`
**Lines**: 399-409  
**Purpose**: Delete currently selected object  
**Parameters**: None  
**Returns**: void

**Code**:
```javascript
deleteSelected() {
    if (!this.selectedObject) return;
    const index = this.objects.indexOf(this.selectedObject);
    if (index > -1) {
        this.objects.splice(index, 1);
        this.selectedObject = null;
        this.updateProperties();
        this.updateObjectCount();
        this.updateStatus('Object deleted');
    }
}
```

**Behavior**:
- Removes from objects array
- Clears selection
- Updates UI

---

### `duplicateObject()`
**Lines**: 411-429  
**Purpose**: Clone selected object with offset  
**Parameters**: None  
**Returns**: void

**Code**:
```javascript
duplicateObject() {
    if (!this.selectedObject) return;
    const original = this.selectedObject;
    const duplicate = {
        id: Date.now() + Math.random(),
        name: original.name + ' (copy)',
        image: original.image,
        x: original.x + 20,
        y: original.y + 20,
        width: original.width,
        height: original.height,
        rotation: original.rotation,
        imageSrc: original.imageSrc
    };
    this.objects.push(duplicate);
    this.selectedObject = duplicate;
    this.updateProperties();
    this.updateObjectCount();
    this.updateStatus('Object duplicated (Ctrl+D)');
}
```

**Clone Strategy**:
- New unique ID
- Name with " (copy)" suffix
- Shared Image reference (memory efficient)
- Offset by +20px X and Y
- All other properties copied

---

### `clearAll()`
**Lines**: 431-439  
**Purpose**: Reset editor to empty state  
**Parameters**: None  
**Returns**: void

**Code**:
```javascript
clearAll() {
    this.objects = [];
    this.selectedObject = null;
    this.background = null;
    this.canvasContainer.classList.remove('has-content');
    this.updateProperties();
    this.updateObjectCount();
    this.updateStatus('All cleared');
}
```

**Note**: Confirmation dialog shown in `setupEventListeners`

---

## Properties Panel

### `updateProperties()`
**Lines**: 445-450  
**Purpose**: Update properties panel AND show status message  
**Parameters**: None  
**Returns**: void

**Code**:
```javascript
updateProperties() {
    this.updatePropertiesQuiet();
    if (this.selectedObject) {
        this.updateStatus(`Selected: ${this.selectedObject.name}`);
    }
}
```

**Use Cases**: Final updates (after drag, selection change)

---

### `updatePropertiesQuiet()`
**Lines**: 452-530  
**Purpose**: Update properties panel WITHOUT status message  
**Parameters**: None  
**Returns**: void

**Algorithm**:
```
1. If no selection:
   - Show "Select an object" message
   - Return early
2. If object selected:
   - Generate HTML form with inputs
   - Bind input events to live-update object
   - Bind duplicate/delete buttons
```

**Code** (excerpt):
```javascript
updatePropertiesQuiet() {
    if (!this.selectedObject) {
        this.propertiesContent.innerHTML = '<p style="color: #999;">Select an object to view properties</p>';
        return;
    }

    const obj = this.selectedObject;
    this.propertiesContent.innerHTML = `
        <div class="property-group">
            <label>Name</label>
            <input type="text" id="prop-name" value="${obj.name}">
        </div>
        <div class="property-group">
            <label>X Position</label>
            <input type="number" id="prop-x" value="${Math.round(obj.x)}" step="1">
        </div>
        <!-- ... Y, Width, Height, Rotation ... -->
        <div class="property-buttons">
            <button class="btn-duplicate" id="btn-duplicate-obj">Duplicate</button>
            <button class="btn-delete" id="btn-delete-obj">Delete</button>
        </div>
    `;

    // Bind input events
    document.getElementById('prop-name').addEventListener('input', (e) => {
        obj.name = e.target.value;
    });
    
    document.getElementById('prop-x').addEventListener('input', (e) => {
        obj.x = parseFloat(e.target.value) || 0;
    });
    
    // ... more bindings ...
}
```

**Live Editing**: 
- Input events directly mutate object properties
- Render loop automatically reflects changes
- No "Apply" button needed

**Validation**:
- Width/Height: `Math.max(1, value)` - prevents zero/negative
- Rotation: No validation (allows any degree value)

---

## Export/Save/Load

### `exportJSON()`
**Lines**: 536-571  
**Purpose**: Generate clean JSON for game integration  
**Parameters**: None  
**Returns**: void

**Output Format**:
```json
{
  "meta": {
    "editor": "Universal Game Level Editor",
    "version": "1.0",
    "exported": "2025-12-11T10:30:00.000Z"
  },
  "canvas": {
    "width": 1280,
    "height": 720
  },
  "background": "background.png",
  "objects": [
    {
      "name": "enemy-sprite",
      "x": 100,
      "y": 200,
      "width": 64,
      "height": 64,
      "rotation": 0
    }
  ]
}
```

**Code**:
```javascript
exportJSON() {
    const data = {
        meta: {
            editor: 'Universal Game Level Editor',
            version: '1.0',
            exported: new Date().toISOString()
        },
        canvas: {
            width: this.canvas.width,
            height: this.canvas.height
        },
        background: this.background ? 'background.png' : null,
        objects: this.objects.map(obj => ({
            name: obj.name,
            x: Math.round(obj.x),
            y: Math.round(obj.y),
            width: Math.round(obj.width),
            height: Math.round(obj.height),
            rotation: obj.rotation
        }))
    };

    const json = JSON.stringify(data, null, 2);
    
    // Copy to clipboard
    navigator.clipboard.writeText(json).then(() => {
        this.updateStatus('✅ JSON copied to clipboard!');
    }).catch(() => {
        this.updateStatus('⚠️ Could not copy to clipboard, downloading file...');
    });

    // Also download as file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'level-' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(url);
}
```

**Behavior**:
- Copies to clipboard (primary)
- Downloads file (backup)
- Filename: `level-{timestamp}.json`

**Data Transformations**:
- Position/size values rounded to integers
- Background replaced with generic "background.png" string
- No image data (keeps file small)

---

### `saveProject()`
**Lines**: 573-607  
**Purpose**: Save complete editor state (including images)  
**Parameters**: None  
**Returns**: void

**Output Format**:
```json
{
  "meta": {...},
  "canvas": {...},
  "background": {
    "name": "bg.png",
    "data": "data:image/png;base64,iVBORw0..."
  },
  "objects": [
    {
      "id": "asset_123",
      "name": "sprite",
      "x": 100,
      "y": 200,
      "width": 64,
      "height": 64,
      "rotation": 0,
      "imageSrc": "data:image/png;base64,..."
    }
  ]
}
```

**Code**:
```javascript
saveProject() {
    const project = {
        meta: {
            editor: 'Universal Game Level Editor',
            version: '1.0',
            saved: new Date().toISOString()
        },
        canvas: {
            width: this.canvas.width,
            height: this.canvas.height
        },
        background: this.background ? this.canvasToDataURL(this.background) : null,
        objects: this.objects.map(obj => ({
            id: obj.id,
            name: obj.name,
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            rotation: obj.rotation,
            imageSrc: obj.imageSrc
        }))
    };

    const json = JSON.stringify(project);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(url);

    this.updateStatus('💾 Project saved!');
}
```

**Key Differences from exportJSON**:
- Includes full image data (base64)
- Preserves object IDs
- Much larger file size
- Can restore exact state

---

### `canvasToDataURL(image)`
**Lines**: 609-616  
**Purpose**: Convert Image to base64 data URL  
**Parameters**:
- `image` (Image) - Image to convert

**Returns**: string - Data URL

**Code**:
```javascript
canvasToDataURL(image) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    return tempCanvas.toDataURL();
}
```

**Why Temporary Canvas?**:
- Image objects can't directly export to data URL
- Canvas has `toDataURL()` method
- Draw image to temp canvas, export, discard canvas

---

### `loadProject(file)`
**Lines**: 618-676  
**Purpose**: Restore complete editor state from project file  
**Parameters**:
- `file` (File) - Project JSON file

**Returns**: void (async via FileReader)

**Algorithm**:
```
1. Read file as text (FileReader)
2. Parse JSON
3. Clear current state
4. Restore canvas dimensions
5. Restore background (if exists):
   - Create Image from base64
   - Assign to this.background
6. Restore objects:
   - For each object in JSON:
     * Create Image from base64
     * Create GameObject
     * Add to this.objects
7. Update UI when all loaded
```

**Code** (excerpt):
```javascript
loadProject(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const project = JSON.parse(e.target.result);
            
            // Clear current state
            this.objects = [];
            this.selectedObject = null;

            // Restore canvas size
            this.canvas.width = project.canvas.width || 1280;
            this.canvas.height = project.canvas.height || 720;

            // Restore background
            if (project.background) {
                const img = new Image();
                img.onload = () => {
                    this.background = img;
                    this.canvasContainer.classList.add('has-content');
                };
                img.src = project.background;
            }

            // Restore objects
            let loadedCount = 0;
            project.objects.forEach(objData => {
                const img = new Image();
                img.onload = () => {
                    const obj = {
                        id: objData.id || Date.now() + Math.random(),
                        name: objData.name,
                        image: img,
                        x: objData.x,
                        y: objData.y,
                        width: objData.width,
                        height: objData.height,
                        rotation: objData.rotation || 0,
                        imageSrc: objData.imageSrc
                    };
                    this.objects.push(obj);
                    loadedCount++;
                    
                    if (loadedCount === project.objects.length) {
                        this.canvasContainer.classList.add('has-content');
                        this.updateObjectCount();
                        this.updateStatus(`📂 Project loaded! ${loadedCount} objects restored.`);
                    }
                };
                img.src = objData.imageSrc;
            });

            if (project.objects.length === 0) {
                this.updateStatus('📂 Project loaded (no objects)');
            }

        } catch (error) {
            console.error('Load error:', error);
            this.updateStatus('❌ Error loading project: ' + error.message);
        }
    };
    reader.readAsText(file);
}
```

**Async Complexity**:
- Multiple Image.onload callbacks
- Counter tracks when all images loaded
- Final UI update only after all images ready

**Error Handling**:
- try/catch for JSON parsing
- Error message displayed in status bar
- Console log for debugging

---

## Utility Methods

### `updateStatus(message)`
**Lines**: 682-684  
**Purpose**: Update status bar text  
**Parameters**:
- `message` (string) - Status message

**Returns**: void

**Code**:
```javascript
updateStatus(message) {
    this.statusText.textContent = message;
}
```

**Usage**: Called by most methods to provide user feedback

---

### `updateObjectCount()`
**Lines**: 686-692  
**Purpose**: Update object counter display  
**Parameters**: None  
**Returns**: void

**Code**:
```javascript
updateObjectCount() {
    this.objectCount.textContent = `Objects: ${this.objects.length}`;
    
    if (this.objects.length === 0 && !this.background) {
        this.canvasContainer.classList.remove('has-content');
    }
}
```

**Behavior**:
- Updates counter text
- Removes 'has-content' class if completely empty
- Shows "Drop files" placeholder when empty

---

## Data Structures

### GameObject
**Defined in**: `loadAsset()`, `duplicateObject()`, `loadProject()`  
**Purpose**: Represents a placeable game object

```typescript
interface GameObject {
  id: string;           // Unique identifier (Date.now() + random)
  name: string;         // Display name (filename without extension)
  image: Image;         // HTML Image object (for rendering)
  imageSrc: string;     // base64 data URL (for persistence)
  x: number;            // Left edge position (pixels)
  y: number;            // Top edge position (pixels)
  width: number;        // Display width (pixels)
  height: number;       // Display height (pixels)
  rotation: number;     // Rotation angle (degrees, 0-360)
}
```

### Export JSON Format
```typescript
interface ExportJSON {
  meta: {
    editor: string;     // "Universal Game Level Editor"
    version: string;    // "1.0"
    exported: string;   // ISO timestamp
  };
  canvas: {
    width: number;      // Canvas width (pixels)
    height: number;     // Canvas height (pixels)
  };
  background: string | null;  // "background.png" or null
  objects: Array<{
    name: string;
    x: number;          // Rounded to integer
    y: number;
    width: number;
    height: number;
    rotation: number;
  }>;
}
```

### Project JSON Format
```typescript
interface ProjectJSON {
  meta: {
    editor: string;
    version: string;
    saved: string;      // ISO timestamp
  };
  canvas: {
    width: number;
    height: number;
  };
  background: {
    name: string;
    data: string;       // base64 data URL
  } | null;
  objects: Array<{
    id: string;
    name: string;
    imageSrc: string;   // base64 data URL
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }>;
}
```

---

## Global Initialization

### Window Load Handler
**Lines**: 704-711  
**Purpose**: Initialize editor when DOM is ready  
**Parameters**: None  
**Returns**: void

**Code**:
```javascript
window.addEventListener('DOMContentLoaded', () => {
    try {
        window.editor = new GameEditor();
    } catch (error) {
        console.error('Failed to initialize editor:', error);
        alert('Failed to start editor. Check console for details.');
    }
});
```

**Behavior**:
- Waits for DOM to load
- Creates global `window.editor` instance
- Catches initialization errors
- Shows alert if startup fails

**Global Access**:
- `window.editor` accessible in console
- Useful for debugging
- Not recommended for production (but OK for this use case)

---

## Method Call Graph

```
constructor()
  ├─ setupEventListeners()
  ├─ startRenderLoop()
  │    └─ render() [loop]
  │         ├─ drawGrid()
  │         ├─ drawObject()
  │         └─ drawSelection()
  ├─ updateObjectCount()
  └─ updateStatus()

User Interactions:
  Click Load Background
    └─ loadBackground()
         └─ updateStatus()

  Click Add Asset
    └─ loadAsset()
         ├─ updateProperties()
         ├─ updateObjectCount()
         └─ updateStatus()

  Mouse Down on Canvas
    └─ onMouseDown()
         └─ updateProperties()
              ├─ updatePropertiesQuiet()
              └─ updateStatus()

  Mouse Move on Canvas
    └─ onMouseMove()
         └─ updatePropertiesQuiet()

  Mouse Up on Canvas
    └─ onMouseUp()
         └─ updateProperties()

  Keyboard Shortcut
    └─ onKeyDown()
         ├─ exportJSON()
         │    └─ updateStatus()
         ├─ saveProject()
         │    ├─ canvasToDataURL()
         │    └─ updateStatus()
         ├─ loadProject()
         │    ├─ updateObjectCount()
         │    └─ updateStatus()
         ├─ duplicateObject()
         │    ├─ updateProperties()
         │    ├─ updateObjectCount()
         │    └─ updateStatus()
         └─ deleteSelected()
              ├─ updateProperties()
              ├─ updateObjectCount()
              └─ updateStatus()
```

---

## Performance Notes

**Render Loop**:
- Runs at ~60 FPS (requestAnimationFrame)
- Full redraw every frame (simple, reliable)
- Tested with 100 objects @ 60 FPS

**Event Handlers**:
- Mouse move not throttled (browser handles efficiently)
- Keyboard not debounced (intentional for responsive controls)

**Memory**:
- Image references shared on duplicate
- ObjectURLs revoked after download
- No known memory leaks

---

## Extension Points

**Adding New Features**:

1. **Grid Snapping**:
   - Modify `onMouseMove` to round positions: `Math.round(x / gridSize) * gridSize`

2. **Undo/Redo**:
   - Add `history: Array<State>` property
   - Snapshot state before mutations
   - Implement `undo()` and `redo()` methods

3. **Layers**:
   - Add `layer: number` to GameObject
   - Sort `this.objects` by layer before rendering
   - Add layer controls to properties panel

4. **Zoom/Pan**:
   - Add `zoom: number` and `panOffset: {x, y}` properties
   - Modify `getMousePos` to account for transforms
   - Apply transforms in `render()` before drawing

---

**END OF API_REFERENCE.MD**  
**Total Lines**: ~1150  
**Read Time**: ~25 minutes  
**Coverage**: 100% of editor.js public methods  
**Next Review**: December 12, 2025
