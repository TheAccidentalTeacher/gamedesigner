# Troubleshooting Guide
**Last Updated**: December 11, 2025  
**Version**: 1.0.0  
**Purpose**: Quick reference for common issues and solutions

---

## Quick Fixes

### Editor Won't Load
```
1. Hard refresh: Ctrl+Shift+R (Ctrl+Shift+Delete on Mac)
2. Check browser console (F12) for errors
3. Try different browser
4. Verify files: index.html, style.css, editor.js all present
5. Check internet connection (shouldn't be needed but verify)
```

### File Picker Won't Open
```
1. Click button again (may need to re-focus)
2. Check browser security settings
3. Try keyboard shortcut instead (Ctrl+B, Ctrl+A, Ctrl+O)
4. Reload page and try again
```

### Images Won't Load
```
1. Verify file is an image (PNG, JPG, GIF, WebP)
2. Check file size (< 10MB recommended)
3. Try different image
4. Check browser console for errors
5. Try on localhost if file:// protocol has issues
```

---

## Known Issues

### Issue: Clipboard API Doesn't Work

**Symptoms**:
- Ctrl+E exports but doesn't copy to clipboard
- Console shows "Clipboard write blocked"

**Cause**: Clipboard API requires HTTPS or localhost

**Solutions**:
```
Option 1: Use localhost
- Run local server: python -m http.server 8000
- Or use VS Code Live Server extension
- Access via http://localhost:8000

Option 2: Deploy to Netlify (has HTTPS)

Option 3: Use file download (already happens automatically)
```

**Status**: Working as designed (browser security)

---

### Issue: Large Project Files

**Symptoms**:
- Project file is 50MB+
- Save/load is slow
- Browser may hang

**Cause**: Base64 encoding of images (33% size increase)

**Solutions**:
```
1. Use smaller images (resize before adding)
2. Use fewer objects
3. Export JSON instead of project (much smaller)
4. Wait patiently for save/load (may take 10-30 seconds)
```

**Status**: Expected behavior for MVP

**Future**: Possible compression or IndexedDB

---

### Issue: Can't Select Rotated Objects

**Symptoms**:
- Object is rotated
- Click on visible area doesn't select
- Need to click original bounding box

**Cause**: Collision detection uses AABB (Axis-Aligned Bounding Box)

**Solutions**:
```
1. Click near object center (more reliable)
2. Rotate back to 0° for easier selection
3. Use properties panel to edit instead of dragging
```

**Status**: Known limitation (MVP decision)

**Future**: Rotated rectangle collision

---

### Issue: Objects Disappear After Rotation

**Symptoms**:
- Rotate object
- Object seems to disappear or move

**Cause**: Rotation happens around object center (may move visual outside canvas)

**Solutions**:
```
1. Check properties panel - object still exists
2. Reset rotation to 0°
3. Move object back to canvas
4. Undo not available yet - may need to reload project
```

**Status**: Expected behavior (canvas clipping)

---

### Issue: Performance Drops with Many Objects

**Symptoms**:
- FPS drops below 30
- Dragging feels laggy
- Export takes long time

**Cause**: Full redraw every frame + many objects

**Solutions**:
```
1. Reduce object count (< 100 recommended)
2. Use smaller images (< 1MB each)
3. Close other browser tabs
4. Use more powerful computer
5. Consider splitting into multiple levels
```

**Status**: Expected for 100+ objects

---

### Issue: Properties Panel Not Updating

**Symptoms**:
- Drag object but properties don't update
- Numeric values frozen

**Cause**: Usually fixed by completing drag (mouse up)

**Solutions**:
```
1. Release mouse button
2. Click object again
3. Press Escape to deselect
4. Reload page if stuck
```

**Status**: Should not happen - report if consistent

---

### Issue: Keyboard Shortcuts Not Working

**Symptoms**:
- Ctrl+E does nothing
- Arrow keys don't move object
- Delete key ignored

**Causes & Solutions**:

**Cause 1: Input Field Has Focus**
```
Solution: Click on canvas to focus
```

**Cause 2: Browser Intercepts Shortcut**
```
Solution: Check if browser dialog appeared (e.g., Save Page)
Note: We call preventDefault() but some browsers still intercept
```

