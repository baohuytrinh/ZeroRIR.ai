import {useState, useEffect, useCallback } from "react"
import ExerciseTab from "../components/exercise";
import '../css/home.css'
import { searchExercises } from "../services/api.js";

function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

function Home(){
    
    // const exercises = [
    //     { id: 1, title:"Flat Bench Press", weight:265 },
    //     { id: 2, title:"DB Hammer Curls", weight:50 },
    //     { id: 3, title:"Single Arm Tricep", weight:30 },
    //     { id: 4, title:"DB Lateral Raises", weight:45 },
    // ];

    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    // uncomment

    // const handleSearch = async (e) => {
    //     e.preventDefault()
    //     if (!searchQuery.trim()) return //removes all trailing strings (front/end)
    //     if (loading) return

    //     setLoading(true)
    //     try{
    //         const searchResults =  await searchExercises(searchQuery)
    //         console.log(searchResults); 
    //         setResults(searchResults)
    //         setError(null)
    //     } catch (err) {
    //         console.log(err)
    //         setError("Failed to load exercises...")
    //     }finally{
    //         setLoading(false)
    //     }
    // };


    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setResults([]);
                setError(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const searchResults = await searchExercises(query);
                console.log("API response:", searchResults);
                setResults(Array.isArray(searchResults) ? searchResults : []);
                setError(null);
            } catch (err) {
                setError("Failed to load exercises...");
                setResults([]); // Always set to array on error
            } finally {
                setLoading(false);
            }
        }, 300), // 300ms debounce
        []
    );

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);


    return (
        <div className="home">

            <form className="enter-exercise">
                <input type="text" placeholder="Exercise" className="exercise-name" />
                <input type="text" placeholder="Muscle Group" className="exercise-muscle"/>
                <input type="number" placeholder="Sets" className="exercise-sets"/>
                <input type="number" placeholder="Reps" className="exercise-reps"/>
                <input type="number" placeholder="Weight" className="exercise-weight"/> lbs
                <button type="submit" className="add-btn">+</button>
            </form>
            <div className="search">
                <div className="searchbar">   
                    <input 
                        type="text"
                        placeholder="Search for exercises..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                
                    {loading && <div>Loading...</div>}
                    {error && <div>{error}</div>}

                    <div className="exercise-grid">
                        {results.map((exercise, idx) => (
                            <ExerciseTab exercise={exercise} key={exercise.id || idx} />
                        ))}
                    </div>
                </div> 


                <div className="textbox">
                    <p>e.g. Dumbbell Bicep Curl</p>
                </div>
            </div>
        </div>
    );
}

export default Home