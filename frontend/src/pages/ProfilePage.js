import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { AuthContext } from '../context/AuthContext';

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // SECURITY GUARD: Kick out anyone who isn't logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // or wherever your login route is
    }
  }, [navigate]);

  // Prevent rendering errors before the user object loads
  if (!user) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</p>;

  return (
    <>
      <header>
        <h1 className="site-title">My Profile</h1>
        <Nav />
      </header>

      <main>
        <section className="form-container" style={{ maxWidth: '500px', marginTop: '40px' }}>
          
          {/* Avatar and Name */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              backgroundColor: '#0ea5e9', 
              color: 'white', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '3.5rem', 
              margin: '0 auto',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <h2 style={{ marginTop: '15px', marginBottom: '5px' }}>{user.name}</h2>
            
            <span style={{ 
              backgroundColor: user.role === 'admin' ? '#ef4444' : '#10b981', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '12px', 
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}>
              {user.role}
            </span>
          </div>

          {/* Account Details Box */}
          <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginBottom: '15px', color: '#374151' }}>
              Account Information
            </h3>
            
            <div style={{ marginBottom: '10px' }}>
              <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>Full Name</p>
              <p style={{ margin: '0', fontWeight: 'bold', color: '#111827' }}>{user.name}</p>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>Email Address</p>
              <p style={{ margin: '0', fontWeight: 'bold', color: '#111827' }}>{user.email}</p>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>Account ID</p>
              <p style={{ margin: '0', fontFamily: 'monospace', color: '#111827' }}>{user._id}</p>
            </div>
          </div>

        </section>
      </main>
    </>
  );
}

export default ProfilePage;