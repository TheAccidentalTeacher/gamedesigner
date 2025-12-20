# Phase 8 Week 4: Video History & Batch Operations

**Last Updated**: December 17, 2025
**Status**: Planning Complete - Ready to Implement

---

## Overview

Transform Video Intelligence modal into full-featured video library with history tracking, batch operations, and automatic transcript loading.

**User Requirements** (Dec 17):
1. ✅ Cloud storage (Supabase sync)
2. ✅ All batch operations (weekly summary, combined quiz, vocab, exports)
3. ✅ Full screen modal with dedicated History/Batch tabs
4. ✅ Auto-load transcripts (no manual clicking!)

---

## 1. Auto-Load Transcripts (UX Fix)

### Current Problem
User must manually click "Load Transcript" button after every video load.

### Solution
**Automatic background loading**:
- Video loads → transcript immediately starts fetching
- Show loading spinner on transcript icon
- When ready, transcript tab shows ✅ and becomes clickable
- No manual intervention needed

### Implementation
```javascript
// In video-ui.js loadVideo()
async function loadVideo(videoId) {
    // Load metadata
    const metadata = await fetchVideoMetadata(videoId);
    
    // Start transcript loading immediately (background)
    loadTranscriptAutomatically(videoId);
    
    // User can start using other features while transcript loads
}

async function loadTranscriptAutomatically(videoId) {
    try {
        const transcript = await fetchTranscript(videoId);
        
        // Save to current video state
        window.currentVideoTranscript = transcript;
        
        // Update UI: show ✅ on Transcript tab
        updateTranscriptTabStatus('ready');
        
        // Save to history with transcript included
        saveVideoToHistory(videoId, { transcript });
        
    } catch (error) {
        // If transcript fails, show warning but don't block
        console.warn('Transcript unavailable:', error);
        updateTranscriptTabStatus('unavailable');
    }
}
```

**Benefits**:
- No extra clicks
- Faster workflow
- Transcript ready when user needs it
- Creates, Summary, Analysis can start immediately

---

## 2. Full Screen Modal Redesign

### Current Size
95vw × 95vh (already large)

### New Size
**98vw × 98vh** (nearly full screen)

### New Tab Structure

```
┌─────────────────────────────────────────────────────────────┐
│ 🎬 Video Intelligence                                    [X] │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Search │ 📚 History │ 📦 Batch │ 📺 Current Video        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│              TAB CONTENT (changes based on selection)         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Tab 1: 🔍 Search/Load
- Current search functionality
- Direct video ID input
- Search results grid
- Click video → auto-loads + auto-fetches transcript

### Tab 2: 📚 History
- Grid view of recent videos (last 50)
- Thumbnail, title, channel, duration
- Date added, last accessed
- Tool usage icons (✅ Quiz, ✅ Notes, ⬜ Vocab)
- Star/favorite toggle
- Collections dropdown
- Click video → instantly loads (transcript already saved)

### Tab 3: 📦 Batch
- Multi-select mode for videos from history
- Batch action buttons:
  - 📝 Weekly Summary (combine all selected)
  - 📊 Combined Quiz (questions from all)
  - 📚 Master Vocabulary (all terms)
  - 🗂️ Unit Study Guide (complete)
  - 📄 Export All (ZIP or PDF)
- Collection manager (create/edit/delete)
- Weekly digest (auto-selects last 7 days)

### Tab 4: 📺 Current Video
- Shows when a video is loaded
- Video player + metadata (left side)
- Tabs for: Transcript, Summary, Analysis, Create (right side)
- All existing functionality
- "Add to Collection" button
- "Star Video" button

---

## 3. Video History (Cloud Sync)

### Data Structure

**Supabase Table: `video_history`**
```sql
CREATE TABLE video_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    video_id TEXT NOT NULL,
    title TEXT,
    channel_name TEXT,
    thumbnail_url TEXT,
    duration INTEGER,
    transcript JSONB,  -- Store full transcript
    date_added TIMESTAMP DEFAULT NOW(),
    last_accessed TIMESTAMP DEFAULT NOW(),
    times_viewed INTEGER DEFAULT 1,
    is_starred BOOLEAN DEFAULT FALSE,
    collections TEXT[],  -- Array of collection names
    tools_used JSONB,  -- { quiz: true, notes: true, vocab: false }
    UNIQUE(user_id, video_id)
);

