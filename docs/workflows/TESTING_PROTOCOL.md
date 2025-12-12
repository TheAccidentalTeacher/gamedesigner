# Testing Protocol
**Last Updated**: December 11, 2025  
**Version**: 1.0.0  
**Purpose**: Complete testing checklist for manual QA

---

## Critical Path (Test Before Every Commit)

```
[ ] 1. Load background image (Ctrl+B)
[ ] 2. Background displays correctly (fills canvas)
[ ] 3. Add 2-3 assets (Ctrl+A, select multiple files)
[ ] 4. Assets appear centered on canvas
[ ] 5. Click to select an asset
[ ] 6. Green selection highlight appears
[ ] 7. Drag selected asset
[ ] 8. Asset moves smoothly with mouse
[ ] 9. Mouse coordinates update in status bar
[ ] 10. Release mouse (drag ends)
[ ] 11. Properties panel shows current values
[ ] 12. Edit X position in properties panel
[ ] 13. Object moves to new position
[ ] 14. Edit Width in properties panel
[ ] 15. Object resizes correctly
[ ] 16. Edit Rotation in properties panel
[ ] 17. Object rotates around center
[ ] 18. Press Ctrl+D to duplicate
[ ] 19. New object appears offset by 20px
[ ] 20. Press Delete to remove object
[ ] 21. Object disappears
[ ] 22. Object count updates correctly
[ ] 23. Press Ctrl+E to export JSON
[ ] 24. JSON copied to clipboard
[ ] 25. JSON file downloads
[ ] 26. Open downloaded JSON (verify format)
[ ] 27. Press Ctrl+S to save project
[ ] 28. Project file downloads
[ ] 29. Clear all (click Clear All button)
[ ] 30. Confirm dialog appears
[ ] 31. Press Ctrl+O to load project
[ ] 32. Select saved project file
[ ] 33. All objects restore correctly
[ ] 34. Background restores correctly
[ ] 35. No console errors throughout
```

**Time to Complete**: ~5 minutes

---

## Keyboard Shortcuts Test

```
[ ] Ctrl+B opens background file picker
[ ] Ctrl+A opens asset file picker
[ ] Ctrl+E exports JSON
[ ] Ctrl+S saves project
[ ] Ctrl+O loads project
[ ] Ctrl+D duplicates selected object
[ ] Arrow Up moves object up 1px
[ ] Arrow Down moves object down 1px
[ ] Arrow Left moves object left 1px
[ ] Arrow Right moves object right 1px
[ ] Shift+Arrow moves object 10px
[ ] Delete removes selected object
[ ] Backspace removes selected object (Mac)
```

---

## Browser Compatibility Test

Test in each browser:

### Chrome (Latest)
```
[ ] All features work
[ ] Clipboard API works
[ ] File loading works
[ ] Downloads work
[ ] Canvas renders correctly
[ ] No console errors
```

### Firefox (Latest)
```
[ ] All features work
[ ] Clipboard API works
[ ] File loading works
[ ] Downloads work
[ ] Canvas renders correctly
[ ] No console errors
```

### Safari (Latest)
```
[ ] All features work
[ ] Clipboard API works (or graceful fallback)
[ ] File loading works
[ ] Downloads work
[ ] Canvas renders correctly
[ ] No console errors
```

### Edge (Latest)
```
[ ] All features work
[ ] Clipboard API works
[ ] File loading works
[ ] Downloads work
[ ] Canvas renders correctly
[ ] No console errors
```

---

## Edge Cases

### Empty State
```
[ ] Editor loads with no errors
[ ] Grid displays (no background)
[ ] Status says "Ready to create!"
[ ] Properties panel says "Select an object"
[ ] Object count shows "Objects: 0"
[ ] Export produces empty objects array
[ ] Save/load works with empty state
```

### Single Object
```
[ ] Can load one asset
[ ] Can select it
[ ] Can drag it
[ ] Can edit properties
[ ] Can duplicate it
[ ] Can delete it
[ ] Export includes one object
```

### Many Objects (100+)
```
[ ] Load 100 small sprites
[ ] Framerate stays smooth (~60 FPS)
[ ] Selection still works
[ ] Dragging still smooth
[ ] Export completes without hanging
[ ] Save/load works (may be slow - OK)
```

### Large Images
```
[ ] Load 5MB background image
[ ] Image displays (may take a moment)
[ ] Load 2MB asset
[ ] Asset displays correctly
[ ] Performance acceptable
[ ] Save project creates large file (expected)
```

