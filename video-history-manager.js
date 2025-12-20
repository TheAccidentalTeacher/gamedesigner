/**
 * Video History Manager
 * Manages cloud sync of video history to Supabase
 * Auto-saves videos, tracks tool usage, manages collections
 */

import { supabase } from './supabase-client.js';

class VideoHistoryManager {
    constructor() {
        this.currentUser = null;
        this.historyCache = []; // Local cache for fast access
        this.initialized = false;
    }

    /**
     * Initialize history manager (call after auth)
     */
    async initialize() {
        if (this.initialized) return;

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        this.currentUser = user;

        if (!user) {
            console.log('📚 Video history: No user logged in, using local storage only');
            this.initialized = true;
            return;
        }

        // Load history from cloud
        await this.loadHistory();
        this.initialized = true;
        console.log('📚 Video history initialized:', this.historyCache.length, 'videos');
    }

    /**
     * Save or update video in history
     * @param {Object} videoData - Video metadata and transcript
     */
    async saveVideo(videoData) {
        const { videoId, title, channelName, channelId, thumbnail, duration, description, transcript } = videoData;

        if (!videoId || !title) {
            console.error('❌ Cannot save video: missing required fields');
            return false;
        }

        // If user logged in, save to Supabase
        if (this.currentUser) {
            try {
                // Check if video already exists
                const { data: existing } = await supabase
                    .from('video_history')
                    .select('id, times_viewed')
                    .eq('video_id', videoId)
                    .single();

                if (existing) {
                    // Update existing: increment views, update last_accessed
                    const { error } = await supabase
                        .from('video_history')
                        .update({
                            last_accessed: new Date().toISOString(),
                            times_viewed: existing.times_viewed + 1
                        })
                        .eq('video_id', videoId);

                    if (error) throw error;
                    console.log('📚 Video history updated:', title);
                } else {
                    // Insert new video
                    const { error } = await supabase
                        .from('video_history')
                        .insert({
                            user_id: this.currentUser.id,
                            video_id: videoId,
                            title: title,
                            channel_name: channelName || 'Unknown',
                            channel_id: channelId || null,
                            thumbnail_url: thumbnail || null,
                            duration: duration || 0,
                            description: description || null,
                            transcript: transcript ? JSON.parse(JSON.stringify(transcript)) : null,
                            date_added: new Date().toISOString(),
                            last_accessed: new Date().toISOString(),
                            times_viewed: 1
                        });

                    if (error) throw error;
                    console.log('📚 Video saved to history:', title);
                }

                // Reload history cache
                await this.loadHistory();
                return true;

            } catch (error) {
                console.error('❌ Error saving video to history:', error);
                return false;
            }
        } else {
            // No user logged in - save to localStorage
            const localHistory = this.getLocalHistory();
            const existingIndex = localHistory.findIndex(v => v.videoId === videoId);

            if (existingIndex !== -1) {
                // Update existing
                localHistory[existingIndex].lastAccessed = new Date().toISOString();
                localHistory[existingIndex].timesViewed = (localHistory[existingIndex].timesViewed || 1) + 1;
            } else {
                // Add new (keep last 50)
                localHistory.unshift({
                    videoId,
                    title,
                    channelName,
                    thumbnail,
                    duration,
                    transcript,
                    dateAdded: new Date().toISOString(),
                    lastAccessed: new Date().toISOString(),
                    timesViewed: 1,
                    toolsUsed: {}
                });

                // Keep only last 50 videos
                if (localHistory.length > 50) {
                    localHistory.splice(50);
                }
            }

            localStorage.setItem('videoHistory', JSON.stringify(localHistory));
            this.historyCache = localHistory;
            console.log('📚 Video saved to localStorage:', title);
            return true;
        }
    }

    /**
     * Load history from cloud or localStorage
     */
    async loadHistory() {
        if (this.currentUser) {
            // Load from Supabase
            try {
                const { data, error } = await supabase
                    .from('video_history')
                    .select('*')
                    .order('last_accessed', { ascending: false })
                    .limit(50);

                if (error) throw error;

                this.historyCache = data.map(v => ({
                    videoId: v.video_id,
                    title: v.title,
                    channelName: v.channel_name,
                    channelId: v.channel_id,
                    thumbnail: v.thumbnail_url,
                    duration: v.duration,
                    description: v.description,
                    transcript: v.transcript,
                    dateAdded: v.date_added,
                    lastAccessed: v.last_accessed,
                    timesViewed: v.times_viewed,
                    isStarred: v.is_starred,
                    collections: v.collections || [],
                    toolsUsed: v.tools_used || {}
                }));

                console.log('📚 Loaded', data.length, 'videos from cloud');
            } catch (error) {
                console.error('❌ Error loading video history:', error);
                this.historyCache = [];
            }
        } else {
            // Load from localStorage
            this.historyCache = this.getLocalHistory();
            console.log('📚 Loaded', this.historyCache.length, 'videos from localStorage');
        }
    }

