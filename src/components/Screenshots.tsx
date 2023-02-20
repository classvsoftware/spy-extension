import React, { useEffect, useState } from "react";
import { IScreenshotLogEntry } from "src/interfaces";
import { StorageKey } from "../consts";
import { watch } from "../utils/shared-utils";

export default function ScreenshotLog() {
  const [screenshotEntries, setScreenshotEntries] = useState<
    IScreenshotLogEntry[]
  >([]);

  useEffect(() => {
    watch(StorageKey.SCREENSHOT_LOG, ({ newValue = [] }) => {
      setScreenshotEntries(newValue);
    });
  }, []);

  return (
    <>
      <div>
        <h1
          id="screenshots"
          className="border-b border-gray-500 font-semibold text-gray-700 text-2xl"
        >
          Screenshots
        </h1>
        <hr />
        <div className="flex flex-col items-stretch gap-2">
          {screenshotEntries.map((x) => (
            <React.Fragment key={x.uuid}>
              <div>[{x.timestamp}]</div>
              <div>{x.url}</div>
              <img src={x.imageData} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
