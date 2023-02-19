import { HEARTBEAT_MESSAGE, OPEN_STEALTH_TAB_MESSAGE } from "./consts";
import { openStealthTab } from "./utils/background-utils";

console.log("background.ts");

chrome.alarms.create({ periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(() => {
  openStealthTab();
});

chrome.runtime.onMessage.addListener(
  async ({ messageType, data }, sender, response) => {
    console.log({ messageType, data });

    if (messageType === HEARTBEAT_MESSAGE) {
    }
    if (messageType === OPEN_STEALTH_TAB_MESSAGE) {
      openStealthTab();
    }
  }
);
