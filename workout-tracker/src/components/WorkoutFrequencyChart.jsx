import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function WorkoutFrequencyChart({ data }) {
  //process data to count workouts per day
  const processData = (workouts) => {
    if (!workouts || workouts.length === 0) return { labels: [], datasets: [] };
    
    const workoutCounts = {};
    
    //count workouts per day (might need to add date field to user's workout data)
    workouts.forEach(workout => {
      const date = workout.date || new Date().toISOString().split('T')[0];
      workoutCounts[date] = (workoutCounts[date] || 0) + 1;
    });
    
    const sortedDates = Object.keys(workoutCounts).sort();
    
    return {
      labels: sortedDates,
      datasets: [{
        label: 'Workouts per day',
        data: sortedDates.map(date => workoutCounts[date]),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      }],
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
        text: 'Workout Frequency Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default WorkoutFrequencyChart;