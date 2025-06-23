import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Userlogin from './pages/Userlogin.jsx';                          //  userlogin for everyone (admin, reader, writer)
import ResetPassword from './pages/ResetPass.jsx';                      //  reset password for everyone (admin, reader, writer)
import SetNewPassword from './pages/SetNewPass.jsx';                    //  reset password for everyone after giving the email
import Recommend from './pages/Reader/Recommend.jsx';                   //  reader's recommendation page
import NavBar from './components/Navbar.jsx';                           //  reader's navigation bar
import Signup from './pages/SignUp.jsx';                                //  reader's signup
import Tagsblog from './pages/Reader/TagBlog.jsx';                      //  reader's tags
import Latestblog from './pages/Reader/LatestBlog.jsx';                 //  reader's latest blog
import ReaderProfile from './pages/Reader/ReaderProfile.jsx';           //  reader's profile
import ProtectedRoute from './components/ProtectedRoute.jsx';           //  protected route( for routing with tokens)
import ProfileCard from './components/ProfileCard';                     //  reader's profile card(placeholder)
import ChangePass from './components/ChangePass';                       //  reader's change password(can be used for everyone)
import UpdateProfilePage from './components/UpdateProfile.jsx';               // readers profile

//logout function for all
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
  <Route path="/" element={<Navigate to="/login" replace />} /> {/*when user opens the website, it automatically redirects to login  */}
  <Route path="/login" element={<Userlogin />} /> {/*login landing page */}
  <Route path="/signup" element={<Signup />} /> {/*signup  */}
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

  {/* New Protected Routes for Profile Actions */}
  <Route path="/updateprofile" element={
    <ProtectedRoute><UpdateProfilePage /></ProtectedRoute>
  } />
  <Route path="/change-password" element={
    <ProtectedRoute><ChangePass /></ProtectedRoute>
  } />
  <Route path="/profile-card" element={
    <ProtectedRoute><ProfileCard /></ProtectedRoute>
  } />

  {/* Logout */}
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
