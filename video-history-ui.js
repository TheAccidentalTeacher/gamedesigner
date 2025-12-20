/**
 * Video History UI - Grid view with filters and collections
 */

import { videoHistory } from './video-history-manager.js';
import { videoCollections } from './video-collections-manager.js';

export class VideoHistoryUI {
    constructor(container) {
        this.container = container;
        this.history = [];
        this.collections = [];
        this.currentFilter = 'all';
        this.currentSort = 'recent';
        this.selectedCollection = null;
    }

    /**
     * Render History tab
     */
    async render() {
        try {
            console.log('📚 History render() called');
            console.log('📚 Container:', this.container);
            
            if (!this.container) {
                console.error('❌ No container found!');
                return;
            }
            
            // Load history and collections
            console.log('📚 Loading videos from history manager...');
            this.history = videoHistory.getRecentVideos(); // Get all videos from history
            console.log('📚 Loading collections...');
            this.collections = videoCollections.getAllCollections();
            
            console.log(`📚 Loaded ${this.history.length} videos, ${this.collections.length} collections`);
            
            // Build UI
            console.log('📚 Building UI HTML...');
            this.container.innerHTML = `
            <div style="display: flex; height: 100%; overflow: hidden;">
                <!-- Collections Sidebar -->
                <div id="collections-sidebar" style="width: 220px; border-right: 1px solid rgba(255,255,255,0.1); padding: 15px; overflow-y: auto; flex-shrink: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h3 style="margin: 0; font-size: 14px; color: #61dafb;">Collections</h3>
                        <button id="new-collection-btn" style="padding: 4px 8px; background: rgba(97, 218, 251, 0.2); border: 1px solid #61dafb; border-radius: 4px; color: #61dafb; cursor: pointer; font-size: 12px;">➕ New</button>
                    </div>
                    <div id="collections-list"></div>
                </div>
                
                <!-- Main Content -->
                <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                    <!-- Filters -->
                    <div style="display: flex; gap: 10px; padding: 15px; flex-shrink: 0; flex-wrap: wrap; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; gap: 8px;">
                            <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                            <button class="filter-btn ${this.currentFilter === 'starred' ? 'active' : ''}" data-filter="starred">⭐ Starred</button>
                            <button class="filter-btn ${this.currentFilter === 'recent' ? 'active' : ''}" data-filter="recent">🕒 Recent</button>
                        </div>
                        
                        <select id="history-sort" style="padding: 6px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #999; cursor: pointer; font-size: 13px;">
                            <option value="recent">Sort: Most Recent</option>
                            <option value="title">Sort: Title A-Z</option>
                            <option value="duration">Sort: Duration</option>
                        </select>
                        
                        <input type="text" id="history-search" placeholder="Search..." style="flex: 1; min-width: 200px; padding: 6px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #fff; font-size: 13px;" />
                    </div>
                    
                    <!-- Grid -->
                    <div id="video-history-grid" style="flex: 1; overflow-y: auto; padding: 15px;"></div>
                </div>
            </div>
        `;
        
        console.log('📚 UI HTML built, rendering collections sidebar...');
        
        // Render collections and grid
        this.renderCollectionsSidebar();
        
        console.log('📚 Rendering grid...');
        this.renderGrid();
        
        console.log('📚 Attaching event listeners...');
        // Event listeners
        this.attachEventListeners();
        
        console.log('📚 ✅ Render complete!');
        
        } catch (error) {
            console.error('❌ Error in render():', error);
            console.error('Stack trace:', error.stack);
        }
    }

    renderGrid() {
        console.log('📚 renderGrid() called');
        const grid = document.getElementById('video-history-grid');
        if (!grid) {
            console.error('❌ video-history-grid element not found!');
            return;
        }

        let filtered = this.filterVideos(this.history);
        console.log(`📚 Filtered ${filtered.length} videos`);
        
        // Filter by selected collection
        if (this.selectedCollection) {
            const collection = this.collections.find(c => c.id === this.selectedCollection);
            if (collection) {
                filtered = filtered.filter(v => collection.video_ids.includes(v.videoId || v.video_id));
            }
        }
        
        filtered = this.sortVideos(filtered);

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="text-align: center; padding: 60px; color: #999;">
                    <div style="font-size: 64px; margin-bottom: 20px;">📚</div>
                    <h3 style="color: #61dafb;">No Videos Found</h3>
                    <p>Load a video to start building your library</p>
                </div>
            `;
            return;
        }

        const html = filtered.map(v => this.renderVideoCard(v)).join('');
        grid.innerHTML = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">${html}</div>`;
    }

