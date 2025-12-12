# Debugging Guide
**Last Updated**: December 11, 2025  
**Version**: 1.0.0  
**Purpose**: Systematic approach to troubleshooting issues

---

## Quick Debugging Steps

```
1. Check browser console for errors (F12)
2. Verify files loaded correctly (Network tab)
3. Check state in DevTools: window.editor
4. Try in different browser
5. Clear cache and reload
6. Check TROUBLESHOOTING.md for known issues
```

---

## Browser DevTools Guide

### Console Tab (Primary Debugging Tool)

**Open Console**: F12 or Ctrl+Shift+J

**Check for Errors**:
```javascript
// Red errors indicate problems
Uncaught TypeError: Cannot read property 'x' of null
  at GameEditor.onMouseMove (editor.js:312)
```

**Inspect Editor State**:
```javascript
// In console, type:
window.editor

// Check specific properties:
window.editor.objects          // All objects
window.editor.selectedObject   // Current selection
window.editor.background       // Background image
window.editor.isDragging       // Drag state
```

**Manual Testing**:
```javascript
// Trigger methods manually:
window.editor.exportJSON()
window.editor.updateStatus('Test message')
window.editor.render()
```

### Sources Tab (Breakpoint Debugging)

1. Open DevTools → Sources
2. Find `editor.js` in file tree
3. Click line number to set breakpoint
4. Trigger the action (e.g., click on canvas)
5. Execution pauses at breakpoint
6. Inspect variables in Scope panel
7. Step through code (F10 = step over, F11 = step into)

**Useful Breakpoints**:
- Line 269 (`onMouseDown`) - Selection issues
- Line 294 (`onMouseMove`) - Dragging issues
- Line 138 (`loadAsset`) - Loading problems
- Line 166 (`render`) - Rendering problems

### Network Tab (File Loading Issues)

1. Open DevTools → Network
2. Reload page
3. Check all files load (200 status codes)
4. Look for failed requests (red entries)

