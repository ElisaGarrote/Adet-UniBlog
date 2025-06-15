import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Userlogin from './pages/Userlogin.jsx';  
import Navbar from './components/Navbar.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/navbar" element={<Navbar />} />
      </Routes>
    </Router>
  );
}

export default App;
