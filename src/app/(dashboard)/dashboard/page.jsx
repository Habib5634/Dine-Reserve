'use client'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiUsers, FiCoffee, FiDollarSign, FiCalendar, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/rest/dashboard/`,getAuthHeaders());
        setStats(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  useEffect(() => {
    if (!stats?.reservationTrends) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    const labels = stats.reservationTrends.map(item => item._id);
    const confirmedData = stats.reservationTrends.map(item => item.confirmed);
    const cancelledData = stats.reservationTrends.map(item => item.cancelled);

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Confirmed Reservations',
            data: confirmedData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Cancelled Reservations',
            data: cancelledData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Reservations'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [stats]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => router.reload()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Admin Stats */}
        {stats.totalUsers !== undefined && (
          <StatCard 
            icon={<FiUsers className="text-blue-500" size={24} />}
            title="Total Users"
            value={stats.totalUsers}
            trend="+5% from last month"
            bgColor="bg-blue-50"
          />
        )}

        {stats.totalRestaurants !== undefined && (
          <StatCard 
            icon={<FiCoffee className="text-green-500" size={24} />}
            title="Total Restaurants"
            value={stats.totalRestaurants}
            trend="+3 new this month"
            bgColor="bg-green-50"
          />
        )}

        {(stats.totalEarnings !== undefined || stats.restaurantEarnings !== undefined) && (
          <StatCard 
            icon={<FiDollarSign className="text-purple-500" size={24} />}
            title={stats.totalEarnings !== undefined ? "Total Earnings" : "Restaurant Earnings"}
            value={`$${(stats.totalEarnings || stats.restaurantEarnings || 0).toLocaleString()}`}
            trend="+12% from last month"
            bgColor="bg-purple-50"
          />
        )}

        {stats.activeReservations !== undefined && (
          <StatCard 
            icon={<FiCalendar className="text-orange-500" size={24} />}
            title="Active Reservations"
            value={stats.activeReservations}
            trend="5 confirmed today"
            bgColor="bg-orange-50"
          />
        )}

        {/* Manager Stats */}
        {stats.cancelledReservations !== undefined && (
          <StatCard 
            icon={<FiXCircle className="text-red-500" size={24} />}
            title="Cancelled Reservations"
            value={stats.cancelledReservations}
            trend="2% cancellation rate"
            bgColor="bg-red-50"
          />
        )}
      </div>

      {/* Additional Charts/Graphs Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Reservation Trends</h2>
      <div className="h-96">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, trend, bgColor }) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-2">{trend}</p>
        </div>
        <div className="p-3 rounded-full bg-white">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;