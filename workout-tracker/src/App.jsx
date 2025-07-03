import './css/App.css'
import Footer from './components/footer'
import ExerciseTab from './components/exercise'
import Home from './pages/Home'
import Workouts from './pages/workouts'
import {Routes, Route} from "react-router-dom"
import NavBar from "./components/NavBar"
import Calender from './pages/calender'
import PlanBuilder from './pages/PlanBuilder'

function App() {
  return (
    <div>
      <NavBar />
      <main className = 'main-content'> 
        <Routes>
          {/* pages */}
          <Route path="/" element={<Home />}/>
          <Route path="/workouts" element={<Workouts />}/>
          <Route path="/PlanBuilder" element={<PlanBuilder />}/>
          <Route path="/calender" element={<Calender />}/>
        </Routes>
      </main>
    </div>
  )
}



export default App
