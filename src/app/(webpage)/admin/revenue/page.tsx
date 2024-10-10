"use client"
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaMoneyBillWave } from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';

// Register the necessary components
ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const RevenueDashboard: React.FC = () => {
  // Sample data for the chart
  const chartData = {
    labels: ['30 août', '31 août', '1 sept.', '2 sept.', '3 sept.', '4 sept.', '5 sept.', '6 sept.', '7 sept.', '8 sept.', '9 sept.', '10 sept.'],
    datasets: [
      {
        label: 'Revenue (€)',
        data: [1200, 1300, 1250, 1400, 1300, 1350, 1500, 1600, 1550, 1700, 1800, 2574.5],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#000',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#000',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="p-6  ">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Revenue</h1>
        
      </div>

      {/* Revenue Section */}
      <div className=' flex flex-col-2 gap-11 justify-center '>
      <div className=" bg-white  rounded-lg w-[45%] h-full border-2 p-36  ">
      <div className="flex items-center gap-4 flex-col-2">
        <h2 className="text-xl font-semibold">Revenue</h2>
        
          <button className=" bg-gray-300 text-white p-2">Par Année</button>
          <button className=" bg-green-500 text-white p-2">Par Mois</button>
          <button className=" bg-gray-300 text-white p-2">Par Jour</button>
          <input
            type="month"
            className="border rounded p-2 ml-4"
            defaultValue="2024-09"
          />
        </div>
        <div className="mt-11 flex flex-col items-center justify-center ">
          <h3 className="text-3xl text-purple-600 mb-7 flex gap-2 justify-center items-center"><FaMoneyBillWave />
          Revenue: 2574.50€</h3>
          <p className=" font-medium flex gap-2">
            <span className="font-bold text-green-600 flex gap-2 items-center"> <FaArrowTrendUp />100.00%</span> Increase par rapport à la période précédente
          </p>
        </div>

       
        
      </div>
       {/* Revenue Chart */}
      <div className="bg-white rounded-lg w-[45%] h-full border-2 p-2 ">
          <Line data={chartData} options={options} />
        </div>
        </div>
    </div>
  );
};

export default RevenueDashboard;

// Button styles can be customized
const btnStyle = 'bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition';
