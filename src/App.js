import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* If no user, show Login. If user exists, redirect to Dashboard */}
        <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Route: Only accessible if user is logged in */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;