CREATE INDEX idx_video_history_user ON video_history(user_id);
CREATE INDEX idx_video_history_starred ON video_history(user_id, is_starred);
```

### Features

**Automatic Saving**:
- Every video loaded → saved to history
- Transcript saved with video (no re-fetching)
- Tool usage tracked automatically
- Last accessed timestamp updated

**Quick Reload**:
- Click video in history → instant load
- Transcript already available (no API call)
- All metadata cached

**Search History**:
- Filter by title/channel
- Sort by date added, last accessed, most viewed
- Show only starred videos
- Filter by collection

---

## 4. Collections/Playlists

### Data Structure

**Supabase Table: `video_collections`**
```sql
CREATE TABLE video_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    video_ids TEXT[],  -- Array of video IDs
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    color TEXT DEFAULT '#3b82f6',  -- For visual distinction
    UNIQUE(user_id, name)
);
```

### Features

**Create Collections**:
- Button: "New Collection"
- Name: "Week 1 Science", "American Revolution", etc.
- Description: "Videos for unit on cellular biology"
- Color picker for visual organization

**Manage Videos**:
- Right-click video → "Add to Collection"
- Drag-and-drop interface
- Remove from collection
- Move between collections

**Collection View**:
- Shows all videos in collection
- Thumbnails in grid
- Total duration, total videos
- "Generate Combined Summary" button
- Export entire collection

---

## 5. Batch Operations

### Weekly Summary

**User Action**: Select 5-10 videos → Click "Weekly Summary"

**Backend Process**:
```javascript
// netlify/functions/video-batch-summary.cjs

// 1. Collect all transcripts
const allTranscripts = videos.map(v => v.transcript);

// 2. Send to Claude with special prompt
const prompt = `
You are synthesizing ${videos.length} educational videos into a comprehensive weekly summary.

Videos:
${videos.map((v, i) => `${i+1}. "${v.title}" by ${v.channel}`).join('\n')}

Create a master summary that:
1. TLDR: 2-3 sentences covering all videos
2. Major Themes: What common topics/concepts appeared?
3. Key Insights: Most important takeaways from each video
4. Connections: How do these videos relate to each other?
5. Complete Topic Coverage: What does this collection teach about [subject]?
6. Study Recommendations: Best order to watch, which is foundational

Format as structured markdown.
`;

// 3. Generate combined summary
const summary = await claude.generate(prompt);

// 4. Return to frontend
return { summary, videoCount: videos.length };
```

**Output**: One document synthesizing all videos

---

### Combined Quiz

**User Action**: Select videos → Click "Combined Quiz"

**Backend Process**:
```javascript
// netlify/functions/video-batch-quiz.cjs

// Generate questions that:
// - Cover content from ALL videos
// - Test connections between videos
// - Include questions like "In which video did we learn about X?"
// - Mix difficulty levels across all sources

const prompt = `
Create a comprehensive quiz covering ${videos.length} videos:

${videos.map((v, i) => `
Video ${i+1}: "${v.title}"
Key Topics: [extract from transcript]
`).join('\n')}

Generate 20 questions:
- 10 Multiple Choice (cover all videos)
- 5 Short Answer (synthesize concepts)
- 5 True/False (verify understanding)

Each question should indicate which video(s) it relates to.
`;
```

**Output**: Quiz covering entire collection

---

### Master Vocabulary

**User Action**: Select videos → Click "Master Vocabulary"

**Backend Process**:
```javascript
// Extract key terms from ALL videos
// Remove duplicates
// Combine definitions if term appears in multiple videos
// Generate comprehensive vocabulary list

