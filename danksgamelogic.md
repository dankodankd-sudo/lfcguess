```javascript
import { useState, useEffect, useMemo } from 'react'
import playersData from '../data/players.json'

const useGameLogic = () => {
  const [remainingPlayers, setRemainingPlayers] = useState(playersData)
  const [questionCount, setQuestionCount] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [gameState, setGameState] = useState('START') // START, PLAYING, WON, LOST
  const [guess, setGuess] = useState(null)

  // List of possible questions derived from player attributes
  // In a real app, these would be more natural language strings
  const questions = useMemo(() => [
    { id: 'isLFC', text: 'Does he play (or did he play) for Liverpool FC?' },
    { id: 'active', text: 'Is he currently an active player?' },
    { id: 'isLegend', text: 'Is he considered an LFC legend?' },
    { id: 'isEnglish', text: 'Is he English?' },
    { id: 'isDefender', text: 'Is he a defender?' },
    { id: 'isForward', text: 'Is he a forward?' },
    { id: 'isMidfielder', text: 'Is he a midfielder?' },
    { id: 'isGoalkeeper', text: 'Is he a goalkeeper?' },
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
    { id: 'isAcademyGraduate', text: 'Did he graduate from the club\'s youth academy?' },
    { id: 'isLeftFooted', text: 'Is he naturally left-footed?' },
    { id: 'leftFooted', text: 'Is he naturally left-footed?' }, // Supporting both naming conventions
    { id: 'isCaptain', text: 'Was he or is he a club captain?' },
    { id: 'isScouser', text: 'Is he a local lad (Scouser)?' }
  ], [])

  const [askedQuestions, setAskedQuestions] = useState([])

  const getNextQuestion = (currentPlayers, alreadyAsked) => {
    let bestQuestion = null
    let bestSplit = 1 // We want to be closest to 0.5

    questions.forEach(q => {
      if (alreadyAsked.includes(q.id)) return

      const yesCount = currentPlayers.filter(p => p[q.id]).length
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

    if (newPlayers.length === 1) {
      setGuess(newPlayers[0])
      setGameState('WON')
    } else if (newPlayers.length === 0 || questionCount >= 19) {
      setGameState('LOST')
    } else {
      const nextQ = getNextQuestion(newPlayers, newAsked)
      if (nextQ) {
        setCurrentQuestion(nextQ)
      } else {
        // No more specific questions, just guess the top one
        setGuess(newPlayers[0])
        setGameState('WON')
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
    handleAnswer
  }
}

export default useGameLogic
```
