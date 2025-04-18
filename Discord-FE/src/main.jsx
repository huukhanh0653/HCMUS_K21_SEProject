import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./redux/store";
import App from "./App";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import GraphQLProvider from "./services/ApolloProvider";

if (typeof global === "undefined") {
  window.global = window;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <GraphQLProvider>
        {/* ApolloProvider is used to provide the Apollo Client instance to the app */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
      </GraphQLProvider>
    </Provider>
  </StrictMode>
);
