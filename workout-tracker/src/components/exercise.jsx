import '../css/exercise.css'

function ExerciseTab({exercise}) {
    function addBtn(){
        alert("clicked")
    }

    return <div className="exercise">
        <div className="exercise-info">
            <p>{exercise.title}</p>
            <button className="add-btn" onClick={addBtn}>Add</button>
        </div>
    </div>
    
}

/* VOID THIS ATM */

export default ExerciseTab