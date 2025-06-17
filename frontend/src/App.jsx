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
import ProtectedRoute from './components/ProtectedRoute.jsx';
function Logout(){
  localStorage.clear();
  return <Navigate to="/login" />;
}

function AppWrapper() {
  const location = useLocation();

  const noNavRoutes = ['/login', '/resetpassword', '/setnewpassword', '/signup'];
  const hideNav = noNavRoutes.includes(location.pathname);

  return (
    <>
      {!hideNav && <NavBar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/setnewpassword" element={<SetNewPassword />} />
        
        {/* Protected Routes */}
        <Route path="/recommendation" element={
          <ProtectedRoute><Recommend /></ProtectedRoute>
        } />
        <Route path="/tags" element={
          <ProtectedRoute><Tagsblog /></ProtectedRoute>
        } />
        <Route path="/latestblog" element={
          <ProtectedRoute><Latestblog /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ReaderProfile /></ProtectedRoute>
        } />
        <Route path="/logout" element={<Logout />} />
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
