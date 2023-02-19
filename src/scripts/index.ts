import { GEOLOCATION_HISTORY_STORAGE_KEY, SECTION_NAMES } from "./consts";
import { selectOrError } from "./utils/page-utils";

console.log("index.ts");

const SECTION_DATA = SECTION_NAMES.map((name) => ({
  name,
  href: name.replaceAll(/\W/g, "").toLocaleLowerCase(),
}));

selectOrError<HTMLElement>("#links").innerHTML = SECTION_DATA.map(
  ({ href, name }) => `<a href="#${href}">${name}</a>`
).join("");

selectOrError<HTMLElement>("#sections").innerHTML = SECTION_DATA.map(
  ({ href, name }) =>
    `<section id="${href}">
      <h1 class="border-b border-gray-500 font-semibold text-gray-700 text-2xl">${name}</h1>
      <div class="content"></div>
    </section>`
).join("");

// setInterval(() => chrome.runtime.sendMessage(HEARTBEAT_MESSAGE), 10000);

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log({ changes });
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === GEOLOCATION_HISTORY_STORAGE_KEY) {
      const locationList = newValue;
      const { latitude, longitude } = locationList[0].coords;

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
  }
});
