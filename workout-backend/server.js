require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);
let workoutsCollection;

async function connectDB() {
    await client.connect();
    const db = client.db('workout_tracker');
    workoutsCollection = db.collection('workouts');
}
connectDB();

// Add a workout (only save the fields you want)
app.post('/api/workouts', async (req, res) => {
    const { name, muscle, sets, reps, weight } = req.body;
    const workout = { name, muscle, sets, reps, weight };
    await workoutsCollection.insertOne(workout);
    res.status(201).json({ message: 'Workout saved!' });
});

// Get all workouts (only return the fields you want)
app.get('/api/workouts', async (req, res) => {
    const workouts = await workoutsCollection.find().toArray();
    const filtered = workouts.map(({ name, muscle, sets, reps, weight }) => ({
        name, muscle, sets, reps, weight
    }));
    res.json(filtered);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/api/workouts`));