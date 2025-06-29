import {useState} from "react"
import ExerciseTab from "../components/exercise";
import '../css/home.css'



function Home(){
    const [searchQuery, setSearchQuery] = useState("");

    // const exercises = [
    //     { id: 1, title:"Flat Bench Press", weight:265 },
    //     { id: 2, title:"DB Hammer Curls", weight:50 },
    //     { id: 3, title:"Single Arm Tricep", weight:30 },
    //     { id: 4, title:"DB Lateral Raises", weight:45 },
    // ];

    const [results, setResults] = useState([])

    const handleSearch = (e) => {
        e.preventDefault()
        // alert(searchQuery)
        
    }

    return (
        <div className="home">
            {/* <form onSubmit={handleSearch} className="searchForm">
                <input 
                  type="text"
                  placeholder="Search for exercises..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="search-button">Search</button>
            </form> */}
            <div className="exercise-grid">
                {/* {exercises.map((exercise) => (
                    <ExerciseTab exercise={exercise} key={exercise.id} />
                ))} */}
            </div>
            <form onSubmit={handleSearch} className="enter-exercise">
                <input type="text" placeholder="Exercise" className="exercise-name"/>
                <input type="text" placeholder="Muscle Group" className="exercise-muscle"/>
                <input type="number" placeholder="Sets" className="exercise-sets"/>
                <input type="number" placeholder="Reps" className="exercise-reps"/>
                <input type="number" placeholder="Weight" className="exercise-weight"/> lbs
                <button type="submit" className="add-btn">Add</button>
            </form>
        </div>
    );
}

export default Home