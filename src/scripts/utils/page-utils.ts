import { GEOLOCATION_HISTORY_STORAGE_KEY } from "../consts";
import { simpleGet } from "./shared-utils";

if (typeof window === "undefined") {
  throw new Error("Cannot use this in background");
}

export function selectOrError<T>(selector: string, context = document): T {
  const el: T | null = context.querySelector(selector) as T | null;

  if (!el) {
    throw new Error(`Could not match ${selector}`);
  }

  return el;
}

export async function getGeolocation(): Promise<GeolocationPosition> {
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
  const geolocationHistory = await simpleGet(
    GEOLOCATION_HISTORY_STORAGE_KEY,
    []
  );

  const position = await getGeolocation();

  const { timestamp } = position;
  const { latitude, longitude, accuracy } = position.coords;

  await chrome.storage.sync.set({
    [GEOLOCATION_HISTORY_STORAGE_KEY]: [
      { timestamp, latitude, longitude, accuracy },
      ...geolocationHistory,
    ].slice(0, 1000),
  });
}
