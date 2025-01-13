const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// MIDDLEWARE

app.use(cors());
app.use(express.json());

// MONGODB CONNECTION



mongoose.connect("mongodb+srv://ljrangel:sz2jxp8mM0W7QO6Z@nightguard.jcotw1u.mongodb.net/?retryWrites=true&w=majority&appName=NightGuard"
).then(()=>{
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err)
});

// SCHEMA CREATION/MODEL

const reportSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    description: String,
    photoUrl : String,
    timestamp: {type : Date, default: Date.now},
});

const Report = mongoose.model('Report', reportSchema);

// ROUTES

// HEALTH CHECK
app.get('/', (req,res) => {
    res.send('API is running!');
});

// GET ALL REPORTS
app.get('/api/reports', async (req,res) => {
    try {
        const reports = await Report.find({});
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server Error'});
    }
});

// CREATE NEW REPORT
app.post('/api/reports', async (req,res) => {
    try {
        const {latitude, longitude, description, photoUrl} = req.body;
        const newReport = new Report({
            latitude,
            longitude,
            description,
            photoUrl
        });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Unable to save report' });
    }
});

// ADD MORE ROUTES HERE LATER

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});

