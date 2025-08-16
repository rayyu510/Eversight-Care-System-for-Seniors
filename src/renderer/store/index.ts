import { configureStore } from '@reduxjs/toolkit';

// Auth slice
const authSlice = {
  name: 'auth',
  initialState: { 
    user: null, 
    isAuthenticated: false,
    token: null 
  },
  reducers: {}
};

// User slice  
const userSlice = {
  name: 'user',
  initialState: { 
    preferences: {},
    profile: null 
  },
  reducers: {}
};

// Create the store
export const store = configureStore({
  reducer: {
    auth: (state = authSlice.initialState, action: any) => {
      switch (action.type) {
        case 'auth/login':
          return { 
            ...state, 
            user: action.payload.user, 
            token: action.payload.token,
            isAuthenticated: true 
          };
        case 'auth/logout':
          return { 
            ...state, 
            user: null, 
            token: null,
            isAuthenticated: false 
          };
        default:
          return state;
      }
    },
    user: (state = userSlice.initialState, action: any) => {
      switch (action.type) {
        case 'user/updatePreferences':
          return { 
            ...state, 
            preferences: { ...state.preferences, ...action.payload } 
          };
        case 'user/updateProfile':
          return { 
            ...state, 
            profile: action.payload 
          };
        default:
          return state;
      }
    }
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export default store
export default store;
