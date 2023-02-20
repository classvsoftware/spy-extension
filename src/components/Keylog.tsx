import React, { useEffect, useState } from "react";
import { StorageKey } from "../consts";
import { IKeylogEntry, ILogEntry } from "../interfaces";
import { watch } from "../utils/shared-utils";

export default function Log() {
  const [logEntries, setLogEntries] = useState<IKeylogEntry[]>([]);

  useEffect(() => {
    watch(
      StorageKey.KEYLOG,
      ({ newValue = [] }) => {
        setLogEntries(newValue);
      },
      { initialCheck: true }
    );
  }, []);

  return (
    <>
      <div>
        <h1 className="border-b border-gray-500 font-semibold text-gray-700 text-2xl">
          Keylog
        </h1>
        <hr />
        <div
          className="grid grid-cols-2 gap-2"
          style={{ gridTemplateColumns: "auto 1fr" }}
        >
          {logEntries.map((x) => (
            <>
              <div key={x.timestamp}>[{x.timestamp}]</div>
              <div key={x.timestamp + x.message}>{x.message}</div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
