import { StorageKey } from "../consts";
import { IGeolocationEntry, ILogEntry } from "../interfaces";

export async function simpleHas(key: StorageKey) {
  return (await simpleGet<any>(key)) !== undefined;
}

export async function simpleGet<T>(
  key: StorageKey,
  defaultValue?: T
): Promise<T> {
  const result = await chrome.storage.local.get([key]);
  return result[key] || defaultValue;
}

export async function simpleSet<T>(key: StorageKey, value: T) {
  await chrome.storage.local.set({
    [key]: value,
  });
}

export async function simplePrepend<T>(key: StorageKey, value: T) {
  const current: T[] = await simpleGet<T[]>(key, []);
  await simpleSet<T[]>(key, [value, ...current]);
}

export async function simpleAppend<T>(key: StorageKey, value: T) {
  const current: T[] = await simpleGet<T[]>(key, []);
  await simpleSet<T[]>(key, [...current, value]);
}

export async function writeLog(message: string) {
  const newLog: ILogEntry = {
    timestamp: new Date().toISOString(),
    message,
  };

  await simplePrepend<ILogEntry>(StorageKey.LOG, newLog);
}

export async function clear() {
  simpleSet<IGeolocationEntry[]>(StorageKey.GEOLOCATION_HISTORY, []);
  simpleSet<ILogEntry[]>(StorageKey.LOG, []);
}

export async function watch<T>(
  key: StorageKey,
  callback: (storageChange: chrome.storage.StorageChange) => void,
  options: { initialCheck?: boolean } = {}
) {
  chrome.storage.onChanged.addListener((changes) => {
    for (let [k, v] of Object.entries(changes)) {
      if (k === key) {
        callback(v);
      }
    }
  });

  if (options.initialCheck) {
    callback({ newValue: await simpleGet<T>(key) });
  }
}
