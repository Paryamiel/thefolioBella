import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

function EditPostPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // Grabs the post ID from the URL

  // Fetch the existing post data when the page loads
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setTitle(data.title);
        setBody(data.body);
      } catch (error) {
        setErrorMsg('Could not load post data.');
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // Send the updated data to the backend
      await API.put(`/posts/${id}`, { title, body });
      navigate(`/post/${id}`); // Redirect back to the single post page
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to update post');
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
          <h2>Edit Post</h2>
          
          {errorMsg && <p className="error" style={{ marginBottom: '15px' }}>{errorMsg}</p>}

          <form onSubmit={handleSubmit}>
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label>Content:</label>
            <textarea 
              value={body} 
              onChange={(e) => setBody(e.target.value)} 
              required 
              rows="6"
              style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', borderRadius: '4px' }}
            ></textarea>
            
            <button type="submit">Update Post</button>
          </form>
        </section>
      </main>

      <footer>
        <p>Bella Donna A. Viloria | Web Programming 1</p>
      </footer>
    </>
  );
}

export default EditPostPage;