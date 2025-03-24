'use client'
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const ReservationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('table');
  const [selectedTable, setSelectedTable] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const tables = [
    { id: 1, type: '2-chair table', price: '$20' },
    { id: 2, type: '4-chair table', price: '$35' },
    { id: 3, type: '6-chair table', price: '$50' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('success');
    // Here you would typically send data to your backend
  };

  const resetForm = () => {
    setStep('table');
    setSelectedTable(null);
    setDate('');
    setTime('');
    setPayment({
      cardNumber: '',
      expiry: '',
      cvv: '',
      name: ''
    });
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
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
                      {tables.map((table) => (
                        <option key={table.id} value={table.type}>
                          {table.type} - {table.price}
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
                    <p>Date: {new Date(date).toLocaleDateString()}</p>
                    <p>Time: {time}</p>
                    <p className="font-bold mt-2">
                      Total: {tables.find(t => t.type === selectedTable)?.price}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={payment.name}
                      onChange={(e) => setPayment({...payment, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({...payment, cardNumber: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={payment.expiry}
                        onChange={(e) => setPayment({...payment, expiry: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={payment.cvv}
                        onChange={(e) => setPayment({...payment, cvv: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
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
                disabled={!selectedTable || !date || !time}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                  !selectedTable || !date || !time ? 'bg-gray-400' : 'bg-redish hover:bg-red-700'
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
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                    !payment.cardNumber || !payment.expiry || !payment.cvv || !payment.name 
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