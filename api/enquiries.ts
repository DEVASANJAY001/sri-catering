import type { IncomingMessage, ServerResponse } from 'http';
import { handleCreateEnquiry, handleGetEnquiries } from '../src/server/enquiryBackend';

export default async function handler(req: IncomingMessage & { body?: any; query?: any; method?: string }, res: ServerResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    if (req.method === 'POST') {
      let bodyData = req.body;
      if (typeof bodyData === 'string') {
        try {
          bodyData = JSON.parse(bodyData);
        } catch {
          // keep as is
        }
      }

      if (!bodyData) {
        // Read stream if body is not pre-parsed
        bodyData = await new Promise((resolve, reject) => {
          let str = '';
          req.on('data', (chunk) => {
            str += chunk;
          });
          req.on('end', () => {
            try {
              resolve(str ? JSON.parse(str) : {});
            } catch (err) {
              reject(err);
            }
          });
          req.on('error', reject);
        });
      }

      const result = await handleCreateEnquiry(bodyData);
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
      return;
    }

    if (req.method === 'GET') {
      const result = await handleGetEnquiries();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
      return;
    }

    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  } catch (err: any) {
    console.error('API Error:', err);
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Server error' }));
  }
}
