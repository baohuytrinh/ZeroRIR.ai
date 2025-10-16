import React, { useState, useEffect } from 'react';
import { fetchWorkoutData, fetchProgressData } from '../services/api';
import WorkoutFrequencyChart from '../components/WorkoutFrequencyChart';
import ExerciseTypeChart from '../components/ExerciseTypeChart';
import ProgressChart from '../components/ProgressChart';
import VolumeChart from '../components/VolumeChart';
import '../css/charts.css';

function Charts() {
  const [workoutData, setWorkoutData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); //days

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      //fetch data based on timeRange
      const [workouts, progress] = await Promise.all([
        fetchWorkoutData(timeRange),
        fetchProgressData(timeRange)
      ]);
      setWorkoutData(workouts);
      setProgressData(progress);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="charts-loading">Loading charts...</div>;

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h1>Workout Analytics</h1>
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Workout Frequency</h3>
          <WorkoutFrequencyChart data={workoutData} />
        </div>

        <div className="chart-card">
          <h3>Exercise Types</h3>
          <ExerciseTypeChart data={workoutData} />
        </div>

        <div className="chart-card">
          <h3>Progress Tracking</h3>
          <ProgressChart data={progressData} />
        </div>

        <div className="chart-card">
          <h3>Training Volume</h3>
          <VolumeChart data={workoutData} />
        </div>
      </div>

    
    </div>
  );
}

export default Charts;