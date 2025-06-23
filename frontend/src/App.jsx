import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Userlogin from './pages/Userlogin.jsx';  
import ResetPassword from './pages/ResetPass.jsx';
import SetNewPassword from './pages/SetNewPass.jsx';
import Recommend from './pages/Reader/Recommend.jsx';
import NavBar from './components/Navbar.jsx'; // Renamed from NavBar.jsx
import AdminNavBar from './components/AdminNavbar.jsx';
import WriterNavbar from './components/WriterNavBar.jsx';
import Signup from './pages/SignUp.jsx';
import Tagsblog from './pages/Reader/TagBlog.jsx';
import Latestblog from './pages/Reader/LatestBlog.jsx';
import ReaderProfile from './pages/Reader/ReaderProfile.jsx';
import UpdateProfilePage from './components/EditProfile.jsx';
import ChangePassword from './components/ChangePass.jsx';
import BlogPage from './components/BlogContent.jsx';
import AboutPage from './pages/About.jsx';
import PrivacyPolicy from './pages/Privacy.jsx';
import NotificationsPage from './pages/Reader/Notification.jsx';
import Dashboard from './pages/Adminn/Dashboard.jsx';
import WriterDashboard from './pages/Writer/WriterDashboard.jsx';
import WriteBlogPage from './pages/Writer/WriteBlogPage.jsx';

function AppWrapper() {
  const location = useLocation();
  
  // Mock user role - in a real app, this would come from authentication
  // For now, we'll use localStorage or a hardcoded value for mockups
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'writer'); // 'reader', 'writer', or 'admin'

  // Define routes where NavBar should not show
  const noNavRoutes = ['/login', '/resetpassword', '/setnewpassword', '/signup'];
  const hideNav = noNavRoutes.includes(location.pathname);

  const renderNavBar = () => {
    if (hideNav) return null;
    
    switch(userRole) {
      case 'admin':
        return <AdminNavBar />;
      case 'writer':
        return <WriterNavbar />;
      case 'reader':
      default:
        return <NavBar />;
    }
  };

  return (
    <>
      {renderNavBar()}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Userlogin setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Signup setUserRole={setUserRole} />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/setnewpassword" element={<SetNewPassword />} />
        
        {/* Reader Routes */}
        <Route path="/recommendation" element={<Recommend />} />
        <Route path="/tags" element={<Tagsblog />} />
        <Route path="/latestblog" element={<Latestblog />} />
        <Route path="/profile" element={<ReaderProfile />} />
        <Route path="/updateprofile" element={<UpdateProfilePage />} />
        <Route path="/updatepassword" element={<ChangePassword />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/notification" element={<NotificationsPage />} />
        
        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Add Writer Routes here when you develop them */}
        <Route path="/writerdashboard" element={<WriterDashboard />} />
        <Route path="/writeblog" element={<WriteBlogPage />} />


      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
