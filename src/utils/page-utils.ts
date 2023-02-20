import { BackgroundMessage, StorageKey } from "../consts";
import { simpleGet, writeLog } from "./shared-utils";

if (typeof window === "undefined") {
  throw new Error("Cannot use this in background");
}

// export function selectOrError<T>(selector: string, context = document): T {
//   const el: T | null = context.querySelector(selector) as T | null;

//   if (!el) {
//     throw new Error(`Could not match ${selector}`);
//   }

//   return el;
// }

async function getGeolocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
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
  });
}

export async function updateGeolocation() {
  writeLog("Gathering geolocation...");

  const geolocationHistory = await simpleGet(
    StorageKey.GEOLOCATION_HISTORY,
    []
  );

  const position = await getGeolocation();

  const { timestamp } = position;
  const { latitude, longitude, accuracy } = position.coords;

  writeLog("Writing geolocation");

  await chrome.storage.sync.set({
    [StorageKey.GEOLOCATION_HISTORY]: [
      { timestamp, latitude, longitude, accuracy },
      ...geolocationHistory,
    ].slice(0, 1000),
  });
}

export async function sendMessage(messageType: BackgroundMessage, data?: any) {
  return chrome.runtime.sendMessage({
    messageType,
    data,
  });
}
