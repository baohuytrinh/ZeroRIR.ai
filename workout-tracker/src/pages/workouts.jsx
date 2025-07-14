import { useEffect, useState } from "react"
import {deleteWorkout} from "../services/api.js"

function Workouts(){

    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8000/api/workouts', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('Unauthorized or error fetching workouts');
            return res.json();
        })
        .then(data => setWorkouts(data))
        .catch(err => {
            setWorkouts([]);
            console.error("failed to fetch workouts:", err);
        });
    }, []);


    return (
        
        <div className="workouts">
            {workouts.length === 0 ?  (
                <div className="workouts-empty">
                    <h2>No workouts yet</h2>
                    <p>start adding workouts, and they'll appear here</p>
                </div>
            ) : (
                <div className="workouts-chart">
                    <h2>Your Workout(s)</h2>
                    <p>
                    {workouts.map((w, idx) => (
                        <>
                        <div style={{marginBottom: '1.5rem'}}>
                            <div className="workout-fetched">
                                <p key={idx} className="workout-name">
                                    {w.name} ({w.muscle})  
                                </p>
                                <p key={idx} className="workout-num">
                                ({w.sets}x{w.reps}) -{'>'} {w.weight} lbs
                                </p>
                                
                            </div>
                            <button 
                            className="rmv-workouts-btn" 
                            onClick={async () => {
                                await deleteWorkout(w);
                                setWorkouts(workouts.filter((_,i) => i !== idx));}}
                            >Delete</button>
                        </div>
                        </>
                    ))}
                    </p>
                </div>
            )}
        </div>
    );
}


export default Workouts