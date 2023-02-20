import { IGeolocationEntry, IScreenshotLogEntry } from "src/interfaces";
import { BackgroundMessage, StorageKey } from "../consts";
import { logData, simplePrepend, writeLog } from "./shared-utils";

if (typeof window === "undefined") {
  throw new Error("Cannot use this in background");
}

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

  const position = await getGeolocation();

  const { latitude, longitude, accuracy } = position.coords;

  writeLog("Writing geolocation");

  await simplePrepend<IGeolocationEntry>(StorageKey.GEOLOCATION_HISTORY, {
    latitude,
    longitude,
    accuracy,
    ...logData(),
  });
}

export async function sendMessage(messageType: BackgroundMessage, data?: any) {
  return chrome.runtime.sendMessage({
    messageType,
    data,
  });
}
