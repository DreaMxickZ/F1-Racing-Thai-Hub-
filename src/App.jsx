import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import NewsManagement from './pages/admin/NewsManagement';
import NewsForm from './pages/admin/NewsForm';
import DriverManagement from './pages/admin/DriverManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/circuits" element={<Circuits />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/news" element={
                <ProtectedRoute>
                  <NewsManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/news/create" element={
                <ProtectedRoute>
                  <NewsForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/news/edit/:id" element={
                <ProtectedRoute>
                  <NewsForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/drivers" element={
                <ProtectedRoute>
                  <DriverManagement />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
