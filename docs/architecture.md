# Architecture Overview

NyayaLens AI is a full-stack web application designed for multimodal document intelligence.

## System Architecture

```mermaid
graph TD
    Client[React/Vite Client] -->|REST /api| Server[Express Server]
    Server -->|Upload| Multer[Memory Storage]
    Server -->|Extract| PDFParse[PDF Text Extractor]
    Server -->|RAG / Reasoning| Gemini[Google Gemini API]
    Server -->|Persistence| Mongo[MongoDB Atlas]
    
    subgraph AI Pipeline
      PDFParse --> Chunking[Semantic Chunking]
      Chunking --> Extraction[Clause Extraction]
      Extraction --> Classification[Attention Classification]
      Classification --> Summary[Action Plan Generation]
    end
```

## Layers
1. **Presentation**: React, Tailwind CSS, Framer Motion.
2. **Backend**: Express.js handling business logic, document parsing, and file handling.
3. **AI Provider Abstraction**: Interface for LLMs (currently leveraging @google/genai).
4. **Data Persistence**: MongoDB (with fallback in-memory caching for demo environments).
