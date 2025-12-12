# Adding Features Workflow
**Last Updated**: December 11, 2025  
**Version**: 1.0.0  
**Purpose**: Step-by-step guide for implementing new features

---

## Before You Start

### Read These First
1. [`AI_CONTEXT.md`](../ai/AI_CONTEXT.md) - Project philosophy
2. [`ARCHITECTURE.md`](../technical/ARCHITECTURE.md) - System design
3. [`API_REFERENCE.md`](../technical/API_REFERENCE.md) - Code documentation

### Ask These Questions
1. **Is this in the critical 1%?** - MVP philosophy
2. **Does the user actually need this?** - Real vs imagined requirement
3. **Can this be simpler?** - Always prefer simplicity
4. **Will this complicate the codebase?** - Cost-benefit analysis

### MVP Principle
> "Don't build the Death Star when you need a speeder bike."

**Default Answer**: Don't build it unless explicitly requested.

---

## Feature Addition Workflow

### Phase 1: Planning (Before Writing Code)

**Step 1: Understand the Request**
```
[ ] Read user's request completely
[ ] Identify the core problem being solved
[ ] Check if existing features can solve this
[ ] Ask clarifying questions if ambiguous
```

**Step 2: Consult the Fellowship**
```
[ ] Shadowstep (Marketing): How does this help users?
[ ] Skytalon (UX): What's the user experience impact?
[ ] Ironpaw (Technical): What's the implementation complexity?
[ ] Sage (Game Design): Does this fit the vision?
[ ] DM: Synthesize perspectives and decide
```

**Step 3: Design the Feature**
```
[ ] Write a one-paragraph description
[ ] List affected files (index.html, style.css, editor.js)
[ ] Identify data structure changes (if any)
[ ] Sketch the user interaction flow
[ ] Estimate lines of code (keep it small!)
```

**Step 4: Check Documentation**
```
[ ] Does this feature already exist? (Check API_REFERENCE)
[ ] Will this change architecture? (Document in ARCHITECTURE.md)
[ ] Does this affect data flow? (Update diagrams)
```

---

### Phase 2: Implementation

**Step 1: Update Documentation FIRST**
```
[ ] Update ARCHITECTURE.md with design changes
[ ] Add method signatures to API_REFERENCE.md
[ ] Update AI_CONTEXT.md if new concepts added
[ ] Document expected behavior before implementing
```

**Why Document First?**
- Clarifies thinking before coding
- Prevents scope creep
- Makes implementation faster
- Ensures documentation stays current

**Step 2: Implement in Small Increments**

**Increment 1: Data Structure** (if needed)
```
[ ] Add new properties to GameObject or state
[ ] Update constructor initialization
[ ] Test that app still works (no errors)
[ ] Commit: "Add data structure for [feature]"
```

**Increment 2: UI Elements** (if needed)
```
[ ] Add HTML elements to index.html
[ ] Add CSS styles to style.css
[ ] Test visual appearance
[ ] Commit: "Add UI for [feature]"
```

**Increment 3: Core Logic**
```
[ ] Add new methods to GameEditor class
[ ] Implement minimal working version
[ ] Test basic functionality
[ ] Commit: "Implement [feature] core logic"
```

**Increment 4: Integration**
```
[ ] Wire up event listeners
[ ] Connect to existing systems
[ ] Test complete workflow
[ ] Commit: "Integrate [feature] with editor"
```

**Increment 5: Polish**
```
[ ] Add keyboard shortcuts (if applicable)
[ ] Add status messages
[ ] Handle edge cases
[ ] Test thoroughly
[ ] Commit: "Polish [feature]"
```

**Step 3: Testing**
```
[ ] Test happy path (normal usage)
[ ] Test edge cases (empty state, max objects, etc.)
[ ] Test in all browsers (Chrome, Firefox, Safari, Edge)
[ ] Test keyboard shortcuts
[ ] Test with real assets (images of various sizes)
```

See [`TESTING_PROTOCOL.md`](./TESTING_PROTOCOL.md) for complete checklist.

---

### Phase 3: Documentation

**Step 1: Update Code Documentation**
```
[ ] Add JSDoc comments to new methods
[ ] Update inline comments
[ ] Add code examples to API_REFERENCE.md
[ ] Document parameters and return values
```

