import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Userlogin from './pages/Userlogin.jsx';                          //  userlogin for everyone (admin, reader, writer)
import ResetPassword from './pages/ResetPass.jsx';                      //  reset password for everyone (admin, reader, writer)
import SetNewPassword from './pages/SetNewPass.jsx';                    //  reset password for everyone after giving the email
import Recommend from './pages/Reader/Recommend.jsx';                   //  reader's recommendation page
import DynamicNavBar from './components/DynamicNavBar.jsx';             //  dynamic navbar based on user role
import Signup from './pages/SignUp.jsx';                                //  reader's signup
import Tagsblog from './pages/Reader/TagBlog.jsx';                      //  reader's tags
import Latestblog from './pages/Reader/LatestBlog.jsx';                 //  reader's latest blog
import ReaderProfile from './pages/Reader/ReaderProfile.jsx';           //  reader's profile
import ProtectedRoute from './components/ProtectedRoute.jsx';           //  protected route( for routing with tokens)
import ProfileCard from './components/ProfileCard';                     //  reader's profile card(placeholder)
import ChangePass from './components/ChangePass';                       //  reader's change password(can be used for everyone)
import UpdateProfilePage from './components/UpdateProfile.jsx';         // readers profile
import WriteBlogPage from './pages/Writer/WriteBlogPage';               //  writer's blog pages (writer can see their published blogs and add blog btn)
import WriteBlog from './pages/Writer/WriteBlog.jsx';                   //  writer's blog creation page
import Editblog from './pages/Writer/EditBlog.jsx';                     //  writer's blog edit page
import BlogPage from './components/BlogContent.jsx';
import AboutPage from './pages/About.jsx';
import PrivacyPolicy from './pages/Privacy.jsx';
import AdminDashboard from './pages/Adminn/AdminDashboard.jsx';
import WriterDashboard from './pages/Writer/WriterDashboard.jsx';
import AllBlogsPage from './pages/Writer/AllBlogPage.jsx';
import AllFlagBlog from './pages/Writer/AllFlagBlogs.jsx';
import WriterProfile from './pages/Writer/WriterProfile.jsx';
import WriterNotificationsPage from './pages/Writer/WriterNotification.jsx';

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
      {!hideNav && <DynamicNavBar />}
      <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Navigate to="/login" replace />} /> {/*when user opens the website, it automatically redirects to login  */}
  <Route path="/login" element={<Userlogin />} /> {/*login landing page */}
  <Route path="/signup" element={<Signup />} /> {/*signup  */}
  <Route path="/resetpassword" element={<ResetPassword />} />
  <Route path="/setnewpassword" element={<SetNewPassword />} />
  <Route path="/blog" element={<BlogPage />} />
  <Route path="/blog/:id" element={<BlogPage />} />
  <Route path="/viewblog/:id" element={<BlogPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/privacypolicy" element={<PrivacyPolicy />} />
  <Route path="/privacy" element={<PrivacyPolicy />} />  

  

  {  /* Admin Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

  {  /* Writer Routes */}
        <Route path="/writerdashboard" element={
          <ProtectedRoute allowedRoles={['writer']}>
            <WriterDashboard />
          </ProtectedRoute>
        } />
        <Route path="/allblog" element={
          <ProtectedRoute allowedRoles={['writer']}>
            <AllBlogsPage />
          </ProtectedRoute>
        } />
        <Route path="/allflagblog" element={
          <ProtectedRoute allowedRoles={['writer']}>
            <AllFlagBlog />
          </ProtectedRoute>
        } />
        <Route path="/writerprofile" element={
          <ProtectedRoute allowedRoles={['writer']}>
            <WriterProfile />
          </ProtectedRoute>
        } />
        <Route path="/writernotification" element={
          <ProtectedRoute allowedRoles={['writer']}>
            <WriterNotificationsPage />
          </ProtectedRoute>
        } />

  
  {/* Reader Routes */}
  <Route path="/recommendation" element={
    <ProtectedRoute allowedRoles={['reader']}>
      <Recommend />
    </ProtectedRoute>
  } />
  <Route path="/tags" element={
    <ProtectedRoute allowedRoles={['reader']}>
      <Tagsblog />
    </ProtectedRoute>
  } />
  <Route path="/latestblog" element={
    <ProtectedRoute allowedRoles={['reader']}>
      <Latestblog />
    </ProtectedRoute>
  } />
  <Route path="/profile" element={
    <ProtectedRoute allowedRoles={['reader']}>
      <ReaderProfile />
    </ProtectedRoute>
  } />

  {/* Shared Protected Routes for Profile Actions (all roles) */}
  <Route path="/updateprofile" element={
    <ProtectedRoute><UpdateProfilePage /></ProtectedRoute>
  } />
  <Route path="/change-password" element={
    <ProtectedRoute><ChangePass /></ProtectedRoute>
  } />
  <Route path="/profile-card" element={
    <ProtectedRoute><ProfileCard /></ProtectedRoute>
  } />

  {/* Writer-only Routes */}
  <Route path="/writeblogpage" element={
    <ProtectedRoute allowedRoles={['writer']}>
      <WriteBlogPage />
    </ProtectedRoute>
  } />
  
  <Route path="/writeblog" element={
    <ProtectedRoute allowedRoles={['writer']}>
      <WriteBlog />
    </ProtectedRoute>
  } />

  <Route path="/editblog/:id" element={
    <ProtectedRoute allowedRoles={['writer']}>
      <Editblog />
    </ProtectedRoute>
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
