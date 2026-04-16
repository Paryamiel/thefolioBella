import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Nav from '../components/Nav';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '', username: '', email: '', password: '', 
    confirmPassword: '', dob: '', level: '', terms: false
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState(''); // NEW: To catch database errors

  const { register } = useContext(AuthContext); // NEW: Pull in the register function
  const navigate = useNavigate(); // NEW: Used to redirect after success

  const handleChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    if (type === 'radio') {
      setFormData({ ...formData, [name]: value });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  // NEW: Make this function async so we can talk to the database
  const validateForm = async (e) => {
    e.preventDefault();
    let newErrors = {};
    let valid = true;
    setBackendError(''); // Clear previous backend errors

    // --- YOUR EXISTING VALIDATIONS ---
    if (formData.fullname.trim() === "") { newErrors.fullname = "Required"; valid = false; }
    if (formData.username.trim() === "") { newErrors.username = "Required"; valid = false; }
    if (formData.email.trim() === "") { newErrors.email = "Required"; valid = false; }
    
    if (formData.password.length < 6) { 
      newErrors.password = "Min 6 chars"; 
      valid = false; 
    }
    if (formData.password !== formData.confirmPassword) { 
      newErrors.confirmPassword = "Passwords do not match"; 
      valid = false; 
    }

    if (formData.dob) {
      const today = new Date();
      const birth = new Date(formData.dob);
      let age = today.getFullYear() - birth.getFullYear();
      if (age < 18) {
        newErrors.dob = "Must be 18+";
        valid = false;
      }
    }

    if (!formData.level) { newErrors.level = "Select an interest category"; valid = false; }
    if (!formData.terms) { newErrors.terms = "You must agree to the terms"; valid = false; }

    setErrors(newErrors);

    // --- NEW: BACKEND CONNECTION ---
    if (valid) {
      try {
        // We map your 'fullname' to the 'name' field our backend expects
        await register(formData.fullname, formData.email, formData.password);
        
        // If it succeeds, redirect them to the home page!
        navigate('/'); 
      } catch (error) {
        // If the backend rejects it (e.g. email already in use), show the error
        setBackendError(error.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <>
      <header>
        <h1 className="site-title">Find Your TREASURE</h1>
        <Nav />
      </header>
      
      <main>
        <section className="signup-info">
          <h2>Why Sign Up?</h2>
          <p>Signing up allows fans to receive updates about TREASURE’s music, events, and exclusive content. This helps create a stronger fan community while demonstrating form design in HTML and CSS.</p>
          <img src="/images/treasurepromotional.jpg" width="1060" height="550" alt="TREASURE promotional " className="decorative-image" />
        </section>

        <section className="form-container">
          <h2>User Registration</h2>
          
          {/* NEW: Display backend errors here (like 'User already exists') */}
          {backendError && <p className="error" style={{ marginBottom: '15px', fontWeight: 'bold' }}>{backendError}</p>}

          <form onSubmit={validateForm}>
            <label>Full Name:</label>
            <input type="text" id="fullname" value={formData.fullname} onChange={handleChange} />
            <span className="error">{errors.fullname}</span>

            <label>Username:</label>
            <input type="text" id="username" value={formData.username} onChange={handleChange} />
            <span className="error">{errors.username}</span>

            <label>Email:</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} />
            <span className="error">{errors.email}</span>

            <label>Password:</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange} />
            <span className="error">{errors.password}</span>

            <label>Confirm Password:</label>
            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            <span className="error">{errors.confirmPassword}</span>

            <label>Date of Birth:</label>
            <input type="date" id="dob" value={formData.dob} onChange={handleChange} />
            <span className="error">{errors.dob}</span>
            
            <p><br /><strong>Interest Category:</strong></p>
            <label><input type="radio" name="level" value="beginner" onChange={handleChange} checked={formData.level === 'beginner'} /> Beginner</label>
            <label><input type="radio" name="level" value="intermediate" onChange={handleChange} checked={formData.level === 'intermediate'} /> Intermediate</label>
            <label><input type="radio" name="level" value="expert" onChange={handleChange} checked={formData.level === 'expert'} /> Expert</label>
            <span className="error">{errors.level}</span>
            <br />

            <label><input type="checkbox" id="terms" checked={formData.terms} onChange={handleChange} /> I agree to the terms and conditions</label>
            <span className="error">{errors.terms}</span>
            
            <button type="submit">Submit</button>
          </form>
        </section>  
      </main>

      <footer>
        <p>Bella Donna A. Viloria | Web Programming 1</p>
      </footer>
    </>
  );
}

export default RegisterPage;