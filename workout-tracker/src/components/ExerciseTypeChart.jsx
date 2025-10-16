import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function ExerciseTypeChart({ data }) {
  //process data to count exercises by muscle group
  const processData = (workouts) => {
    if (!workouts || workouts.length === 0) return { labels: [], datasets: [] };
    
    const muscleCounts = {};
    
    workouts.forEach(workout => {
      const muscle = workout.muscle || 'unknown';
      muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1;
    });
    
    const labels = Object.keys(muscleCounts);
    const counts = Object.values(muscleCounts);
    
    //generate colors for each muscle group
    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
    ];
    
    return {
      labels: labels,
      datasets: [{
        label: 'Exercises by Muscle Group',
        data: counts,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
      }],
    };
  };

  const chartData = processData(data);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Exercise Distribution by Muscle Group',
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default ExerciseTypeChart;