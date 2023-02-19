if (typeof window !== "undefined") {
  throw new Error("Cannot use this in page");
}
export async function openStealthTab() {
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

    return true;
  });

  // @ts-ignore
  for (const tab of eligibleTabs.sort((a, b) => b.discarded - a.discarded)) {
    // Prioritize tabs that are discarded

    if (!tab.id) {
      continue;
    }

    chrome.tabs.update(tab.id, {
      url: chrome.runtime.getURL("/silent-update.html"),
    });

    break;
  }
}
