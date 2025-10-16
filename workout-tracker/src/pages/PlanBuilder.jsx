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
    <div className="plan-builder-container">
      <h1 className="page-title">
        Create a workout plan for each day of the week!
      </h1>
      
      <div className="workout-plan">
        <div className="left">
          <div className="plan">
            <div className="plan-name">
              <h3>Current Plan</h3>
              <h4 className="current-plan-name">{planName || "(No name yet)"}</h4>
              <input
                type="text"
                placeholder="Plan Name"
                value={planName}
                onChange={e => setPlanName(e.target.value)}
                maxLength={15}
              />
            </div>
            
            <ul className="added">
              {planExercises.map((ex, i) => (
                <li className="each-added" key={i}>
                  <span className="exercise-info">- {ex.name} ({ex.muscle})</span>
                  <button 
                    className="remove-exercise-btn"
                    onClick={() => setPlanExercises(planExercises.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="create-plan-btn"
            onClick={async () => {
              if (!planName || planExercises.length === 0) return alert("Name and at least one exercise required!");
              await createWorkoutPlan({
                name: planName,
                exercises: planExercises,
              });
              setPlanName("");
              setPlanExercises([]);
              alert("Plan created!");
            }}
          >
            Create Plan
          </button>
        </div>

        <div className="right">
          <h2 className="section-title">Add/Search for exercises!</h2>
          
          <form 
            onSubmit={e => {
              e.preventDefault();
              addToPlan({
                name: customName,
                muscle: customMuscle,
                custom: true
              });
              setCustomName(""); 
              setCustomMuscle("");
            }}
            className="add-to-plan"
          >
            <input 
              className="custom-exercise-name" 
              value={customName} 
              onChange={e => setCustomName(e.target.value)} 
              placeholder="Exercise Name" 
              required 
            />
            <input 
              className="custom-exercise-muscle" 
              value={customMuscle} 
              onChange={e => setCustomMuscle(e.target.value)} 
              placeholder="Muscle Group" 
              required 
            />
            <button className="add-custom-btn" type="submit">
              Add Custom Exercise
            </button>
          </form>

          <div className="search">
            <div className="search-controls">
              <input
                className="search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for exercises..."
              />
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
            
            {loading && <div className="loading-message">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            
            <ul className="search-results">
              {results.map((ex, idx) => (
                <li key={idx} className="search-result-item">
                  <span className="result-info">{ex.name} ({ex.muscle})</span>
                  <button 
                    className="add-to-plan-btn"
                    onClick={() => addToPlan(ex)}
                  >
                    Add to Plan
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bottom">
        <h3 className="saved-plans-title">Your Saved Workout Plans</h3>
        <div className="plans-grid">
          {plans.map((plan, idx) => (
            <div className="saved-plan" key={idx}>
              <h4 className="saved-plan-name">{plan.name}</h4>
              <ul className="saved-plan-exercises">
                {plan.exercises.map((ex, i) => (
                  <li key={i}>- {ex.name}</li>
                ))}
              </ul>
              <button 
                className="delete-plan-btn" 
                onClick={async () => {
                  await deletePlan(plan.name);
                  setPlans(plans.filter((_, i) => i !== idx));
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlanBuilder;