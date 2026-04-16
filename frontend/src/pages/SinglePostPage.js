import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

function SinglePostPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      // 1. Fetch the POST
      try {
        const postRes = await API.get(`/posts/${id}`);
        setPost(postRes.data.post || postRes.data); 
      } catch (error) {
        console.error('Error fetching the POST:', error);
        setIsLoading(false);
        return; 
      }

      // 2. Fetch the COMMENTS (Updated URL!)
      try {
        const commentsRes = await API.get(`/comments/${id}`); 
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error fetching the COMMENTS:', error);
      }
      
      setIsLoading(false);
    };

    fetchPostAndComments();
  }, [id]);

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/posts/${id}`);
        navigate('/home');
      } catch (error) {
        alert('Failed to delete post');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Updated URL and changed payload from "text" to "body" to match your backend
      const { data } = await API.post(`/comments/${id}`, { body: newComment });
      
      // Add the new comment to the top of the list instantly
      setComments([data, ...comments]);
      setNewComment(''); 
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post comment');
    }
  };

  // NEW: Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await API.delete(`/comments/${commentId}`);
        // Remove it from the screen without refreshing
        setComments(comments.filter(comment => comment._id !== commentId));
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete comment');
      }
    }
  };

  if (isLoading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;
  if (!post) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Post not found.</p>;

  return (
    <>
      <header>
        <h1 className="site-title">Find Your TREASURE</h1>
        <Nav />
      </header>

      <main>
        <section className="form-container" style={{ maxWidth: '800px' }}>
          <h2>{post.title}</h2>
          <p style={{ color: 'gray', fontSize: '0.9rem', marginBottom: '20px' }}>
            Posted by: {post.author?.name || 'Unknown User'}
          </p>
          <p style={{ lineHeight: '1.6', marginBottom: '30px', whiteSpace: 'pre-wrap' }}>{post.body}</p>

          {user && (post.author?._id === user._id || user.role === 'admin') && (
            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
              <Link to={`/edit/${post._id}`}>
                <button style={{ backgroundColor: '#f59e0b' }}>Edit Post</button>
              </Link>
              <button onClick={handleDeletePost} style={{ backgroundColor: '#dc2626' }}>Delete Post</button>
            </div>
          )}

          <hr style={{ margin: '30px 0', borderColor: '#ddd' }} />

          {/* COMMENTS SECTION */}
          <h3>Comments</h3>
          
          <div style={{ marginBottom: '20px' }}>
            {comments.length === 0 ? (
              <p>No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} style={{ padding: '15px', borderBottom: '1px solid #ddd', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    {/* Changed from comment.text to comment.body to match backend! */}
                    <p style={{ margin: '0 0 5px 0' }}>{comment.body}</p>
                    <small style={{ color: 'gray' }}>— {comment.author?.name || 'Anonymous'}</small>
                  </div>
                  
                  {/* Delete button only shows for the comment author OR an admin */}
                  {user && (comment.author?._id === user._id || user.role === 'admin') && (
                    <button 
                      onClick={() => handleDeleteComment(comment._id)}
                      style={{ backgroundColor: 'transparent', color: '#dc2626', border: 'none', cursor: 'pointer', padding: '0', fontSize: '0.9rem' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {user ? (
            <form onSubmit={handleCommentSubmit} style={{ marginTop: '20px' }}>
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}
                required
              ></textarea>
              <button type="submit">Post Comment</button>
            </form>
          ) : (
            <p><Link to="/login" style={{ color: '#0ea5e9' }}>Log in</Link> to leave a comment.</p>
          )}
        </section>
      </main>

      <footer>
        <p>Bella Donna A. Viloria | Web Programming 1</p>
      </footer>
    </>
  );
}

export default SinglePostPage;