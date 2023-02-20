import React from "react";
import { createHashRouter } from "react-router-dom";
import Controls from "./Controls";
import Geolocation from "./Geolocation";
import KeyLog from "./Keylog";
import Log from "./Log";
import NavigationLog from "./NavigationLog";
import ScreenshotLog from "./Screenshots";

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
        {/* <div className="col-span-2">
          <RouterProvider router={router}></RouterProvider>
        </div> */}
        <div className="col-span-2 flex flex-col items-stretch gap-12">
          <Geolocation></Geolocation>
          <NavigationLog></NavigationLog>
          <KeyLog></KeyLog>
          <ScreenshotLog></ScreenshotLog>
        </div>

        <Log></Log>
      </div>
    </div>
  );
}
