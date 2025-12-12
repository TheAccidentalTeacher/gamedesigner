# Daily Update Checklist
**Purpose**: Ensure documentation stays current and comprehensive  
**Frequency**: After EVERY code change (mandatory)  
**Time Required**: 5-10 minutes per update

---

## Immediate Updates (After Any Code Change)

### Step 1: Update Code Documentation
```
[ ] Add/update inline comments in changed code
[ ] Update method JSDoc comments
[ ] Add code examples if new pattern introduced
[ ] Update variable names for clarity
```

### Step 2: Update API_REFERENCE.md
```
[ ] Document new methods with full signatures
[ ] Update existing method docs if behavior changed
[ ] Add usage examples for new features
[ ] Update data structure definitions
[ ] Update method call graph if new dependencies
```

### Step 3: Update ARCHITECTURE.md
```
[ ] Update data flow diagrams if state changed
[ ] Document new design decisions
[ ] Update component overview if structure changed
[ ] Add performance notes if relevant
[ ] Update event system if new events added
```

### Step 4: Update AI_CONTEXT.md
```
[ ] Move feature from "What Doesn't Exist" to "What Exists"
[ ] Update "Current State" section
[ ] Update data structure examples
[ ] Update common tasks if new workflows
[ ] Update "Last Updated" timestamp
```

### Step 5: Update CHANGELOG.md
```
[ ] Add entry under appropriate category:
    - ### Added - New features
    - ### Changed - Modified functionality
    - ### Fixed - Bug fixes
    - ### Removed - Deleted features
[ ] Include code example if helpful
[ ] Link to related documentation
[ ] Update "Last Updated" timestamp
```

### Step 6: Update TROUBLESHOOTING.md (if applicable)
```
[ ] Document any new known issues
[ ] Add workarounds for edge cases
[ ] Update FAQ if new common question
[ ] Remove fixed issues
```

---

## Weekly Reviews (Every 7 Days)

### Documentation Health Check
```
[ ] Read through AI_CONTEXT.md - still accurate?
[ ] Check ARCHITECTURE.md - diagrams current?
[ ] Verify API_REFERENCE.md - all methods documented?
[ ] Review CHANGELOG.md - complete history?
[ ] Scan TROUBLESHOOTING.md - issues still relevant?
```

### Cross-Reference Audit
```
[ ] Check all internal links work
[ ] Verify line number references accurate
[ ] Update file paths if structure changed
[ ] Fix broken cross-references
```

### Timestamp Updates
```
[ ] Update "Last Updated" in all modified docs
[ ] Update "Next Review" dates
[ ] Update version numbers if applicable
```

---

## Monthly Maintenance (Every 30 Days)

### Complete Documentation Review
```
[ ] Read every documentation file completely
[ ] Verify accuracy against current code
[ ] Update outdated examples
[ ] Refresh screenshots if UI changed
[ ] Check external links (GitHub, Netlify, etc.)
```

### Documentation Metrics
```
[ ] Count total documentation lines
[ ] Calculate docs-to-code ratio
[ ] Update stats in README.md
[ ] Celebrate comprehensive documentation! 🎉
```

### Cleanup
```
[ ] Remove obsolete TODOs
[ ] Archive old changelog entries
[ ] Consolidate duplicate information
[ ] Simplify over-complex explanations
```

---

## Quality Standards

### Every Documentation File Must Have:
```
[ ] "Last Updated" date at top
[ ] "Version" number
[ ] "Purpose" statement
[ ] Table of contents (if > 200 lines)
[ ] Cross-references to related docs
[ ] Code examples (where applicable)
[ ] Clear section headers
```

### Code Comments Must Include:
```
[ ] What the code does (purpose)
[ ] Why it does it this way (rationale)
[ ] Any gotchas or edge cases
[ ] TODO markers for future improvements
```

### Commit Messages Must Include:
```
[ ] Type prefix (feat/fix/docs/style/refactor)
[ ] Concise description (< 50 chars)
[ ] Detailed explanation in body
[ ] References to updated docs
[ ] Breaking changes noted
```

---

## Pre-Commit Checklist

