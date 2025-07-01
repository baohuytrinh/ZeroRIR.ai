import { Link } from "react-router-dom";
import '../css/NavBar.css'

function NavBar(){
    return <nav className="navbar">
        <div className='navbar-brand'>
            <Link to="/">Workout Tracker</Link>
        </div>
        <div className="navbar-links">
            <Link to='/' className='nav-link'>Home</Link>
            <Link to='/workouts' className='nav-link'>Workouts</Link>
            <Link to='/calender' className='nav-link'>Calender</Link>
        </div>
    </nav>
}

export default NavBar