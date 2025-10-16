import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
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
  Filler,
  Title,
  Tooltip,
  Legend
);

function VolumeChart({ data }) {
  //process data to calculate training volume (sets × reps × weight) per day
  const processData = (workouts) => {
    if (!workouts || workouts.length === 0) return { labels: [], datasets: [] };
    
    const dailyVolume = {};
    
    workouts.forEach(workout => {
      const date = workout.date || new Date().toISOString().split('T')[0];
      const volume = workout.sets * workout.reps * workout.weight;
      
      if (!dailyVolume[date]) {
        dailyVolume[date] = 0;
      }
      dailyVolume[date] += volume;
    });
    
    const sortedDates = Object.keys(dailyVolume).sort();
    const volumes = sortedDates.map(date => dailyVolume[date]);
    
    return {
      labels: sortedDates,
      datasets: [{
        label: 'Training Volume (sets × reps × weight)',
        data: volumes,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        fill: true,
        tension: 0.4,
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
        text: 'Daily Training Volume',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Volume (lbs)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
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

export default VolumeChart;