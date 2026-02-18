import { useEffect, useState } from "react"
import './SmartCounter.css'

function SmartCounter({ isActive, setIsActive }) {

  const [count, setCount] = useState(0)

  useEffect(() => {

    const counter = setInterval(() => {
      if (isActive) {
        setCount(prevCount => prevCount + 1)
      }
    }, 1000);

    return () => {
      clearInterval(counter);
    }
  }, [isActive])

  return (
    <div className="counter-container">
      <h1 className="counter-title">Smart Counter</h1>
      <p className="counter-subtitle">Automatic Timer</p>

      <div className={`status-indicator ${isActive ? 'running' : 'paused'}`}>
        <span className="status-dot"></span>
        {isActive ? 'Running' : 'Paused'}
      </div>

      <div className="counter-display">
        <p className="count-label">Count</p>
        <p className="count-value">{count}</p>
      </div>

      <div className="counter-buttons">
        <button
          className={`counter-btn start-btn ${isActive ? 'active' : ''}`}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? "Pause" : "Start"}
        </button>

        <button className="counter-btn reset-btn" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default SmartCounter
