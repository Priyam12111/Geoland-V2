import { useState } from 'react'
import './App.css'
import MapComponent from './components/MapComponent'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MapComponent />
    </>
  )
}

export default App