    renderVideoCard(video) {
        const videoId = video.videoId || video.video_id;
        const title = video.title || 'Unknown';
        const channel = video.channelName || video.channel_name || 'Unknown';
        const thumbnail = video.thumbnail || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
        const starred = video.starred || false;
        const toolsUsed = video.tools_used || [];
        
        const toolIcons = toolsUsed.map(tool => {
            const icons = {'Quiz': '📝', 'Lesson Plan': '📚', 'Discussion Questions': '💬', 'DOK Project': '🎯', 'Vocabulary': '📖', 'Guided Notes': '📓', 'Graphic Organizer': '🗺️'};
            return `<span style="font-size: 16px;" title="${tool}">${icons[tool] || '✅'}</span>`;
        }).join('');
        
        // Collection badges
        const videoCollections = this.collections.filter(c => c.video_ids.includes(videoId));
        const collectionBadges = videoCollections.map(c => 
            `<span style="display: inline-block; padding: 2px 6px; background: ${c.color}22; border: 1px solid ${c.color}; border-radius: 3px; font-size: 10px; color: ${c.color}; margin-right: 4px;">${c.name}</span>`
        ).join('');
        
        return `
            <div class="video-card" data-video-id="${videoId}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; transition: all 0.2s; position: relative; cursor: pointer;">
                <div style="position: relative;">
                    <img src="${thumbnail}" style="width: 100%; aspect-ratio: 16/9; object-fit: cover;" />
                    <button class="star-btn ${starred ? 'starred' : ''}" data-video-id="${videoId}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 16px;">
                        ${starred ? '⭐' : '☆'}
                    </button>
                    <button class="add-to-collection-btn" data-video-id="${videoId}" style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); border: 1px solid rgba(97, 218, 251, 0.5); padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 12px; color: #61dafb;">
                        ➕
                    </button>
                </div>
                <div style="padding: 12px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #fff; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${title}</h4>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #999;">${channel}</p>
                    ${collectionBadges ? `<div style="margin-bottom: 8px;">${collectionBadges}</div>` : ''}
                    ${toolIcons ? `<div style="margin-bottom: 12px;">${toolIcons}</div>` : ''}
                    <button class="load-video-btn" data-video-id="${videoId}" style="width: 100%; padding: 8px; background: rgba(97, 218, 251, 0.2); border: 1px solid #61dafb; border-radius: 6px; color: #61dafb; cursor: pointer; font-weight: bold;">🔄 Load</button>
                </div>
            </div>
        `;
    }

    filterVideos(videos) {
        if (this.currentFilter === 'starred') return videos.filter(v => v.starred);
        if (this.currentFilter === 'recent') {
            const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            return videos.filter(v => new Date(v.last_viewed || v.lastViewed || 0).getTime() > oneWeekAgo);
        }
        return videos;
    }

    sortVideos(videos) {
        if (this.currentSort === 'recent') {
            return [...videos].sort((a, b) => new Date(b.last_viewed || b.lastViewed || 0) - new Date(a.last_viewed || a.lastViewed || 0));
        }
        if (this.currentSort === 'title') {
            return [...videos].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }
        if (this.currentSort === 'duration') {
            return [...videos].sort((a, b) => (b.duration || 0) - (a.duration || 0));
        }
        return videos;
    }

