import { useState } from 'react'
import './App.css'
import UserCard from './components/UserCard'

function App() {

  return (
    <>
      <UserCard name="John Doe" role="Developer" isAvailable={true} />
      <UserCard name="Jane Smith" role="Designer" isAvailable={false} />
      <UserCard name="Alice Johnson" role="Manager" isAvailable={true} />
    </>
  )
}

export default App
