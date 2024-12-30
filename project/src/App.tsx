import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { VideoPage } from './pages/VideoPage';
import { Profile } from './pages/Profile';
import { Upload } from './pages/Upload';
import { Auth } from './pages/Auth';
import { Settings } from './pages/Settings';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Sidebar />
          <main className="lg:ml-64 min-h-screen">
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/video/:id" element={<VideoPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}