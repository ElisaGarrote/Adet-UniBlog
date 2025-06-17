import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Userlogin from './pages/Userlogin.jsx';  
import ResetPassword from './pages/ResetPass.jsx';
import SetNewPassword from './pages/SetNewPass.jsx';
import Recommend from './pages/Reader/Recommend.jsx';
import NavBar from './components/NavBar.jsx';
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


function AppWrapper() {
  const location = useLocation();

  // Define routes where NavBar should not show
  const noNavRoutes = ['/login', '/resetpassword', '/setnewpassword','/signup'];

  const hideNav = noNavRoutes.includes(location.pathname);

  return (
    <>
      {!hideNav && <NavBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/setnewpassword" element={<SetNewPassword />} />
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
