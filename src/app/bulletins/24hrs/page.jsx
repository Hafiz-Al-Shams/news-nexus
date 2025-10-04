"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetch24hrsBulletin, expandBulletinDetails } from "@/store/slices/newsSlice";
import toast from "react-hot-toast";

export default function Bulletin24HrsPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const { bulletin } = useSelector((state) => state.news);
    const [showDetails, setShowDetails] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        dispatch(fetch24hrsBulletin());
    }, [dispatch]);

    const handleShowDetails = async () => {
        if (bulletin.detailedCards.length > 0) {
            setShowDetails(true);
            return;
        }

        try {
            await dispatch(expandBulletinDetails(bulletin.bullets)).unwrap();
            setShowDetails(true);
            toast.success("Detailed cards generated!");
        } catch (error) {
            toast.error(error.message || "Failed to generate details");
        }
    };

    const handleBackToBullets = () => {
        setShowDetails(false);
    };

    const handleReviewSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setSubmittingReview(true);

        try {
            const response = await fetch("/api/reviews/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating,
                    comment: comment.trim(),
                    reviewType: 'bulletin_details'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit review");
            }

            toast.success("Thank you for your feedback!");
            setShowReview(false);
            setRating(0);
            setComment("");
        } catch (err) {
            console.error("Review error:", err);
            toast.error(err.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Home</span>
                        </button>

                        <h1 className="text-xl font-bold text-gray-800">24hrs News Bulletin</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Loading State */}
                {bulletin.loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="inline-block w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 text-lg">
                            {showDetails ? 'Generating detailed cards...' : 'Loading bulletin...'}
                        </p>
                    </div>
                )}

                {/* Error State */}
                {bulletin.error && !bulletin.loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Bulletin</h3>
                        <p className="text-red-600 mb-4">{bulletin.error}</p>
                        <button
                            onClick={() => dispatch(fetch24hrsBulletin())}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Bulletin Content */}
                {!bulletin.loading && !bulletin.error && bulletin.bullets.length > 0 && (
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-8 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <div>
                                    <h2 className="text-3xl font-bold">Top 12 News Stories</h2>
                                    <p className="text-amber-100">Past 24 Hours - AI Prioritized</p>
                                </div>
                            </div>
                            {bulletin.cachedAt && (
                                <p className="text-sm text-amber-100">
                                    Last updated: {new Date(bulletin.cachedAt).toLocaleString()}
                                </p>
                            )}
                        </div>

                        {/* Toggle View Button */}
                        {!showDetails && (
                            <div className="flex justify-center">
                                <button
                                    onClick={handleShowDetails}
                                    disabled={bulletin.loading}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center gap-3"
                                >
                                    {bulletin.loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Show Detailed Cards
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Bullet Points View */}
                        {!showDetails && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                                    Quick Summary
                                </h3>
                                <div className="space-y-4">
                                    {bulletin.bullets.map((bullet, index) => (
                                        <div key={index} className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-700 leading-relaxed">{bullet}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Detailed Cards View */}
                        {showDetails && bulletin.detailedCards.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold text-gray-800">Detailed Stories</h3>
                                    <button
                                        onClick={handleBackToBullets}
                                        className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to Bullets
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {bulletin.detailedCards.map((card, index) => (
                                        <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                                            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3">
                                                <span className="text-sm font-semibold">Story #{index + 1}</span>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="text-xl font-bold text-gray-800 mb-3">{card.title}</h4>
                                                <p className="text-gray-600 leading-relaxed">{card.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Review Section After Details */}
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                                    {!showReview ? (
                                        <div className="text-center">
                                            <h4 className="text-xl font-bold text-gray-800 mb-2">How was this feature?</h4>
                                            <p className="text-gray-600 mb-4">Your feedback helps us improve</p>
                                            <button
                                                onClick={() => setShowReview(true)}
                                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
                                            >
                                                Leave a Review
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-gray-800">Leave a Review</h4>

                                            {/* Rating */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rating (1-5)
                                                </label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((num) => (
                                                        <button
                                                            key={num}
                                                            onClick={() => setRating(num)}
                                                            className={`w-12 h-12 rounded-lg font-bold transition-all ${rating >= num
                                                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110"
                                                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                                                }`}
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Comment */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Comment (Optional)
                                                </label>
                                                <textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Share your thoughts..."
                                                    rows={3}
                                                    maxLength={500}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {comment.length}/500 characters
                                                </p>
                                            </div>

                                            {/* Submit Buttons */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleReviewSubmit}
                                                    disabled={submittingReview || rating === 0}
                                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                                                >
                                                    {submittingReview ? "Submitting..." : "Submit Review"}
                                                </button>
                                                <button
                                                    onClick={() => setShowReview(false)}
                                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!bulletin.loading && !bulletin.error && bulletin.bullets.length === 0 && (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bulletin Available</h3>
                        <p className="text-gray-500 mb-4">The bulletin is being generated. Please check back in a moment.</p>
                    </div>
                )}
            </main>
        </div>
    );
}