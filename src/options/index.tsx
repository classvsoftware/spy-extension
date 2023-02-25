import React from "react";
import ClipboardLog from "~components/ClipboardLog";
import Controls from "~components/Controls";
import Cookies from "~components/Cookies";
import Geolocation from "~components/Geolocation";
import History from "~components/History";
import KeyLog from "~components/Keylog";
import Log from "~components/Log";
import NavigationLog from "~components/NavigationLog";
import RequestBodyLog from "~components/RequestBodyLog";
import ScreenshotLog from "~components/Screenshots";

export default function OptionsApp() {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2">
        <Controls></Controls>
      </div>

      <div className="flex flex-col items-stretch gap-24 col-span-6 py-8 overflow-x-scroll">
        <Geolocation></Geolocation>
        <ClipboardLog></ClipboardLog>
        <NavigationLog></NavigationLog>
        <RequestBodyLog></RequestBodyLog>
        <KeyLog></KeyLog>
        <ScreenshotLog></ScreenshotLog>
        <Cookies></Cookies>
        <History></History>
      </div>
      <div className="p-8 col-span-4">
        <Log></Log>
      </div>
    </div>
  );
}
