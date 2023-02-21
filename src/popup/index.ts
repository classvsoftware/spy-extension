import React from "react";
import ReactDOM from "react-dom/client";
import PopupApp from "../components/PopupApp";
import { updateGeolocation } from "../utils/page-utils";

ReactDOM.createRoot(document.getElementById("app")!).render(
  React.createElement(PopupApp)
);

setInterval(() => {
  updateGeolocation();
}, 60 * 1e3);
