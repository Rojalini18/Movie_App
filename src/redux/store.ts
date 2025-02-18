import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import {configureStore} from '@reduxjs/toolkit';
import shortlistedMoviesReducer from './shortlistedMovies';

const reduxPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const reduxPersistReducer = persistReducer(
  reduxPersistConfig,
  shortlistedMoviesReducer,
);

export const store = configureStore({
  reducer: {
    shortlistedMovies: reduxPersistReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
