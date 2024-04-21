import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import tokenReducer from "./tokenSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedTokenReducer = persistReducer(persistConfig, tokenReducer);

const store = configureStore({
  reducer: {
    token: persistedTokenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
