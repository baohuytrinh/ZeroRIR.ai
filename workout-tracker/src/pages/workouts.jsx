import { useState } from "react"

function Workouts(){

    const [workouts, setWorkouts] = useState("");



    return (
        
        <div>
            {workouts.length === 0 ?  (
                <div className="workouts-empty">
                    <h2>No workouts yet</h2>
                    <p>start adding workouts, and they'll appear here</p>
                </div>
            ) : (
                <div className="workouts-chart">
                    <h2>Your Workout(s)</h2>
                    <p>start adding workouts, and they'll appear here</p>
                </div>
            )}
        </div>
    );
}


export default Workouts