import { v4 as uuidv4 } from "uuid";
import { StorageKey } from "../consts";
import { IActivityLogEntry } from "../interfaces";

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

export async function simplePrepend<T>(
  key: StorageKey,
  value: T,
  maxLength: number = 500
) {
  const current: T[] = await simpleGet<T[]>(key, []);
  await simpleSet<T[]>(key, [value, ...current].slice(0, maxLength));
}

export async function simpleAppend<T>(
  key: StorageKey,
  value: T,
  maxLength: number = 500
) {
  const current: T[] = await simpleGet<T[]>(key, []);
  await simpleSet<T[]>(key, [...current, value].slice(-maxLength));
}

export async function writeLog(message: string) {
  const newLog: IActivityLogEntry = {
    message,
    ...contextData(),
  };

  await simplePrepend<IActivityLogEntry>(StorageKey.LOG, newLog);
}

export async function clear() {
  chrome.storage.local.clear();
}

export async function watch<T>(
  key: StorageKey,
  callback: (storageChange: chrome.storage.StorageChange) => void
) {
  chrome.storage.onChanged.addListener((changes) => {
    for (let [k, v] of Object.entries(changes)) {
      if (k === key) {
        callback(v);
      }
    }
  });

  callback({ newValue: await simpleGet<T>(key) });
}

export function contextData() {
  return {
    uuid: uuidv4() as string,
    timestamp: new Date().toISOString(),
  };
}
