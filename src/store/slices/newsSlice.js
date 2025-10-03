// src/store/slices/newsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  // NewsAPI data
  articles: [],
  loading: false,
  error: null,
  
  // Guardian API data
  guardianArticles: [],
  guardianLoading: false,
  guardianError: null,
  
  // Combined view
  combinedArticles: [],
  
  // Filters
  filters: {
    time: "24h",    // 1h, 24h, 3d, 7d
    topic: "all",   // all, politics, business, technology, environment, sport, health, science, education, books, travel
  },
  
  // Active news source
  activeSource: "guardian",
  
  lastFetched: null,
  guardianLastFetched: null,
};

// Async thunk for fetching NewsAPI articles
export const fetchNewsAPIArticles = createAsyncThunk(
  'news/fetchNewsAPI',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        time: filters.time || '24h',
        topic: filters.topic || 'all'
      });
      
      const response = await fetch(`/api/news?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

// Async thunk for fetching Guardian articles
export const fetchGuardianArticles = createAsyncThunk(
  'news/fetchGuardian',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        time: filters.time || '24h',
        topic: filters.topic || 'all'
      });
      
      const response = await fetch(`/api/guardian?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue({ error: error.message });
    }
  }
);

// Async thunk for fetching both sources
export const fetchCombinedArticles = createAsyncThunk(
  'news/fetchCombined',
  async (filters, { dispatch }) => {
    const [newsAPIResult, guardianResult] = await Promise.allSettled([
      dispatch(fetchNewsAPIArticles(filters)).unwrap(),
      dispatch(fetchGuardianArticles(filters)).unwrap()
    ]);
    
    return {
      newsAPI: newsAPIResult.status === 'fulfilled' ? newsAPIResult.value : null,
      guardian: guardianResult.status === 'fulfilled' ? guardianResult.value : null
    };
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set articles (NewsAPI)
    setArticles: (state, action) => {
      state.articles = action.payload;
      state.lastFetched = new Date().toISOString();
      state.error = null;
    },
    
    // Set Guardian articles
    setGuardianArticles: (state, action) => {
      state.guardianArticles = action.payload;
      state.guardianLastFetched = new Date().toISOString();
      state.guardianError = null;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Set Guardian error
    setGuardianError: (state, action) => {
      state.guardianError = action.payload;
      state.guardianLoading = false;
    },

    // Update filters
    setTimeFilter: (state, action) => {
      state.filters.time = action.payload;
    },

    setTopicFilter: (state, action) => {
      state.filters.topic = action.payload;
    },
    
    // Set active source
    setActiveSource: (state, action) => {
      state.activeSource = action.payload;
      
      // Update combined articles based on active source
      if (action.payload === 'combined') {
        state.combinedArticles = [
          ...state.articles,
          ...state.guardianArticles
        ].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      }
    },

    // Clear news
    clearNews: (state) => {
      state.articles = [];
      state.guardianArticles = [];
      state.combinedArticles = [];
      state.error = null;
      state.guardianError = null;
      state.lastFetched = null;
      state.guardianLastFetched = null;
    },
  },
  
  extraReducers: (builder) => {
    // NewsAPI reducers
    builder
      .addCase(fetchNewsAPIArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsAPIArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles || [];
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchNewsAPIArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch NewsAPI articles';
      });
    
    // Guardian reducers
    builder
      .addCase(fetchGuardianArticles.pending, (state) => {
        state.guardianLoading = true;
        state.guardianError = null;
      })
      .addCase(fetchGuardianArticles.fulfilled, (state, action) => {
        state.guardianLoading = false;
        state.guardianArticles = action.payload.articles || [];
        state.guardianLastFetched = new Date().toISOString();
        state.guardianError = null;
      })
      .addCase(fetchGuardianArticles.rejected, (state, action) => {
        state.guardianLoading = false;
        state.guardianError = action.payload?.message || 'Failed to fetch Guardian articles';
      });
    
    // Combined reducers
    builder
      .addCase(fetchCombinedArticles.pending, (state) => {
        state.loading = true;
        state.guardianLoading = true;
      })
      .addCase(fetchCombinedArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.guardianLoading = false;
        
        const { newsAPI, guardian } = action.payload;
        
        if (newsAPI) {
          state.articles = newsAPI.articles || [];
        }
        if (guardian) {
          state.guardianArticles = guardian.articles || [];
        }
        
        // Combine and sort articles
        state.combinedArticles = [
          ...state.articles,
          ...state.guardianArticles
        ].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      })
      .addCase(fetchCombinedArticles.rejected, (state) => {
        state.loading = false;
        state.guardianLoading = false;
      });
  }
});

export const {
  setLoading,
  setArticles,
  setGuardianArticles,
  setError,
  setGuardianError,
  setTimeFilter,
  setTopicFilter,
  setActiveSource,
  clearNews,
} = newsSlice.actions;

export default newsSlice.reducer;