**Step 2: Update Architecture Docs**
```
[ ] Update ARCHITECTURE.md data flow diagrams
[ ] Add new method to call graph
[ ] Document design decisions
[ ] Update performance notes (if applicable)
```

**Step 3: Update User Documentation**
```
[ ] Add to README.md feature list
[ ] Update keyboard shortcuts table
[ ] Add usage examples
[ ] Update screenshots (if UI changed)
```

**Step 4: Update Changelog**
```
[ ] Add entry to CHANGELOG.md
[ ] Format: "### Added - [Feature name]"
[ ] Include usage example
[ ] Link to related documentation
```

**Step 5: Update AI Context**
```
[ ] Update AI_CONTEXT.md current state
[ ] Move feature from "What Doesn't Exist" to "What Exists"
[ ] Update quick start guide if needed
```

---

### Phase 4: Deployment

**Step 1: Final Checks**
```
[ ] All tests passing
[ ] No console errors
[ ] All documentation updated
[ ] CHANGELOG entry added
[ ] Code committed
```

**Step 2: Git Commit**
```bash
git add .
git commit -m "[Type]: [Feature name]

- Detailed description
- Breaking changes (if any)
- Related issues (if any)"

# Types: feat, fix, docs, style, refactor, test, chore
```

**Step 3: Push to GitHub**
```bash
git push origin main
```

**Step 4: Verify Netlify Deployment**
```
[ ] Check Netlify dashboard for build status
[ ] Wait ~30 seconds for deployment
[ ] Test deployed version
[ ] Verify feature works on live site
```

**Step 5: Announce (if major feature)**
```
[ ] Update README.md with new capabilities
[ ] Document any breaking changes
[ ] Update version number (if using semantic versioning)
```

---

## Example Workflows

### Example 1: Grid Snapping Toggle

**Planning**:
```
Feature: Toggle grid snapping on/off
User Problem: Hard to align objects precisely
Affected Files: editor.js, index.html, style.css
Complexity: Low (30 lines of code)
```

**Implementation Steps**:

1. **Data Structure**:
```javascript
// Add to constructor
this.gridSnap = false;
this.gridSize = 50;
```

2. **UI**:
```html
<!-- Add to toolbar -->
<button id="toggle-snap">Grid Snap: OFF</button>
```

3. **Logic**:
```javascript
// Add method
toggleGridSnap() {
    this.gridSnap = !this.gridSnap;
    document.getElementById('toggle-snap').textContent = 
        `Grid Snap: ${this.gridSnap ? 'ON' : 'OFF'}`;
    this.updateStatus(`Grid snap ${this.gridSnap ? 'enabled' : 'disabled'}`);
}

// Modify onMouseMove
if (this.isDragging && this.selectedObject) {
    let x = pos.x - this.dragOffset.x;
    let y = pos.y - this.dragOffset.y;
    
    if (this.gridSnap) {
        x = Math.round(x / this.gridSize) * this.gridSize;
        y = Math.round(y / this.gridSize) * this.gridSize;
    }
    
    this.selectedObject.x = x;
    this.selectedObject.y = y;
    this.updatePropertiesQuiet();
}
```

4. **Event Binding**:
```javascript
// Add to setupEventListeners
document.getElementById('toggle-snap').addEventListener('click', () => {
    this.toggleGridSnap();
});
```

5. **Documentation**:
- Update API_REFERENCE.md with `toggleGridSnap()` method
- Update ARCHITECTURE.md with grid snap logic
- Add keyboard shortcut (Ctrl+G) if desired
- Update CHANGELOG.md

---

### Example 2: Undo/Redo System

**Planning**:
```
Feature: Undo/Redo for object changes
User Problem: Can't fix mistakes easily
Affected Files: editor.js
Complexity: Medium (100-150 lines)
Design Pattern: Command pattern with history stack
```

**Implementation Steps**:

1. **Data Structure**:
```javascript
// Add to constructor
this.history = [];
this.historyIndex = -1;
this.maxHistory = 50; // Limit memory usage
```

