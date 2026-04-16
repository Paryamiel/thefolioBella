import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simply wait 3 seconds, then go to the Home page!
    const timer = setTimeout(() => {
      navigate('/home'); 
    }, 3000); 

    // This cleans up the timer just in case the user clicks away early
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="loader">
        <img src="/images/treasure.jpg" alt="TREASURE Logo" />
        <h1>Find Your TREASURE</h1>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default SplashPage;