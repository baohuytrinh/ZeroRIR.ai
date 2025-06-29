import {useState} from "react"
import ExerciseTab from "../components/exercise";
import '../css/home.css'
import { searchExercises } from "../services/api.js";



function Home(){
    const [searchQuery, setSearchQuery] = useState("");

    // const exercises = [
    //     { id: 1, title:"Flat Bench Press", weight:265 },
    //     { id: 2, title:"DB Hammer Curls", weight:50 },
    //     { id: 3, title:"Single Arm Tricep", weight:30 },
    //     { id: 4, title:"DB Lateral Raises", weight:45 },
    // ];
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)


    // useEffect(() => {
    //     const loadExercises = async () => {
    //         try {
    //             const Exercises = await searchExercises()
    //             setResults(Exercises)
    
    //         } catch (err) {
    //             console.log(err)
    //             setError("Failed to load exercises...")
    //         }
    //         finally {
    //             setLoading(false)
    //         }

    //     }
    //     loadExercises()
    // }, [])

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return //removes all trailing strings (front/end)
        if (loading) return

        setLoading(true)
        try{
            const searchResults =  await searchExercises(searchQuery)
            console.log(searchResults); 
            setResults(searchResults)
            setError(null)
        } catch (err) {
            console.log(err)
            setError("Failed to load exercises...")
        }finally{
            setLoading(false)
        }
        
    };

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


            <form onSubmit={handleSearch} className="enter-exercise">
                <input type="text" placeholder="Exercise" className="exercise-name" 
                
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  
                />
                <input type="text" placeholder="Muscle Group" className="exercise-muscle"/>
                <input type="number" placeholder="Sets" className="exercise-sets"/>
                <input type="number" placeholder="Reps" className="exercise-reps"/>
                <input type="number" placeholder="Weight" className="exercise-weight"/> lbs
                <button type="submit" className="add-btn">Add</button>
            </form>


            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <div className="exercise-grid">
                {results.map((exercise, idx) => (
                    <ExerciseTab exercise={exercise} key={exercise.id || idx} />
                ))}
            </div>


        </div>
    );
}

export default Home