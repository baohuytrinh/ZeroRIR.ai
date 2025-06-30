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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout)
    });
    return response.json();
};