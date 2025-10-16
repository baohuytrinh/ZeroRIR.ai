import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ProgressChart({ data }) {
  //process data to show weight progression for each exercise
  const processData = (workouts) => {
    if (!workouts || workouts.length === 0) return { labels: [], datasets: [] };
    
    const exerciseProgress = {};
    
    workouts.forEach(workout => {
      const exerciseName = workout.name;
      if (!exerciseProgress[exerciseName]) {
        exerciseProgress[exerciseName] = [];
      }
      exerciseProgress[exerciseName].push({
        weight: workout.weight,
        sets: workout.sets,
        reps: workout.reps,
        date: workout.date || new Date().toISOString()
      });
    });
    
    //get top 5 exercises by frequency
    const topExercises = Object.entries(exerciseProgress)
      .sort(([,a], [,b]) => b.length - a.length)
      .slice(0, 5)
      .map(([name]) => name);
    
    const datasets = topExercises.map((exerciseName, index) => {
      const exerciseData = exerciseProgress[exerciseName];
      const colors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ];
      
      return {
        label: exerciseName,
        data: exerciseData.map(session => session.weight),
        backgroundColor: colors[index],
        borderColor: colors[index].replace('0.8', '1'),
        borderWidth: 1,
      };
    });
    
    return {
      labels: Array.from({length: Math.max(...Object.values(exerciseProgress).map(arr => arr.length))}, (_, i) => `Session ${i + 1}`),
      datasets: datasets,
    };
  };

  const chartData = processData(data);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weight Progression by Exercise',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Weight (lbs)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Workout Session',
        },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default ProgressChart;