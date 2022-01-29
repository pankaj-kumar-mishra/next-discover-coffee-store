import StoreProvider from "../store/store-context";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
};

export default MyApp;
