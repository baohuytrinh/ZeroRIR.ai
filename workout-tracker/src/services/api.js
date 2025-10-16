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

//backend

//workout
export const addWorkout = async (workout) => {
    const response = await fetch('https://workout-backend-v932.onrender.com/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders()},
        body: JSON.stringify(workout)
    });
    return response.json();
};

export const deleteWorkout = async (workout) => {
    const response = await fetch('https://workout-backend-v932.onrender.com/api/workouts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders()},
      body: JSON.stringify(workout)
    });
    return response.json();
};


//plan
export const createWorkoutPlan = async (plan) => {
    const response = await fetch('https://workout-backend-v932.onrender.com/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders()},
      body: JSON.stringify(plan)
    });
    return response.json();
};

export const deletePlan = async (name) => {
  const response = await fetch('https://workout-backend-v932.onrender.com/api/plans', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders()},
    body: JSON.stringify({name})
  });
  return response.json();
};


//auth
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

//calendar
export const fetchCalendarEvents = async () => {
  const response = await fetch('https://workout-backend-v932.onrender.com/api/calendar', {
    headers: { ...getAuthHeaders() }
  });
  return response.json();
};
  
export const addCalendarEvent = async (event) => {
  const response = await fetch('https://workout-backend-v932.onrender.com/api/calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(event)
  });
  return response.json();
};
  
export const updateCalendarEvent = async (id, updates) => {
  const response = await fetch(`https://workout-backend-v932.onrender.com/api/calendar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(updates)
  });
  return response.json();
};

export const deleteCalendarEvent = async (id) => {
  const response = await fetch(`https://workout-backend-v932.onrender.com/api/calendar/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() 
      }});
  return response.json();
};


//charts

export const fetchWorkoutData = async (timeRange = '30') => {
  const response = await fetch(`https://workout-backend-v932.onrender.com/api/workouts?range=${timeRange}`, {
    headers: { ...getAuthHeaders() }
  });
  return response.json();
};

export const fetchProgressData = async (timeRange = '30') => {
  const response = await fetch(`https://workout-backend-v932.onrender.com/api/workouts?range=${timeRange}`, {
    headers: { ...getAuthHeaders() }
  });
  return response.json();
};