    attachEventListeners() {
        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.filter;
                this.selectedCollection = null;
                this.render();
            });
        });
        
        // Sort
        const sort = document.getElementById('history-sort');
        if (sort) {
            sort.addEventListener('change', () => {
                this.currentSort = sort.value;
                this.renderGrid();
            });
        }
        
        // Search
        const search = document.getElementById('history-search');
        if (search) {
            search.addEventListener('input', async (e) => {
                const query = e.target.value.toLowerCase();
                if (!query) {
                    this.history = await videoHistory.getAllVideos();
                    this.renderGrid();
                    return;
                }
                this.history = this.history.filter(v => 
                    (v.title || '').toLowerCase().includes(query) || 
                    (v.channelName || v.channel_name || '').toLowerCase().includes(query)
                );
                this.renderGrid();
            });
        }
        
        // New collection button
        const newCollBtn = document.getElementById('new-collection-btn');
        if (newCollBtn) {
            newCollBtn.addEventListener('click', () => this.showCreateCollectionModal());
        }
        
        // Load video
        document.querySelectorAll('.load-video-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const videoId = btn.dataset.videoId;
                this.loadVideo(videoId);
            });
        });
        
        // Video card clicks - LOAD THE VIDEO!
        document.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', async (e) => {
                // Don't trigger if clicking star or add-to-collection button
                if (e.target.closest('.star-btn') || e.target.closest('.add-to-collection-btn')) {
                    return;
                }
                
                const videoId = card.dataset.videoId;
                console.log(`📺 Loading video from history: ${videoId}`);
                
                // Find the video data
                const video = this.history.find(v => (v.video_id || v.videoId) === videoId);
                if (!video) {
                    console.error('❌ Video not found in history');
                    return;
                }
                
                // Load the video
                this.loadVideo(video);
            });
        });
        
        // Star
        document.querySelectorAll('.star-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const videoId = btn.dataset.videoId;
                await videoHistory.starVideo(videoId);
                await this.render();
            });
        });
        
        // Add to collection
        document.querySelectorAll('.add-to-collection-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const videoId = btn.dataset.videoId;
                this.showAddToCollectionModal(videoId);
            });
        });
    }
    
    /**
     * Load video from history (instant - no API calls!)
     */
    loadVideo(video) {
        console.log('═══════════════════════════════════════════════');
        console.log('📺 LOADING VIDEO FROM HISTORY');
        console.log('═══════════════════════════════════════════════');
        console.log('Video data:', {
            videoId: video.video_id || video.videoId,
            title: video.title,
            hasTranscript: !!video.transcript
        });
        
        const videoId = video.video_id || video.videoId;
        
        // STEP 1: Check modal
        const modal = document.getElementById('video-modal');
        console.log('1️⃣ Modal element:', modal ? '✅ EXISTS' : '❌ NOT FOUND');
        
        // STEP 2: Check window.videoUI
        console.log('2️⃣ window.videoUI:', window.videoUI ? '✅ EXISTS' : '❌ NOT FOUND');
        if (window.videoUI) {
            console.log('   - handleModalLoadVideo:', typeof window.videoUI.handleModalLoadVideo);
            console.log('   - currentVideo:', window.videoUI.currentVideo);
        }
        
        // STEP 3: Check modal input
        const modalInput = document.getElementById('video-modal-input');
        console.log('3️⃣ Modal input element:', modalInput ? '✅ EXISTS' : '❌ NOT FOUND');
        
        // STEP 4: Check load button
        const loadBtn = document.getElementById('video-modal-load-btn');
        console.log('4️⃣ Load button element:', loadBtn ? '✅ EXISTS' : '❌ NOT FOUND');
        
        // STEP 5: Set input value and try to load
        if (modalInput) {
            console.log('5️⃣ Setting input value to:', videoId);
            modalInput.value = videoId;
            console.log('   Input value is now:', modalInput.value);
            
            // Try clicking the load button
            if (loadBtn) {
                console.log('6️⃣ Clicking load button...');
                loadBtn.click();
                console.log('   ✅ Load button clicked!');
            } else if (window.videoUI && window.videoUI.handleModalLoadVideo) {
                console.log('6️⃣ Calling handleModalLoadVideo directly...');
                try {
                    window.videoUI.handleModalLoadVideo();
                    console.log('   ✅ handleModalLoadVideo called!');
                } catch (err) {
                    console.error('   ❌ ERROR calling handleModalLoadVideo:', err);
                    this.loadVideoDirectly(video);
                }
            } else {
                console.error('6️⃣ ❌ No way to trigger load! Using fallback...');
                this.loadVideoDirectly(video);
            }
        } else {
            console.error('5️⃣ ❌ Modal input not found! Using fallback...');
            this.loadVideoDirectly(video);
        }
        
        console.log('═══════════════════════════════════════════════');
    }
    
    /**
     * Direct load fallback (if videoUI not available)
     */
    loadVideoDirectly(video) {
        const videoId = video.video_id || video.videoId;
        
        // Open modal
        const modal = document.getElementById('video-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
        
        // Hide search results, show video content
        const searchContainer = document.getElementById('video-modal-search-results-container');
        const videoContent = document.getElementById('video-modal-content');
        if (searchContainer) searchContainer.style.display = 'none';
        if (videoContent) videoContent.style.display = 'block';
        
        // Show video player
        const videoContainer = document.getElementById('video-modal-video-container');
        if (videoContainer) {
            videoContainer.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}" 
                    style="width: 100%; height: 100%; border: none; border-radius: 8px;"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        }
        
        // Show video info
        const videoInfo = document.getElementById('video-modal-video-info');
        if (videoInfo) {
            videoInfo.innerHTML = `
                <h2 style="margin: 0 0 8px 0; font-size: 18px; color: white;">${video.title}</h2>
                <p style="margin: 0; color: #888; font-size: 14px;">${video.channel_name || video.channelName || 'Unknown'}</p>
            `;
        }
        
        // Show transcript if available
        if (video.transcript) {
            const transcriptContent = document.getElementById('video-modal-transcript-content');
            if (transcriptContent && video.transcript.segments) {
                transcriptContent.innerHTML = video.transcript.segments.map(segment => `
                    <div style="margin-bottom: 12px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px; cursor: pointer;" 
                         data-timestamp="${segment.start}">
                        <span style="color: #61dafb; font-size: 12px; margin-right: 8px;">${this.formatTime(segment.start)}</span>
                        <span style="color: #ccc;">${segment.text}</span>
                    </div>
                `).join('');
            }
            
            // Switch to transcript tab
            const transcriptTab = document.querySelector('[data-video-tab="transcript"]');
            if (transcriptTab) {
                setTimeout(() => transcriptTab.click(), 100);
            }
        }
        
        console.log('✅ Video loaded directly!');
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    renderCollectionsSidebar() {
        const sidebar = document.getElementById('collections-list');
        if (!sidebar) return;
        
        if (this.collections.length === 0) {
            sidebar.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                    <p>No collections yet</p>
                    <p style="font-size: 10px; margin-top: 8px;">Click "➕ New" to create one</p>
                </div>
            `;
            return;
        }
        
        const html = this.collections.map(c => `
            <div class="collection-item ${this.selectedCollection === c.id ? 'active' : ''}" data-collection-id="${c.id}" style="padding: 8px; margin-bottom: 6px; border-radius: 6px; cursor: pointer; background: ${this.selectedCollection === c.id ? 'rgba(97, 218, 251, 0.1)' : 'transparent'}; border-left: 3px solid ${c.color}; transition: all 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1; overflow: hidden;">
                        <div style="font-size: 13px; font-weight: bold; color: ${this.selectedCollection === c.id ? '#61dafb' : '#fff'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.name}</div>
                        <div style="font-size: 11px; color: #666;">${c.video_ids.length} videos</div>
                    </div>
                    <button class="collection-menu-btn" data-collection-id="${c.id}" style="padding: 4px 8px; background: none; border: none; color: #666; cursor: pointer; font-size: 16px;">⋮</button>
                </div>
            </div>
        `).join('');
        
        sidebar.innerHTML = html;
        
        // Collection click to filter
        document.querySelectorAll('.collection-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('collection-menu-btn')) return;
                const collectionId = item.dataset.collectionId;
                this.selectedCollection = this.selectedCollection === collectionId ? null : collectionId;
                this.currentFilter = 'all';
                this.render();
            });
        });
        
        // Collection menu
        document.querySelectorAll('.collection-menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const collectionId = btn.dataset.collectionId;
                this.showCollectionMenu(collectionId, e);
            });
        });
    }
    
    showCreateCollectionModal() {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;';
        
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        
        modal.innerHTML = `
            <div style="background: #1e1e1e; border-radius: 12px; padding: 24px; width: 400px; max-width: 90vw;">
                <h3 style="margin: 0 0 20px 0; color: #61dafb;">Create Collection</h3>
                <input type="text" id="collection-name" placeholder="Collection name..." style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; margin-bottom: 12px;" />
                <textarea id="collection-desc" placeholder="Description (optional)..." style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; margin-bottom: 12px; resize: vertical; height: 60px;"></textarea>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 12px; color: #999;">Color</label>
                    <div style="display: flex; gap: 8px;">
                        ${colors.map(color => `<button class="color-btn" data-color="${color}" style="width: 40px; height: 40px; border-radius: 6px; background: ${color}; border: 2px solid transparent; cursor: pointer;"></button>`).join('')}
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="cancel-collection-btn" style="padding: 8px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #999; cursor: pointer;">Cancel</button>
                    <button id="create-collection-btn" style="padding: 8px 16px; background: rgba(97, 218, 251, 0.2); border: 1px solid #61dafb; border-radius: 6px; color: #61dafb; cursor: pointer; font-weight: bold;">Create</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        let selectedColor = colors[0];
        
        modal.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.color-btn').forEach(b => b.style.borderColor = 'transparent');
                btn.style.borderColor = '#fff';
                selectedColor = btn.dataset.color;
            });
        });
        modal.querySelector('.color-btn').style.borderColor = '#fff';
        
        modal.querySelector('#cancel-collection-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#create-collection-btn').addEventListener('click', async () => {
            const name = modal.querySelector('#collection-name').value.trim();
            const desc = modal.querySelector('#collection-desc').value.trim();
            
            if (!name) {
                alert('Please enter a collection name');
                return;
            }
            
            try {
                await videoCollections.createCollection(name, desc, selectedColor);
                document.body.removeChild(modal);
                await this.render();
            } catch (error) {
                alert('Error creating collection: ' + error.message);
            }
        });
        
        modal.querySelector('#collection-name').focus();
    }
    
    showAddToCollectionModal(videoId) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;';
        
        const videoCollectionIds = this.collections.filter(c => c.video_ids.includes(videoId)).map(c => c.id);
        
        modal.innerHTML = `
            <div style="background: #1e1e1e; border-radius: 12px; padding: 24px; width: 300px; max-width: 90vw;">
                <h3 style="margin: 0 0 16px 0; color: #61dafb;">Add to Collection</h3>
                <div style="max-height: 300px; overflow-y: auto; margin-bottom: 16px;">
                    ${this.collections.map(c => `
                        <label style="display: flex; align-items: center; padding: 8px; margin-bottom: 6px; border-radius: 6px; cursor: pointer; background: rgba(255,255,255,0.02); border-left: 3px solid ${c.color};">
                            <input type="checkbox" ${videoCollectionIds.includes(c.id) ? 'checked' : ''} data-collection-id="${c.id}" style="margin-right: 10px;" />
                            <span style="color: #fff; font-size: 13px;">${c.name}</span>
                        </label>
                    `).join('')}
                </div>
                <button id="done-collection-btn" style="width: 100%; padding: 8px; background: rgba(97, 218, 251, 0.2); border: 1px solid #61dafb; border-radius: 6px; color: #61dafb; cursor: pointer; font-weight: bold;">Done</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#done-collection-btn').addEventListener('click', async () => {
            const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
            for (const checkbox of checkboxes) {
                const collectionId = checkbox.dataset.collectionId;
                if (checkbox.checked && !videoCollectionIds.includes(collectionId)) {
                    await videoCollections.addVideoToCollection(collectionId, videoId);
                } else if (!checkbox.checked && videoCollectionIds.includes(collectionId)) {
                    await videoCollections.removeVideoFromCollection(collectionId, videoId);
                }
            }
            document.body.removeChild(modal);
            await this.render();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    showCollectionMenu(collectionId, event) {
        const menu = document.createElement('div');
        menu.style.cssText = `position: fixed; top: ${event.clientY}px; left: ${event.clientX}px; background: #2a2a2a; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 10000;`;
        
        menu.innerHTML = `
            <button class="menu-item" data-action="rename" style="display: block; width: 100%; padding: 10px 16px; background: none; border: none; color: #fff; text-align: left; cursor: pointer; font-size: 13px;">✏️ Rename</button>
            <button class="menu-item" data-action="delete" style="display: block; width: 100%; padding: 10px 16px; background: none; border: none; color: #ef4444; text-align: left; cursor: pointer; font-size: 13px;">🗑️ Delete</button>
        `;
        
        document.body.appendChild(menu);
        
        menu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', async () => {
                const action = item.dataset.action;
                document.body.removeChild(menu);
                
                if (action === 'rename') {
                    const collection = this.collections.find(c => c.id === collectionId);
                    const newName = prompt('New collection name:', collection.name);
                    if (newName && newName.trim()) {
                        await videoCollections.renameCollection(collectionId, newName.trim());
                        await this.render();
                    }
                } else if (action === 'delete') {
                    const collection = this.collections.find(c => c.id === collectionId);
                    if (confirm(`Delete collection "${collection.name}"? (Videos will stay in history)`)) {
                        await videoCollections.deleteCollection(collectionId);
                        this.selectedCollection = null;
                        await this.render();
                    }
                }
            });
        });
        
        // Close menu on click outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                if (document.body.contains(menu)) {
                    document.body.removeChild(menu);
                }
                document.removeEventListener('click', closeMenu);
            });
        }, 100);
    }

    async loadVideo(videoId) {
        // DON'T switch tabs - just open the modal!
        // The user is in History tab, let them stay there
        
        // Load video
        const input = document.getElementById('video-modal-input');
        if (input) input.value = `https://www.youtube.com/watch?v=${videoId}`;
        
        const loadBtn = document.getElementById('video-modal-load-btn');
        if (loadBtn) loadBtn.click();
    }
}
