import { StorageKey } from "../consts";
import { ILogEntry } from "../interfaces";

export async function simpleHas(key: StorageKey) {
  return (await simpleGet(key)) !== undefined;
}

export async function simpleGet(key: string, defaultValue?: any) {
  const result = await chrome.storage.sync.get([key]);
  return result[key] || defaultValue;
}

export async function simpleSet(key: string, value: any) {
  await chrome.storage.sync.set({
    [key]: value,
  });
}

export async function writeLog(message: string) {
  const logData = (await simpleGet(StorageKey.LOG, [])) as ILogEntry[];

  const newLog: ILogEntry = {
    timestamp: new Date().toISOString(),
    message,
  };

  await simpleSet(StorageKey.LOG, [newLog, ...logData]);
}

export async function clear() {
  simpleSet(StorageKey.GEOLOCATION_HISTORY, []);
  simpleSet(StorageKey.LOG, []);
}

export async function watch(
  key: StorageKey,
  callback: (x: chrome.storage.StorageChange) => void,
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
    callback({newValue: await simpleGet(key)});
  }
}
