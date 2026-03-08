import './App.css'
import useGameLogic from './hooks/useGameLogic'

function App() {
  const {
    gameState,
    currentQuestion,
    questionCount,
    remainingPlayersCount,
    guess,
    startGame,
    handleAnswer,
    handleGuessResponse
  } = useGameLogic()

  return (
    <div className="app-container">
      <header>
        <div className="logo">🔴</div>
        <h1>LFC Guess</h1>
        <p className="subtitle">The Premier League 20 Questions Game</p>
      </header>

      <main>
        {gameState === 'START' && (
          <div className="card start-card animate-in">
            <h2>Think of a Player...</h2>
            <p>I will try to guess which Premier League or Liverpool FC player you are thinking of in 20 questions or less.</p>
            <div className="instructions">
              <p>1. Think of a current or legendary player.</p>
              <p>2. Answer my questions honestly.</p>
              <p>3. See if I can read your mind!</p>
            </div>
            <button className="primary-btn pulse" onClick={startGame}>
              I&apos;m Ready!
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="card game-card animate-in">
            <div className="game-stats">
              <span className="q-count">Question {questionCount + 1}</span>
              <span className="p-count">{remainingPlayersCount} possibilities</span>
            </div>
            
            <div className="question-area">
              <p className="question-text">{currentQuestion?.text}</p>
            </div>

            <div className="button-group-wrap">
              <div className="button-group-main">
                <button className="answer-btn yes" onClick={() => handleAnswer('YES')}>YES</button>
                <button className="answer-btn no" onClick={() => handleAnswer('NO')}>NO</button>
              </div>
              <button className="answer-btn maybe" onClick={() => handleAnswer('NOT_SURE')}>I&apos;M NOT SURE</button>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(questionCount / 20) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {gameState === 'GUESSING' && (
          <div className="card result-card animate-in">
            <h2 className="victory-title">I think I know who it is!</h2>
            <div className="guess-display">
              <div className="player-avatar">⚽</div>
              <h3>Are you thinking of... {guess?.name}?</h3>
              <p>{guess?.team} • {guess?.position}</p>
            </div>
            <div className="button-group-wrap">
              <button className="answer-btn yes" onClick={() => handleGuessResponse(true)}>YES, YOU GOT IT!</button>
              <button className="answer-btn no" onClick={() => handleGuessResponse(false)}>NO, THAT'S WRONG!</button>
            </div>
          </div>
        )}

        {gameState === 'WON' && (
          <div className="card result-card animate-in">
            <h2 className="victory-title">AHA! I GOT IT!</h2>
            <div className="guess-display">
              <div className="player-avatar">⚽</div>
              <h3>{guess?.name}</h3>
              <p>{guess?.team} | {guess?.position}</p>
            </div>
            <p className="result-text">I guessed it in {questionCount} questions!</p>
            <button className="primary-btn" onClick={startGame}>
              Play Again
            </button>
          </div>
        )}

        {gameState === 'LOST' && (
          <div className="card result-card animate-in">
            <h2>You Beat Me!</h2>
            <p className="result-text">I couldn&apos;t figure out who you were thinking of. My scouting network needs an update!</p>
            <button className="primary-btn" onClick={startGame}>
              Try Again
            </button>
          </div>
        )}
      </main>

      <footer>
        <p>Built for the Kopites around the world</p>
      </footer>
    </div>
  )
}

export default App
