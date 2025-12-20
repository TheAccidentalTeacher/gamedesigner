/**
 * Video Collections Manager
 * Create and manage video collections (playlists/units)
 */

import { supabase } from './supabase-client.js';

class VideoCollectionsManager {
    constructor() {
        this.currentUser = null;
        this.collectionsCache = [];
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        const { data: { user } } = await supabase.auth.getUser();
        this.currentUser = user;

        if (!user) {
            console.log('📁 Collections: No user logged in, using local storage only');
            this.loadFromLocalStorage();
            this.initialized = true;
            return;
        }

        await this.loadCollections();
        this.initialized = true;
        console.log('📁 Collections initialized:', this.collectionsCache.length, 'collections');
    }

    async loadCollections() {
        if (!this.currentUser) {
            this.loadFromLocalStorage();
            return;
        }

        const { data, error } = await supabase
            .from('video_collections')
            .select('*')
            .eq('user_id', this.currentUser.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error loading collections:', error);
            this.loadFromLocalStorage();
            return;
        }

        this.collectionsCache = data || [];
        this.saveToLocalStorage();
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('video_collections');
        this.collectionsCache = stored ? JSON.parse(stored) : [];
    }

    saveToLocalStorage() {
        localStorage.setItem('video_collections', JSON.stringify(this.collectionsCache));
    }

    async createCollection(name, description = '', color = '#3b82f6') {
        if (!name || !name.trim()) {
            throw new Error('Collection name is required');
        }

        const collection = {
            id: crypto.randomUUID(),
            name: name.trim(),
            description: description.trim(),
            color,
            video_ids: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Save to Supabase if logged in
        if (this.currentUser) {
            const { data, error } = await supabase
                .from('video_collections')
                .insert({
                    user_id: this.currentUser.id,
                    name: collection.name,
                    description: collection.description,
                    color: collection.color,
                    video_ids: collection.video_ids
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Error creating collection:', error);
                throw error;
            }

            this.collectionsCache.unshift(data);
        } else {
            this.collectionsCache.unshift(collection);
        }

        this.saveToLocalStorage();
        return collection;
    }

    async addVideoToCollection(collectionId, videoId) {
        const collection = this.collectionsCache.find(c => c.id === collectionId);
        if (!collection) {
            throw new Error('Collection not found');
        }

        if (collection.video_ids.includes(videoId)) {
            return; // Already in collection
        }

        collection.video_ids.push(videoId);
        collection.updated_at = new Date().toISOString();

        // Update in Supabase if logged in
        if (this.currentUser) {
            const { error } = await supabase
                .from('video_collections')
                .update({
                    video_ids: collection.video_ids,
                    updated_at: collection.updated_at
                })
                .eq('id', collectionId);

            if (error) {
                console.error('❌ Error adding video to collection:', error);
                throw error;
            }
        }

        this.saveToLocalStorage();
    }

    async removeVideoFromCollection(collectionId, videoId) {
        const collection = this.collectionsCache.find(c => c.id === collectionId);
        if (!collection) return;

        collection.video_ids = collection.video_ids.filter(id => id !== videoId);
        collection.updated_at = new Date().toISOString();

        if (this.currentUser) {
            await supabase
                .from('video_collections')
                .update({
                    video_ids: collection.video_ids,
                    updated_at: collection.updated_at
                })
                .eq('id', collectionId);
        }

        this.saveToLocalStorage();
    }

    async renameCollection(collectionId, newName) {
        const collection = this.collectionsCache.find(c => c.id === collectionId);
        if (!collection) throw new Error('Collection not found');

        collection.name = newName.trim();
        collection.updated_at = new Date().toISOString();

        if (this.currentUser) {
            await supabase
                .from('video_collections')
                .update({
                    name: collection.name,
                    updated_at: collection.updated_at
                })
                .eq('id', collectionId);
        }

        this.saveToLocalStorage();
    }

    async deleteCollection(collectionId) {
        this.collectionsCache = this.collectionsCache.filter(c => c.id !== collectionId);

        if (this.currentUser) {
            await supabase
                .from('video_collections')
                .delete()
                .eq('id', collectionId);
        }

        this.saveToLocalStorage();
    }

    getAllCollections() {
        return this.collectionsCache;
    }

    getCollection(collectionId) {
        return this.collectionsCache.find(c => c.id === collectionId);
    }

    getCollectionsForVideo(videoId) {
        return this.collectionsCache.filter(c => c.video_ids.includes(videoId));
    }
}

export const videoCollections = new VideoCollectionsManager();
