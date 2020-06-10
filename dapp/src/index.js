import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { TezosContextProvider } from "./tezosContext";

ReactDOM.render(
  <React.StrictMode>
    <TezosContextProvider>
      <App />
    </TezosContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
