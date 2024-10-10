"use client";
import React, { useEffect, useState } from 'react';
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

interface Order {
  _id: string;
  createdAt: string;
  total: number;
  orderStatus: string;
}

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'year' | 'month' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetch("/api/order/getallorder", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(`[Orders_GET] ${err.message}`);
      }
    };
    getOrders();
  }, []);

  const aggregateRevenue = () => {
    const revenueByDate: Record<string, number> = {};
    const selectedYear = new Date(selectedDate).getFullYear();
    const selectedMonth = new Date(selectedDate).getMonth();

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const year = orderDate.getFullYear();
      const month = orderDate.getMonth();
      const day = orderDate.getDate();

      if (timeframe === 'year' && year === selectedYear) {
        revenueByDate[year] = (revenueByDate[year] || 0) + order.total;
      } else if (timeframe === 'month' && year === selectedYear && month === selectedMonth) {
        const dateKey = orderDate.toLocaleDateString('fr-FR');
        revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + order.total;
      } else if (timeframe === 'day' && year === selectedYear && month === selectedMonth && day === new Date(selectedDate).getDate()) {
        const dateKey = orderDate.toLocaleDateString('fr-FR');
        revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + order.total;
      }
    });

    return revenueByDate;
  };

  const revenueData = aggregateRevenue();
  const labels = Object.keys(revenueData);
  const data = Object.values(revenueData);

  // Chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue (€)',
        data,
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

  const totalRevenue = data.reduce((a, b) => a + b, 0).toFixed(2);

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Revenue</h1>
      </div>

      {/* Revenue Section */}
      <div className='flex flex-col-2 gap-11 justify-center'>
        <div className="bg-white rounded-lg w-[50%] h-full border-2  p-36 ">
          <div className="flex items-center  gap-4 flex-col-2 ">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <button
              onClick={() => setTimeframe('year')}
              className={`p-2 ${timeframe === 'year' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
            >
              Par Année
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`p-2 ${timeframe === 'month' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
            >
              Par Mois
            </button>
            <button
              onClick={() => setTimeframe('day')}
              className={`p-2 ${timeframe === 'day' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
            >
              Par Jour
            </button>
            <input
              type={timeframe === 'year' ? 'number' : 'date'}
              className="border rounded p-2 ml-4"
              value={timeframe === 'year' ? selectedDate.split('-')[0] : selectedDate}
              onChange={(e) => {
                if (timeframe === 'year') {
                  setSelectedDate(`${e.target.value}-01-01`);
                } else {
                  setSelectedDate(e.target.value);
                }
              }}
            />
          </div>
          <div className="mt-11 flex flex-col items-center justify-center">
            <h3 className="text-3xl text-purple-600 mb-7 flex gap-2 justify-center items-center">
              <FaMoneyBillWave />
              Revenue: {totalRevenue}€
            </h3>
            <p className="font-medium flex gap-2">
              <span className="font-bold text-green-600 flex gap-2 items-center">
                <FaArrowTrendUp />100.00%
              </span> Increase par rapport à la période précédente
            </p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg w-[40%] h-full border-2 p-2">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
