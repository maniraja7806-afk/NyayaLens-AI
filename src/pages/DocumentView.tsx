import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertTriangle, Info, ShieldAlert, Calendar, CheckCircle, BrainCircuit } from 'lucide-react';
import type { DocumentAnalysis, Clause } from '../types';
import { cn } from '../lib/utils';

export function DocumentView() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'clauses' | 'dates' | 'action'>('overview');

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch(`/api/documents/${id}/analysis`);
        if (!res.ok) throw new Error('Failed to fetch document analysis.');
        const data = await res.json();
        setAnalysis(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Retrieving intelligent analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex items-start gap-4 max-w-2xl mx-auto">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <div>
            <h3 className="font-semibold text-lg">Analysis Unavailable</h3>
            <p className="mt-1">{error || 'Could not load the analysis for this document.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getAttentionColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'important': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const getAttentionIcon = (level: string) => {
    switch (level) {
      case 'critical': return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'important': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'review': return <Info className="w-5 h-5 text-yellow-600" />;
      default: return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="flex h-full">
      {/* LEFT: Original Document Viewer (Placeholder) */}
      <div className="hidden lg:flex w-1/2 border-r border-slate-200 bg-slate-100 p-6 flex-col items-center justify-center text-center">
         <FileText className="w-16 h-16 text-slate-300 mb-4" />
         <h2 className="text-slate-500 font-medium">Document Preview</h2>
         <p className="text-sm text-slate-400 max-w-xs mt-2">In a production environment, the original PDF would be rendered here side-by-side using PDF.js.</p>
      </div>

      {/* RIGHT: AI Intelligence Panel */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white h-full overflow-hidden">
        <header className="p-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
              {analysis.documentType}
            </span>
            <span className="text-sm text-slate-400 font-medium">
              {(analysis.confidence * 100).toFixed(0)}% Match
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Intelligence Report</h1>
        </header>

        {/* Custom Tabs */}
        <div className="flex px-6 border-b border-slate-100 gap-6 flex-shrink-0">
          {[
            { id: 'overview', label: 'Summary' },
            { id: 'clauses', label: 'What Matters' },
            { id: 'dates', label: 'Dates' },
            { id: 'action', label: 'Action Plan' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "py-4 font-medium text-sm transition-colors relative",
                activeTab === tab.id ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass-panel p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-blue-600" />
                    Plain English Summary
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'clauses' && (
              <motion.div
                key="clauses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {analysis.clauses.map((clause: Clause, idx: number) => (
                  <div key={idx} className={cn("rounded-2xl p-5 border", getAttentionColor(clause.attentionLevel))}>
                    <div className="flex items-start gap-3 mb-3">
                      {getAttentionIcon(clause.attentionLevel)}
                      <div>
                        <div className="flex items-center gap-2">
                           <h4 className="font-semibold text-slate-900">{clause.title}</h4>
                           <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 bg-black/5 px-2 py-0.5 rounded-sm">
                             {clause.category}
                           </span>
                        </div>
                        <p className="text-sm font-medium mt-1 opacity-90">{clause.explanation}</p>
                      </div>
                    </div>
                    {clause.attentionReason && (
                      <div className="mt-3 pl-8">
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Why it matters</p>
                        <p className="text-sm opacity-80">{clause.attentionReason}</p>
                      </div>
                    )}
                    <div className="mt-4 pt-3 border-t border-black/5 pl-8">
                      <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Original Text</p>
                      <p className="text-xs font-mono opacity-60 italic">"{clause.originalText}"</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'dates' && (
              <motion.div
                key="dates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {analysis.importantDates.length === 0 ? (
                  <p className="text-slate-500">No specific dates detected in this document.</p>
                ) : (
                  analysis.importantDates.map((dateItem, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
                      <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{dateItem.date}</p>
                        <h4 className="font-semibold text-lg text-slate-900">{dateItem.event}</h4>
                        <p className="text-slate-600 mt-1 text-sm">{dateItem.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'action' && (
              <motion.div
                key="action"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-6 text-sm text-blue-800">
                  <p className="font-medium flex items-center gap-2">
                    <Info className="w-4 h-4" /> Suggested Review Checklist
                  </p>
                  <p className="mt-1 opacity-90">Based on the document's contents. This does not constitute legal instructions.</p>
                </div>
                
                {analysis.actionPlan.map((action, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                      {idx + 1}
                    </div>
                    <div className="pt-1">
                      <h4 className="font-medium text-slate-900">{action.task}</h4>
                      <p className="text-sm text-slate-500 mt-1">{action.reason}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