2. **State Snapshot**:
```javascript
saveState() {
    // Remove future states (if we're mid-history and make new change)
    this.history = this.history.slice(0, this.historyIndex + 1);
    
    // Create snapshot
    const state = {
        background: this.background,
        objects: JSON.parse(JSON.stringify(this.objects.map(obj => ({
            id: obj.id,
            name: obj.name,
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            rotation: obj.rotation,
            imageSrc: obj.imageSrc
        })))),
        selectedObjectId: this.selectedObject ? this.selectedObject.id : null
    };
    
    this.history.push(state);
    this.historyIndex++;
    
    // Limit history size
    if (this.history.length > this.maxHistory) {
        this.history.shift();
        this.historyIndex--;
    }
}

undo() {
    if (this.historyIndex > 0) {
        this.historyIndex--;
        this.restoreState(this.history[this.historyIndex]);
        this.updateStatus('Undo');
    }
}

redo() {
    if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.restoreState(this.history[this.historyIndex]);
        this.updateStatus('Redo');
    }
}

restoreState(state) {
    // Restore background
    this.background = state.background;
    
    // Restore objects (recreate Image objects)
    this.objects = [];
    state.objects.forEach(objData => {
        const img = new Image();
        img.src = objData.imageSrc;
        this.objects.push({
            ...objData,
            image: img
        });
    });
    
    // Restore selection
    this.selectedObject = this.objects.find(obj => 
        obj.id === state.selectedObjectId) || null;
    
    this.updateProperties();
    this.updateObjectCount();
}
```

3. **Call `saveState()` Before Mutations**:
```javascript
// Modify existing methods:
loadAsset(file) {
    // ... existing code ...
    img.onload = () => {
        this.saveState(); // Save before adding
        // ... rest of code ...
    };
}

deleteSelected() {
    if (!this.selectedObject) return;
    this.saveState(); // Save before deleting
    // ... rest of code ...
}

// Do NOT save on every property change (too frequent)
// Only save on discrete actions (load, delete, duplicate, etc.)
```

4. **Keyboard Shortcuts**:
```javascript
// Add to onKeyDown
if (e.ctrlKey || e.metaKey) {
    switch(e.key.toLowerCase()) {
        case 'z':
            e.preventDefault();
            if (e.shiftKey) {
                this.redo(); // Ctrl+Shift+Z
            } else {
                this.undo(); // Ctrl+Z
            }
            break;
        case 'y':
            e.preventDefault();
            this.redo(); // Ctrl+Y (Windows convention)
            break;
    }
}
```

5. **UI Buttons** (optional):
```html
<button id="undo">Undo</button>
<button id="redo">Redo</button>
```

6. **Documentation**:
- Document Command pattern in ARCHITECTURE.md
- Add undo/redo methods to API_REFERENCE.md
- Update memory management section (state snapshots use memory)
- Add keyboard shortcuts to README.md
- Update CHANGELOG.md

---

### Example 3: Layer Management

**Planning**:
```
Feature: Z-ordering (bring forward/send back)
User Problem: Can't control which objects appear on top
Affected Files: editor.js, index.html, style.css
Complexity: Medium (80-100 lines)
```

**Implementation Steps**:

1. **Data Structure**:
```javascript
// Add to GameObject (in loadAsset, duplicateObject, etc.)
layer: 0  // Default layer (0 = back, higher = front)
```

2. **Sorting**:
```javascript
// Modify render() method
render() {
    // ... clear canvas ...
    
    // Sort objects by layer before rendering
    const sortedObjects = [...this.objects].sort((a, b) => a.layer - b.layer);
    
    sortedObjects.forEach(obj => {
        this.drawObject(obj);
    });
    
    // ... draw selection ...
}
```

3. **Layer Controls**:
```javascript
bringForward() {
    if (!this.selectedObject) return;
    this.selectedObject.layer++;
    this.updateStatus(`Layer: ${this.selectedObject.layer}`);
}

sendBackward() {
    if (!this.selectedObject) return;
    this.selectedObject.layer--;
    this.updateStatus(`Layer: ${this.selectedObject.layer}`);
}

bringToFront() {
    if (!this.selectedObject) return;
    const maxLayer = Math.max(...this.objects.map(obj => obj.layer));
    this.selectedObject.layer = maxLayer + 1;
    this.updateStatus('Brought to front');
}

sendToBack() {
    if (!this.selectedObject) return;
    const minLayer = Math.min(...this.objects.map(obj => obj.layer));
    this.selectedObject.layer = minLayer - 1;
    this.updateStatus('Sent to back');
}
```

4. **UI** (toolbar or properties panel):
```html
<!-- Add to properties panel -->
<div class="property-group">
    <label>Layer</label>
    <input type="number" id="prop-layer" value="${obj.layer}">
    <button id="btn-layer-up">▲</button>
    <button id="btn-layer-down">▼</button>
</div>
```

