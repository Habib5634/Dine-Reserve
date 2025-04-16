'use client'
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaTimes, FaCheck, FaClock, FaTrash, FaFilePdf, FaPrint, } from 'react-icons/fa';
import { jsPDF } from "jspdf";
import ReviewForm from './ReviewForm';
const MyReservations = () => {


  const [myReservations, setMyReservations] = useState(null)

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [detailModel, setDetailModel] = useState(false)
  const [reservation, setReservation] = useState(null)
const [reviewModel,setReviewModel] = useState(false)
const [reviews, setReviews] = useState([]);

const handleOpenReviewModel = (reservation)=>{
  setReservation(reservation)
  setReviewModel(true)
}

const handleReviewSubmitSuccess = (newReview) => {
  // Update your state or UI as needed
  setReviews([newReview, ...reviews]);
};
  const fetchMyReservations = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/rest/my-reservations`, getAuthHeaders());

      setMyReservations(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMyReservations()
  }, [])

  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    // Update the reservation status to cancelled

    try {
      const response = await axios.patch(`${API_URL}/rest/${selectedReservation?._id}/cancelled`, {}, getAuthHeaders());

      if (response?.status === 200) {

        setShowCancelModal(false);
        setCancelSuccess(true);
        fetchMyReservations()
      }
    } catch (error) {
      console.log(error)
    }



    // Hide success message after 5 seconds
    setTimeout(() => {
      setCancelSuccess(false);
    }, 5000);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "pending":
        return "text-yellow-500";
      case "refunded":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const handleReservation = (reservation) => {
    setDetailModel(true)
    setReservation(reservation)
  }
  // PDF Generation Function
  const generatePDFInvoice = () => {
    const doc = new jsPDF();

    // Add logo or title
    doc.setFontSize(20);
    doc.text('Reservation Invoice', 105, 20, { align: 'center' });

    // Restaurant Info
    doc.setFontSize(12);
    doc.text(`Restaurant: ${reservation?.restaurant?.name}`, 20, 40);
    doc.text(`Location: ${reservation?.restaurant?.location}`, 20, 50);

    // Reservation Details
    doc.text(`Reservation ID: ${reservation?._id}`, 20, 70);
    doc.text(`Date: ${new Date(reservation?.reservationDate).toLocaleDateString()}`, 20, 80);
    doc.text(`Time: ${reservation?.startTime} - ${reservation?.endTime}`, 20, 90);
    doc.text(`Table: ${reservation?.table?.tableNumber} (${reservation?.table?.capacity} persons)`, 20, 100);

    // Payment Details
    doc.setFontSize(14);
    doc.text('Payment Summary', 20, 120);
    doc.setFontSize(12);
    doc.text(`Amount: $${(reservation?.payment?.amount / 100).toFixed(2)}`, 20, 130);
    doc.text(`Payment Method: ${reservation?.payment?.paymentMethod.replace('_', ' ')}`, 20, 140);
    doc.text(`Status: ${reservation?.payment?.status}`, 20, 150);

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your reservation!', 105, 280, { align: 'center' });

    // Save the PDF
    doc.save(`reservation_${reservation?._id}.pdf`);
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
        {myReservations?.length === 0 ? (
          <p className="text-gray-500 text-center py-12">You have no reservations yet.</p>
        ) : (
          myReservations?.map(reservation => (
            <div
              key={reservation._id}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start" onClick={() => handleReservation(reservation)}>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{reservation?.restaurant?.name}</h2>
                    <div className="flex items-center mt-1 text-gray-600">
                      <FaClock className="mr-2" />
                      <span>{formatDate(reservation?.reservationDate)} at {reservation?.startTime} to {reservation?.endTime}</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                        {reservation?.numberOfGuests}-chair Table
                      </span>
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        ${reservation?.payment?.amount}
                      </span>
                    </div>
                    <div className={`text-sm font-semibold mt-2 ${getStatusColor(reservation?.payment?.status)}`}>
                      Payment Status: {reservation?.payment?.status?.charAt(0).toUpperCase() + reservation?.payment?.status.slice(1)}
                    </div>
                  </div>
                  <div>
                    {reservation.status === "confirmed" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    )}

                    {reservation.status === "cancelled" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    )}

                    {reservation.status === "completed" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {reservation.status === "confirmed" ? (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleCancel(reservation)}
                      className="flex items-center text-red-600 hover:text-red-800"
                    >
                      <FaTrash className="mr-1" />
                      Cancel Reservation
                    </button>
                  </div>
                ):
                <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleOpenReviewModel(reservation)}
                  className="flex items-center text-green-600 hover:text-red-800"
                >
                 Add Review
                </button>
              </div>
                }
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
                        Are you sure you want to cancel your reservation at {selectedReservation?.restaurant?.name}?
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Your refund of {selectedReservation?.payment?.amount} will be processed within 5-7 business days.
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

      {detailModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Reservation Details</h2>
              <button
                onClick={() => setDetailModel(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Restaurant Info */}
              <div className="pb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Restaurant</h3>
                <p className="text-gray-900 font-medium">{reservation?.restaurant?.name}</p>
                <p className="text-gray-600 text-sm">{reservation?.restaurant?.location}</p>
              </div>

              {/* Reservation Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Reservation ID</p>
                    <p className="text-gray-900 font-mono">{reservation?._id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${reservation?.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      reservation?.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {reservation?.status}
                  </span>
                </div>
              </div>

              {/* Guest Info */}
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">Guest Name</p>
                  <p className="text-gray-900">{reservation?.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number of Guests</p>
                  <p className="text-gray-900">{reservation?.numberOfGuests}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-gray-900">
                    {new Date(reservation?.reservationDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-gray-900">
                    {reservation?.startTime} - {reservation?.endTime}
                  </p>
                </div>
              </div>

              {/* Table Info */}
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">Table Number</p>
                  <p className="text-gray-900">{reservation?.table?.tableNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="text-gray-900">{reservation?.table?.capacity} persons</p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Details</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">${(reservation?.payment?.amount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-900 capitalize">
                      {reservation?.payment?.paymentMethod?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-md text-xs ${reservation?.payment?.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {reservation?.payment?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Created: {new Date(reservation?.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(reservation?.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setDetailModel(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <div className="space-x-3">
                <button
                  onClick={generatePDFInvoice}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <FaFilePdf /> Download Invoice (PDF)
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

{reviewModel && reservation && (
        <ReviewForm
          reservation={reservation}
          onClose={() => setReviewModel(false)}
          onSubmitSuccess={handleReviewSubmitSuccess}
        />
      )}
    </div>
  );
};

export default MyReservations;