import React from 'react'
import '../css/PlanBuilder.css'
import { useState, useEffect, useCallback } from 'react';
import { searchExercises, createWorkoutPlan, deletePlan } from "../services/api.js";
import ExerciseTab from "../components/exercise";

function PlanBuilder() {

  const [planName, setPlanName] = useState("");
  const [planExercises, setPlanExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [customName, setCustomName] = useState("");
  const [customMuscle, setCustomMuscle] = useState("");
  const [customSets, setCustomSets] = useState("");
  const [customReps, setCustomReps] = useState("");
  const [customWeight, setCustomWeight] = useState("");

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/plans', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setPlans);
  }, []);
  
  // const refreshPlans = () => {
  //   fetch('http://localhost:8000/api/plans', {
  //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  //   })
  //     .then(res => res.json())
  //     .then(setPlans);
  // };

  // const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchExercises(searchQuery);
      setResults(Array.isArray(results) ? results : []);
    } catch (err) {
      console.log("FAIL", err)
      setError("Failed to fetch exercises");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const addToPlan = (exercise) => {
    setPlanExercises([...planExercises, exercise]);
  };

  return (
    <>
    <h1 style={{marginTop: '-5rem', display:'flex', justifyContent:'center'}}>
        Create a workout plan for each day of the week!
    </h1>
    <div className='workout-plan'>
      

      <div className='left'>
        <div className='plan'>
          <div className='plan-name'>
            <h3>Current Plan</h3>
              <h4 style={{fontSize:'20px'}}>{planName || "(No name yet)"}</h4>
            <input
              type="text"
              placeholder="Plan Name"
              value={planName}
              onChange={e => setPlanName(e.target.value)}
              maxLength={15}
            />
          </div>
          <ul className='added'>
            {planExercises.map((ex, i) => (
              <p className='each-added' key={i}>
                - {ex.name} ({ex.muscle})
                <button onClick={() => setPlanExercises(planExercises.filter((_, idx) => idx !== i))}>
                  Remove
                </button>
              </p>
            ))}
          </ul>
        </div>
        {/* ^^^^ PLAN NAME */}

        <button
          className='create-plan-btn'
          onClick={async () => {
            if (!planName || planExercises.length === 0) return alert("Name and at least one exercise required!");
            await createWorkoutPlan({
              
              name: planName,
              exercises: planExercises,
            });
            setPlanName("");
            setPlanExercises([]);
            alert("Plan created!");
            console.log("CREATED")
          }}
        >
          Create Plan
        </button>
      </div>


      <div className="right">
        <h1>Add/Search for exercises!</h1>
        <form onSubmit={e => {
          e.preventDefault();
          addToPlan({
            name: customName,
            muscle: customMuscle,
            // sets: Number(customSets),
            // reps: Number(customReps),
            // weight: Number(customWeight),
            custom: true // flag for custom exercises
          });
          setCustomName(""); 
          setCustomMuscle(""); 
          // setCustomSets(""); 
          // setCustomReps(""); 
          // setCustomWeight("");
        }}
        className='add-to-plan'
        >
          <input className='x-name' value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Exercise Name" required />
          <input className='x-muscle' value={customMuscle} onChange={e => setCustomMuscle(e.target.value)} placeholder="Muscle Group" required />
          {/* <input value={customSets} onChange={e => setCustomSets(e.target.value)} placeholder="Sets" type="number" required />
          <input value={customReps} onChange={e => setCustomReps(e.target.value)} placeholder="Reps" type="number" required />
          <input value={customWeight} onChange={e => setCustomWeight(e.target.value)} placeholder="Weight" type="number" required /> */}
          <button className='x-submit' type="submit">Add Custom Exercise</button>
        </form>


        <div className='search'>
          <input
            className='searchbar'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for exercises..."
          />
          <button className='search-btn' onClick={handleSearch}>Search</button>
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          <ul>
            {results.map((ex, idx) => (
              <p key={idx} className='searched-results'>
                {ex.name} ({ex.muscle})
                <button onClick={() => addToPlan(ex)}>Add to Plan</button>
              </p>
            ))}
          </ul>
        </div>
      </div>
    </div>


    <div className='bottom'>
      <h3 >Your Saved Workout Plans</h3>
      <div className='plans'>
        {plans.map((plan, idx) => (
            <div 
              className="saved-plan"
              // key={idx}
              // draggable
              // onDragStart={() => handleDragStart(plan)}
              
            >
                <b className='plan-name' style={{paddingTop: '.5rem'}}>{plan.name}</b>

                <p className='plan-exercises'>
                  {plan.exercises.map((ex, i) => (
                    <p className= '' key={i} > - {ex.name}</p>
                  ))}
                </p>

                <button className="rmv-plan-btn" onClick={async () => {
                  await deletePlan(plan.name);
                  setPlans(plans.filter((_, i) => i !== idx));
                  }}
                >Delete</button>

            </div>
          ))}
        </div>
    </div>
    </>
  )
}

export default PlanBuilder