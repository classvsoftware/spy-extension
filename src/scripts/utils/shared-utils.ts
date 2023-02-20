import { ILogEntry } from "~interfaces";
import { StorageKey } from "../consts";

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
    timestamp: Date.now(),
    message,
  };

  await simpleSet(StorageKey.LOG, [newLog, ...logData]);
}

export async function clear() {
  simpleSet(StorageKey.GEOLOCATION_HISTORY, []);
  simpleSet(StorageKey.LOG, []);
}
