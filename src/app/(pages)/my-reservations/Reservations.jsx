'use client'
import { useState } from 'react';
import { FaTimes, FaCheck, FaClock, FaTrash } from 'react-icons/fa';

const MyReservations = () => {
  // Dummy reservation data
  const [reservations, setReservations] = useState([
    {
      id: 1,
      restaurant: "Alzar Cafe",
      date: "2023-12-15",
      time: "19:00",
      table: "2-chair table",
      price: "$20",
      status: "confirmed"
    },
    {
      id: 2,
      restaurant: "Sapna Shenwari",
      date: "2023-12-20",
      time: "20:30",
      table: "4-chair table",
      price: "$35",
      status: "confirmed"
    },
    {
      id: 3,
      restaurant: "Dynasty Marriot",
      date: "2024-01-05",
      time: "18:00",
      table: "6-chair table",
      price: "$50",
      status: "confirmed"
    }
  ]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    // Update the reservation status to cancelled
    setReservations(reservations.map(res => 
      res.id === selectedReservation.id ? { ...res, status: "cancelled" } : res
    ));
    setShowCancelModal(false);
    setCancelSuccess(true);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setCancelSuccess(false);
    }, 5000);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-redish mb-8">My Reservations</h1>

      {/* Success message */}
      {cancelSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <div className="flex items-center">
            <FaCheck className="mr-2" />
            <p>
              Reservation cancelled successfully. Your refund of {selectedReservation?.price} will be 
              processed within 5-7 business days.
            </p>
          </div>
        </div>
      )}

      {/* Reservations list */}
      <div className="space-y-6">
        {reservations.length === 0 ? (
          <p className="text-gray-500 text-center py-12">You have no reservations yet.</p>
        ) : (
          reservations.map(reservation => (
            <div 
              key={reservation.id} 
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{reservation.restaurant}</h2>
                    <div className="flex items-center mt-1 text-gray-600">
                      <FaClock className="mr-2" />
                      <span>{formatDate(reservation.date)} at {reservation.time}</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                        {reservation.table}
                      </span>
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        {reservation.price}
                      </span>
                    </div>
                  </div>
                  <div>
                    {reservation.status === "confirmed" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {reservation.status === "confirmed" && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleCancel(reservation)}
                      className="flex items-center text-red-600 hover:text-red-800"
                    >
                      <FaTrash className="mr-1" />
                      Cancel Reservation
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 transition-opacity"></div>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTimes className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cancel Reservation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel your reservation at {selectedReservation?.restaurant}?
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Your refund of {selectedReservation?.price} will be processed within 5-7 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={confirmCancel}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-redish text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  No, Keep It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;