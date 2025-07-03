require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());



const client = new MongoClient(process.env.MONGODB_URI);
let workoutsCollection;
let plansCollection;

async function connectDB() {
    await client.connect();
    const db = client.db('workout_tracker');
    workoutsCollection = db.collection('workouts');
    plansCollection = db.collection('plans');
}
connectDB();

// Add a workout (only save the fields you want)
app.post('/api/workouts', async (req, res) => {
    const { demoUserID, name, muscle, sets, reps, weight } = req.body;
    const workout = { demoUserID, name, muscle, sets, reps, weight };
    await workoutsCollection.insertOne(workout);
    res.status(201).json({ message: 'Workout saved!' });
});

// Get all workouts (only return the fields you want)
app.get('/api/workouts', async (req, res) => {
    const workouts = await workoutsCollection.find().toArray();
    const filtered = workouts.map(({ demoUserID, name, muscle, sets, reps, weight }) => ({
        demoUserID, name, muscle, sets, reps, weight
    }));
    res.json(filtered);
});

// add a plan
app.post('/api/plans', async (req, res) => {
    const { demoUserID, name, exercises } = req.body;
    if (!demoUserID || !name || !Array.isArray(exercises)) {
        return res.status(400).json({ error: "Missing fields" });
    }
    await plansCollection.insertOne({ demoUserID, name, exercises });
    res.status(201).json({ message: 'Plan saved!' });
});

app.get('/api/plans', async (req, res) => {
    const plans = await plansCollection.find().toArray();
    const filtered = plans.map(plan => 
        ({ demoUserID: plan.demoUserID, name: plan.name, exercises: plan.exercises.map(ex => 
            ({name: ex.name, muscle: ex.muscle})) 
        }));
    res.json(filtered);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/api/workouts`));