### Rotation Edge Cases
```
[ ] Rotate object to 0° (default)
[ ] Rotate to 90° (vertical flip)
[ ] Rotate to 180° (upside down)
[ ] Rotate to 270° (vertical flip opposite)
[ ] Rotate to 360° (full circle)
[ ] Rotate to negative values (-90°)
[ ] Rotation handles correctly
```

### Boundary Conditions
```
[ ] Drag object off canvas (left edge)
[ ] Drag object off canvas (right edge)
[ ] Drag object off canvas (top edge)
[ ] Drag object off canvas (bottom edge)
[ ] Objects still selectable when partially off-canvas
[ ] Negative X/Y positions work
```

---

## File Format Tests

### Image Formats
```
[ ] PNG images load correctly
[ ] JPG images load correctly
[ ] GIF images load correctly
[ ] WebP images load correctly
[ ] SVG images load (may not work - OK)
[ ] BMP images load (browser-dependent)
```

### Export JSON Validation
```
[ ] Valid JSON structure
[ ] meta.editor = "Universal Game Level Editor"
[ ] meta.version = "1.0"
[ ] meta.exported is ISO timestamp
[ ] canvas.width = 1280
[ ] canvas.height = 720
[ ] background is string or null
[ ] objects is array
[ ] Each object has: name, x, y, width, height, rotation
[ ] Position values are integers (rounded)
```

### Project JSON Validation
```
[ ] Valid JSON structure
[ ] meta section present
[ ] canvas section present
[ ] background includes "data" (base64) or null
[ ] objects include "imageSrc" (base64)
[ ] objects include "id" field
[ ] File size reasonable (< 50MB for typical project)
```

---

## Performance Tests

### Frame Rate
```
[ ] Empty canvas: 60 FPS
[ ] 10 objects: 60 FPS
[ ] 50 objects: 60 FPS
[ ] 100 objects: ~60 FPS (may drop slightly - acceptable)
```

**Check FPS**: Open DevTools → Rendering → Frame Rendering Stats

### Memory Usage
```
[ ] Empty editor: ~5MB
[ ] 10 small sprites: ~10MB
[ ] 10 large sprites: ~50MB
[ ] No memory leaks (reload page, memory resets)
```

**Check Memory**: DevTools → Memory → Take Heap Snapshot

### Load Times
```
[ ] Initial page load: < 1 second
[ ] Load background: < 2 seconds
[ ] Load 10 assets: < 5 seconds
[ ] Export JSON: Instant
[ ] Save project: < 2 seconds
[ ] Load project: < 5 seconds
```

---

## Regression Tests (After Changes)

Run these if you modified specific areas:

### If Changed `editor.js`
```
[ ] Run complete critical path
[ ] Test keyboard shortcuts
[ ] Test export/save/load
[ ] Check for console errors
```

### If Changed `style.css`
```
[ ] Check layout (toolbar, canvas, properties, status bar)
[ ] Check button hover states
[ ] Check responsive behavior (resize window)
[ ] Check dark theme consistency
```

### If Changed `index.html`
```
[ ] Verify all buttons still work
[ ] Verify file inputs still trigger
[ ] Check status bar updates
[ ] Check properties panel updates
```

---

## Accessibility (Optional, Future)

```
[ ] Keyboard-only navigation works
[ ] Focus indicators visible
[ ] Button labels descriptive
[ ] Screen reader announces actions
[ ] Color contrast meets WCAG AA
```

**Note**: Not required for MVP but good to consider.

---

## Manual Testing Template

Copy this for each test run:

```markdown
## Test Run - [Date] - [Browser]

**Tester**: [Your Name]  
**Version**: [Commit Hash]  
**Environment**: [OS] / [Browser Version]

### Critical Path
- [ ] All 35 steps passed

### Keyboard Shortcuts
- [ ] All 12 shortcuts work

### Browser Compatibility
- [ ] Chrome: PASS / FAIL
- [ ] Firefox: PASS / FAIL
- [ ] Safari: PASS / FAIL
- [ ] Edge: PASS / FAIL

### Edge Cases
- [ ] Empty state: PASS / FAIL
- [ ] Single object: PASS / FAIL
- [ ] Many objects: PASS / FAIL
- [ ] Large images: PASS / FAIL

### Issues Found
1. [Issue description]
   - Severity: Critical / High / Medium / Low
   - Steps to reproduce: ...
   - Expected: ...
   - Actual: ...

### Notes
[Any additional observations]
```

---

## Automated Testing (Future)

**Not Implemented Yet** - Manual testing sufficient for MVP.

If adding automated tests:
- Jest for unit tests
- Playwright for E2E
- Canvas snapshot testing for visual regression

---

**END OF TESTING_PROTOCOL.MD**  
**Total Lines**: ~330  
**Next Review**: December 12, 2025
