import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

const lettersArray = "abcdefghijklmnopqrstuvwxyz".split("");

function AboutPage() {
  const [score, setScore] = useState(0);
  const [targetLetter, setTargetLetter] = useState("");
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const newLetter = () => {
    const randomLetter = lettersArray[Math.floor(Math.random() * lettersArray.length)];
    setTargetLetter(randomLetter.toUpperCase());
  };

  useEffect(() => {
    newLetter();
  }, []);

  const handleGuess = (letter) => {
    if (gameOver) return;

    if (letter.toUpperCase() === targetLetter) {
      setScore(score + 1);
      setMessage("Correct! 🎉");
      newLetter();
    } else {
      setMessage(`❌ Game Over! Final Score: ${score}`);
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setScore(0);
    setMessage("");
    setGameOver(false);
    newLetter();
  };

  return (
    <>
      
      <header>
        <h1 className="site-title">Find Your TREASURE</h1>
        <Nav />
      </header>
      <main>
        <div className="about-container">
          <section className="profile-header">
            <h2>About TREASURE</h2>
            <figure className="profile-icon">
              <img src="/images/treasure.jpg" alt="TREASURE, a South Korean boy group under YG Entertainment" />
              <figcaption>TREASURE – South Korean Boy Group</figcaption>
            </figure>
          </section>
          <br />
          <section>
            <p><b>TREASURE</b> is a South Korean boy group formed by YG Entertainment through the survival program <strong>YG Treasure Box</strong>. The group officially debuted on August 7, 2020 and is known for their powerful performances, strong vocals, and diverse musical styles.</p>
          </section>
          <br />
          <section>
            <h3>Music & Achievements</h3>
            <p>The group has released multiple successful albums and singles, gaining recognition both locally and internationally. TREASURE is admired for their energetic stage presence and meaningful music that connects with fans.</p>
          </section>
          <br />
          <section>
            <h3>Global Influence</h3>
            <p>TREASURE continues to grow as a global K-pop group, participating in world tours, fan meetings, and international events. Their dedication and passion have made them one of the rising stars under YG Entertainment.</p>
          </section>
        </div>

        <section className="quotes-section">
          <div className="quote-card">
            <h3>Inspirational Quote</h3>
            <p>"If you feel like you have to do something really hard, it will only make you feel pressured, so do something like you usually do in a normal way you do." - Park Jihoon</p>
          </div>
          <div className="quote-card">
            <h3>Funny Quote</h3>
            <p>"Sometimes giving up is important too." - Kim Junkyu</p>
          </div>
        </section>
        <br />
        <section className="mini-game">
          <h2>Mini Game: Match The Letter 🎮</h2>
          <p>Click the lowercase letter that matches the uppercase letter shown!</p>

          <div className="game-box">
            <div className="target-letter">{targetLetter}</div>
            <p>Score: <span>{score}</span></p>

            <div className="letter-buttons">
              {lettersArray.map(letter => (
                <button 
                  key={letter} 
                  onClick={() => handleGuess(letter)}
                  disabled={gameOver}
                >
                  {letter}
                </button>
              ))}
            </div>
            <p>{message}</p>
            {gameOver && (
              <button onClick={restartGame} style={{ display: 'inline-block', marginTop: '10px' }}>
                Play Again 🔁
              </button>
            )}
          </div>
        </section>
      </main>
      <footer>
        <p>Bella Donna A. Viloria | Web Programming 1</p>
      </footer>
    </>
  );
}


export default AboutPage;