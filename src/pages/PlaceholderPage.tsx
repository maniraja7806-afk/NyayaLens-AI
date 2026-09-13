import { motion } from 'framer-motion';
import { Hammer } from 'lucide-react';

interface Props {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-12 max-w-md w-full border border-slate-200 shadow-xl rounded-3xl"
      >
        <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Hammer className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-500 mb-8">{description}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          Under Construction
        </div>
      </motion.div>
    </div>
  );
}
