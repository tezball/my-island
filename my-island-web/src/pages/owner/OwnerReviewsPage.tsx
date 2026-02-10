import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/reviewService';
import type { Review } from '../../types/review';
import { StarDisplay } from '../../components/review/StarRating';

export const OwnerReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [respondingTo, setRespondingTo] = useState<string | null>(null);
    const [responseText, setResponseText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        setIsLoading(true);
        try {
            const data = await reviewService.getOwnerReviews();
            setReviews(data);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRespond = async (reviewId: string) => {
        if (!responseText.trim()) return;
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const updated = await reviewService.respondToReview(reviewId, responseText.trim());
            setReviews(prev => prev.map(r => r.id === reviewId ? updated : r));
            setRespondingTo(null);
            setResponseText('');
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit response');
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Guest Reviews</h1>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                            <StarDisplay rating={averageRating} size="sm" />
                            <span className="font-semibold text-[#111418] dark:text-white">{averageRating.toFixed(1)}</span>
                            <span className="text-gray-500 text-sm">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                        </div>
                    )}
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3">rate_review</span>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">No reviews yet</h3>
                    <p className="text-gray-500 text-sm">Reviews from your guests will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white dark:bg-[#1a2632] p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-[#111418] dark:text-white">{review.userName}</p>
                                        <span className="text-gray-400">·</span>
                                        <p className="text-sm text-gray-500">{review.lotName}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(review.createdAt)}</p>
                                </div>
                                <StarDisplay rating={review.rating} size="sm" />
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">{review.comment}</p>

                            {review.ownerResponse ? (
                                <div className="pl-4 border-l-2 border-primary bg-gray-50 dark:bg-gray-800/50 p-3 rounded-r-lg">
                                    <p className="text-xs font-semibold text-primary mb-1">Your Response</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{review.ownerResponse}</p>
                                    {review.ownerResponseAt && (
                                        <p className="text-xs text-gray-400 mt-1">Responded on {formatDate(review.ownerResponseAt)}</p>
                                    )}
                                </div>
                            ) : respondingTo === review.id ? (
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <textarea
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        placeholder="Write your reply to this guest..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm resize-none mb-2"
                                        maxLength={2000}
                                    />
                                    {submitError && <p className="text-sm text-red-600 mb-2">{submitError}</p>}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRespond(review.id)}
                                            disabled={isSubmitting || !responseText.trim()}
                                            className="bg-primary hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send Reply'}
                                        </button>
                                        <button
                                            onClick={() => { setRespondingTo(null); setResponseText(''); setSubmitError(null); }}
                                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setRespondingTo(review.id)}
                                    className="text-primary hover:text-emerald-600 text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">reply</span>
                                    Reply
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
