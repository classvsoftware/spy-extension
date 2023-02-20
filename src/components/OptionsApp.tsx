import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Controls from "./Controls";
import Geolocation from "./Geolocation";
import Log from "./Log";

const router = createHashRouter([
  {
    path: "/",
    element: <Geolocation></Geolocation>,
  },
]);

export default function OptionsApp() {
  return (
    <div>
      <Controls></Controls>
      <div className="grid gap-12 grid-cols-3 p-8">
        <div className="col-span-2">
          <RouterProvider router={router}></RouterProvider>
        </div>
        <Log></Log>
      </div>
    </div>
  );
}
