"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setArticles,
  setError,
  setLocationFilter,
  setTimeFilter,
  setTopicFilter,
} from "@/store/slices/newsSlice";
import NewsFilters from "./NewsFilters";
import NewsCard from "./NewsCard";
import toast from "react-hot-toast";

export default function NewsSection() {
  const dispatch = useDispatch();
  const { articles, loading, error, filters } = useSelector(
    (state) => state.news
  );
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch news from API
  const fetchNews = async () => {
    dispatch(setLoading(true));
    setHasFetched(true);

    try {
      const response = await fetch(
        `/api/news?location=${filters.location}&time=${filters.time}&topic=${filters.topic}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch news");
      }

      const data = await response.json();

      if (data.success && data.articles) {
        dispatch(setArticles(data.articles));

        if (data.articles.length === 0) {
          toast.error("No news found for selected filters");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("News fetch error:", error);
      dispatch(setError(error.message));

      if (error.message.includes("Unauthorized")) {
        toast.error("Please login to view news");
      } else {
        toast.error(error.message || "Failed to load news");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle filter changes
  const handleLocationChange = (location) => {
    dispatch(setLocationFilter(location));
  };

  const handleTimeChange = (time) => {
    dispatch(setTimeFilter(time));
  };

  const handleTopicChange = (topic) => {
    dispatch(setTopicFilter(topic));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Latest News
        </h1>
        <p className="text-gray-600">
          AI-powered Smart News Summaries for Busy Minds
        </p>
      </div>

      {/* Filters */}
      <NewsFilters
        currentLocation={filters.location}
        currentTime={filters.time}
        currentTopic={filters.topic}
        onLocationChange={handleLocationChange}
        onTimeChange={handleTimeChange}
        onTopicChange={handleTopicChange}
      />

      {/* Get The News Button - Show only if not fetched yet */}
      {!hasFetched && (
        <div className="flex justify-center py-8">
          <button
            onClick={fetchNews}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center gap-3"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            Get The News
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading news...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && hasFetched && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to Load News
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* News Grid */}
      {!loading && !error && articles.length > 0 && hasFetched && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{articles.length}</span>{" "}
              articles
            </p>
            <button
              onClick={fetchNews}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && articles.length === 0 && hasFetched && (
        <div className="text-center py-20">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No News Found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filters or check back later
          </p>
          <button
            onClick={fetchNews}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh News
          </button>
        </div>
      )}
    </div>
  );
}
