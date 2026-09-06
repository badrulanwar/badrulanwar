import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create data directory:', e);
  }
}

// Active Server-Sent Events clients for multi-device live sync
const sseClients: Response[] = [];

async function startServer() {
  const app = express();

  // Parse JSON payloads up to 50MB (to comfortably handle class gradebooks and photos)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // --- API ROUTES FIRST ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      serverTime: new Date().toISOString(),
      sseConnectedClients: sseClients.length
    });
  });

  // Get current cloud database state
  app.get('/api/data', (req: Request, res: Response) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return res.json({
          success: true,
          data: parsed,
          timestamp: parsed.timestamp || 0
        });
      }
      return res.json({ success: true, data: null, timestamp: 0 });
    } catch (error) {
      console.error('Error reading database file:', error);
      return res.status(500).json({ success: false, error: 'Gagal membaca database server' });
    }
  });

  // Save updated data to cloud database and broadcast to all devices
  app.post('/api/data', (req: Request, res: Response) => {
    try {
      const { students, teacherColumns, teachers } = req.body;
      const timestamp = Date.now();

      const recordToSave = {
        students,
        teacherColumns,
        teachers,
        timestamp,
        lastSavedByDevice: req.headers['user-agent'] || 'Web Browser',
        lastSavedAt: new Date().toISOString()
      };

      fs.writeFileSync(DB_FILE, JSON.stringify(recordToSave, null, 2), 'utf-8');

      // Broadcast update to all connected devices via SSE
      const ssePayload = `data: ${JSON.stringify({ type: 'DATABASE_UPDATED', timestamp })}\n\n`;
      sseClients.forEach((client) => {
        try {
          client.write(ssePayload);
        } catch (err) {
          // ignore closed connection
        }
      });

      return res.json({
        success: true,
        timestamp,
        message: 'Data berhasil tersimpan dan disinkronkan ke seluruh perangkat'
      });
    } catch (error) {
      console.error('Error saving database file:', error);
      return res.status(500).json({ success: false, error: 'Gagal menyimpan database server' });
    }
  });

  // Lightweight timestamp check for polling
  app.get('/api/sync/check', (req: Request, res: Response) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const stats = fs.statSync(DB_FILE);
        return res.json({
          exists: true,
          mtimeMs: stats.mtimeMs
        });
      }
      return res.json({ exists: false, mtimeMs: 0 });
    } catch (error) {
      return res.json({ exists: false, mtimeMs: 0 });
    }
  });

  // Real-time Server-Sent Events (SSE) connection for multi-device sync
  app.get('/api/sync/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Send initial connection packet
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', serverTime: Date.now() })}\n\n`);

    sseClients.push(res);

    // Heartbeat every 20s to prevent reverse proxy timeouts
    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 20000);

    req.on('close', () => {
      clearInterval(heartbeat);
      const index = sseClients.indexOf(res);
      if (index !== -1) {
        sseClients.splice(index, 1);
      }
    });
  });

  // --- VITE MIDDLEWARE OR STATIC PRODUCTION SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduGrade Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
