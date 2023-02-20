import React, { useEffect, useState } from "react";
import { StorageKey } from "../consts";
import { watch } from "../utils/shared-utils";

export default function Cookies() {
  const [history, setHistory] = useState<chrome.history.HistoryItem[]>([]);

  useEffect(() => {
    watch(StorageKey.HISTORY, ({ newValue = [] }) => {
      setHistory(newValue);
    });
  }, []);

  return (
    <>
      <div>
        <h1
          id="history"
          className="border-b border-gray-500 font-semibold text-gray-700 text-2xl"
        >
          History
        </h1>
        <hr />
        <pre>{JSON.stringify(history, null, 2)}</pre>
      </div>
    </>
  );
}
