/**
 * Local Development Server
 * Mimics Netlify Functions for local testing
 * Serves static files and handles API endpoints
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = 8888;

// Import the chat function handler
const chatFunction = require('./netlify/functions/chat.cjs');

// Import the multi-agent function handler
const multiAgentFunction = require('./netlify/functions/multi-agent.cjs');

// Import the research function handler
const researchFunction = require('./netlify/functions/research.cjs');

// Import the youtube-transcript function handler
const youtubeTranscriptFunction = require('./netlify/functions/youtube-transcript.cjs');

// Import the youtube-search function handler
const youtubeSearchFunction = require('./netlify/functions/youtube-search.cjs');

// Import the video-analyze function handler
const videoAnalyzeFunction = require('./netlify/functions/video-analyze.cjs');

// Phase 8 Week 2: Import content creation tool handlers
const videoQuizFunction = require('./netlify/functions/video-quiz.cjs');
const videoLessonPlanFunction = require('./netlify/functions/video-lesson-plan.cjs');
const videoDiscussionFunction = require('./netlify/functions/video-discussion.cjs');

// Phase 8 Week 3: Import DOK project, vocabulary, guided notes & graphic organizer handlers
const videoDOKProjectFunction = require('./netlify/functions/video-dok-project.cjs');
const videoVocabularyFunction = require('./netlify/functions/video-vocabulary.cjs');
const videoGuidedNotesFunction = require('./netlify/functions/video-guided-notes.cjs');
const videoGraphicOrganizerFunction = require('./netlify/functions/video-graphic-organizer.cjs');

// Phase 8 Week 4: Import batch operation handlers
const videoBatchSummaryFunction = require('./netlify/functions/video-batch-summary.cjs');
const videoBatchQuizFunction = require('./netlify/functions/video-batch-quiz.cjs');
const videoBatchVocabularyFunction = require('./netlify/functions/video-batch-vocabulary.cjs');
const videoBatchStudyGuideFunction = require('./netlify/functions/video-batch-study-guide.cjs');

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

console.log('\n' + '='.repeat(80));
console.log('🚀 Starting Local Development Server');
console.log('='.repeat(80));
console.log('[Server] Port:', PORT);
console.log('[Server] Environment variables loaded:', Object.keys(process.env).filter(k => k.includes('API')).length, 'API keys');
console.log('[Server] ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✓ Loaded' : '❌ Missing');
console.log('='.repeat(80) + '\n');

const server = http.createServer(async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();
  
  console.log(`\n📨 [${requestId}] ${req.method} ${req.url}`);
  console.log(`[${requestId}] Headers:`, JSON.stringify(req.headers, null, 2));

  // Handle API endpoints (Netlify Functions)
  if (req.url.startsWith('/.netlify/functions/') || req.url.startsWith('/api/')) {
    console.log(`[${requestId}] 🔧 API endpoint detected`);
    
    // Extract function name
    const functionPath = req.url.replace('/.netlify/functions/', '').replace('/api/', '').split('?')[0];
    console.log(`[${requestId}] Function path:`, functionPath);
    
    if (functionPath === 'chat') {
      console.log(`[${requestId}] 💬 Routing to chat function`);
      
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
        console.log(`[${requestId}] Received ${chunk.length} bytes`);
      });
      
      req.on('end', async () => {
        console.log(`[${requestId}] ✓ Request body complete (${body.length} bytes)`);
        
        try {
          // Create Netlify-compatible event object
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const context = {};
          
          console.log(`[${requestId}] 📤 Calling chat function handler...`);
          const result = await chatFunction.handler(event, context);
          
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✅ Function completed in ${duration}ms`);
          console.log(`[${requestId}] Status:`, result.statusCode);
          console.log(`[${requestId}] Response body length:`, result.body?.length || 0);
          
          // Send response
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
          
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[${requestId}] ❌ Function error after ${duration}ms:`, error);
          console.error(`[${requestId}] Error stack:`, error.stack);
          
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({
            error: 'Internal server error',
            message: error.message,
            requestId: requestId
          }));
        }
      });
      
      return;
    }

    // Multi-Agent endpoint
    if (functionPath === 'multi-agent') {
      console.log(`[${requestId}] 🤖 Routing to multi-agent function`);
      
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
        console.log(`[${requestId}] Received ${chunk.length} bytes`);
      });
      
      req.on('end', async () => {
        console.log(`[${requestId}] ✓ Request body complete (${body.length} bytes)`);
        
        try {
          // Create Netlify-compatible event object
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const context = {};
          
          console.log(`[${requestId}] 📤 Calling multi-agent function handler...`);
          const result = await multiAgentFunction.handler(event, context);
          
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✅ Function completed in ${duration}ms`);
          console.log(`[${requestId}] Status:`, result.statusCode);
          console.log(`[${requestId}] Response body length:`, result.body?.length || 0);
          
          // Send response
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
          
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[${requestId}] ❌ Function error after ${duration}ms:`, error);
          console.error(`[${requestId}] Error stack:`, error.stack);
          
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({
            error: 'Internal server error',
            message: error.message,
            requestId: requestId
          }));
        }
      });
      
      return;
    }

    // YouTube Transcript endpoint
    if (functionPath === 'youtube-transcript') {
      console.log(`[${requestId}] 📹 Routing to youtube-transcript function`);
      
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const context = {};
          
          console.log(`[${requestId}] 📤 Calling youtube-transcript function handler...`);
          const result = await youtubeTranscriptFunction.handler(event, context);
          
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✅ Function completed in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
          
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[${requestId}] ❌ Function error after ${duration}ms:`, error);
          
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({
            error: 'Internal server error',
            message: error.message
          }));
        }
      });
      
      return;
    }

    // YouTube Search endpoint
    if (functionPath === 'youtube-search') {
      console.log(`[${requestId}] 🔍 Routing to youtube-search function`);
      
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const context = {};
          
          console.log(`[${requestId}] 📤 Calling youtube-search function handler...`);
          const result = await youtubeSearchFunction.handler(event, context);
          
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✅ Function completed in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
          
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[${requestId}] ❌ Function error after ${duration}ms:`, error);
          
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({
            error: 'Internal server error',
            message: error.message
          }));
        }
      });
      
      return;
    }

    // Video Analysis endpoint
    if (functionPath === 'video-analyze') {
      console.log(`[${requestId}] 🎬 Routing to video-analyze function`);
      
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const context = {};
          
          console.log(`[${requestId}] 📤 Calling video-analyze function handler...`);
          const result = await videoAnalyzeFunction.handler(event, context);
          
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✅ Function completed in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
          
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[${requestId}] ❌ Function error after ${duration}ms:`, error);
          
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({
            error: 'Internal server error',
            message: error.message
          }));
        }
      });
      
      return;
    }

    // Phase 8 Week 2: Video Quiz endpoint
    if (functionPath === 'video-quiz') {
      console.log(`[${requestId}] 📝 Routing to video-quiz function`);
      
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const result = await videoQuizFunction.handler(event, {});
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✅ Quiz generated in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
        } catch (error) {
          console.error(`[${requestId}] ❌ Quiz error:`, error);
          res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'Quiz generation failed', message: error.message }));
        }
      });
      
      return;
    }

    // Phase 8 Week 2: Video Lesson Plan endpoint
    if (functionPath === 'video-lesson-plan') {
      console.log(`[${requestId}] 📚 Routing to video-lesson-plan function`);
      
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const result = await videoLessonPlanFunction.handler(event, {});
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✅ Lesson plan generated in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
        } catch (error) {
          console.error(`[${requestId}] ❌ Lesson plan error:`, error);
          res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'Lesson plan generation failed', message: error.message }));
        }
      });
      
      return;
    }

    // Phase 8 Week 2: Video Discussion Questions endpoint
    if (functionPath === 'video-discussion') {
      console.log(`[${requestId}] 💬 Routing to video-discussion function`);
      
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const result = await videoDiscussionFunction.handler(event, {});
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✅ Discussion questions generated in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
        } catch (error) {
          console.error(`[${requestId}] ❌ Discussion questions error:`, error);
          res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'Discussion questions generation failed', message: error.message }));
        }
      });
      
      return;
    }

    // Video DOK Project endpoint (Phase 8 Week 3)
    if (functionPath === 'video-dok-project') {
      console.log(`[${requestId}] 🎓 Routing to video-dok-project function`);
      
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const result = await videoDOKProjectFunction.handler(event, {});
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✅ DOK project generated in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
        } catch (error) {
          console.error(`[${requestId}] ❌ DOK project error:`, error);
          res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ error: 'DOK project generation failed', message: error.message }));
        }
      });
      
      return;
    }

    // Video Vocabulary endpoint (Phase 8 Week 3)
    if (functionPath === 'video-vocabulary') {
      console.log(`[${requestId}] 📚 Routing to video-vocabulary function`);
      
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const result = await videoVocabularyFunction.handler(event, {});
          const duration = Date.now() - startTime;
          
          console.log(`[${requestId}] ✓ Video vocabulary complete in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers);
          res.end(result.body);
        } catch (error) {
          console.error(`[${requestId}] ❌ Video vocabulary error:`, error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      
      return;
    }

    // Phase 8 Week 3: Guided Notes endpoint
    if (functionPath === 'video-guided-notes') {
      console.log(`[${requestId}] 📝 Routing to video-guided-notes function`);
      
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
        console.log(`[${requestId}] Received ${chunk.length} bytes`);
      });
      
      req.on('end', async () => {
        console.log(`[${requestId}] ✓ Request body complete (${body.length} bytes)`);
        
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url
          };
          
          const result = await videoGuidedNotesFunction.handler(event, {});
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✓ Video guided notes complete in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[${requestId}] ✗ Guided notes error after ${duration}ms:`, error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      
      return;
    }

    // Phase 8 Week 3: Graphic Organizer endpoint
    if (functionPath === 'video-graphic-organizer') {
      console.log(`[${requestId}] 🗺️ Routing to video-graphic-organizer function`);
      
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
        console.log(`[${requestId}] Received ${chunk.length} bytes`);
      });
      
      req.on('end', async () => {
        console.log(`[${requestId}] ✓ Request body complete (${body.length} bytes)`);
        
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url
          };
          
          // Ensure ANTHROPIC_API_KEY is available in process.env for the function
          if (!process.env.ANTHROPIC_API_KEY) {
            console.error(`[${requestId}] ❌ ANTHROPIC_API_KEY not found in environment!`);
            throw new Error('ANTHROPIC_API_KEY not configured');
          }
          
          const result = await videoGraphicOrganizerFunction.handler(event, {});
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✓ Graphic organizer complete in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[${requestId}] ✗ Graphic organizer error after ${duration}ms:`, error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      
      return;
    }

    // Phase 8 Week 4: Batch Summary endpoint
    if (functionPath === 'video-batch-summary') {
      console.log(`[${requestId}] 📊 Routing to video-batch-summary function`);
      
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url
          };
          
          const result = await videoBatchSummaryFunction.handler(event, {});
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✓ Batch summary complete in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
        } catch (error) {
          console.error(`[${requestId}] ✗ Batch summary error:`, error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      
      return;
    }

    // Phase 8 Week 4: Batch Quiz endpoint
    if (functionPath === 'video-batch-quiz') {
      console.log(`[${requestId}] 📝 Routing to video-batch-quiz function`);
      
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url
          };
          
          const result = await videoBatchQuizFunction.handler(event, {});
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✓ Batch quiz complete in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
        } catch (error) {
          console.error(`[${requestId}] ✗ Batch quiz error:`, error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      
      return;
    }

    // Phase 8 Week 4: Batch Vocabulary endpoint
    if (functionPath === 'video-batch-vocabulary') {
      console.log(`[${requestId}] 📖 Routing to video-batch-vocabulary function`);
      
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url
          };
          
          const result = await videoBatchVocabularyFunction.handler(event, {});
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✓ Batch vocabulary complete in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
        } catch (error) {
          console.error(`[${requestId}] ✗ Batch vocabulary error:`, error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      
      return;
    }

    // Phase 8 Week 4: Batch Study Guide endpoint
    if (functionPath === 'video-batch-study-guide') {
      console.log(`[${requestId}] 📚 Routing to video-batch-study-guide function`);
      
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url
          };
          
          const result = await videoBatchStudyGuideFunction.handler(event, {});
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✓ Batch study guide complete in ${duration}ms`);
          
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
        } catch (error) {
          console.error(`[${requestId}] ✗ Batch study guide error:`, error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      
      return;
    }

    // Research endpoint
    if (functionPath === 'research') {
      console.log(`[${requestId}] 🔍 Routing to research function`);
      
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
        console.log(`[${requestId}] Received ${chunk.length} bytes`);
      });
      
      req.on('end', async () => {
        console.log(`[${requestId}] ✓ Request body complete (${body.length} bytes)`);
        
        try {
          // Create Netlify-compatible event object
          const event = {
            httpMethod: req.method,
            headers: req.headers,
            body: body,
            path: req.url,
            queryStringParameters: {}
          };
          
          const context = {};
          
          console.log(`[${requestId}] 📤 Calling research function handler...`);
          const result = await researchFunction.handler(event, context);
          
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ✅ Function completed in ${duration}ms`);
          console.log(`[${requestId}] Status:`, result.statusCode);
          console.log(`[${requestId}] Response body length:`, result.body?.length || 0);
          
          // Send response
          res.writeHead(result.statusCode, result.headers || {});
          res.end(result.body);
          
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[${requestId}] ❌ Function error after ${duration}ms:`, error);
          console.error(`[${requestId}] Error stack:`, error.stack);
          
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({
            error: 'Internal server error',
            message: error.message,
            requestId: requestId
          }));
        }
      });
      
      return;
    }
  }

  // Serve static files
  console.log(`[${requestId}] 📄 Serving static file`);
  
  // Strip query parameters from URL for file path
  const urlPath = req.url.split('?')[0];
  let filePath = '.' + urlPath;
  if (filePath === './' || filePath === '.') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.log(`[${requestId}] ⚠️ File not found:`, filePath);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        console.error(`[${requestId}] ❌ Server error:`, error);
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      const duration = Date.now() - startTime;
      console.log(`[${requestId}] ✓ Served ${filePath} (${content.length} bytes) in ${duration}ms`);
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('\n' + '='.repeat(80));
  console.log('✅ Server Running!');
  console.log('='.repeat(80));
  console.log(`🌐 Local:            http://localhost:${PORT}`);
  console.log(`🌐 Network:         http://127.0.0.1:${PORT}`);
  console.log('');
  console.log('📁 Serving static files from current directory');
  console.log('🔧 API endpoint:     /.netlify/functions/chat');
  console.log('🔧 API endpoint:     /api/chat');
  console.log('🔧 API endpoint:     /.netlify/functions/multi-agent');
  console.log('🔧 API endpoint:     /api/multi-agent');
  console.log('🔧 API endpoint:     /.netlify/functions/research');
  console.log('🔧 API endpoint:     /api/research');
  console.log('🎨 NEW: /api/video-quiz (Phase 8 Week 2)');
  console.log('🎨 NEW: /api/video-lesson-plan (Phase 8 Week 2)');
  console.log('🎨 NEW: /api/video-discussion (Phase 8 Week 2)');
  console.log('🎓 NEW: /api/video-dok-project (Phase 8 Week 3 - DOK 3-4 Projects)');
  console.log('📚 NEW: /api/video-vocabulary (Phase 8 Week 3 - Vocabulary Builder)');
  console.log('📝 NEW: /api/video-guided-notes (Phase 8 Week 3 - Guided Notes)');
  console.log('🗺️ NEW: /api/video-graphic-organizer (Phase 8 Week 3 - Graphic Organizers) ✅ COMPLETE');
  console.log('');
  console.log('📦 BATCH: /api/video-batch-summary (Phase 8 Week 4 - Weekly Summary)');
  console.log('📦 BATCH: /api/video-batch-quiz (Phase 8 Week 4 - Combined Quiz)');
  console.log('📦 BATCH: /api/video-batch-vocabulary (Phase 8 Week 4 - Master Vocabulary)');
  console.log('📦 BATCH: /api/video-batch-study-guide (Phase 8 Week 4 - Unit Study Guide)');
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('='.repeat(80) + '\n');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error('Kill the process using that port and try again.');
    console.error(`Run: Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force\n`);
  } else {
    console.error('\n❌ Server error:', error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
