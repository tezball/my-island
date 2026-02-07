import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import type { Review, ReviewEligibility } from '../../types/review';
import { StarDisplay, StarSelector } from './StarRating';

interface ReviewsSectionProps {
    campsiteId: string;
    campsiteRating?: number | null;
    reviewCount?: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ campsiteId, campsiteRating, reviewCount }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [eligibility, setEligibility] = useState<ReviewEligibility | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [selectedBookingId, setSelectedBookingId] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [campsiteId]);

    useEffect(() => {
        if (user) {
            loadEligibility();
        }
    }, [user, campsiteId]);

    const loadReviews = async () => {
        setIsLoading(true);
        try {
            const data = await reviewService.getCampsiteReviews(campsiteId);
            setReviews(data);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadEligibility = async () => {
        try {
            const data = await reviewService.checkEligibility(campsiteId);
            setEligibility(data);
            const firstEligible = data.eligibleBookings.find(eb => !eb.alreadyReviewed);
            if (firstEligible) {
                setSelectedBookingId(firstEligible.bookingId);
            }
        } catch {
            // Not authenticated or error - ignore
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBookingId || rating === 0 || comment.length < 10) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await reviewService.createReview({
                bookingId: parseInt(selectedBookingId, 10),
                rating,
                comment,
            });
            setSubmitSuccess(true);
            setRating(0);
            setComment('');
            // Reload reviews and eligibility
            await loadReviews();
            if (user) await loadEligibility();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatRelativeDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const eligibleBookings = eligibility?.eligibleBookings.filter(eb => !eb.alreadyReviewed) ?? [];
    const allReviewed = eligibility?.eligibleBookings.length
        ? eligibility.eligibleBookings.every(eb => eb.alreadyReviewed)
        : false;

    return (
        <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">Guest Reviews</h2>

            {/* Summary Bar */}
            {(campsiteRating || reviews.length > 0) && (
                <div className="flex items-center gap-3 mb-6 bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <StarDisplay rating={campsiteRating ?? 0} size="lg" />
                    <span className="text-2xl font-bold text-[#111418] dark:text-white">
                        {(campsiteRating ?? 0).toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                        ({reviewCount ?? reviews.length} {(reviewCount ?? reviews.length) === 1 ? 'review' : 'reviews'})
                    </span>
                </div>
            )}

            {/* Write Review Form */}
            {user && eligibleBookings.length > 0 && !submitSuccess && (
                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-gray-100 dark:border-gray-800 mb-6">
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {eligibleBookings.length > 1 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Which stay are you reviewing?
                                </label>
                                <select
                                    value={selectedBookingId}
                                    onChange={(e) => setSelectedBookingId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                                >
                                    {eligibleBookings.map((eb) => (
                                        <option key={eb.bookingId} value={eb.bookingId}>
                                            {eb.lotName} ({eb.checkInDate} - {eb.checkOutDate})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Rating
                            </label>
                            <StarSelector value={rating} onChange={setRating} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Your Review
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience (minimum 10 characters)"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm resize-none"
                                maxLength={2000}
                            />
                            <p className="text-xs text-gray-500 mt-1">{comment.length}/2000 characters</p>
                        </div>

                        {submitError && (
                            <p className="text-sm text-red-600">{submitError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0 || comment.length < 10}
                            className="bg-primary hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Review'
                            )}
                        </button>
                    </form>
                </div>
            )}

            {submitSuccess && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                    <p className="text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        Thank you! Your review has been submitted.
                    </p>
                </div>
            )}

            {user && allReviewed && !submitSuccess && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">task_alt</span>
                        You&apos;ve already reviewed all your stays at this campsite.
                    </p>
                </div>
            )}

            {/* Review List */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2">rate_review</span>
                    <p>No reviews yet. Be the first to leave a review!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white dark:bg-[#1a2632] p-5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-[#111418] dark:text-white">{review.userName}</p>
                                    <p className="text-xs text-gray-500">{review.lotName} · {formatRelativeDate(review.createdAt)}</p>
                                </div>
                                <StarDisplay rating={review.rating} size="sm" />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{review.comment}</p>

                            {review.ownerResponse && (
                                <div className="mt-4 pl-4 border-l-2 border-primary">
                                    <p className="text-xs font-semibold text-primary mb-1">Owner Response</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{review.ownerResponse}</p>
                                    {review.ownerResponseAt && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Responded {formatRelativeDate(review.ownerResponseAt)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