**Cause 3: Wrong Modifier Key**
```
Mac users: Use Cmd (⌘) not Ctrl
Windows/Linux: Use Ctrl
```

---

### Issue: Export JSON is Empty

**Symptoms**:
- JSON file downloads
- Contains no objects
- Background is null

**Cause**: No objects or background loaded

**Solutions**:
```
1. Verify objects exist: window.editor.objects
2. Load background and assets first
3. Check that objects are visible on canvas
4. Try saving project instead (includes more data)
```

**Status**: Working as designed (empty level is valid)

---

### Issue: Can't Load Saved Project

**Symptoms**:
- Click Load Project
- Select file
- Nothing happens or error

**Causes & Solutions**:

**Cause 1: Wrong File Type**
```
Solution: Ensure you're loading a .json file saved from this editor
Not the exported JSON (use project files only)
```

**Cause 2: Corrupted File**
```
Solution: 
1. Open file in text editor
2. Check it's valid JSON (starts with {, ends with })
3. Try saving a new project
```

**Cause 3: Large File**
```
Solution: Be patient (may take 30 seconds for large projects)
Check browser console for progress
```

---

## Browser-Specific Issues

### Chrome
**Issue**: None known  
**Status**: Fully supported ✅

### Firefox
**Issue**: None known  
**Status**: Fully supported ✅

### Safari
**Issue**: Clipboard API requires Safari 13.1+  
**Workaround**: File download still works  
**Status**: Mostly supported ✅

### Edge
**Issue**: None known  
**Status**: Fully supported ✅

### Internet Explorer 11
**Issue**: ES6 not supported  
**Status**: Not supported ❌  
**Solution**: Use modern browser

---

## File System Issues

### Issue: File Paths Not Working

**Symptoms**:
- Running from file:// protocol
- Some features don't work
- Security errors in console

**Solution**:
```
Run from local server instead:

Option 1: Python
python -m http.server 8000
# Visit http://localhost:8000

Option 2: VS Code Live Server
Install "Live Server" extension
Right-click index.html → Open with Live Server

Option 3: Node.js
npx http-server
```

---

### Issue: Can't Write Files

**Symptoms**:
- Export/Save buttons don't work
- No download dialog

**Cause**: Browser security or permissions

**Solutions**:
```
1. Check browser download settings
2. Allow pop-ups for this site
3. Check browser storage settings
4. Try different browser
```

---

## Network Issues

### Issue: Page Won't Load from Netlify

**Symptoms**:
- Deployed to Netlify
- Gets 404 error
- Or shows Netlify landing page

**Solutions**:
```
1. Check deploy status in Netlify dashboard
2. Wait for build to complete (~30 seconds)
3. Verify publish directory is set correctly (/ or root)
4. Check if files actually uploaded (check deploy log)
5. Try manual deploy (drag folder to Netlify)
```

---

### Issue: Assets Not Loading on Deployed Site

**Symptoms**:
- Works locally
- Doesn't work on Netlify
- Missing images or styles

**Cause**: File paths incorrect or CORS issues

**Solutions**:
```
1. Verify all files uploaded to Netlify
2. Check Network tab for 404s
3. Use relative paths (not absolute)
4. Clear browser cache
```

**Note**: Our editor uses FileReader (no external requests) so this shouldn't happen

---

## Data Issues

### Issue: Lost Work

**Symptoms**:
- Closed browser
- Work disappeared
- No save file

**Prevention**:
```
Save frequently:
- Ctrl+S to save project
- Name your files meaningfully
- Keep backups of important work
```

