import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'
import { handleCreateEnquiry, handleGetEnquiries } from './src/server/enquiryBackend.ts'

function backendApiPlugin(): Plugin {
  const handler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url?.split('?')[0];

    if (url === '/api/health' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        status: 'ok',
        backend: 'Sri Caterers Live Firebase Engine',
        projectId: 'sricatering-64043',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    if (url === '/api/enquiries' && req.method === 'POST') {
      let bodyStr = '';
      req.on('data', (chunk) => {
        bodyStr += chunk;
      });
      req.on('end', async () => {
        try {
          const payload = bodyStr ? JSON.parse(bodyStr) : {};
          const result = await handleCreateEnquiry(payload);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 201;
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message || 'Failed to process enquiry' }));
        }
      });
      return;
    }

    if (url === '/api/enquiries' && req.method === 'GET') {
      try {
        const result = await handleGetEnquiries();
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(result));
      } catch (err: any) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || 'Failed to fetch enquiries' }));
      }
      return;
    }

    next();
  };

  return {
    name: 'sri-caterers-backend-api',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), backendApiPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react-router') || id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            return 'vendor-libs';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})

