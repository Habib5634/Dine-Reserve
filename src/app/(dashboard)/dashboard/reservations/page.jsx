'use client'
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl';
import axios from 'axios';
import { useEffect, useState } from 'react';

const ReservationManagement = () => {
    // Dummy reservation data
    const [reservations, setReservations] = useState([
        {
            id: 1,
            customerName: 'John Doe',
            phone: '+1 555-123-4567',
            date: '2023-12-15',
            time: '19:00',
            guests: 4,
            table: 'Window #5',
            paymentStatus: 'pending',
            reservationStatus: 'confirmed',
            specialRequests: 'Birthday celebration'
        },
        {
            id: 2,
            customerName: 'Jane Smith',
            phone: '+1 555-987-6543',
            date: '2023-12-16',
            time: '20:30',
            guests: 2,
            table: 'Booth #3',
            paymentStatus: 'paid',
            reservationStatus: 'confirmed',
            specialRequests: 'Vegetarian menu'
        },
        {
            id: 3,
            customerName: 'Robert Johnson',
            phone: '+1 555-456-7890',
            date: '2023-12-17',
            time: '18:00',
            guests: 6,
            table: 'Private Room #1',
            paymentStatus: 'failed',
            reservationStatus: 'pending',
            specialRequests: 'Allergic to nuts'
        },
    ]);

    const [myReservations, setMyReservations] = useState(null)

    const fetchMyReservations = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/rest/reservations`, getAuthHeaders())
            console.log(data)
            setMyReservations(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMyReservations()
    }, [])


    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [deleteModel,setDeleteModel] = useState(false)
    const [currentReservation, setCurrentReservation] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusType, setStatusType] = useState(''); // 'payment' or 'reservation'
const [detailModel,setDetailModel] = useState(false)
const [reservation,setReservation] = useState(null)
    // Status options
    const paymentStatusOptions = ['pending', 'completed', 'failed', 'refunded'];
    const reservationStatusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];

    // Handle status change initiation
    const initiateStatusChange = (reservation, type, value) => {
        setCurrentReservation(reservation);
        setSelectedStatus(value);
        setStatusType(type);

        if (type === 'payment') {
            setShowPaymentModal(true);
        } else if(type==="reservation") {
            setShowReservationModal(true);
        }else{
            setDeleteModel(true)
        }
    };

    // Confirm status change
    const confirmStatusChange = async () => {
        
        if (statusType === "payment") {
            try {

                const response = await axios.patch(`${API_URL}/rest/${currentReservation?.payment?._id}/payment`, { status: selectedStatus }, getAuthHeaders());
             
                if (response.status === 200) {
                    setShowPaymentModal(false);
                  fetchMyReservations()
                }
            } catch (error) {
                console.log(error)
            }
        }else if(type==="reservation"){
            try {

                const response = await axios.patch(`${API_URL}/rest/${currentReservation?._id}/cancelled`, { }, getAuthHeaders());
             
                if (response.status === 200) {
                    setShowReservationModal(false);
                  fetchMyReservations()
                }
            } catch (error) {
                console.log(error)
            }
        }else{

        }

        
    };

    // Handle delete
    const handleDelete = (id) => {
        setMyReservations(myReservations?.filter(res => res.id !== id));
    };
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleShowDetailModel=(reservation)=>{
        setReservation(reservation)

        setDetailModel(true)
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Reservation Management</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {myReservations?.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{reservation?.user?.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {reservation?.user?.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-900">{formatDate(reservation?.reservationDate)}</div>
                                        <div className="text-gray-500">{reservation?.startTime} to {reservation?.endTime}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-900">
                                            {reservation?.numberOfGuest} guests
                                        </div>

                                    </td>
                                    {/* Table cells remain the same as before */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={reservation?.payment?.status}
                                            onChange={(e) => initiateStatusChange(reservation, 'payment', e.target.value)}
                                            className={`px-2 py-1 rounded-md text-sm ${reservation.payment?.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    reservation.payment?.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                        reservation.payment?.status === 'refunded' ? 'bg-red-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {paymentStatusOptions?.map(option => (
                                                <option key={option} value={option}>{option?.charAt(0).toUpperCase() + option.slice(1)}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap capitalize ${reservation?.status === 'confirmed' ? ' text-blue-800' :
                                                    reservation?.status === 'cancelled' ? ' text-red-800' :
                                                        reservation?.status === 'completed' ? ' text-green-800' :
                                                            ' text-yellow-800'
                                                }`}>
                                        {/* <select
                                            value={reservation?.reservationStatus}
                                            onChange={(e) => initiateStatusChange(reservation, 'reservation', e.target.value)}
                                            className={`px-2 py-1 rounded-md text-sm ${reservation?.reservationStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                    reservation?.reservationStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        reservation?.reservationStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {reservationStatusOptions?.map(option => (
                                                <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                                            ))}
                                        </select> */}
                                        {reservation?.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* <button
                                            onClick={(e) => initiateStatusChange(reservation, 'delete')}
                                            className="text-red-600 hover:text-red-900 mr-4"
                                        >
                                            Delete
                                        </button> */}
                                        <button onClick={()=>handleShowDetailModel(reservation)} className="text-blue-600 hover:text-blue-900">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Total Reservations</h3>
                    <p className="text-3xl font-bold">{reservations?.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Confirmed</h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {reservations?.filter(r => r.reservationStatus === 'confirmed').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Paid</h3>
                    <p className="text-3xl font-bold text-green-600">
                        {reservations?.filter(r => r.paymentStatus === 'completed').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Pending Payment</h3>
                    <p className="text-3xl font-bold text-yellow-600">
                        {reservations?.filter(r => r.paymentStatus === 'pending').length}
                    </p>
                </div>
            </div>

            {/* Payment Status Change Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Payment Status Change</h3>
                        <p className="mb-4">
                            Change payment status for <strong>{currentReservation?.customerName}</strong>'s reservation from
                            <span className={`mx-1 px-2 py-1 rounded-md text-sm ${currentReservation?.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                    currentReservation?.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {currentReservation?.paymentStatus}
                            </span> to
                            <span className={`mx-1 px-2 py-1 rounded-md text-sm ${selectedStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                    selectedStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {selectedStatus}
                            </span>?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmStatusChange}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reservation Status Change Modal */}
            {showReservationModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Reservation Status Change</h3>
                        <p className="mb-4">
                            Change reservation status for <strong>{currentReservation?.customerName}</strong>'s reservation from
                            <span className={`mx-1 px-2 py-1 rounded-md text-sm ${currentReservation?.reservationStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                    currentReservation?.reservationStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        currentReservation?.reservationStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                }`}>
                                {currentReservation?.reservationStatus}
                            </span> to
                            <span className={`mx-1 px-2 py-1 rounded-md text-sm ${selectedStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                    selectedStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        selectedStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                }`}>
                                {selectedStatus}
                            </span>?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowReservationModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmStatusChange}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Confirm
                            </button>
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
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Restaurant Info */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Restaurant</h3>
          <p className="text-gray-900">{reservation?.restaurant?.name}</p>
        </div>

        {/* User Info */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Guest Information</h3>
          <p className="text-gray-900 font-medium">{reservation?.user?.name}</p>
          <p className="text-gray-600">{reservation?.user?.email}</p>
          <p className="text-gray-600 mt-1">Guests: {reservation?.numberOfGuests}</p>
        </div>

        {/* Reservation Timing */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Reservation Time</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-gray-900">
                {new Date(reservation?.reservationDate).toLocaleDateString('en-US', {
                  weekday: 'long',
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
        </div>

        {/* Table Info */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Table Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Table Number</p>
              <p className="text-gray-900">{reservation?.table?.tableNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="text-gray-900">{reservation?.table?.capacity} people</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Information</h3>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-gray-900">${(reservation?.payment?.amount / 100).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Method</p>
              <p className="text-gray-900 capitalize">
                {reservation?.payment?.paymentMethod?.replace('_', ' ')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-2 py-1 rounded-md text-xs ${
                reservation?.payment?.status === 'completed' ? 'bg-green-100 text-green-800' :
                reservation?.payment?.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {reservation?.payment?.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid On</p>
              <p className="text-gray-900">
                {new Date(reservation?.payment?.paymentDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Reservation Status */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Reservation Status</h3>
          <span className={`px-3 py-1 rounded-md text-sm font-medium ${
            reservation?.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
            reservation?.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {reservation?.status}
          </span>
          <p className="text-xs text-gray-500 mt-2">
            Created: {new Date(reservation?.createdAt).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            Last Updated: {new Date(reservation?.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => setDetailModel(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
        </div>
    );
};

export default ReservationManagement;