import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./Slices/userSlice";
import { personSlice } from "./Slices/personSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['users', 'persons'] // only users and persons will be persisted
};

const rootReducer = combineReducers({
  users: userSlice.reducer,
  persons: personSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);