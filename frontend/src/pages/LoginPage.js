import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Nav from '../components/Nav';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Clear previous errors
    
    try {
      // Calls the login function from AuthContext (which hits your Node.js backend)
      await login(email, password);
      navigate('/'); // Redirect to Home page on success
    } catch (error) {
      // If backend throws an error (e.g., wrong password, inactive account), show it!
      setErrorMsg(error.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <>
      <header>
        <h1 className="site-title">Find Your TREASURE</h1>
        <Nav />
      </header>

      <main>
        <section className="form-container">
          <h2>User Login</h2>
          
          {/* Display backend errors here */}
          {errorMsg && <p className="error" style={{ marginBottom: '15px' }}>{errorMsg}</p>}
          
          <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />

            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            
            <br />
            <button type="submit">Login</button>
          </form>
        </section>
      </main>

      <footer>
        <p>Bella Donna A. Viloria | Web Programming 1</p>
      </footer>
    </>
  );
}

export default LoginPage;