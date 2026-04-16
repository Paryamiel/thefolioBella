import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

function AdminDashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('accounts');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // SECURITY GUARD
  useEffect(() => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      navigate('/home'); 
    } else if (user && user.role !== 'admin') {
      navigate('/home'); 
    }
  }, [user, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let endpoint = '';
        if (activeTab === 'accounts') endpoint = '/admin/users';        
        if (activeTab === 'posts') endpoint = '/posts';           
        if (activeTab === 'comments') endpoint = '/comments'; 
        if (activeTab === 'concerns') endpoint = '/contact';  

        const res = await API.get(endpoint);
        setData(res.data);
      } catch (error) {
        console.error(`Failed to fetch ${activeTab}:`, error);
        setData([]); 
      }
      setIsLoading(false);
    };

    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [activeTab, user]);

  // Handle Deletions (Posts and Comments)
  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to permanently delete this ${type}?`)) return;
    
    try {
      if (type === 'post') await API.delete(`/posts/${id}`);
      if (type === 'comment') await API.delete(`/comments/${id}`);
      
      setData(data.filter(item => item._id !== id));
    } catch (error) {
      alert(`Failed to delete ${type}`);
    }
  };

  // Handle Toggling Account Status 
  const handleToggleStatus = async (id) => {
    try {
      const res = await API.put(`/admin/users/${id}/status`);
      setData(data.map(user => user._id === id ? { ...user, status: res.data.status } : user));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to toggle status');
    }
  };

  // NEW: Handle Marking Concerns as Read
  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/contact/${id}/read`);
      // Update the screen instantly without refreshing
      setData(data.map(concern => concern._id === id ? { ...concern, isRead: true } : concern));
    } catch (error) {
      alert('Failed to mark message as read');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <>
      <header>
        <h1 className="site-title">Admin Control Center</h1>
        <Nav />
      </header>

      <main>
        <section className="form-container" style={{ maxWidth: '1000px' }}>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
            {['accounts', 'posts', 'comments', 'concerns'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  backgroundColor: activeTab === tab ? '#0ea5e9' : '#e5e7eb',
                  color: activeTab === tab ? 'white' : '#374151',
                  textTransform: 'capitalize',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p>Loading {activeTab}...</p>
          ) : data.length === 0 ? (
            <p>No {activeTab} found in the database.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6', color: '#111827' }}>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Details</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd', width: '150px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid #eee', backgroundColor: activeTab === 'concerns' && !item.isRead ? '#f0fdfa' : 'transparent' }}>
                      
                      <td style={{ padding: '10px' }}>
                        {activeTab === 'accounts' && (
                          <p>
                            <strong>{item.name}</strong> ({item.email}) <br/>
                            Role: {item.role} | Status: <span style={{ color: item.status === 'active' ? 'green' : 'red', fontWeight: 'bold' }}>{item.status || 'active'}</span>
                          </p>
                        )}
                        
                        {activeTab === 'posts' && (
                          <p><strong>{item.title}</strong> by {item.author?.name || 'Unknown'}</p>
                        )}
                        
                        {activeTab === 'comments' && (
                          <p>"{item.body}" — <em>{item.author?.name || 'Unknown'}</em></p>
                        )}
                        
                        {activeTab === 'concerns' && (
                          <p>
                            <strong>From: {item.name} ({item.email})</strong> 
                            {/* NEW BADGE */}
                            {!item.isRead && (
                              <span style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', marginLeft: '10px' }}>
                                New
                              </span>
                            )}
                            <br/>{item.message}
                          </p>
                        )}
                      </td>

                      <td style={{ padding: '10px' }}>
                        {activeTab === 'accounts' && item._id !== user._id && (
                          <button 
                            onClick={() => handleToggleStatus(item._id)} 
                            style={{ backgroundColor: item.status === 'active' ? '#f59e0b' : '#10b981', color: 'white', padding: '5px 10px', fontSize: '0.8rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            {item.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}

                        {(activeTab === 'posts' || activeTab === 'comments') && (
                          <button 
                            onClick={() => handleDelete(item._id, activeTab.slice(0, -1))} 
                            style={{ backgroundColor: '#dc2626', color: 'white', padding: '5px 10px', fontSize: '0.8rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        )}

                        {/* NEW: Mark as Read Button */}
                        {activeTab === 'concerns' && (
                          !item.isRead ? (
                            <button 
                              onClick={() => handleMarkAsRead(item._id)} 
                              style={{ backgroundColor: '#3b82f6', color: 'white', padding: '5px 10px', fontSize: '0.8rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Mark as Read
                            </button>
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 'bold' }}>✓ Read</span>
                          )
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default AdminDashboardPage;