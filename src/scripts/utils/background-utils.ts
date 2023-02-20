import { SearchParamKey } from "../consts";
import { writeLog } from "./shared-utils";

if (typeof window !== "undefined") {
  throw new Error("Cannot use this in page");
}
export async function openStealthTab() {
  writeLog("Attempting to open stealth tab");

  const tabs = await chrome.tabs.query({});

  const eligibleTabs = tabs.filter((tab) => {
    // User is looking at this tab
    if (tab.active) {
      return false;
    }

    // Tab is probably important
    if (tab.pinned) {
      return false;
    }

    // Tab is playing audio, don't mess with it
    if (tab.audible) {
      return false;
    }

    // Want to use a tab that's finished loading
    if (tab.status !== "complete") {
      return false;
    }

    // Must have url and id
    if (!tab.id || !tab.url) {
      return false;
    }

    if (new URL(tab.url).protocol === "chrome-extension:") {
      return false;
    }

    return true;
  });

  // for (const tab of eligibleTabs.sort((a, b) => {
  //   // @ts-ignore
  //   return b.discarded - a.discarded;
  // })) {
  // Prioritize tabs that are discarded

  for (const tab of eligibleTabs) {
    const searchParams = new URLSearchParams({
      [SearchParamKey.RETURN_URL]: tab.url as string,
      [SearchParamKey.FAVICON_URL]: tab.favIconUrl || "",
      [SearchParamKey.TITLE]: tab.title || "",
    });

    const url = `${chrome.runtime.getURL(
      "/stealth-tab.html"
    )}?${searchParams.toString()}`;

    console.log({ url });

    await chrome.tabs.update(tab.id as number, {
      url,
      active: false,
    });

    await writeLog("Found eligible tab host for stealth tab");

    return;
  }

  await writeLog("No eligible tab host for stealth tab");
}

export async function sendTabBack(sender: chrome.runtime.MessageSender) {
  console.log(sender.url);

  if (!sender.url) {
    console.error("Bad sender url");
    return;
  }

  const returnUrl = new URL(sender.url).searchParams.get(
    SearchParamKey.RETURN_URL
  );

  if (!returnUrl) {
    console.error("Cannot get return url");
    return;
  }

  return chrome.tabs.update({
    url: returnUrl,
    active: false,
  });
}
