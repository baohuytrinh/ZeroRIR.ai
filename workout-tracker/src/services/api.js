const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.api-ninjas.com/v1/exercises"

export const searchExercises = async (muscle) => {
    const response = await fetch(
        `${BASE_URL}?name=${encodeURIComponent(muscle)}`,
        {
            headers: {
                "X-Api-Key": API_KEY
            }
        }
    );
    const data = await response.json();
    return data;
};


// backend

export const addWorkout = async (workout) => {
    const response = await fetch('http://localhost:8000/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders},
        body: JSON.stringify(workout)
    });
    return response.json();
};

export const createWorkoutPlan = async (plan) => {
    const response = await fetch('http://localhost:8000/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders},
      body: JSON.stringify(plan)
    });
    return response.json();
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  

