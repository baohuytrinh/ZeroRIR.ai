const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.api-ninjas.com/v1/exercises"

export const searchExercises = async (muscle) => {
    const response = await fetch(
        `${BASE_URL}?muscle=${encodeURIComponent(muscle)}`,
        {
            headers: {
                "X-Api-Key": API_KEY
            }
        }
    );
    const data = await response.json();
    return data;
};