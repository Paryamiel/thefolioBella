import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Nav() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDark);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav>
      <button className="dark-toggle" onClick={toggleDarkMode}>Dark Mode</button>
      <Link to="/home">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact Us</Link>
      
      {/* Conditional Rendering */}
      {user ? (
        <>
          {/* NEW: Added Create Post link for logged-in users */}
          <Link to="/create" style={{ color: '#f59e0b', fontWeight: 'bold' }}>Create Post</Link>
          <Link to="/profile">Profile</Link> {/* <-- ADD THIS LINK! */}
          
{user.role === 'admin' && (
  <Link to="/admin" style={{ color: '#ef4444', fontWeight: 'bold' }}>Dashboard</Link>
)}

          <span className="nav-greeting" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
            Hi, {user.name}!
          </span>
          <button 
            onClick={handleLogout} 
            style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '15px' }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Nav;