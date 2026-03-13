import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Drivers from './pages/Drivers';
import Teams from './pages/Teams';
import Circuits from './pages/Circuits';
import Schedule from './pages/Schedule';
import Standings from './pages/Standings';
import Login from './pages/Login';
import Knowledge from './pages/Knowledge';
import KnowledgeDetail from './pages/KnowledgeDetail';
import Results from './pages/Results';
import RaceResult from './pages/RaceResult';
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import NewsManagement from './pages/admin/NewsManagement';
import NewsForm from './pages/admin/NewsForm';
import DriverManagement from './pages/admin/DriverManagement';
import KnowledgeForm from './pages/admin/KnowledgeForm';
import KnowledgeManagement from './pages/admin/KnowledgeManagement';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/news" element={<News />} />
                {/* SEO-friendly news URL: /news/2025/01/slug */}
                <Route path="/news/:year/:month/:slug" element={<NewsDetail />} />
                {/* Fallback for old UUID links */}
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/circuits" element={<Circuits />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/standings" element={<Standings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/knowledge" element={<Knowledge />} />
                {/* SEO-friendly knowledge URL: /knowledge/:slug */}
                <Route path="/knowledge/:slug" element={<KnowledgeDetail />} />
                <Route path="/results" element={<Results />} />
                
                <Route path="/results/:season/:slug" element={<RaceResult />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute><AdminDashboard /></ProtectedRoute>
                } />
                <Route path="/admin/news" element={
                  <ProtectedRoute><NewsManagement /></ProtectedRoute>
                } />
                <Route path="/admin/news/create" element={
                  <ProtectedRoute><NewsForm /></ProtectedRoute>
                } />
                <Route path="/admin/news/edit/:id" element={
                  <ProtectedRoute><NewsForm /></ProtectedRoute>
                } />
                <Route path="/admin/knowledge" element={
                  <ProtectedRoute><KnowledgeManagement /></ProtectedRoute>
                } />
                <Route path="/admin/knowledge/create" element={
                  <ProtectedRoute><KnowledgeForm /></ProtectedRoute>
                } />
                <Route path="/admin/knowledge/edit/:id" element={
                  <ProtectedRoute><KnowledgeForm /></ProtectedRoute>
                } />
                <Route path="/admin/drivers" element={
                  <ProtectedRoute><DriverManagement /></ProtectedRoute>
                } />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;