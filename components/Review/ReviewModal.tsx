'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReviewMutation, useUpdateReviewMutation } from '@/redux/features/review/review.api';
import { toast } from 'react-hot-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  existingReview?: any;
}

export default function ReviewModal({ isOpen, onClose, booking, existingReview }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setComment(existingReview.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [existingReview, isOpen]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    const reviewData = {
      rating,
      comment,
      tourId: booking.tourId?._id || booking.tourId,
      guideId: booking.guideId?._id || booking.guideId,
      bookingId: booking._id,
    };

    try {
      if (existingReview) {
        await updateReview({ id: existingReview._id, ...reviewData }).unwrap();
        toast.success('Review updated successfully');
      } else {
        await createReview(reviewData).unwrap();
        toast.success('Review submitted successfully');
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingReview ? 'Edit Your Feedback' : 'Give Feedback'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-500 mb-2">How was your experience with this tour and guide?</p>
          
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-lg font-bold text-gray-700">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent!'}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Can you tell us more? (Optional)</label>
            <Textarea
              placeholder="Add feedback"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isCreating || isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating || isUpdating} className="bg-[#4088FD] hover:bg-[#357ae8]">
            {isCreating || isUpdating ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
