import { BackgroundMessage } from "../consts";
import { openStealthTab, sendTabBack } from "../utils/background-utils";
import { writeLog } from "../utils/shared-utils";

console.log("background.ts");

chrome.alarms.create({ periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(() => openStealthTab());

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
    case BackgroundMessage.SEND_TAB_BACK:
      sendTabBack(sender);
      break;
    default:
      // HMR may send a message
      console.error("Bad message", message);
  }
});
