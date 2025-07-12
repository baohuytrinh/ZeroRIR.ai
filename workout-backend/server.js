require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());



const client = new MongoClient(process.env.MONGODB_URI);
let workoutsCollection;
let plansCollection;
let usersCollection;
let calendarCollection;

async function connectDB() {
    await client.connect();
    const db = client.db('workout_tracker');
    workoutsCollection = db.collection('workouts');
    plansCollection = db.collection('plans');
    usersCollection = db.collection('users');
    calendarCollection = db.collection('calendarEvents');
}
connectDB();
const JWT_SECRET = process.env.JWT_SECRET


// Add a workout (only save the fields you want)
app.post('/api/workouts', authMiddleware, async (req, res) => {
    const username = req.user.username; // jwt
    const { name, muscle, sets, reps, weight } = req.body;
    const workout = { username, name, muscle, sets, reps, weight };
    await workoutsCollection.insertOne(workout);
    res.status(201).json({ message: 'Workout saved!' });
});

// Get all workouts (only return the fields you want)
app.get('/api/workouts', authMiddleware, async (req, res) => {
    const username = req.user.username; // jwt
    const workouts = await workoutsCollection.find({username}).toArray();
    const filtered = workouts.map(({ name, muscle, sets, reps, weight }) => ({
         name, muscle, sets, reps, weight
    }));
    res.json(filtered);
});

// add a plan
app.post('/api/plans', authMiddleware, async (req, res) => {
    const username = req.user.username; 
    const {name, exercises } = req.body;
    if (!username || !name || !Array.isArray(exercises)) {
        return res.status(400).json({ error: "Missing fields" });
    }
    await plansCollection.insertOne({ username, name, exercises });
    res.status(201).json({ message: 'Plan saved!' });
});

app.get('/api/plans', authMiddleware, async (req, res) => {
    const username = req.user.username;
    const plans = await plansCollection.find({username}).toArray();
    const filtered = plans.map(plan => 
        ({ name: plan.name, exercises: plan.exercises.map(ex => 
            ({name: ex.name, muscle: ex.muscle})) 
        }));
    res.json(filtered);
});

//calendar

app.post('/api/calendar', authMiddleware, async (req, res) => {
    const username = req.user.username;
    const {title, start, end, allDay} = req.body;
    if (!title || !start || !end) return res.status(400).json({ error: "Missing fields" });
    const result = await calendarCollection.insertOne({ username, title, start, end, allDay});
    res.status(201).json({ _id: result.insertedId, title, start, end, allDay });
});

app.get('/api/calendar', authMiddleware, async (req, res) => {
    const username = req.user.username;
    const events = await calendarCollection.find({username}).toArray();
    res.json(events);
});

app.put('/api/calendar/:id', authMiddleware, async (req,res) => {
    const username = req.user.username;
    const {id} = req.params;
    const {start, end, allDay} = req.body;
    await calendarCollection.updateOne(
        {_id: new ObjectId(id), username},
        { $set: {start, end, allDay } }
    );
    res.json({ message: "Event updated" });
});

app.delete('/api/calendar/:id', authMiddleware, async (req, res) => {
    const username = req.user.username;
    const { id } = req.params;
    await calendarCollection.deleteOne({ _id: new ObjectId(id), username});
    res.json({ message: "Event deleted" });
});

//authentication

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    //checks if theres an existing user
    const existing = await usersCollection.findOne({ username });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ username, passwordHash });
    res.json({ message: 'User registered' });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await usersCollection.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
});

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}


//openAI

app.post('/api/ai', authMiddleware, async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    try {
        const username = req.user.username;
        const plans = await plansCollection.find({username}).toArray();
        const workouts = await workoutsCollection.find({username}).toArray();

        const userData = `
        User's Plans: ${JSON.stringify(plans)}
        User's Workouts: ${JSON.stringify(workouts)}
        `;

        const fullPrompt = `
        You are a helpful fitness assistant. Here is information about the user:
        ${userData}
        Now answer the user's question: ${prompt}`

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${process.env.openAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4.1",
                messages: [{ role: "user", content: fullPrompt }],
                max_tokens: 150
            })
        });
        const data = await openaiRes.json();
        res.json({ ai: data.choices[0].message.content });
    } catch (err) {
        res.status(500).json({error: 'AI request failed', details: err.message });
    }
});



app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}` });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/api/workouts`));