**What to Check**:
- `index.html` loads
- `style.css` loads
- `editor.js` loads
- Images load as Data URLs (won't show in Network)

### Application Tab (localStorage Issues)

1. Open DevTools → Application
2. Storage → Local Storage
3. Check for editor data (if using localStorage in future)

---

## Common Issues & Solutions

### Issue: Objects Not Rendering

**Symptoms**:
- Canvas is blank after adding assets
- Objects in `window.editor.objects` array but not visible

**Debug Steps**:
```javascript
// 1. Check if objects exist
console.log(window.editor.objects);

// 2. Check if images loaded
window.editor.objects.forEach((obj, i) => {
    console.log(`Object ${i}:`, obj.image.complete, obj.image.src);
});

// 3. Check canvas size
console.log(window.editor.canvas.width, window.editor.canvas.height);

// 4. Force render
window.editor.render();
```

**Common Causes**:
- Image not loaded yet (`img.complete === false`)
- Object positioned off-canvas
- Canvas size 0x0 (CSS issue)
- Render loop not started

**Solution**:
```javascript
// Wait for images to load
img.onload = () => {
    // Add object here
};
```

---

### Issue: Can't Select Objects

**Symptoms**:
- Clicking on objects doesn't select them
- Selection highlight doesn't appear

**Debug Steps**:
```javascript
// 1. Check if mouse events firing
window.editor.canvas.addEventListener('mousedown', (e) => {
    console.log('Mouse down:', e);
});

// 2. Check mouse position calculation
// Add to onMouseDown:
console.log('Mouse pos:', this.getMousePos(e));

// 3. Check collision detection
// Add to isPointInObject:
console.log('Checking collision:', point, obj);
```

**Common Causes**:
- Canvas position changed (getMousePos calculation wrong)
- Objects array empty
- Event listeners not bound
- CSS `pointer-events: none` on canvas

**Solution**:
```javascript
// Verify getBoundingClientRect:
console.log(window.editor.canvas.getBoundingClientRect());
```

---

### Issue: Drag Not Working

**Symptoms**:
- Can select but can't drag
- Object jumps to wrong position
- Drag feels "sticky"

**Debug Steps**:
```javascript
// 1. Check drag state
console.log('Dragging:', window.editor.isDragging);
console.log('Drag offset:', window.editor.dragOffset);

// 2. Check mouse events
console.log('Mouse move events firing?');
window.editor.canvas.addEventListener('mousemove', () => {
    console.log('Move!');
});

// 3. Check selected object
console.log('Selected:', window.editor.selectedObject);
```

**Common Causes**:
- `isDragging` not set to true
- `dragOffset` not calculated
- `onMouseUp` not firing (stuck in drag state)
- Object position not updating

**Solution**:
```javascript
// Reset drag state manually:
window.editor.isDragging = false;
```

---

### Issue: Keyboard Shortcuts Not Working

**Symptoms**:
- Ctrl+E doesn't export
- Arrow keys don't move objects
- Delete doesn't work

**Debug Steps**:
```javascript
// 1. Check if event listener bound
console.log('Listeners:', getEventListeners(document));

// 2. Add logging to onKeyDown
// At start of method:
console.log('Key pressed:', e.key, 'Ctrl:', e.ctrlKey);

// 3. Check if input field has focus
console.log('Active element:', document.activeElement);
```

**Common Causes**:
- Input field has focus (keyboard events captured)
- Browser shortcut intercepts (e.g., Ctrl+S save page)
- Event listener not bound
- `e.preventDefault()` not called

**Solution**:
```javascript
// Force blur from inputs:
document.activeElement.blur();

// Always call preventDefault on handled shortcuts:
e.preventDefault();
```

---

### Issue: Export/Save Not Working

**Symptoms**:
- Ctrl+E doesn't download file
- JSON not copied to clipboard
- File downloads but is empty

**Debug Steps**:
```javascript
// 1. Check if method called
console.log('Export method called');

// 2. Check data generation
const data = window.editor.exportJSON(); // Manual call
console.log('Generated data:', data);

// 3. Check clipboard API
navigator.clipboard.writeText('test').then(() => {
    console.log('Clipboard works');
}).catch(err => {
    console.error('Clipboard error:', err);
});

// 4. Check blob creation
const blob = new Blob(['test'], {type: 'text/plain'});
console.log('Blob:', blob);
```

**Common Causes**:
- Clipboard API not supported (older browser)
- HTTPS required for clipboard (use localhost or HTTPS)
- Objects array empty
- JSON.stringify fails (circular reference)

**Solution**:
```javascript
// Fallback if clipboard fails - just download:
// (Already implemented in exportJSON)
```

---

### Issue: Images Not Loading

**Symptoms**:
- File picker opens but nothing happens
- Console shows image error
- Objects added but no images

**Debug Steps**:
```javascript
// 1. Check if file selected
document.getElementById('asset-input').addEventListener('change', (e) => {
    console.log('Files:', e.target.files);
});

// 2. Check FileReader
const reader = new FileReader();
reader.onload = (e) => {
    console.log('File read:', e.target.result.substring(0, 50));
};
reader.onerror = (e) => {
    console.error('Read error:', e);
};

// 3. Check Image creation
const img = new Image();
img.onload = () => console.log('Image loaded');
img.onerror = () => console.error('Image error');
img.src = 'data:...';
```

**Common Causes**:
- File not an image (wrong type)
- File corrupted
- Browser doesn't support format (e.g., SVG)
- File too large (browser memory limit)

**Solution**:
```javascript
// Add file type validation:
if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
}
```

---

## Performance Debugging

### Slow Rendering

**Check Frame Rate**:
1. DevTools → Rendering → Frame Rendering Stats
2. Look for consistent 60 FPS
3. If below 30 FPS, investigate

**Common Causes**:
- Too many objects (100+)
- Large images (5MB+)
- Expensive operations in render loop

**Solution**:
```javascript
// Profile render performance:
const start = performance.now();
this.render();
const end = performance.now();
console.log('Render time:', end - start, 'ms');

// Target: < 16ms per frame (60 FPS)
```

### Memory Leaks

**Check Memory Usage**:
1. DevTools → Memory
2. Take heap snapshot
3. Perform actions
4. Take another snapshot
5. Compare

**Common Causes**:
- ObjectURLs not revoked
- Event listeners not removed
- Image references not released

**Solution**:
```javascript
// Always revoke ObjectURLs:
URL.revokeObjectURL(url);

// Remove event listeners when needed:
element.removeEventListener('click', handler);
```

---

## Error Message Reference

### "Cannot read property 'x' of null"
**Meaning**: Trying to access property of null/undefined  
**Common Location**: `selectedObject.x` when no selection  
**Fix**: Add null check: `if (this.selectedObject) { ... }`

### "Failed to execute 'drawImage' on 'CanvasRenderingContext2D'"
**Meaning**: Image not loaded or invalid  
**Common Location**: `render()` method  
**Fix**: Check `img.complete` before drawing

### "Unexpected token < in JSON"
**Meaning**: Trying to parse HTML as JSON  
**Common Location**: `loadProject()`  
**Fix**: User selected wrong file (not JSON)

### "SecurityError: Clipboard write blocked"
**Meaning**: Clipboard API requires user interaction  
**Common Location**: `exportJSON()`  
**Fix**: Ensure called from user-initiated event (click, keyboard)

---

## Debugging Workflow

### Step 1: Reproduce
```
1. Note exact steps to reproduce
2. Try to reproduce in clean state
3. Try in different browser
4. Document what you see vs expected
```

### Step 2: Isolate
```
1. Comment out recent changes
2. Narrow down to specific function
3. Add console.logs at key points
4. Check state before/after problem area
```

### Step 3: Hypothesize
```
1. Form theory about cause
2. List possible causes
3. Rank by likelihood
4. Test most likely first
```

### Step 4: Test
```
1. Make minimal change to test theory
2. Reload and test
3. If fixed, understand why
4. If not fixed, try next theory
```

### Step 5: Fix
```
1. Implement proper fix
2. Test thoroughly
3. Check for side effects
4. Document in CHANGELOG
```

### Step 6: Prevent
```
1. Add error handling
2. Add validation
3. Update tests
4. Document in TROUBLESHOOTING.md
```

---

## Tools & Techniques

### Console Tricks

```javascript
// Table view for objects
console.table(window.editor.objects);

// Group related logs
console.group('Mouse Events');
console.log('Down');
console.log('Move');
console.log('Up');
console.groupEnd();

// Time operations
console.time('render');
window.editor.render();
console.timeEnd('render');

// Trace call stack
console.trace();
```

### Debugging CSS

```css
/* Visual debugging */
* { outline: 1px solid red; }

/* Check specific element */
#canvas { border: 2px solid lime; }
```

### Network Throttling

1. DevTools → Network
2. Dropdown: "Slow 3G"
3. Test image loading on slow connection

---

## When to Ask for Help

**Escalate if**:
- Issue persists after 30 minutes
- Can't reproduce
- Affects core functionality
- Security concern
- Browser-specific bug

**Before asking, provide**:
1. Exact steps to reproduce
2. Expected vs actual behavior
3. Browser/OS version
4. Console errors (screenshot)
5. What you've tried
6. Minimal code example

---

**END OF DEBUGGING_GUIDE.MD**  
**Total Lines**: ~460  
**Next Review**: December 12, 2025
