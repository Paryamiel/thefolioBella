import { Link } from 'react-router-dom';

function PostCard({ id, title, description }) {
  // We trim the description so the home page preview doesn't get too massive
  const snippet = description.length > 100 ? description.substring(0, 100) + '...' : description;

  return (
    <div className="preview-card" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '15px' }}>
      <h3>{title}</h3>
      <p>{snippet}</p>
      
      {/* NEW: The link to the single post page! */}
      <Link to={`/post/${id}`} style={{ display: 'inline-block', marginTop: '10px', color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none' }}>
        Read More →
      </Link>
    </div>
  );
}

export default PostCard;