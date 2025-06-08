import React, { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: App,
})

type Category = { id: number; name: string }
type Question = {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  type: string
  category: string
}

type LeaderboardEntry = {
  name: string
  score: number
  category: string
}

function shuffle<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function App() {
  // Form state
  const [name, setName] = useState("Anonymous")
  const [amount, setAmount] = useState(10)
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState("any")
  const [difficulty, setDifficulty] = useState("any")
  const [type, setType] = useState("any")
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  // Fetch categories on mount
  useEffect(() => {
    setLoadingCategories(true)
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.trivia_categories || [])
        setLoadingCategories(false)
      })
  }, [])

  // Load leaderboard from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("trivia_leaderboard")
    if (stored) {
      setLeaderboard(JSON.parse(stored))
    }
  }, [])

  // Save leaderboard to localStorage
  useEffect(() => {
    localStorage.setItem("trivia_leaderboard", JSON.stringify(leaderboard))
  }, [leaderboard])

  // Handle quiz setup form submit
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Build API URL
    let url = `https://opentdb.com/api.php?amount=${amount}`
    if (category !== "any") url += `&category=${category}`
    if (difficulty !== "any") url += `&difficulty=${difficulty}`
    if (type !== "any") url += `&type=${type}`
    const res = await fetch(url)
    const data = await res.json()
    setQuestions(
      data.results.map((q: any) => ({
        ...q,
        all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
      }))
    )
    setUserAnswers(Array(data.results.length).fill(""))
    setQuizStarted(true)
    setQuizSubmitted(false)
    setScore(0)
  }

  // Handle answer change
  const handleAnswerChange = (idx: number, value: string) => {
    setUserAnswers((prev) => {
      const copy = [...prev]
      copy[idx] = value
      return copy
    })
  }

  // Handle quiz submit
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let sc = 0
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.correct_answer) sc++
    })
    setScore(sc)
    setQuizSubmitted(true)

    // Save to leaderboard
    const catName =
      category === "any"
        ? "Any Category"
        : categories.find((c) => String(c.id) === category)?.name || "Unknown"
    const entry: LeaderboardEntry = {
      name,
      score: sc,
      category: catName,
    }
    setLeaderboard((prev) => {
      const updated = [...prev, entry]
      // Only keep top 5 per category
      const grouped: { [cat: string]: LeaderboardEntry[] } = {}
      updated.forEach((e) => {
        if (!grouped[e.category]) grouped[e.category] = []
        grouped[e.category].push(e)
      })
      const flat: LeaderboardEntry[] = []
      Object.values(grouped).forEach((arr) => {
        arr
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .forEach((e) => flat.push(e))
      })
      return flat
    })
  }

  // Reset quiz
  const handleRestart = () => {
    setQuizStarted(false)
    setQuestions([])
    setUserAnswers([])
    setQuizSubmitted(false)
    setScore(0)
  }

  // Group leaderboard by category
  const leaderboardByCategory: { [cat: string]: LeaderboardEntry[] } = {}
  leaderboard.forEach((entry) => {
    if (!leaderboardByCategory[entry.category])
      leaderboardByCategory[entry.category] = []
    leaderboardByCategory[entry.category].push(entry)
  })

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <header className="flex flex-col items-center mb-8">
        <img src="../public/A+.png" alt="Logo" className="w-24 h-24 mb-4" />
        <h1 className="text-3xl font-bold mt-4 mb-2">Connell's Amazing Trivia App</h1>
        <h2 className="text-lg text-gray-700">Please give me a good mark</h2>
      </header>

      {!quizStarted && (
        <form
          onSubmit={handleSetupSubmit}
          className="bg-white p-6 rounded shadow max-w-md w-full space-y-4"
        >
          <div>
            <label className="block font-semibold mb-1">Name of the user</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Amount</label>
            <input
              type="number"
              min={1}
              max={50}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="any">Any Category</option>
              {loadingCategories ? (
                <option>Loading...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="any">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="any">Any Type</option>
              <option value="multiple">Multiple Choice</option>
              <option value="boolean">True/False</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start Quiz
          </button>
        </form>
      )}

      {quizStarted && !quizSubmitted && (
        <form
          onSubmit={handleQuizSubmit}
          className="bg-white p-6 rounded shadow max-w-2xl w-full space-y-6"
        >
          <h2 className="text-xl font-bold mb-4">Quiz</h2>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-4">
              <div className="font-semibold mb-2">
                {idx + 1}.{" "}
                <span
                  dangerouslySetInnerHTML={{ __html: q.question }}
                />
              </div>
              <div className="space-y-2">
                {q.type === "boolean"
                  ? ["True", "False"].map((ans) => (
                      <label key={ans} className="block">
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={ans}
                          checked={userAnswers[idx] === ans}
                          onChange={() => handleAnswerChange(idx, ans)}
                          required
                        />{" "}
                        {ans}
                      </label>
                    ))
                  : shuffle([
                      q.correct_answer,
                      ...q.incorrect_answers,
                    ]).map((ans) => (
                      <label key={ans} className="block">
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={ans}
                          checked={userAnswers[idx] === ans}
                          onChange={() => handleAnswerChange(idx, ans)}
                          required
                        />{" "}
                        <span dangerouslySetInnerHTML={{ __html: ans }} />
                      </label>
                    ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Answers
          </button>
        </form>
      )}

      {quizSubmitted && (
        <div className="bg-white p-6 rounded shadow max-w-2xl w-full space-y-6 mt-6">
          <h2 className="text-xl font-bold mb-2">Results</h2>
          <div className="mb-2">
            <b>Name:</b> {name}
          </div>
          <div className="mb-2">
            <b>Score:</b> {score} / {questions.length}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Correct Answers:</h3>
            <ul className="list-disc pl-6">
              {questions.map((q, idx) => (
                <li key={idx}>
                  <span
                    dangerouslySetInnerHTML={{ __html: q.question }}
                  />{" "}
                  <b>
                    <span dangerouslySetInnerHTML={{ __html: q.correct_answer }} />
                  </b>
                  {userAnswers[idx] === q.correct_answer ? (
                    <span className="text-green-600 ml-2">✓</span>
                  ) : (
                    <span className="text-red-600 ml-2">
                      (Your answer:{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: userAnswers[idx] || "No answer",
                        }}
                      />
                      )
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleRestart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Restart
          </button>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white p-6 rounded shadow max-w-2xl w-full space-y-6 mt-10">
        <h2 className="text-xl font-bold mb-4">Leaderboard (Top 5 per Category)</h2>
        {Object.keys(leaderboardByCategory).length === 0 && (
          <div>No scores yet.</div>
        )}
        {Object.entries(leaderboardByCategory).map(([cat, entries]) => (
          <div key={cat} className="mb-6">
            <h3 className="font-semibold mb-2">{cat}</h3>
            <ol className="list-decimal pl-6">
              {entries
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((entry, idx) => (
                  <li key={idx}>
                    {entry.name} - {entry.score}
                  </li>
                ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}