    /**
     * Get history from localStorage
     */
    getLocalHistory() {
        try {
            const stored = localStorage.getItem('videoHistory');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('❌ Error loading localStorage history:', error);
            return [];
        }
    }

    /**
     * Get recent videos
     * @param {number} limit - Max videos to return
     */
    getRecentVideos(limit = 50) {
        return this.historyCache.slice(0, limit);
    }

    /**
     * Get starred videos
     */
    getStarredVideos() {
        return this.historyCache.filter(v => v.isStarred);
    }

    /**
     * Star/unstar a video
     */
    async toggleStar(videoId, starred) {
        if (this.currentUser) {
            try {
                const { error } = await supabase
                    .from('video_history')
                    .update({ is_starred: starred })
                    .eq('video_id', videoId);

                if (error) throw error;
                await this.loadHistory(); // Refresh cache
                console.log('⭐ Video', starred ? 'starred' : 'unstarred');
                return true;
            } catch (error) {
                console.error('❌ Error toggling star:', error);
                return false;
            }
        } else {
            // Update localStorage
            const localHistory = this.getLocalHistory();
            const video = localHistory.find(v => v.videoId === videoId);
            if (video) {
                video.isStarred = starred;
                localStorage.setItem('videoHistory', JSON.stringify(localHistory));
                this.historyCache = localHistory;
                return true;
            }
            return false;
        }
    }

    /**
     * Track tool usage
     */
    async markToolUsed(videoId, toolName) {
        if (!videoId || !toolName) return false;

        if (this.currentUser) {
            try {
                // Get current tools_used
                const { data: video } = await supabase
                    .from('video_history')
                    .select('tools_used')
                    .eq('video_id', videoId)
                    .single();

                if (!video) return false;

                const toolsUsed = video.tools_used || {};
                toolsUsed[toolName] = true;

                const { error } = await supabase
                    .from('video_history')
                    .update({ tools_used: toolsUsed })
                    .eq('video_id', videoId);

                if (error) throw error;
                await this.loadHistory(); // Refresh cache
                console.log('✅ Tool usage tracked:', toolName);
                return true;
            } catch (error) {
                console.error('❌ Error tracking tool usage:', error);
                return false;
            }
        } else {
            // Update localStorage
            const localHistory = this.getLocalHistory();
            const video = localHistory.find(v => v.videoId === videoId);
            if (video) {
                video.toolsUsed = video.toolsUsed || {};
                video.toolsUsed[toolName] = true;
                localStorage.setItem('videoHistory', JSON.stringify(localHistory));
                this.historyCache = localHistory;
                return true;
            }
            return false;
        }
    }

    /**
     * Add video to collection
     */
    async addToCollection(videoId, collectionName) {
        if (!this.currentUser) {
            console.log('⚠️ Collections require cloud sync (please sign in)');
            return false;
        }

        try {
            // Get current collections
            const { data: video } = await supabase
                .from('video_history')
                .select('collections')
                .eq('video_id', videoId)
                .single();

            if (!video) return false;

            const collections = video.collections || [];
            if (!collections.includes(collectionName)) {
                collections.push(collectionName);

                const { error } = await supabase
                    .from('video_history')
                    .update({ collections })
                    .eq('video_id', videoId);

                if (error) throw error;
                await this.loadHistory(); // Refresh cache
                console.log('📂 Added to collection:', collectionName);
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error adding to collection:', error);
            return false;
        }
    }

    /**
     * Get video by ID from history (instant reload)
     */
    getVideoById(videoId) {
        return this.historyCache.find(v => v.videoId === videoId);
    }

    /**
     * Delete video from history
     */
    async deleteVideo(videoId) {
        if (this.currentUser) {
            try {
                const { error } = await supabase
                    .from('video_history')
                    .delete()
                    .eq('video_id', videoId);

                if (error) throw error;
                await this.loadHistory();
                console.log('🗑️ Video deleted from history');
                return true;
            } catch (error) {
                console.error('❌ Error deleting video:', error);
                return false;
            }
        } else {
            // Delete from localStorage
            let localHistory = this.getLocalHistory();
            localHistory = localHistory.filter(v => v.videoId !== videoId);
            localStorage.setItem('videoHistory', JSON.stringify(localHistory));
            this.historyCache = localHistory;
            return true;
        }
    }

    /**
     * Clear all history
     */
    async clearHistory() {
        if (this.currentUser) {
            try {
                const { error } = await supabase
                    .from('video_history')
                    .delete()
                    .eq('user_id', this.currentUser.id);

                if (error) throw error;
                this.historyCache = [];
                console.log('🗑️ All history cleared');
                return true;
            } catch (error) {
                console.error('❌ Error clearing history:', error);
                return false;
            }
        } else {
            localStorage.removeItem('videoHistory');
            this.historyCache = [];
            return true;
        }
    }
}

// Export singleton instance
export const videoHistory = new VideoHistoryManager();
