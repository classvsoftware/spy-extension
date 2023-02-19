import { LOG_STORAGE_KEY } from "../consts";

export async function simpleGet(key: string, defaultValue?: any) {
  const result = await chrome.storage.sync.get([key]);
  console.log({ result });
  return result[key] || defaultValue;
}

export async function simpleSet(key: string, value: any) {
  await chrome.storage.sync.set({
    [key]: value,
  });
}

export async function writeLog(message: any) {
  const logData = (await simpleGet(LOG_STORAGE_KEY, [])) as any[];

  await simpleSet(LOG_STORAGE_KEY, [message, ...logData]);
}
