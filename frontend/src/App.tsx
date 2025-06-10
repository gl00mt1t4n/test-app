import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function evaluate(e: React.FormEvent) {
    e.preventDefault() // doesn't reload page 
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const result = await fetch('http://localhost:3000/evaluate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({expression}),
      })

      const data = await result.json()
      if (!result.ok) throw new Error(data.message || "Error")
      setResult(data.result)
    }
    catch (err: any) {
      setError(err.message)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
    <h1> Calculator test-app </h1>

    <form onSubmit={evaluate}>
      <input
        type="text"
        value={expression}
        onChange={e => setExpression(e.target.value)}
        placeholder="e.g. (1+2)/3*4"
        disabled={loading}
      />
      
      <button type="submit" disabled={loading}>
        {loading? "Calculating" : "Calculate"}
      </button>
    </form>

    {result != null && <div>Result: {result}</div>}
    {error && <div style={{color: 'red'}}>Error: {error}</div>}
    </>
  )
}

export default App
