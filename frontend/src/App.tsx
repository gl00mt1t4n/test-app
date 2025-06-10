import React, { useState } from 'react'
import './App.css'

function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult]         = useState<number | null>(null)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  async function evaluate(e: React.FormEvent) {
    e.preventDefault() // doesn't reload page 
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3000/evaluate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ expression }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error")
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
    <div id="app-container">
      <h1>Calculator test-app</h1>

      <form onSubmit={evaluate}>
        <input
          type="text"
          value={expression}
          onChange={e => setExpression(e.target.value)}
          placeholder="e.g. (1+2)/3*4"
          disabled={loading}
          style={{ marginBottom: '0.75rem', width: '100%', padding: '0.5rem', fontSize: '1rem' }}

        />
        <button type="submit" disabled={loading}>
          {loading ? "Calculating…" : "Calculate"}
        </button>
      </form>

      <hr />

      {result != null && <div className="result">Result: {result}</div>}
      {error       && <div className="error">Error: {error}</div>}
    </div>
  )
}

export default App
