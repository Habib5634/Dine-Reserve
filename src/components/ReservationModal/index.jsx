'use client'
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const ReservationModal = ({ isOpen, onClose, restaurant }) => {
  const [step, setStep] = useState('table');
  const [selectedTable, setSelectedTable] = useState(null);
  const [reservationDate, setReservationDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [errors, setErrors] = useState({});

const router = useRouter()

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();

    // Validate reservation date
    if (!reservationDate) {
      newErrors.reservationDate = 'Reservation date is required';
    } else {
      const selectedDate = new Date(reservationDate);
      if (selectedDate < now.setHours(0, 0, 0, 0)) {
        newErrors.reservationDate = 'Reservation date must be in the future';
      }
    }

    // Validate time
    if (!startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!endTime) {
      newErrors.endTime = 'End time is required';
    }
    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    // Validate card number
    if (!payment.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (payment.cardNumber.length !== 16 || !/^\d+$/.test(payment.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number (must be 16 digits)';
    }

    // Validate expiry date
    if (!payment.expiry) {
      newErrors.expiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) {
      newErrors.expiry = 'Invalid format (MM/YY)';
    } else {
      const [month, year] = payment.expiry.split('/');
      const expiryDate = new Date(`20${year}`, month - 1);
      const currentDate = new Date();
      if (expiryDate < currentDate) {
        newErrors.expiry = 'Card has expired';
      }
    }

    // Validate CVV
    if (!payment.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (payment.cvv.length !== 3 || !/^\d+$/.test(payment.cvv)) {
      newErrors.cvv = 'Invalid CVV (must be 3 digits)';
    }

    // Validate name
    if (!payment.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 4) {
      value = value.substring(0, 4);
    }

    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }

    setPayment({ ...payment, expiry: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      reservationDate,
      startTime,
      endTime,
      tableId:selectedTable,
      payment,
      paymentMethod:"credit_card"
    };
    try {
      const response = await axios.post(`${API_URL}/rest/reserve`,payload,getAuthHeaders())
      console.log(response)
      if(response.status === 201){
        console.log(payload);
        setStep('success');
      }
    } catch (error) {
      console.log(error)
    }

  };

  const resetForm = () => {
    setStep('table');
    setSelectedTable(null);
    setReservationDate('');
    setStartTime('');
    setEndTime('');
    setPayment({
      cardNumber: '',
      expiry: '',
      cvv: '',
      name: ''
    });
    setErrors({});
    router.push('/my-reservations')
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 transition-opacity"></div>

      {/* Modal container */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>

          {/* Modal content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {step === 'table' && (
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Reserve Your Table</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Date</label>
                    <input
                      type="date"
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.reservationDate && <div className="error text-red-500">{errors.reservationDate}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                     
                    />
                    {errors.startTime && <div className="error text-red-500">{errors.startTime}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                      min={startTime}
                    />
                    {errors.endTime && <div className="error text-red-500">{errors.endTime}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Table Type</label>
                    <select
                      value={selectedTable || ''}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a table</option>
                      {restaurant?.tables?.map((table) => (
                        <option key={table._id} value={table._id}>
                          {table.capacity}-chair table - ${table.pricePerHour}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">Reservation Details:</p>
                    <p>Table: {selectedTable}</p>
                    <p>Date: {new Date(reservationDate).toLocaleDateString()}</p>
                    <p>Start Time: {startTime}</p>
                    <p>End Time: {endTime}</p>
                    <p className="font-bold mt-2">
                      Total: {restaurant?.tables?.find(t => t._id === selectedTable)?.price}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={payment.name}
                      onChange={(e) => setPayment({ ...payment, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    {errors.name && <div className="error text-red-500">{errors.name}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={payment.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').substring(0, 16);
                        setPayment({...payment, cardNumber: value});
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    {errors.cardNumber && <div className="error text-red-500">{errors.cardNumber}</div>}

                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={payment.expiry}
                        onChange={handleExpiryChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                      {errors.expiry && <div className="error text-red-500">{errors.expiry}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={payment.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').substring(0, 3);
                          setPayment({...payment, cvv: value});
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                      {errors.cvv && <div className="error text-red-500">{errors.cvv}</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  Reservation Confirmed!
                </h3>
                <p className="text-sm text-gray-500">
                  Your table has been successfully reserved.
                </p>
              </div>
            )}
          </div>

          {/* Modal footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step === 'table' && (
              <button
                onClick={() => setStep('payment')}
                disabled={!selectedTable || !reservationDate || !startTime || !endTime}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${!selectedTable || !reservationDate || !startTime || !endTime ? 'bg-gray-400' : 'bg-redish hover:bg-red-700'
                  }`}
              >
                Continue to Payment
              </button>
            )}

            {step === 'payment' && (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={!payment.cardNumber || !payment.expiry || !payment.cvv || !payment.name}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${!payment.cardNumber || !payment.expiry || !payment.cvv || !payment.name
                      ? 'bg-gray-400'
                      : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  Confirm Payment
                </button>
                <button
                  onClick={() => setStep('table')}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Back
                </button>
              </>
            )}

            {step === 'success' && (
              <button
                onClick={resetForm}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-redish text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;