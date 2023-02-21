import React, { useEffect, useState } from "react";
import { StorageKey } from "../consts";
import { IActivityLogEntry } from "../interfaces";
import { watch } from "../utils/shared-utils";

export default function Log() {
  const [logEntries, setLogEntries] = useState<IActivityLogEntry[]>([]);

  useEffect(() => {
    watch(StorageKey.LOG, ({ newValue = [] }) => {
      setLogEntries(newValue);
    });
  }, []);

  return (
    <>
      <div>
        <h1 className="border-b border-gray-500 font-semibold text-gray-700 text-2xl">
          Extension Activity Log
        </h1>
        <hr />
        <div
          className="grid grid-cols-2 gap-2"
          style={{ gridTemplateColumns: "auto 1fr" }}
        >
          {logEntries.map((x) => (
            <React.Fragment key={x.uuid}>
              <div>[{x.timestamp}]</div>
              <div>{x.message}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
