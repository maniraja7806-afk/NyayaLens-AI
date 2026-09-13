import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, AlertCircle, CheckCircle2, Loader2, Camera as CameraIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentScanner } from '../components/DocumentScanner';

export function Dashboard() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const processFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setShowScanner(false);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await fetch('/api/documents/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.details || errData.error || 'Analysis failed');
      }

      const data = await res.json();
      
      if (data.document?.id) {
        navigate(`/document/${data.document.id}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      setError('Please upload a PDF or an Image (JPEG/PNG).');
      return;
    }

    processFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {showScanner && (
        <DocumentScanner 
          onClose={() => setShowScanner(false)} 
          onCapture={processFile} 
        />
      )}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Good afternoon</h1>
        <p className="text-slate-500 mt-2 text-lg">Understand what matters in your documents.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2">
          <motion.div 
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-blue-600" />
              Upload Document
            </h2>

            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors duration-200
                ${isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'}
                ${uploading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              <AnimatePresence mode="wait">
                {uploading ? (
                  <motion.div 
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-slate-600 font-medium text-lg">Analyzing document structure...</p>
                    <p className="text-sm text-slate-400">This might take a few moments depending on length.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <File className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-slate-700 font-medium text-lg">Drag & drop your PDF or Image</p>
                    <p className="text-sm text-slate-400">Or click to browse from your computer</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {!uploading && (
              <div className="mt-6 flex items-center justify-center">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="px-4 text-sm text-slate-400 uppercase font-medium tracking-wide">Or</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
            )}

            {!uploading && (
              <button 
                onClick={() => setShowScanner(true)}
                className="mt-6 w-full py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-medium transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
              >
                <CameraIcon className="w-5 h-5 text-slate-500" />
                Scan Document with Camera
              </button>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
           <motion.div 
            className="bg-gradient-to-br from-blue-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-medium text-blue-100 mb-1">Documents Analyzed</h3>
            <p className="text-4xl font-bold">12</p>
          </motion.div>

          <motion.div 
            className="glass-panel p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Supported Types
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"/> Rental Agreements</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"/> Employment Contracts</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"/> Government Notices</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"/> Policies & T&Cs</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
