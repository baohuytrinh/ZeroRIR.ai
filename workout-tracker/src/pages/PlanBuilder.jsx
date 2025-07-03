import React from 'react'
import '../css/PlanBuilder.css'
import { useState, useEffect, useCallback } from 'react';
import { searchExercises, createWorkoutPlan } from "../services/api.js";
import ExerciseTab from "../components/exercise";

function PlanBuilder() {

  const [planName, setPlanName] = useState("");
  const [planExercises, setPlanExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // For custom exercise form
  const [customName, setCustomName] = useState("");
  const [customMuscle, setCustomMuscle] = useState("");
  const [customSets, setCustomSets] = useState("");
  const [customReps, setCustomReps] = useState("");
  const [customWeight, setCustomWeight] = useState("");

  

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

    <div>
      <h3>Current Plan: {planName || "(No name yet)"}</h3>
      <input
        type="text"
        placeholder="Plan Name"
        value={planName}
        onChange={e => setPlanName(e.target.value)}
      />
      <ul>
        {planExercises.map((ex, i) => (
          <li key={i}>
            {ex.name} ({ex.muscle}) Sets: {ex.sets} Reps: {ex.reps} Weight: {ex.weight}
            <button onClick={() => setPlanExercises(planExercises.filter((_, idx) => idx !== i))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
    {/* ^^^^ PLAN NAME */}


    <div>
      <input
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search for exercises..."
      />
      <button onClick={handleSearch}>Search</button>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <ul>
        {results.map((ex, idx) => (
          <li key={idx}>
            {ex.name} ({ex.muscle})
            <button onClick={() => addToPlan(ex)}>Add to Plan</button>
          </li>
        ))}
      </ul>
    </div>


    <form onSubmit={e => {
      e.preventDefault();
      addToPlan({
        name: customName,
        muscle: customMuscle,
        sets: Number(customSets),
        reps: Number(customReps),
        weight: Number(customWeight),
        custom: true // flag for custom exercises
      });
      setCustomName(""); 
      setCustomMuscle(""); 
      setCustomSets(""); 
      setCustomReps(""); 
      setCustomWeight("");
    }}>
      <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Exercise Name" required />
      <input value={customMuscle} onChange={e => setCustomMuscle(e.target.value)} placeholder="Muscle Group" required />
      <input value={customSets} onChange={e => setCustomSets(e.target.value)} placeholder="Sets" type="number" required />
      <input value={customReps} onChange={e => setCustomReps(e.target.value)} placeholder="Reps" type="number" required />
      <input value={customWeight} onChange={e => setCustomWeight(e.target.value)} placeholder="Weight" type="number" required />
      <button type="submit">Add Custom Exercise</button>
    </form>

    <button
      onClick={async () => {
        if (!planName || planExercises.length === 0) return alert("Name and at least one exercise required!");
        await createWorkoutPlan({
          demoUserID: "demo123",
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

    </>
  )
}

export default PlanBuilder