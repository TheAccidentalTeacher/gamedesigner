/**
 * ResearchMemory - localStorage-based research session management
 * 
 * Manages saving, loading, listing, and deleting research sessions.
 * Uses localStorage for persistence (Phase 6 Week 7-8).
 * Will be replaced with database in later phases.
 */

export class ResearchMemory {
  constructor() {
    this.storageKey = 'ucas-research-sessions';
    this.maxSessions = 50; // Limit to prevent localStorage overflow
  }

  /**
   * Save a research session
   */
  save(sessionData) {
    try {
      const session = {
        id: `research_${Date.now()}`,
        query: sessionData.query,
        timestamp: new Date().toISOString(),
        personas: sessionData.personas || [],
        results: sessionData.results || [],
        extractedContent: sessionData.extractedContent || [],
        chunks: sessionData.chunks || [],
        analysis: sessionData.analysis || null,
        metadata: {
          resultCount: sessionData.results?.length || 0,
          extractedCount: sessionData.extractedContent?.filter(e => !e.error).length || 0,
          analysisCount: sessionData.analysis?.analyses?.length || 0,
          duration: sessionData.metadata?.duration || 0
        }
      };

      // Get existing sessions
      const sessions = this.list();

      // Add new session at beginning (most recent first)
      sessions.unshift(session);

      // Limit to maxSessions
      if (sessions.length > this.maxSessions) {
        sessions.splice(this.maxSessions);
      }

      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(sessions));

      console.log(`💾 Research session saved: ${session.id}`);
      return session.id;

    } catch (error) {
      console.error('❌ Error saving research session:', error);
      
      // Check if quota exceeded
      if (error.name === 'QuotaExceededError') {
        console.warn('⚠️ localStorage quota exceeded - removing oldest sessions');
        this.cleanup();
        // Try again
        return this.save(sessionData);
      }
      
      throw error;
    }
  }

  /**
   * Load a specific research session
   */
  load(sessionId) {
    try {
      const sessions = this.list();
      const session = sessions.find(s => s.id === sessionId);

      if (!session) {
        console.warn(`⚠️ Session not found: ${sessionId}`);
        return null;
      }

      console.log(`📂 Research session loaded: ${sessionId}`);
      return session;

    } catch (error) {
      console.error('❌ Error loading research session:', error);
      return null;
    }
  }

  /**
   * List all research sessions
   */
  list() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        return [];
      }

      const sessions = JSON.parse(data);
      
      // Sort by timestamp (newest first)
      sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return sessions;

    } catch (error) {
      console.error('❌ Error listing research sessions:', error);
      return [];
    }
  }

  /**
   * Delete a specific research session
   */
  delete(sessionId) {
    try {
      let sessions = this.list();
      const initialLength = sessions.length;

      sessions = sessions.filter(s => s.id !== sessionId);

      if (sessions.length === initialLength) {
        console.warn(`⚠️ Session not found for deletion: ${sessionId}`);
        return false;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(sessions));
      console.log(`🗑️ Research session deleted: ${sessionId}`);
      return true;

    } catch (error) {
      console.error('❌ Error deleting research session:', error);
      return false;
    }
  }

  /**
   * Delete all research sessions
   */
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('🗑️ All research sessions cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing research sessions:', error);
      return false;
    }
  }

  /**
   * Get session count
   */
  count() {
    return this.list().length;
  }

  /**
   * Get storage usage estimate
   */
  getStorageSize() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return 0;

      // Estimate size in bytes
      const sizeBytes = new Blob([data]).size;
      const sizeKB = (sizeBytes / 1024).toFixed(2);
      const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);

      return {
        bytes: sizeBytes,
        kb: sizeKB,
        mb: sizeMB,
        formatted: sizeBytes > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
      };

    } catch (error) {
      console.error('❌ Error calculating storage size:', error);
      return { bytes: 0, kb: 0, mb: 0, formatted: '0 KB' };
    }
  }

  /**
   * Cleanup old sessions when quota exceeded
   */
  cleanup() {
    try {
      let sessions = this.list();
      
      // Keep only 25% of sessions (remove oldest 75%)
      const keepCount = Math.floor(this.maxSessions * 0.25);
      sessions = sessions.slice(0, keepCount);

      localStorage.setItem(this.storageKey, JSON.stringify(sessions));
      console.log(`🧹 Cleaned up old sessions - kept ${sessions.length} most recent`);

    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      // Last resort: clear everything
      this.clear();
    }
  }

  /**
   * Export session as Markdown
   */
  exportMarkdown(session) {
    if (!session) return '';

    let md = `# Research: ${session.query}\n\n`;
    md += `**Date**: ${new Date(session.timestamp).toLocaleString()}\n`;
    md += `**Personas**: ${session.personas.join(', ') || 'All 12'}\n\n`;

    // Analysis Synthesis
    if (session.analysis?.synthesis?.report) {
      md += `## Executive Summary\n\n`;
      md += `${session.analysis.synthesis.report}\n\n`;
    }

    // Individual Analyses
    if (session.analysis?.analyses?.length > 0) {
      md += `## Expert Analyses\n\n`;
      session.analysis.analyses.forEach(analysis => {
        md += `### ${analysis.icon} ${analysis.name}\n`;
        md += `**Focus**: ${analysis.focus}\n\n`;
        md += `${analysis.analysis}\n\n`;
        md += `---\n\n`;
      });
    }

    // Extracted Content
    if (session.extractedContent?.length > 0) {
      md += `## Extracted Content\n\n`;
      session.extractedContent.forEach((content, i) => {
        if (!content.error) {
          md += `### ${i + 1}. ${content.title}\n`;
          md += `**URL**: ${content.url}\n`;
          if (content.author) md += `**Author**: ${content.author}\n`;
          if (content.publishedDate) md += `**Published**: ${content.publishedDate}\n`;
          md += `**Word Count**: ${content.wordCount}\n\n`;
          md += `${content.excerpt || content.content.substring(0, 500)}...\n\n`;
        }
      });
    }

    // Search Results
    if (session.results?.length > 0) {
      md += `## Search Results\n\n`;
      session.results.forEach((result, i) => {
        md += `${i + 1}. **[${result.title}](${result.url})**\n`;
        md += `   ${result.snippet}\n`;
        md += `   *Source: ${result.sources?.join(', ') || result.source}* • Score: ${result.relevanceScore?.toFixed(1) || 'N/A'}\n\n`;
      });
    }

    md += `---\n\n`;
    md += `*Generated by UCAS Research Engine • ${new Date().toLocaleString()}*\n`;

    return md;
  }

  /**
   * Export session as JSON
   */
  exportJSON(session) {
    if (!session) return '';
    return JSON.stringify(session, null, 2);
  }

  /**
   * Get recent sessions (last N)
   */
  getRecent(count = 10) {
    const sessions = this.list();
    return sessions.slice(0, count);
  }

  /**
   * Search sessions by query text
   */
  search(searchText) {
    const sessions = this.list();
    const lowerSearch = searchText.toLowerCase();

    return sessions.filter(session => 
      session.query.toLowerCase().includes(lowerSearch)
    );
  }
}
