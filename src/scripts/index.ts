import { IGeolocationEntry, ILogEntry } from "~interfaces";
import { BackgroundMessage, SECTION_NAMES, StorageKey } from "./consts";
import {
  selectOrError,
  sendMessage,
  updateGeolocation,
} from "./utils/page-utils";
import { clear, simpleGet, writeLog } from "./utils/shared-utils";

console.log("index.ts");

const SECTION_DATA = SECTION_NAMES.map((name) => ({
  name,
  href: name.replaceAll(/\W/g, "").toLocaleLowerCase(),
}));

// selectOrError<HTMLElement>("#links").innerHTML = SECTION_DATA.map(
//   ({ href, name }) => `<a href="#${href}">${name}</a>`
// ).join("");

selectOrError<HTMLElement>("#sections").innerHTML = SECTION_DATA.map(
  ({ href, name }) =>
    `<section id="${href}">
      <h1 class="border-b border-gray-500 font-semibold text-gray-700 text-2xl">${name}</h1>
      <div class="content"></div>
    </section>`
).join("");

selectOrError<HTMLButtonElement>("#stealth-tab").addEventListener("click", () =>
  sendMessage(BackgroundMessage.OPEN_STEALTH_TAB)
);
selectOrError<HTMLButtonElement>("#reset").addEventListener("click", () =>
  clear()
);
selectOrError<HTMLButtonElement>("#test-log").addEventListener("click", () =>
  writeLog("Test log")
);
selectOrError<HTMLButtonElement>("#capture-geolocation").addEventListener(
  "click",
  () => updateGeolocation()
);

function updateGeolocationSection(newValue: IGeolocationEntry[]) {
  if (newValue.length === 0) {
    return;
  }

  const { latitude, longitude } = newValue[0];

  const params = new URLSearchParams({
    bbox: `${longitude + 0.01},${latitude - 0.01},${longitude - 0.01},${
      latitude + 0.01
    }`,
    layer: "mapnik",
    marker: `${latitude},${longitude}`,
  });

  const src = new URL(
    `https://www.openstreetmap.org/export/embed.html?${params.toString()}`
  ).toString();

  selectOrError<HTMLElement>(`#geolocation .content`).innerHTML = `
    <div>Coordinates: ${latitude}, ${longitude}</div>
    <iframe
        width="425"
        height="350"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        src="${src}"
        style="border: 1px solid black"
      >
    </iframe>
  `;
}

function updateLogSection(newValue: ILogEntry[]) {
  selectOrError<HTMLElement>(`#log`).innerHTML = newValue
    .map((x: ILogEntry) => `<div>${x.timestamp}: ${x.message}</div>`)
    .join("");
}

(async () => {
  updateGeolocationSection(await simpleGet(StorageKey.GEOLOCATION_HISTORY));
  updateLogSection(await simpleGet(StorageKey.LOG));
})();

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    switch (key) {
      case StorageKey.GEOLOCATION_HISTORY:
        updateGeolocationSection(newValue);
        break;
      case StorageKey.LOG:
        updateLogSection(newValue);
        break;
      default:
        break;
    }
  }
});
