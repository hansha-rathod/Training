import './App.css'
import { useState } from "react";
import SmartCounter from './components/SmartCounter'

function App() {

  const [isActive, setIsActive] = useState(false)

  return (
    <SmartCounter
      isActive={isActive}
      setIsActive={setIsActive} />
  )
}

export default App
