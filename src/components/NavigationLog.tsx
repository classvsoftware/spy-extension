import React, { useEffect, useState } from "react";
import { StorageKey } from "../consts";
import { INavigationLogEntry } from "../interfaces";
import { watch } from "../utils/shared-utils";

export default function NavigationLog() {
  const [logEntries, setLogEntries] = useState<INavigationLogEntry[]>([]);

  useEffect(() => {
    watch(StorageKey.NAVIGATION_LOG, ({ newValue = [] }) => {
      setLogEntries(newValue);
    });
  }, []);

  return (
    <>
      <div>
        <h1 id="navigation-log" className="border-b border-gray-500 font-semibold text-gray-700 text-2xl">
          Navigation Log
        </h1>
        <hr />
        <div
          className="grid grid-cols-2 gap-2"
          style={{ gridTemplateColumns: "auto 1fr" }}
        >
          {logEntries.map((x) => (
            <React.Fragment key={x.uuid}>
              <div>[{x.timestamp}]</div>
              <div>{x.url.slice(0, 80)}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
