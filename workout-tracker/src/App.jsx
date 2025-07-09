import './css/App.css'
import Footer from './components/footer'
import ExerciseTab from './components/exercise'
import Home from './pages/Home'
import Workouts from './pages/workouts'
import {Routes, Route} from "react-router-dom"
import NavBar from "./components/NavBar"
import CalendarPage from './pages/calendar'
import PlanBuilder from './pages/PlanBuilder'
import Auth from './pages/auth'
import { useState, useEffect } from 'react'
import TestCalendar from './pages/testCalendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const handleAuth = (token, username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  }



  return (
    <div>
      {isLoggedIn ? (
        <>
          <NavBar />
          <button className='logout-btn' onClick={handleLogout} style={{ position: 'absolute', top:10}}>Logout</button>
          <main className = 'main-content'> 
          <Routes>
              {/* pages */}
              <Route path="/" element={<Home />}/>
              <Route path="/workouts" element={<Workouts />}/>
              <Route path="/PlanBuilder" element={<PlanBuilder />}/>
              <Route path="/calendar" element={<CalendarPage />}/>
              <Route path="/testCalendar" element={<TestCalendar/>}/>
            </Routes>
          </main>
        </>
      ) : (
        <Auth onAuth={handleAuth} />
        )}
  
    </div>
  );
}



export default App
