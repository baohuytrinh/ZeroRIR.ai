import '../css/exercise.css'

//backend

import { addWorkout } from '../services/api.js';

function handleAdd(exercise) {
    const sets = Number(prompt('Sets?'));
    const reps = Number(prompt('Reps?'));
    const weight = Number(prompt('Weight?'));
    addWorkout({ ...exercise, sets, reps, weight });

}

function ExerciseTab({exercise}) {
    // function addBtn(){
    //     alert("clicked")
    // }

    return <div className="exercise">
        <div className="exercise-info">
            <p>{exercise.name}</p>
            <button className="add-btn" onClick={() => handleAdd(exercise)}>+</button>
                                                    {/* added arrow to handleadd */}
        </div>
    </div>
    
}

/* VOID THIS ATM */

export default ExerciseTab