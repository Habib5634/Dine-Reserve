'use client'
import { useState } from 'react';
import axios from 'axios';
import { FaStar, FaTimes } from 'react-icons/fa';
import { API_URL, getAuthHeaders } from '@/app/utils/apiUrl';

const ReviewForm = ({ reservation, onClose, onSubmitSuccess }) => {
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
    hoverRating: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (rating) => {
    setReviewForm({ ...reviewForm, rating });
  };

  const handleHoverRating = (rating) => {
    setReviewForm({ ...reviewForm, hoverRating: rating });
  };

  const handleCommentChange = (e) => {
    setReviewForm({ ...reviewForm, comment: e.target.value });
  };

  const submitReview = async () => {
    if (reviewForm.rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await axios.post(
        `${API_URL}/rest/review/${reservation?.restaurant?._id}`,
        {
          restaurantId: reservation.restaurant._id,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        },
        getAuthHeaders()
      );

      console.log(response);
      onSubmitSuccess(response.data.review);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Review {reservation?.restaurant?.name}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <FaTimes />
              </button>
            </div>
            
            <div className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-2xl focus:outline-none"
                      onClick={() => handleRatingChange(star)}
                      onMouseEnter={() => handleHoverRating(star)}
                      onMouseLeave={() => handleHoverRating(0)}
                    >
                      <FaStar
                        className={
                          star <= (reviewForm.hoverRating || reviewForm.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review (Optional)
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={handleCommentChange}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {reviewForm.comment.length}/500 characters
                </p>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={submitReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default ReviewForm
