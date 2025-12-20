/**
 * Supabase Client Configuration
 * 
 * This module initializes and exports the Supabase client for:
 * - Cloud database sync (research sessions, preferences)
 * - User authentication (Google, GitHub OAuth)
 * - Real-time updates across devices
 * - Row-Level Security (RLS) enforcement
 * 
 * Architecture:
 * - Uses SUPABASE_ANON_KEY (frontend-safe, RLS enforced)
 * - Credentials loaded from .env.local (never committed)
 * - Automatically handles authentication state
 * - Provides helper methods for common operations
 * 
 * Usage:
 *   import { supabase, getCurrentUser, isAuthenticated } from './supabase-client.js';
 *   
 *   // Check authentication
 *   if (isAuthenticated()) {
 *     const user = getCurrentUser();
 *     console.log('Logged in as:', user.email);
 *   }
 *   
 *   // Query data (RLS automatically filters to user's data)
 *   const { data, error } = await supabase
 *     .from('research_sessions')
 *     .select('*')
 *     .eq('active', true);
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Configuration from environment (loaded via meta tag in index.html)
const SUPABASE_URL = document.querySelector('meta[name="supabase-url"]')?.content || 'https://kxctrosgcockwtrteizd.supabase.co';
const SUPABASE_ANON_KEY = document.querySelector('meta[name="supabase-anon-key"]')?.content || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Y3Ryb3NnY29ja3d0cnRlaXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODA4MzIsImV4cCI6MjA4MTM1NjgzMn0.F9yb5rkd9UMLL3e7fD4xYWEVgIJgVR8HpMDcG84SMPE';

// Check if this is an OAuth callback
const urlHasOAuthTokens = window.location.hash.includes('access_token');
if (urlHasOAuthTokens) {
    console.log('🔐 OAuth callback detected in URL');
    console.log('🔍 Hash params:', window.location.hash);
}

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        // Store session in localStorage (persists across page reloads)
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Use PKCE flow for OAuth (more secure, prevents token interception)
        flowType: 'pkce',
        // Store PKCE verifier in localStorage
        storage: window.localStorage,
        storageKey: 'supabase.auth.token',
        // Debug mode disabled - was cluttering console with GoTrueClient logs
        debug: false
    },
    db: {
        schema: 'public'
    }
});

// Log session exchange process
if (urlHasOAuthTokens) {
    console.log('⏳ Waiting for Supabase to exchange OAuth tokens...');
}

/**
 * Authentication State Management
 */

// Current authentication state (updated automatically)
let currentUser = null;
let authStateListeners = [];

// Initialize authentication state
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email);
    
    // Log detailed info for OAuth events
    if (event === 'SIGNED_IN' && session) {
        console.log('✅ Successfully signed in!');
        console.log('   User:', session.user.email);
        console.log('   Provider:', session.user.app_metadata?.provider);
        console.log('   Session expires:', new Date(session.expires_at * 1000).toLocaleString());
    }
    
    if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Session token refreshed');
    }
    
    if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
    }
    
    currentUser = session?.user || null;
    
    // Notify all listeners of auth state change
    authStateListeners.forEach(listener => {
        try {
            listener(event, session);
        } catch (error) {
            console.error('Auth listener error:', error);
        }
    });
});

// Initialize with current session
supabase.auth.getSession().then(({ data: { session } }) => {
    currentUser = session?.user || null;
});

/**
 * Get current authenticated user
 * @returns {Object|null} User object or null if not authenticated
 */
export function getCurrentUser() {
    return currentUser;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
export function isAuthenticated() {
    return currentUser !== null;
}

/**
 * Get user ID (for database queries)
 * @returns {string|null} User UUID or null if not authenticated
 */
export function getUserId() {
    return currentUser?.id || null;
}

/**
 * Get user email
 * @returns {string|null} User email or null if not authenticated
 */
export function getUserEmail() {
    return currentUser?.email || null;
}

/**
 * Subscribe to authentication state changes
 * @param {Function} listener - Callback function (event, session) => void
 * @returns {Function} Unsubscribe function
 */
export function onAuthStateChange(listener) {
    authStateListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
        const index = authStateListeners.indexOf(listener);
        if (index !== -1) {
            authStateListeners.splice(index, 1);
        }
    };
}

/**
 * Authentication Methods
 */

/**
 * Sign in with Google OAuth
 * @returns {Promise<Object>} Result with error if any
 */
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
    
    if (error) {
        console.error('Google sign-in error:', error);
        return { error };
    }
    
    return { data };
}

/**
 * Sign in with GitHub OAuth
 * @returns {Promise<Object>} Result with error if any
 */
