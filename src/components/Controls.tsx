import React from "react";
import { BackgroundMessage } from "../consts";
import { sendMessage, updateGeolocation } from "../utils/page-utils";
import { clear, writeLog } from "../utils/shared-utils";

export default function Controls() {
  const buttonClasses = `bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded`;

  return (
    <div className="p-8 sticky top-0 flex flex-row flex-wrap gap-8 w-full bg-white">
      <button
        className={buttonClasses}
        onClick={() => sendMessage(BackgroundMessage.OPEN_STEALTH_TAB)}
      >
        OPEN STEALTH TAB
      </button>
      <button className={buttonClasses} onClick={() => clear()}>
        RESET
      </button>
      <button className={buttonClasses} onClick={() => writeLog("Test log")}>
        TEST LOG
      </button>
      <button className={buttonClasses} onClick={() => updateGeolocation()}>
        CAPTURE GEOLOCATION
      </button>
      <button
        className={buttonClasses}
        onClick={() => sendMessage(BackgroundMessage.CAPTURE_VISIBLE_TAB)}
      >
        CAPTURE VISIBLE TAB
      </button>
    </div>
  );
}
