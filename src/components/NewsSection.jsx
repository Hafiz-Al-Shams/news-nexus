"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchNewsAPIArticles,
  fetchGuardianArticles,
  setActiveSource,
} from "@/store/slices/newsSlice";
import NewsFilters from "./NewsFilters";
import NewsCard from "./NewsCard";
import toast from "react-hot-toast";

export default function NewsSection() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { 
    articles, 
    guardianArticles,
    loading, 
    guardianLoading,
    error,
    guardianError,
    filters,
    activeSource 
  } = useSelector((state) => state.news);
  
  const [hasFetchedNewsAPI, setHasFetchedNewsAPI] = useState(false);
  const [hasFetchedGuardian, setHasFetchedGuardian] = useState(false);

  // Navigate to bulletin page
  const handleBulletinClick = () => {
    router.push('/bulletins/24hrs');
  };

  // Fetch NewsAPI articles
  const fetchNewsAPINews = async () => {
    try {
      const result = await dispatch(fetchNewsAPIArticles(filters)).unwrap();
      setHasFetchedNewsAPI(true);
      dispatch(setActiveSource('newsapi'));
      
      if (result.articles && result.articles.length > 0) {
        toast.success(`Loaded ${result.articles.length} articles from NewsAPI`);
      } else {
        toast.error("No articles found from NewsAPI");
      }
    } catch (error) {
      console.error("NewsAPI fetch error:", error);
      setHasFetchedNewsAPI(true);
      
      if (error.message?.includes("Unauthorized")) {
        toast.error("Please login to view news");
      } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
        toast.error("NewsAPI rate limit exceeded. Try again tomorrow.");
      } else {
        toast.error(error.message || "Failed to load NewsAPI articles");
      }
    }
  };

  // Fetch Guardian articles
  const fetchGuardianNews = async () => {
    try {
      const result = await dispatch(fetchGuardianArticles(filters)).unwrap();
      setHasFetchedGuardian(true);
      dispatch(setActiveSource('guardian'));
      
      if (result.articles && result.articles.length > 0) {
        toast.success(`Loaded ${result.articles.length} articles from Guardian`);
      } else {
        toast.error("No articles found from Guardian");
      }
    } catch (error) {
      console.error("Guardian fetch error:", error);
      setHasFetchedGuardian(true);
      
      if (error.message?.includes("Unauthorized")) {
        toast.error("Please login to view news");
      } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
        toast.error("Guardian API rate limit exceeded. Try again tomorrow.");
      } else {
        toast.error(error.message || "Failed to load Guardian articles");
      }
    }
  };

  const getCurrentArticles = () => {
    if (activeSource === 'guardian') return guardianArticles;
    return articles;
  };

  const getCurrentLoading = () => {
    if (activeSource === 'guardian') return guardianLoading;
    return loading;
  };

  const getCurrentError = () => {
    if (activeSource === 'guardian') return guardianError;
    return error;
  };

  const currentArticles = getCurrentArticles();
  const currentLoading = getCurrentLoading();
  const currentError = getCurrentError();
  const hasFetched = activeSource === 'guardian' ? hasFetchedGuardian : hasFetchedNewsAPI;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Latest News from Around the World
        </h1>
        <p className="text-gray-600">
          AI-powered Smart News Summaries for Busy Minds
        </p>
      </div>

      {/* Filters */}
      <NewsFilters
        currentTime={filters.time}
        currentTopic={filters.topic}
        onTimeChange={(time) => dispatch({ type: 'news/setTimeFilter', payload: time })}
        onTopicChange={(topic) => dispatch({ type: 'news/setTopicFilter', payload: topic })}
      />

      {/* Action Buttons Section */}
      <div className="space-y-4">
        {/* 24hrs Bulletin Button - Featured */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center sm:justify-start gap-2">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI-Generated 24hrs News Bulletin
              </h3>
              <p className="text-gray-600 text-sm">
                Get the top 12 most important news stories from the past 24 hours, prioritized and summarized by AI
              </p>
            </div>
            <button
              onClick={handleBulletinClick}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center justify-center gap-3 whitespace-nowrap"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              View Bulletin
            </button>
          </div>
        </div>

        {/* Regular News Fetch Button */}
        <div className="flex justify-center">
          <button
            onClick={fetchGuardianNews}
            disabled={guardianLoading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center justify-center gap-3 min-w-[240px]"
          >
            {guardianLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Get The News
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Source Indicator */}
      {hasFetched && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm">
            <span className="text-gray-600">Showing news from:</span>
            <span className={`font-semibold ${activeSource === 'guardian' ? 'text-purple-600' : 'text-blue-600'}`}>
              {activeSource === 'guardian' ? 'The Guardian' : 'NewsAPI'}
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {currentLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading news from {activeSource === 'guardian' ? 'Guardian' : 'NewsAPI'}...</p>
        </div>
      )}

      {/* Error State */}
      {currentError && !currentLoading && hasFetched && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load News</h3>
          <p className="text-red-600 mb-4">{currentError}</p>
          <button
            onClick={activeSource === 'guardian' ? fetchGuardianNews : fetchNewsAPINews}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* News Grid */}
      {!currentLoading && !currentError && currentArticles.length > 0 && hasFetched && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{currentArticles.length}</span> articles
            </p>
            <button
              onClick={activeSource === 'guardian' ? fetchGuardianNews : fetchNewsAPINews}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArticles.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!currentLoading && !currentError && currentArticles.length === 0 && hasFetched && (
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No News Found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or check back later</p>
          <button
            onClick={activeSource === 'guardian' ? fetchGuardianNews : fetchNewsAPINews}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh News
          </button>
        </div>
      )}
    </div>
  );
}