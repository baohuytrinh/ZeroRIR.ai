import { useEffect, useState } from "react"


function Workouts(){

    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/workouts')
        .then(res =>res.json())
        .then(data => setWorkouts(data))
        .catch(err => console.error("failed to fetch workouts:", err));
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
                        <div className="workout-fetched">
                            <p key={idx} className="workout-name">
                                {w.name} ({w.muscle})  
                            </p>
                            <p key={idx} className="workout-num">
                             ({w.sets}x{w.reps}) -{'>'} {w.weight} lbs
                            </p>
                        </div>
                    ))}
                    </p>
                </div>
            )}
        </div>
    );
}


export default Workouts