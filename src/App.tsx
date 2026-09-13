import { Routes, Route } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { DocumentView } from './pages/DocumentView';
import { PlaceholderPage } from './pages/PlaceholderPage';

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/document/:id" element={<DocumentView />} />
          <Route path="/documents" element={<PlaceholderPage title="Document Library" description="Browse and manage all your previously analyzed documents in one secure place." />} />
          <Route path="/compare" element={<PlaceholderPage title="Compare Documents" description="Upload two versions of a document to instantly spot semantic differences and changed clauses." />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Center" description="Manage your data retention, clear processing history, and configure local-first AI settings." />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" description="Configure your AI provider, appearance preferences, and application defaults." />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