export async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: window.location.origin
        }
    });
    
    if (error) {
        console.error('GitHub sign-in error:', error);
        return { error };
    }
    
    return { data };
}

/**
 * Sign out current user
 * @returns {Promise<Object>} Result with error if any
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error('Sign out error:', error);
        return { error };
    }
    
    currentUser = null;
    return { error: null };
}

/**
 * Database Helper Methods
 */

/**
 * Get user's storage usage in Supabase
 * @returns {Promise<Object>} { sessionCount, totalSizeMB, error }
 */
export async function getStorageUsage() {
    if (!isAuthenticated()) {
        return { sessionCount: 0, totalSizeMB: 0, error: null };
    }
    
    const { data, error } = await supabase.rpc('get_storage_usage');
    
    if (error) {
        console.error('Storage usage error:', error);
        return { sessionCount: 0, totalSizeMB: 0, error };
    }
    
    return {
        sessionCount: data?.session_count || 0,
        totalSizeMB: data?.total_size_mb || 0,
        error: null
    };
}

/**
 * Search research sessions by query
 * @param {string} query - Search query (searches across queries, summaries, results)
 * @param {number} limit - Maximum results (default 20)
 * @returns {Promise<Object>} { sessions, error }
 */
export async function searchResearch(query, limit = 20) {
    if (!isAuthenticated()) {
        return { sessions: [], error: null };
    }
    
    const { data, error } = await supabase.rpc('search_research', {
        search_query: query,
        result_limit: limit
    });
    
    if (error) {
        console.error('Search error:', error);
        return { sessions: [], error };
    }
    
    return { sessions: data || [], error: null };
}

/**
 * Cleanup old deleted sessions (soft delete → hard delete after 30 days)
 * @returns {Promise<Object>} { deletedCount, error }
 */
export async function cleanupOldSessions() {
    if (!isAuthenticated()) {
        return { deletedCount: 0, error: null };
    }
    
    const { data, error } = await supabase.rpc('cleanup_old_deleted_sessions');
    
    if (error) {
        console.error('Cleanup error:', error);
        return { deletedCount: 0, error };
    }
    
    return { deletedCount: data || 0, error: null };
}

/**
 * Sync Status Tracking
 */

export const SyncStatus = {
    IDLE: 'idle',           // Not syncing
    SYNCING: 'syncing',     // Currently syncing
    SYNCED: 'synced',       // Successfully synced
    ERROR: 'error',         // Sync error
    OFFLINE: 'offline'      // No internet connection
};

// Current sync status
let syncStatus = SyncStatus.IDLE;
let lastSyncTime = null;
let syncStatusListeners = [];

/**
 * Get current sync status
 * @returns {string} Current sync status (use SyncStatus enum)
 */
export function getSyncStatus() {
    return syncStatus;
}

/**
 * Get last successful sync time
 * @returns {Date|null} Last sync timestamp or null
 */
export function getLastSyncTime() {
    return lastSyncTime;
}

/**
 * Set sync status (internal use by ResearchMemory)
 * @param {string} status - New status (use SyncStatus enum)
 */
export function setSyncStatus(status) {
    if (syncStatus !== status) {
        syncStatus = status;
        
        if (status === SyncStatus.SYNCED) {
            lastSyncTime = new Date();
        }
        
        // Notify listeners
        syncStatusListeners.forEach(listener => {
            try {
                listener(status, lastSyncTime);
            } catch (error) {
                console.error('Sync status listener error:', error);
            }
        });
    }
}

/**
 * Subscribe to sync status changes
 * @param {Function} listener - Callback function (status, lastSyncTime) => void
 * @returns {Function} Unsubscribe function
 */
export function onSyncStatusChange(listener) {
    syncStatusListeners.push(listener);
    
    // Call immediately with current status
    listener(syncStatus, lastSyncTime);
    
    // Return unsubscribe function
    return () => {
        const index = syncStatusListeners.indexOf(listener);
        if (index !== -1) {
            syncStatusListeners.splice(index, 1);
        }
    };
}

/**
 * Check if online
 * @returns {boolean} True if browser reports online
 */
export function isOnline() {
    return navigator.onLine;
}

// Monitor online/offline events
window.addEventListener('online', () => {
    console.log('Network: Online');
    if (syncStatus === SyncStatus.OFFLINE) {
        setSyncStatus(SyncStatus.IDLE);
    }
});

window.addEventListener('offline', () => {
    console.log('Network: Offline');
    setSyncStatus(SyncStatus.OFFLINE);
});

// Initialize online/offline status
if (!isOnline()) {
    syncStatus = SyncStatus.OFFLINE;
}

console.log('✅ Supabase client initialized:', SUPABASE_URL);
