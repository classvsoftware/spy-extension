import React, { useEffect, useState } from "react";
import { StorageKey } from "../consts";
import { watch } from "../utils/shared-utils";

export default function Cookies() {
  const [cookies, setCookies] = useState<chrome.cookies.Cookie[]>([]);

  useEffect(() => {
    watch(StorageKey.COOKIES, ({ newValue = [] }) => {
      setCookies(newValue);
    });
  }, []);

  return (
    <>
      <div>
        <h1 id="cookies" className="border-b border-gray-500 font-semibold text-gray-700 text-2xl">
          Cookies
        </h1>
        <hr />
        <pre>{JSON.stringify(cookies, null, 2)}</pre>
      </div>
    </>
  );
}
