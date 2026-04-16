import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import PostCard from '../components/PostCard';
import API from '../api'; // NEW: Import your Axios instance

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // NEW: Fetch real posts from your Node.js/MongoDB backend!
    const fetchPosts = async () => {
      try {
        const { data } = await API.get('/posts');
        setPosts(data); // Save the real MongoDB data
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      {/* FIX: Wrapped Nav inside the header and added the h1 title so it matches the other pages perfectly! */}
      <header>
        <h1 className="site-title">Find Your TREASURE</h1>
        <Nav />
      </header>

      <main>
        <section className="hero">
          <div className="hero-text">
            <h2>Welcome, Netizens!</h2>
            <p>This fan-made portfolio was created about the K-pop group TREASURE.</p>
            <p>Explore the pages to learn more about TREASURE and connect with fans.</p>
          </div>
          <img src="/images/treasurestageperformance.jpg" alt="TREASURE performing live on stage" className="hero-image" />
        </section>

        <section className="previews">
          {isLoading ? (
            <p>Loading posts from database...</p>
          ) : posts.length === 0 ? (
            <p>No posts available yet. Log in to create one!</p>
          ) : (
            posts.map((post) => (
              <PostCard 
                key={post._id} 
                id={post._id}           
                title={post.title} 
                description={post.body} // Using post.body since that's what we named it in our MongoDB Post model
              />
            ))
          )}
        </section>
      </main>

      <footer>
        <p>Bella Donna A. Viloria | Web Programming 1</p>
      </footer>
    </>
  );
}

export default HomePage;