import './css/App.css'
import Footer from './components/footer'
import ExerciseTab from './components/exercise'
import Home from './pages/Home'
import Workouts from './pages/workouts'
import {Routes, Route} from "react-router-dom"
import NavBar from "./components/NavBar"

function App() {
  return (
    <div>
      <NavBar />
      <main className = 'main-content'> 
        <Routes>
          {/* pages */}
          <Route path="/" element={<Home />}/>
          <Route path="/workouts" element={<Workouts />}/>
        </Routes>
      </main>
    </div>
  )
}



export default App
