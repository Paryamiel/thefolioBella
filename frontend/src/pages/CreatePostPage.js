import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      return setErrorMsg('You must be logged in to create a post.');
    }

    try {
      // Send the new post to your Node.js backend
      await API.post('/posts', { title, body });
      navigate('/home'); // Send them back home to see their new post!
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to create post');
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
          <h2>Create a New Post</h2>
          
          {errorMsg && <p className="error" style={{ marginBottom: '15px' }}>{errorMsg}</p>}

          <form onSubmit={handleSubmit}>
            <label>Title:</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="e.g., My favorite TREASURE song!"
            />

            <label>Content:</label>
            <textarea 
              value={body} 
              onChange={(e) => setBody(e.target.value)} 
              required 
              rows="6"
              style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', borderRadius: '4px' }}
              placeholder="Write your thoughts here..."
            ></textarea>
            
            <button type="submit">Publish Post</button>
          </form>
        </section>
      </main>

      <footer>
        <p>Bella Donna A. Viloria | Web Programming 1</p>
      </footer>
    </>
  );
}

export default CreatePostPage;