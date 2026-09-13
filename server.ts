import express from 'express';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { extractTextFromPdf } from './src/server/pdf';
import { analyzeDocumentContent } from './src/server/ai';

// In-memory store for demo mode (since DB might not be configured instantly)
const memoryStore = {
  documents: [] as any[],
  analyses: {} as Record<string, any>
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Configure Multer for in-memory storage (ideal for serverless demo)
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });

  // API Routes MUST be defined BEFORE Vite middleware
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'NyayaLens AI API is running.' });
  });

  // Get all documents
  app.get('/api/documents', (req, res) => {
    res.json({ documents: memoryStore.documents });
  });
  
  // Get specific document analysis
  app.get('/api/documents/:id/analysis', (req, res) => {
    const analysis = memoryStore.analyses[req.params.id];
    if (!analysis) {
       res.status(404).json({ error: 'Analysis not found' });
       return;
    }
    res.json(analysis);
  });

  // Upload and analyze document
  app.post('/api/documents/analyze', upload.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No document uploaded' });
        return;
      }
      
      const fileBuffer = req.file.buffer;
      const filename = req.file.originalname;
      const mimetype = req.file.mimetype;
      
      console.log(`Processing file: ${filename} (${mimetype}, ${fileBuffer.length} bytes)`);
      
      let extractedText = '';
      let inlineData: any = undefined;

      // 1. Extraction / Data Prep
      if (mimetype === 'application/pdf') {
        extractedText = await extractTextFromPdf(fileBuffer);
        if (!extractedText || extractedText.trim() === '') {
          res.status(422).json({ error: 'Could not extract text from document. Ensure it is a valid PDF.' });
          return;
        }
      } else if (mimetype.startsWith('image/')) {
        // It's a scanned document image (JPEG/PNG)
        inlineData = {
          data: fileBuffer.toString('base64'),
          mimeType: mimetype
        };
      } else {
        res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or Image.' });
        return;
      }

      // 2. AI Reasoning / Chunking / Extraction
      const analysis = await analyzeDocumentContent(extractedText, filename, inlineData);
      
      // 3. Save to In-Memory DB (Demo mode)
      const docId = `doc_${Date.now()}`;
      
      const documentRecord = {
        id: docId,
        filename,
        documentType: analysis.documentType,
        pageCount: 1, // Simplified for PDF Parse
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      memoryStore.documents.push(documentRecord);
      memoryStore.analyses[docId] = {
        documentId: docId,
        ...analysis
      };

      res.json({
        message: 'Document analyzed successfully',
        document: documentRecord,
        analysis: memoryStore.analyses[docId]
      });

    } catch (error: any) {
      console.error('Error processing document:', error);
      res.status(500).json({ 
        error: 'Failed to process document', 
        details: error.message 
      });
    }
  });

  // Vite Integration for Full-Stack Routing
  if (process.env.NODE_ENV !== 'production') {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
