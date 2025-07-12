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

    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const [exerciseName, setExerciseName] = useState("");
    const [exerciseMuscle, setExerciseMuscle] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");



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
                setResults([]); 
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );


    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);


    const handleAddExercise = async (e) => {
        e.preventDefault();
    
        
        const newExercise = {
            
            name: exerciseName,
            muscle: exerciseMuscle,
            sets: Number(sets),
            reps: Number(reps),
            weight: Number(weight),
        };
        try {
            
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newExercise),
            });
            if (!response.ok) throw new Error('Failed to add exercise');
            
            alert("Added!")
            setExerciseName("");
            setExerciseMuscle("");
            setSets("");
            setReps("");
            setWeight("");
            
        } catch (err) {
            console.log(err)
            setError("Failed to add exercise");
        }
    };

    
    return (
        <div className="home">

            <form className="enter-exercise" onSubmit={handleAddExercise}>
                <input type="text" placeholder="Exercise" className="exercise-name" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} required/>
                <input type="text" placeholder="Muscle Group" className="exercise-muscle" value={exerciseMuscle} onChange={(e) => setExerciseMuscle(e.target.value)} required/>
                <input type="number" placeholder="Sets" className="exercise-sets" value={sets} onChange={(e) => setSets(e.target.value)} required/>
                <input type="number" placeholder="Reps" className="exercise-reps" value={reps} onChange={(e) => setReps(e.target.value)} required/>
                <input type="number" placeholder="Weight" className="exercise-weight" value={weight} onChange={(e) => setWeight(e.target.value)} required/> lbs
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