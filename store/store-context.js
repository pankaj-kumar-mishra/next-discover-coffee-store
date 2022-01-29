import { createContext, useReducer } from "react";

export const StoreContext = createContext();

export const storeActionTypes = {
  SET_LAT_LNG: "SET_LAT_LNG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case storeActionTypes.SET_LAT_LNG:
      return { ...state, latLng: action.payload };

    case storeActionTypes.SET_COFFEE_STORES:
      return { ...state, coffeeStores: action.payload };

    default:
      throw new Error(`Unhandled action type ${action.type}`);
  }
};

const storeInitialState = {
  latLng: "",
  coffeeStores: [],
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, storeInitialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
