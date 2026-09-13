import { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function DocumentScanner({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      setError('Camera access denied or not available. Please allow permissions in your browser settings.');
    }
  };

  const stopCamera = () => {
    setStream((currentStream) => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      return null;
    });
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'scanned_document.jpg', { type: 'image/jpeg' });
            stopCamera();
            onCapture(file);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
      <div className="absolute top-6 right-6 z-[60]">
        <button 
          onClick={handleClose} 
          className="p-3 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {error ? (
        <div className="text-white p-6 max-w-md text-center bg-red-950/50 rounded-2xl border border-red-900/50">
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={startCamera} 
            className="mt-6 flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <RefreshCcw className="w-5 h-5" /> Retry
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-3xl aspect-[3/4] md:aspect-video bg-black flex flex-col items-center justify-center rounded-2xl overflow-hidden shadow-2xl shadow-black border border-white/10"
        >
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover md:object-contain" 
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Scanning Overlay Guide */}
          <div className="absolute inset-0 pointer-events-none border-[2px] border-white/20 m-8 rounded-xl flex items-center justify-center">
            <p className="text-white/50 text-sm font-medium uppercase tracking-[0.2em] bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Align Document Here</p>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center z-[60]">
            <button 
              onClick={capture} 
              className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
