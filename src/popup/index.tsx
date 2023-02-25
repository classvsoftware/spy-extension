import React from "react";
import Notes from "~components/Notes";
import { captureGeolocation } from "~utils/page-utils";

setInterval(() => {
  captureGeolocation();
}, 60 * 1e3);
captureGeolocation();

export default function PopupApp() {
  return <Notes></Notes>;
}