5. **Keyboard Shortcuts**:
```javascript
// Add to onKeyDown (selection-dependent section)
if (e.ctrlKey) {
    switch(e.key) {
        case ']':
            e.preventDefault();
            this.bringForward();
            break;
        case '[':
            e.preventDefault();
            this.sendBackward();
            break;
    }
}

if (e.ctrlKey && e.shiftKey) {
    switch(e.key) {
        case ']':
            e.preventDefault();
            this.bringToFront();
            break;
        case '[':
            e.preventDefault();
            this.sendToBack();
            break;
    }
}
```

6. **Export Format**:
```javascript
// Modify exportJSON to include layer
objects: this.objects.map(obj => ({
    name: obj.name,
    x: Math.round(obj.x),
    y: Math.round(obj.y),
    width: Math.round(obj.width),
    height: Math.round(obj.height),
    rotation: obj.rotation,
    layer: obj.layer  // Add this
}))
```

---

## Common Pitfalls

### ❌ Pitfall 1: Not Updating Documentation
**Problem**: Code changes but docs become outdated  
**Solution**: Update docs FIRST, then implement

### ❌ Pitfall 2: Too Big, Too Fast
**Problem**: Implementing entire feature in one commit  
**Solution**: Break into small increments, test each

### ❌ Pitfall 3: Forgetting Edge Cases
**Problem**: Feature works in happy path but breaks on edge cases  
**Solution**: Test with empty state, single object, 100 objects, etc.

### ❌ Pitfall 4: Breaking Existing Features
**Problem**: New feature breaks unrelated functionality  
**Solution**: Run complete test suite before committing

### ❌ Pitfall 5: Over-Engineering
**Problem**: Adding complexity "for future flexibility"  
**Solution**: YAGNI (You Aren't Gonna Need It) - keep it simple

---

## Code Style Guidelines

### Naming Conventions
```javascript
// Classes: PascalCase
class GameEditor {}

// Methods: camelCase
loadBackground() {}

// Properties: camelCase
this.selectedObject

// Constants: SCREAMING_SNAKE_CASE (if added)
const MAX_HISTORY = 50;

// DOM IDs: kebab-case
document.getElementById('canvas-container')
```

### Method Organization
```javascript
class GameEditor {
    constructor() {}
    
    // ===== SECTION HEADER =====
    // Group related methods
    
    setupEventListeners() {}
    
    // ===== ASSET LOADING =====
    loadBackground() {}
    loadAsset() {}
    
    // ===== RENDERING =====
    render() {}
    drawGrid() {}
    // ... etc
}
```

### Comment Style
```javascript
// Short comments: Single line with // 

/*
 * Longer explanations: Multi-line with
 * asterisk on each line for readability
 */

// TODOs: Use TODO: prefix
// TODO: Add zoom controls here
```

### Error Handling
```javascript
// Wrap async operations in try/catch
try {
    const data = JSON.parse(file);
    // ... process data ...
} catch (error) {
    console.error('Detailed error:', error);
    this.updateStatus('❌ User-friendly message');
}
```

---

## Testing Checklist

Before marking feature "done":

```
[ ] Feature works as designed
[ ] No console errors
[ ] Works in Chrome, Firefox, Safari, Edge
[ ] Keyboard shortcuts work
[ ] Handles empty state gracefully
[ ] Handles many objects (100+)
[ ] Export/save/load still works
[ ] Existing features not broken
[ ] Documentation updated
[ ] CHANGELOG entry added
[ ] Code committed with good message
[ ] Pushed to GitHub
[ ] Tested on Netlify deployment
```

---

## When to Say No

**Don't implement if:**
- User hasn't explicitly requested it
- It adds significant complexity
- It's not in the critical 1%
- There's a simpler alternative
- It breaks the MVP philosophy
- It requires external dependencies
- It makes the codebase harder to maintain

**Instead:**
- Document as "potential future feature"
- Add to "What Doesn't Exist" in AI_CONTEXT.md
- Wait for real user demand
- Keep the MVP simple and focused

---

**Remember**: The best code is no code. The second-best code is simple code.

---

**END OF ADDING_FEATURES.MD**  
**Total Lines**: ~640  
**Next Review**: December 12, 2025
