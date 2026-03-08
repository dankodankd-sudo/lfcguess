import { useState, useEffect, useMemo } from 'react'
import playersData from '../data/players.json'

const useGameLogic = () => {
  const [remainingPlayers, setRemainingPlayers] = useState(playersData)
  const [questionCount, setQuestionCount] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [gameState, setGameState] = useState('START') // START, PLAYING, GUESSING, WON, LOST
  const [guess, setGuess] = useState(null)
  const [askedQuestions, setAskedQuestions] = useState([])

  // List of possible questions derived from player attributes
  const questions = useMemo(() => [
    { id: 'isLFC', text: 'Does he play (or did he play) for Liverpool FC?' },
    { id: 'active', text: 'Is he currently an active player?' },
    { id: 'isLegend', text: 'Is he considered an LFC legend?' },
    { id: 'isEnglish', text: 'Is he English?' },
    { id: 'isDefender', text: 'Is he a defender?' },
    { id: 'isForward', text: 'Is he a forward?' },
    { id: 'isMidfielder', text: 'Is he a midfielder?' },
    { id: 'isGoalkeeper', text: 'Is he a goalkeeper?' },
    { id: 'isManager', text: 'Is he primarily known as a football manager?' },
    { id: 'wonMultipleEuropeanCups', text: 'Did he win multiple European Cups (Champions League) as a manager?' },
    { id: 'wonTreble', text: 'Did he win a treble (League, League Cup, European Cup) in a single season?' },
    { id: 'isTall', text: 'Is he known for being quite tall?' },
    { id: 'isAfrican', text: 'Is he from Africa?' },
    { id: 'isBrazilian', text: 'Is he Brazilian?' },
    { id: 'isDutch', text: 'Is he Dutch?' },
    { id: 'isSouthAmerican', text: 'Is he from South America?' },
    { id: 'isScottish', text: 'Is he Scottish?' },
    { id: 'isFrench', text: 'Is he French?' },
    { id: 'isPortuguese', text: 'Is he Portuguese?' },
    { id: 'isBelgian', text: 'Is he Belgian?' },
    { id: 'isNorwegian', text: 'Is he Norwegian?' },
    { id: 'isWelsh', text: 'Is he Welsh?' },
    { id: 'isEuropean', text: 'Is he from Europe?' },
    { id: 'isAsian', text: 'Is he from Asia?' },
    { id: 'isSpanish', text: 'Is he Spanish?' },
    { id: 'isAcademyGraduate', text: 'Did he graduate from the club\'s youth academy?' },
    { id: 'isLeftFooted', text: 'Is he naturally left-footed?' },
    { id: 'isCaptain', text: 'Was he or is he a club captain?' },
    { id: 'isScouser', text: 'Is he a local lad (Scouser)?' }
  ], [])

  const getNextQuestion = (currentPlayers, alreadyAsked) => {
    let bestQuestion = null
    let bestSplit = 1 // We want to be closest to 0 (representing a 0.5 split)

    questions.forEach(q => {
      if (alreadyAsked.includes(q.id)) return

      const yesCount = currentPlayers.filter(p => p[q.id]).length

      // OPTIMIZATION: Skip questions that don't eliminate anyone
      if (yesCount === 0 || yesCount === currentPlayers.length) return

      const split = yesCount / currentPlayers.length
      const diff = Math.abs(split - 0.5)

      if (diff < bestSplit) {
        bestSplit = diff
        bestQuestion = q
      }
    })

    return bestQuestion
  }

  const startGame = () => {
    setRemainingPlayers(playersData)
    setQuestionCount(0)
    setAskedQuestions([])
    setGameState('PLAYING')
    const firstQ = getNextQuestion(playersData, [])
    setCurrentQuestion(firstQ)
  }

  const handleAnswer = (answer) => {
    if (!currentQuestion) return

    let newPlayers = remainingPlayers
    if (answer !== 'NOT_SURE') {
      const boolAnswer = answer === 'YES'
      newPlayers = remainingPlayers.filter(p => !!p[currentQuestion.id] === boolAnswer)
    }

    const newAsked = [...askedQuestions, currentQuestion.id]

    setRemainingPlayers(newPlayers)
    setAskedQuestions(newAsked)
    setQuestionCount(prev => prev + 1)

    // Check if we should guess or keep playing
    if (newPlayers.length === 0) {
      setGameState('LOST') // The AI narrowed it down to nobody!
    } else {
      const nextQ = getNextQuestion(newPlayers, newAsked)

      // We go to GUESSING if we only have 1 player left, or if we hit the 20-question limit, or if there are no useful questions left
      if (newPlayers.length === 1 || questionCount >= 19 || !nextQ) {
        setGuess(newPlayers[0])
        setGameState('GUESSING')
      } else {
        setCurrentQuestion(nextQ)
      }
    }
  }

  const handleGuessResponse = (isCorrect) => {
    if (isCorrect) {
      setGameState('WON') // The AI successfully guessed it
    } else {
      // The AI was wrong. Remove the incorrect guess from the pool.
      const filteredPlayers = remainingPlayers.filter(p => p.id !== guess.id)
      setRemainingPlayers(filteredPlayers)

      if (filteredPlayers.length === 0 || questionCount >= 20) {
        setGameState('LOST') // AI is out of options or out of turns
      } else {
        // Try to ask another question, or just guess the next most likely player
        const nextQ = getNextQuestion(filteredPlayers, askedQuestions)
        if (nextQ) {
          setCurrentQuestion(nextQ)
          setGameState('PLAYING')
        } else {
          setGuess(filteredPlayers[0])
          setGameState('GUESSING')
        }
      }
    }
  }

  return {
    gameState,
    currentQuestion,
    questionCount,
    remainingPlayersCount: remainingPlayers.length,
    guess,
    startGame,
    handleAnswer,
    handleGuessResponse // Export the new function
  }
}

export default useGameLogic