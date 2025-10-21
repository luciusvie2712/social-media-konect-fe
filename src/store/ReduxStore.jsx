import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, createStore } from "redux";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { thunk } from "redux-thunk";
import rootReducer from "./Reducer/RootReducer";

const persisConfig = {
  key: "root",
  stateReconciler: autoMergeLevel2,
  storage: storage,
};
const persistedReducer = persistReducer(persisConfig, rootReducer);
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
let persistor = persistStore(store);
export { store, persistor };
export default store;
