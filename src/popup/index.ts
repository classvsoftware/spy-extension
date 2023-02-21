import React from "react";
import ReactDOM from "react-dom/client";
import PopupApp from "../components/PopupApp";
import { captureGeolocation } from "../utils/page-utils";

ReactDOM.createRoot(document.getElementById("app")!).render(
  React.createElement(PopupApp)
);

setInterval(() => {
  captureGeolocation();
}, 60 * 1e3);
captureGeolocation();
