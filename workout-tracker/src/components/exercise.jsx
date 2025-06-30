import '../css/exercise.css'

//backend

import { addWorkout } from '../services/api.js';

function handleAdd(exercise) {
    const sets = prompt('Sets?');
    const reps = prompt('Reps?');
    const weight = prompt('Weight?');
    addWorkout({ ...exercise, sets, reps, weight });
    

}

function ExerciseTab({exercise}) {
    // function addBtn(){
    //     alert("clicked")
    // }

    return <div className="exercise">
        <div className="exercise-info">
            <p>{exercise.name}</p>
            <button className="add-btn" onClick={() => handleAdd(exercise)}>Add</button>
                                                    {/* added arrow to handleadd */}
        </div>
    </div>
    
}

/* VOID THIS ATM */

export default ExerciseTab