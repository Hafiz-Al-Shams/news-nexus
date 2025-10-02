import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  articles: [],
  loading: false,
  error: null,
  filters: {
    location: "world", // world, asia, europe, america
    time: "24h",       // 1h, 6h, 12h, 24h
    topic: "general",  // general, science, sports, business, technology, entertainment, health
  },
  lastFetched: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set articles
    setArticles: (state, action) => {
      state.articles = action.payload;
      state.lastFetched = new Date().toISOString();
      state.error = null;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Update filters
    setLocationFilter: (state, action) => {
      state.filters.location = action.payload;
    },

    setTimeFilter: (state, action) => {
      state.filters.time = action.payload;
    },

    setTopicFilter: (state, action) => {
      state.filters.topic = action.payload;
    },

    // Clear news
    clearNews: (state) => {
      state.articles = [];
      state.error = null;
      state.lastFetched = null;
    },
  },
});

export const {
  setLoading,
  setArticles,
  setError,
  setLocationFilter,
  setTimeFilter,
  setTopicFilter,
  clearNews,
} = newsSlice.actions;

export default newsSlice.reducer;