import { Link } from "react-router-dom";
import '../css/NavBar.css'

function NavBar(){
    return <nav className="navbar">
        <div className='navbar-brand'>
            <Link to="/">ZeroRIR.ai</Link>
        </div>
        <div className="navbar-links">
            <Link to='/' className='nav-link'>Home</Link>
            <Link to='/workouts' className='nav-link'>Workouts</Link>
            <Link to='/PlanBuilder' className='nav-link'>Plans</Link>
            <Link to='/calendar' className='nav-link'>Calendar</Link>
        </div>
    </nav>
}

export default NavBar