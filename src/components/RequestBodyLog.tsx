import React, { useEffect, useState } from "react";
import { StorageKey } from "../consts";
import { IRequestData } from "../interfaces";
import { watch } from "../utils/shared-utils";

export default function RequestBodyLog() {
  const [logEntries, setLogEntries] = useState<IRequestData[]>([]);

  useEffect(() => {
    watch(StorageKey.REQUEST_BODY_LOG, ({ newValue = [] }) => {
      setLogEntries(newValue);
    });
  }, []);

  return (
    <>
      <div>
        <h1
          id="request-body-log"
          className="border-b border-gray-500 font-semibold text-gray-700 text-2xl"
        >
          Request Body Log
        </h1>
        <hr />
        <div
          className="grid grid-cols-2 gap-2"
          style={{ gridTemplateColumns: "auto 1fr" }}
        >
          {logEntries.map((x) => (
            <React.Fragment key={x.uuid}>
              <div>[{x.timestamp}]</div>
              <pre>{JSON.stringify(x.request, null, 2)}</pre>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