const prompt = `
Extract vocabulary from ${videos.length} videos.

For each term:
- Definition (combine insights from all videos where it appears)
- In which video(s) it was explained
- Example sentences from different videos
- Connections between videos using this term
`;
```

**Output**: Master vocabulary list (20-40 terms)

---

### Unit Study Guide

**User Action**: Select videos → Click "Unit Study Guide"

**Backend Process**:
```javascript
// Combine ALL tools into one document:
// - Weekly Summary
// - Combined Quiz
// - Master Vocabulary
// - Key Timestamps from all videos
// - Suggested study order
// - Practice exercises

// Export as:
// - Markdown
// - Word (docx)
// - PDF (future)
```

**Output**: Complete curriculum guide

---

## 6. Implementation Plan

### Day 1: Auto-Load Transcripts + History Storage (4 hours)

**Tasks**:
- Modify `loadVideo()` to auto-fetch transcript
- Create Supabase `video_history` table
- Implement save-to-history function
- Test cloud sync

**Files Modified**:
- `video-ui.js` (auto-load logic)
- Supabase migration SQL
- New: `video-history-manager.js`

---

### Day 2: History Tab UI (4 hours)

**Tasks**:
- Redesign modal to 98vw × 98vh
- Create 4-tab structure (Search, History, Batch, Current)
- Build History tab with grid view
- Implement star/favorite toggle
- Quick reload functionality

**Files Modified**:
- `video-ui.js` (tab structure)
- `style.css` (full screen modal, grid layout)
- New: `video-history-ui.js`

---

### Day 3: Collections (4 hours)

**Tasks**:
- Create Supabase `video_collections` table
- Collection manager UI (create/edit/delete)
- Add video to collection functionality
- Collection view in History tab
- Color-coded collections

**Files Modified**:
- Supabase migration SQL
- New: `video-collections.js`
- `video-history-ui.js` (collection integration)

---

### Day 4: Batch Tab + Multi-Select (4 hours)

**Tasks**:
- Batch tab UI
- Multi-select checkboxes in History
- "Select All" / "Select None" buttons
- Batch action dropdown
- Visual feedback for selected videos

**Files Modified**:
- `video-ui.js` (Batch tab)
- `video-history-ui.js` (multi-select)
- `style.css` (batch UI)

---

### Day 5: Weekly Summary Backend (3 hours)

**Tasks**:
- Create `video-batch-summary.cjs` endpoint
- Implement Claude prompt for synthesis
- Handle multiple transcripts
- Test with 5-10 videos
- Frontend integration

**Files Created**:
- `netlify/functions/video-batch-summary.cjs`
- Frontend: `video-batch-tools.js`

---

### Day 6: Combined Quiz + Vocabulary (3 hours)

**Tasks**:
- Create `video-batch-quiz.cjs` endpoint
- Create `video-batch-vocabulary.cjs` endpoint
- Generate questions spanning multiple videos
- Merge vocabulary from all sources
- Frontend integration

**Files Created**:
- `netlify/functions/video-batch-quiz.cjs`
- `netlify/functions/video-batch-vocabulary.cjs`

---

### Day 7: Unit Study Guide + Export (3 hours)

**Tasks**:
- Combine all batch tools into one document
- Generate comprehensive study guide
- Export as Markdown, Word (docx)
- Test with real 7-day video history
- Polish UI/UX

**Files Modified**:
- `video-batch-tools.js` (export logic)
- Test with Alaska video + others

---

## 7. Success Criteria

### Must Have (MVP)
- ✅ Auto-load transcripts (no manual clicking)
- ✅ Video history (last 50 videos)
- ✅ Star/favorite videos
- ✅ Cloud sync (Supabase)
- ✅ Multi-select batch mode
- ✅ Weekly summary generator
- ✅ Full screen modal (98vw × 98vh)

### Should Have (High Value)
- ✅ Collections/playlists
- ✅ Combined quiz from multiple videos
- ✅ Master vocabulary from multiple videos
- ✅ Tool usage tracking
- ✅ Quick reload from history

### Nice to Have (Polish)
- ⭐ Grid vs list view toggle
- ⭐ Search within history
- ⭐ Duplicate detection
- ⭐ Export collection as PDF
- ⭐ Weekly digest auto-generator (Fridays)

---

## 8. Technical Architecture

### Frontend Structure
```
video-ui.js (main orchestrator)
├── video-history-ui.js (History tab)
├── video-collections.js (Collections manager)
├── video-batch-tools.js (Batch operations)
└── video-content-tools.js (existing Create tools)
```

### Backend Endpoints
```
netlify/functions/
├── video-batch-summary.cjs (weekly summary)
├── video-batch-quiz.cjs (combined quiz)
├── video-batch-vocabulary.cjs (master vocab list)
└── video-batch-study-guide.cjs (complete export)
```

### Supabase Tables
```
video_history (user's video library)
video_collections (playlists/units)
```

---

## 9. User Workflow Examples

### Example 1: Weekly Review (Friday)

**Old Workflow**:
1. Try to remember which videos we watched
2. Search for each one individually
3. Generate content one at a time
4. Manually combine notes

**New Workflow**:
1. Open Video Intelligence modal
2. Click "History" tab
3. See this week's 8 videos with thumbnails
4. Click "Select This Week" button
5. Click "Weekly Summary" → wait 60 seconds
6. Get one document synthesizing all 8 videos
7. Export as Word doc → print for student

**Time Saved**: 45 minutes → 2 minutes

---

### Example 2: Unit Planning

**Old Workflow**:
1. Search for American Revolution videos
2. Watch/load each one
3. Take notes manually
4. Create quiz questions myself

**New Workflow**:
1. Search "American Revolution" throughout the week
2. Load 5 good videos
3. Create collection: "American Revolution Unit"
4. Add all 5 videos to collection
5. Right-click collection → "Unit Study Guide"
6. Get: Combined summary, 30-question quiz, vocabulary list, timeline
7. Export as complete curriculum

**Time Saved**: 6+ hours → 20 minutes

---

### Example 3: Daily Use

**Old Workflow**:
1. Search for video
2. Click video
3. Wait for load
4. Click "Load Transcript"
5. Wait for transcript
6. Switch to Create tab
7. Generate quiz

**New Workflow**:
1. Search for video
2. Click video → transcript auto-loads in background
3. Click "Quiz" immediately (transcript ready)
4. Done

**Clicks Saved**: 7 clicks → 3 clicks

---

## 10. Estimated Timeline

**Total Time**: 24-26 hours (3-4 full days)

**Day 1**: Auto-transcripts + History storage (4h)
**Day 2**: History tab UI (4h)
**Day 3**: Collections (4h)
**Day 4**: Batch tab + Multi-select (4h)
**Day 5**: Weekly summary backend (3h)
**Day 6**: Combined quiz + vocab (3h)
**Day 7**: Study guide + export + polish (3h)

**Target Completion**: December 20-21, 2025

---

## 11. Next Steps

**Immediate Actions**:

1. **Test Discussion Questions fix first** (from earlier today)
   - Hard refresh browser
   - Verify full content generates
   - Confirm console is clean

2. **Start Phase 8 Week 4**
   - Begin with auto-transcript loading (quick win)
   - Then build History storage
   - Then UI redesign
   - Then batch operations

3. **User Validation**
   - After Day 2: Test History tab workflow
   - After Day 4: Test multi-select and batch UI
   - After Day 7: Full walkthrough with real curriculum planning

---

## Notes

**Why This Matters**:
- Transforms video tools from "one-off" to "curriculum builder"
- Aligns with homeschool workflow (weekly planning, unit building)
- Reduces repetitive work (transcript loading, re-searching)
- Creates reusable content library
- Enables sophisticated pedagogical strategies (multi-source synthesis)

**User Quote** (Dec 17):
> "I want to go back in my history, see my videos, and turn them all into a huge long-term summary of everything we've been over in that week or whatever."

This plan directly addresses that need. 🎯