Before running `git commit`:

```
[ ] All code changes documented inline
[ ] API_REFERENCE.md updated
[ ] ARCHITECTURE.md updated (if design changed)
[ ] AI_CONTEXT.md updated (if state changed)
[ ] CHANGELOG.md entry added
[ ] All tests passed (see TESTING_PROTOCOL.md)
[ ] No console errors
[ ] Documentation timestamps updated
```

---

## Commit Message Template

```
[type]: Brief description (50 chars max)

Detailed explanation of changes:
- What changed
- Why it changed
- How it works now

Breaking changes: (if any)
- List breaking changes

Documentation updated:
- [ ] AI_CONTEXT.md
- [ ] ARCHITECTURE.md
- [ ] API_REFERENCE.md
- [ ] CHANGELOG.md
- [ ] Other: ___________

Related issues: #123
```

**Types**: feat, fix, docs, style, refactor, test, chore

---

## Documentation Philosophy

### Goals
1. **AI-First**: Optimize for AI comprehension
2. **Always Current**: Update immediately, not later
3. **Comprehensive**: Document everything, even "obvious" things
4. **Cross-Referenced**: Link related concepts
5. **Searchable**: Use clear headings and keywords

### Anti-Patterns to Avoid
- ❌ "Will document later" (Document NOW)
- ❌ "Code is self-documenting" (It's not)
- ❌ "Too obvious to document" (Document anyway)
- ❌ "Docs can wait until release" (Keep current always)
- ❌ "Just update the README" (Update ALL relevant docs)

---

## Emergency Documentation Update

If documentation fell behind:

### Step 1: Assess Damage
```
[ ] Compare code to API_REFERENCE.md
[ ] Check CHANGELOG for missing entries
[ ] Review AI_CONTEXT for accuracy
[ ] List all undocumented changes
```

### Step 2: Prioritize Updates
```
High Priority:
[ ] Critical functionality changes
[ ] Breaking changes
[ ] New user-facing features

Medium Priority:
[ ] Internal refactoring
[ ] Performance improvements
[ ] Bug fixes

Low Priority:
[ ] Code cleanup
[ ] Comment improvements
[ ] Style changes
```

### Step 3: Systematic Update
```
[ ] Start with CHANGELOG (what changed)
[ ] Update API_REFERENCE (how it works)
[ ] Update ARCHITECTURE (why it works this way)
[ ] Update AI_CONTEXT (current state)
[ ] Update README (user-facing changes)
```

---

## Documentation Debt Prevention

### Daily Habits
- Document BEFORE committing (not after)
- Treat docs as code (same standards)
- Review docs in code reviews
- Run documentation checks before merge

### Automation Ideas (Future)
- Pre-commit hooks to check doc updates
- CI check for "Last Updated" timestamps
- Automated doc/code comparison
- Documentation coverage reports

---

## Success Metrics

### Good Documentation
- ✅ Any AI can pick up project instantly
- ✅ No "hidden" knowledge in heads
- ✅ New features documented same day
- ✅ Bugs tracked in TROUBLESHOOTING
- ✅ All design decisions explained

### Great Documentation (This Project!)
- 🌟 Docs-to-code ratio > 4:1
- 🌟 Every line of code explained
- 🌟 Multiple perspectives (Fellowship)
- 🌟 Workflow guides for common tasks
- 🌟 Complete troubleshooting reference
- 🌟 Historical decision tracking

---

## Time Investment

### Per Code Change
- Inline comments: 2 minutes
- API updates: 3 minutes
- CHANGELOG entry: 2 minutes
- Architecture notes: 2 minutes
- **Total: ~10 minutes**

### ROI
- Time saved in future debugging: Hours
- Time saved onboarding new AI: Hours
- Confidence in codebase: Priceless

**Documentation is not overhead. Documentation is core feature.**

---

## Final Reminder

> "Future you will thank present you for good documentation."

And in AI development:

> "Future AI will thank present AI for epic documentation."

---

**Last Updated**: December 11, 2025  
**Next Review**: December 12, 2025  
**Compliance**: This checklist must be followed for ALL code changes
