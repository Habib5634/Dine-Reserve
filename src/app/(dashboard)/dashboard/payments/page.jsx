'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl';
import { useSelector } from 'react-redux';

const PaymentsPage = () => {
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
const {userData} =useSelector((state)=>state.userData)
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        let endpoint = '';
        
        if (userData.userType === 'admin') {
          endpoint = `${API_URL}/rest/admin-payments`;
        } else if (userData.userType === 'manager') {
          endpoint = `${API_URL}/rest/manager-payments`;
        } else {
          throw new Error('Unauthorized access');
        }

        const { data } = await axios.get(endpoint, getAuthHeaders());

        setPayments(data.payments);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [userData]);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const generatePaymentReceipt = (payment) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Payment Receipt', 105, 20, { align: 'center' });
    
    // Payment Details
    doc.setFontSize(12);
    doc.text(`Payment ID: ${payment._id}`, 20, 40);
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`, 20, 50);
    doc.text(`Status: ${payment.status}`, 20, 60);
    doc.text(`Amount: $${(payment.amount / 100).toFixed(2)}`, 20, 70);
    doc.text(`Method: ${payment.paymentMethod.replace('_', ' ')}`, 20, 80);
    
    // User Details
    doc.text(`Customer: ${payment.user?.name || 'N/A'}`, 20, 100);
    doc.text(`Email: ${payment.user?.email || 'N/A'}`, 20, 110);
    
    // Restaurant Details
    doc.text(`Restaurant: ${payment.restaurant?.name || 'N/A'}`, 20, 130);
    if (userData.userType === 'admin') {
      doc.text(`Manager: ${payment.restaurant?.manager?.name || 'N/A'}`, 20, 140);
    }
    
    // Reservation Details
    doc.text(`Table: ${payment.table?.tableNumber || 'N/A'}`, 20, 160);
    if (payment.reservation) {
      doc.text(`Reservation Date: ${new Date(payment.reservation.reservationDate).toLocaleDateString()}`, 20, 170);
      doc.text(`Time: ${payment.reservation.startTime} - ${payment.reservation.endTime}`, 20, 180);
    }
    
    doc.save(`payment_${payment._id}.pdf`);
  };

  if (loading) return <div className="text-center py-8">Loading payments...</div>;
//   if (error) return <div className="text-center text-red-500 py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {userData?.userType === 'admin' ? 'All Payments' : 'Restaurant Payments'}
      </h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
              {userData?.userType === 'admin' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments?.map((payment) => (
              <tr key={payment._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment._id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment?.user?.name}</div>
                  <div className="text-sm text-gray-500">{payment?.user?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment?.restaurant?.name}
                </td>
                {userData.userType === 'admin' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment?.restaurant?.manager?.name}</div>
                    <div className="text-sm text-gray-500">{payment?.restaurant?.manager?.email}</div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${(payment?.amount / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment?.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(payment)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => generatePaymentReceipt(payment)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaFilePdf />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Payment Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">ID:</span> {selectedPayment._id}</p>
                    <p><span className="text-gray-600">Amount:</span> ${(selectedPayment.amount / 100).toFixed(2)}</p>
                    <p><span className="text-gray-600">Method:</span> {selectedPayment.paymentMethod.replace('_', ' ')}</p>
                    <p><span className="text-gray-600">Status:</span> 
                      <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                        selectedPayment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedPayment.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedPayment.status}
                      </span>
                    </p>
                    <p><span className="text-gray-600">Date:</span> {new Date(selectedPayment.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Name:</span> {selectedPayment.user?.name || 'N/A'}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedPayment.user?.email || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Restaurant Information</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Name:</span> {selectedPayment.restaurant?.name || 'N/A'}</p>
                    {userData.userType === 'admin' && (
                      <p><span className="text-gray-600">Manager:</span> {selectedPayment.restaurant?.manager?.name || 'N/A'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Reservation Details</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Table:</span> {selectedPayment.table?.tableNumber || 'N/A'}</p>
                    {selectedPayment.reservation ? (
                      <>
                        <p><span className="text-gray-600">Date:</span> {new Date(selectedPayment.reservation.reservationDate).toLocaleDateString()}</p>
                        <p><span className="text-gray-600">Time:</span> {selectedPayment.reservation.startTime} - {selectedPayment.reservation.endTime}</p>
                        <p><span className="text-gray-600">Guests:</span> {selectedPayment.reservation.numberOfGuests}</p>
                      </>
                    ) : (
                      <p>No reservation details</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => generatePaymentReceipt(selectedPayment)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <FaFilePdf /> Download Receipt
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;