**Status**: No auto-save (MVP doesn't include localStorage)

---

### Issue: Project File Too Large

**Symptoms**:
- Project file is 100MB+
- Can't share via email
- Slow to load

**Solutions**:
```
1. Reduce image sizes before importing
2. Use fewer objects
3. Split into multiple smaller projects
4. Export JSON only (no images, much smaller)
5. Use image compression tools
```

---

## Performance Issues

### Issue: Slow Export

**Symptoms**:
- Export takes 5+ seconds
- Browser freezes briefly

**Cause**: Large number of objects or complex data

**Solutions**:
```
1. Wait patiently (should complete)
2. Reduce object count
3. Close other browser tabs
4. Check Task Manager (memory usage)
```

**Status**: Expected for 50+ objects

---

### Issue: High Memory Usage

**Symptoms**:
- Browser uses 500MB+ RAM
- Computer slows down
- Browser may crash

**Cause**: Many large images in memory

**Solutions**:
```
1. Reload page to reset
2. Use smaller images
3. Close other tabs
4. Add more RAM to computer
5. Work with fewer objects at a time
```

---

## Mobile/Touch Issues

### Issue: Doesn't Work on Mobile

**Status**: Not supported (desktop-first design)

**Why**: Touch events not implemented in MVP

**Workaround**: Use desktop browser

**Future**: Touch support may be added if requested

---

## Error Messages

### "Cannot read property 'x' of null"
**Meaning**: Trying to access non-existent object  
**Solution**: Check if object is selected first  
**See**: [DEBUGGING_GUIDE.md](workflows/DEBUGGING_GUIDE.md)

### "Failed to execute 'drawImage'"
**Meaning**: Image not loaded or invalid  
**Solution**: Wait for img.onload or check image source

### "Unexpected token < in JSON"
**Meaning**: Trying to load HTML as JSON  
**Solution**: Check you're loading correct file type

### "SecurityError: Clipboard write blocked"
**Meaning**: Clipboard API requires HTTPS  
**Solution**: Use localhost or Netlify, or rely on file download

---

## When Nothing Works

### Nuclear Option: Complete Reset

```
1. Close all browser tabs
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart browser
4. Navigate to editor
5. Try again
```

### Still Not Working?

```
1. Try different browser
2. Check browser console (F12) for errors
3. Take screenshot of error
4. Check GitHub Issues for similar problems
5. Create new issue with:
   - Browser version
   - OS version
   - Steps to reproduce
   - Error messages
   - Screenshots
```

---

## Getting Help

### Self-Service Resources
1. This document (TROUBLESHOOTING.md)
2. [DEBUGGING_GUIDE.md](workflows/DEBUGGING_GUIDE.md) - Detailed debugging
3. [API_REFERENCE.md](technical/API_REFERENCE.md) - Code documentation
4. [ARCHITECTURE.md](technical/ARCHITECTURE.md) - System design

### Community Support
- GitHub Issues: Report bugs or ask questions
- GitHub Discussions: General questions

### Documentation
- All docs in `docs/` folder
- Start with [AI_CONTEXT.md](ai/AI_CONTEXT.md)

---

## Prevention Tips

### Save Frequently
```
Ctrl+S every few minutes
Name your project files clearly
Keep multiple versions (project-v1, project-v2, etc.)
```

### Use Supported Browsers
```
Chrome 90+ ✅
Firefox 88+ ✅
Safari 14+ ✅
Edge 90+ ✅
```

### Keep Images Reasonable
```
< 5MB per image
< 50 total objects
PNG or JPG format preferred
```

### Work on Local Server
```
Better security
Faster performance
Clipboard works
No file:// issues
```

---

## FAQ

**Q: Why isn't there an auto-save feature?**  
A: MVP doesn't include it. Save manually with Ctrl+S. May add in future.

**Q: Can I use this offline?**  
A: Yes! Once loaded, works completely offline (no internet required).

**Q: What if I close the browser?**  
A: Work is lost unless you saved. No localStorage persistence yet.

**Q: Can I collaborate with others?**  
A: Not currently. MVP is single-user. Share project files manually.

**Q: Why is my project file so large?**  
A: Images stored as base64 (33% larger). Tradeoff for offline capability.

**Q: Can I export to other formats?**  
A: Currently JSON only. Future: Could add XML, CSV, custom formats.

**Q: Does this work on mobile?**  
A: No. Desktop-first design. Touch events not implemented.

**Q: Can I zoom or pan?**  
A: Not yet. MVP doesn't include zoom/pan. Future feature.

**Q: How do I undo a mistake?**  
A: No undo yet. Save frequently and reload previous version if needed.

**Q: Why can't I select rotated objects easily?**  
A: Collision detection is simple AABB. Click near center for best results.

---

**Last Updated**: December 11, 2025  
**Next Review**: December 12, 2025  
**Report Issues**: GitHub Issues
