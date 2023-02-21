import React, { useEffect, useState } from "react";
import { StorageKey } from "../consts";
import { IClipboardData } from "../interfaces";
import { watch } from "../utils/shared-utils";

export default function NavigationLog() {
  const [logEntries, setLogEntries] = useState<IClipboardData[]>([]);

  useEffect(() => {
    watch(StorageKey.CLIPBOARD_LOG, ({ newValue = [] }) => {
      setLogEntries(newValue);
    });
  }, []);

  return (
    <>
      <div>
        <h1
          id="clipboard-log"
          className="border-b border-gray-500 font-semibold text-gray-700 text-2xl"
        >
          Clipboard Log
        </h1>
        <hr />
        <div
          className="grid grid-cols-2 gap-2"
          style={{ gridTemplateColumns: "auto 1fr" }}
        >
          {logEntries.map((x) => (
            <React.Fragment key={x.uuid}>
              <div>[{x.timestamp}]</div>
              <div>{x.text}</div>
              <div></div>
              <div>{x.url}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
