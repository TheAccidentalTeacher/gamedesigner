# Changelog
All notable changes to the Universal Game Level Editor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]
### Planned
- See AI_CONTEXT.md "What Doesn't Exist" section for potential features

---

## [1.0.0] - 2025-12-11

### 🎉 Initial Release - MVP Complete

**Philosophy**: "Don't build the Death Star when you need a speeder bike"

This release represents the complete MVP (Minimum Viable Product) - built in hours, not months. Born from rejecting 5,000+ lines of over-engineered specifications in favor of a lean 650-line implementation.

### Added - Core Editor
- **Canvas Rendering** (1280x720 default)
  - HTML5 Canvas with 2D context
  - 60 FPS render loop via requestAnimationFrame
  - Dark theme (#1e1e1e) consistent with VS Code

- **Background Management**
  - Load background images via file picker
  - Stretch to fit canvas
  - Grid visualization when no background
  - FileReader API for client-side loading

- **Asset Management**
  - Add multiple assets via file picker
  - Load images as game objects
  - Center placement on initial load
  - Unique ID generation (timestamp + random)
  - Native dimensions preserved

- **Object Interaction**
  - Click to select objects
  - Drag to move objects
  - Green selection highlight with resize handles
  - Reverse-order selection (top objects first)
  - Smooth dragging with offset calculation

- **Properties Panel**
  - Live property editing (X, Y, Width, Height, Rotation)
  - Name editing
  - Duplicate button
  - Delete button
  - Real-time updates during drag

- **Keyboard Shortcuts**
  - `Ctrl+B`: Load background
  - `Ctrl+A`: Add asset
  - `Ctrl+E`: Export JSON
  - `Ctrl+S`: Save project
  - `Ctrl+O`: Load project
  - `Ctrl+D`: Duplicate object
  - `Arrow Keys`: Move object (1px)
  - `Shift+Arrows`: Move object (10px)
  - `Delete/Backspace`: Remove object

- **Export System**
  - Clean JSON format for game integration
  - Auto-copy to clipboard
  - File download (.json)
  - Metadata included (editor, version, timestamp)
  - Rounded position values

- **Project Persistence**
  - Save complete project (images as base64)
  - Load saved projects
  - Full state restoration
  - Background + objects preserved

- **UI Components**
  - Toolbar with 6 main buttons
  - Canvas workspace with grid
  - Properties panel (320px wide)
  - Status bar with mouse coordinates
  - Object counter display
  - Hidden file inputs (programmatic triggers)

### Added - Documentation (2025-12-11 Evening)
- **AI-Specific Documentation**
  - `docs/ai/AI_CONTEXT.md` (580 lines) - Complete AI orientation
  - `docs/ai/DAILY_UPDATE_CHECKLIST.md` - Maintenance protocol

- **Technical Documentation**
  - `docs/technical/ARCHITECTURE.md` (710 lines) - System design, data flow
  - `docs/technical/API_REFERENCE.md` (1150 lines) - Complete code docs
  - `docs/technical/FILE_MAP.md` - Line-by-line file index

- **Workflow Guides**
  - `docs/workflows/ADDING_FEATURES.md` (640 lines) - Feature implementation
  - `docs/workflows/TESTING_PROTOCOL.md` (330 lines) - QA checklist
  - `docs/workflows/DEBUGGING_GUIDE.md` (460 lines) - Troubleshooting

- **General Documentation**
  - `docs/CHANGELOG.md` - This file
  - `docs/TROUBLESHOOTING.md` - Known issues reference
  - Updated `README.md` with documentation index

- **Historical Documentation**
  - `FELLOWSHIP_GUIDE.md` - D&D persona system
  - `AI-ASSISTANT-CHECKLIST.md` - Quick reference

- **Legacy Specs** (historical reference only)
  - `LEVEL_EDITOR_FEATURES_REFERENCE.md` (863 lines)
  - `LEVEL_EDITOR_IMPLEMENTATION_PLAN.md` (1611 lines)
  - `LEVEL_EDITOR_MASTER_SPEC.md` (1328 lines)
  - `LEVEL_EDITOR_TECHNICAL_GUIDE.md` (1218 lines)
  - `LEVEL_EDITOR_UI_SPECIFICATION.md` (1028 lines)

### Added - Deployment
- **Git Repository**
  - Initialized with .gitignore
  - Initial commit with all files

- **GitHub Integration**
  - Repository: `TheAccidentalTeacher/gamedesigner`
  - Main branch deployed

- **Netlify Ready**
  - Static file structure
  - Zero build process
  - Auto-deploy on push
  - ~30 second deployment time

### Technical Details
- **Stack**: Pure HTML5 + CSS3 + JavaScript (ES6+)
- **Dependencies**: ZERO (no frameworks, no npm, no build tools)
- **File Count**: 3 core files (index.html, style.css, editor.js)
- **Total Lines**: 1,050 lines (91 + 321 + 638)
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Performance**: 60 FPS with 100+ objects

### Known Limitations (Intentional MVP Decisions)
- No undo/redo (future feature)
- No grid snapping (future feature)
- No layer management (future feature)
- No zoom/pan (future feature)
- No touch/mobile support (desktop-first)
- No multi-select (single selection only)
- No collision detection on rotated objects (AABB only)
- No automated tests (manual QA sufficient for MVP)

### Design Decisions
- **Monolithic Class**: Single GameEditor class (simple mental model)
- **No Framework**: Zero dependencies, faster load, easier maintenance
- **Canvas Over SVG**: Better performance for many objects
- **Data URLs**: Complete offline capability, no server needed
- **Full Redraw**: Simple and reliable, fast enough for use case

### Browser APIs Used
- HTML5 Canvas (2D Context)
- FileReader API
- Clipboard API (with fallback)
- Blob API
- requestAnimationFrame
- localStorage (for future use)

### File Structure
```
Game Editor/
├── index.html (91 lines)
├── style.css (321 lines)
├── editor.js (638 lines)
├── README.md
├── .gitignore
├── docs/ (documentation hub)
│   ├── ai/ (AI-specific)
│   ├── technical/ (architecture + API)
│   ├── workflows/ (task guides)
│   └── CHANGELOG.md (this file)
└── [legacy spec files]
```

### Contributors
- **Built By**: AI (Claude Sonnet 4.5)
- **Guided By**: The D&D Fellowship Party
  - Shadowstep (Silk) - Marketing & Strategy
  - Skytalon (Kael) - UX Design
  - Ironpaw (Bjorn) - Technical Systems
  - Sage (Lyra) - Game Design
  - The Dungeon Master - Orchestration

### Special Thanks
- User for embracing the MVP philosophy
- The Fellowship for brutal honesty about over-engineering
- The 5,000 lines of rejected specs (taught us what NOT to build)

---

## How to Read This Changelog

### Categories
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

### Semantic Versioning
Given a version number MAJOR.MINOR.PATCH:
- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible new features
- **PATCH**: Backwards-compatible bug fixes

Current version: **1.0.0** (First stable release)

### Update Frequency
This changelog is updated:
- **Immediately** after significant changes
- **Daily** during active development
- **Weekly** during maintenance mode

### Cross-References
- See [`AI_CONTEXT.md`](ai/AI_CONTEXT.md) for current state
- See [`ARCHITECTURE.md`](technical/ARCHITECTURE.md) for design changes
- See [`API_REFERENCE.md`](technical/API_REFERENCE.md) for code changes

---

## Version History

### [1.0.0] - 2025-12-11
- Initial MVP release
- Complete documentation system
- GitHub + Netlify deployment

---

## Future Versions (Planned)

### [1.1.0] - TBD
**User-Requested Features Only**
- Features will be added based on real usage feedback
- No pre-planned roadmap (MVP philosophy)
- Check GitHub Issues for feature requests

### [2.0.0] - TBD
**Major Features** (if explicitly requested):
- Undo/redo system
- Layer management
- Zoom/pan controls
- Grid snapping
- Multi-select

**Not implementing unless user specifically requests.**

---

## Documentation Updates

This changelog tracks code changes. For documentation changes, see:
- **Daily**: Check git commit messages
- **Weekly**: Review [`AI_CONTEXT.md`](ai/AI_CONTEXT.md) "Last Updated"
- **Monthly**: Full documentation audit

---

## Maintenance Notes

**For AI Assistants**:
- Update this file immediately after ANY code change
- Use format: `### [Type] - [Description]`
- Link to relevant documentation
- Include code examples when helpful
- Update "Last Updated" timestamp

**For Users**:
- Check this file to see what's new
- Compare versions to understand changes
- Use as reference for upgrade decisions

---

**Last Updated**: December 11, 2025  
**Next Review**: December 12, 2025  
**Maintained By**: AI Assistants (see FELLOWSHIP_GUIDE.md)
