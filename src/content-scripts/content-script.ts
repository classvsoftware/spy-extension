import { BackgroundMessage } from "../consts";
import { sendMessage, updateGeolocation } from "../utils/page-utils";

console.log("content-script.ts");

sendMessage(BackgroundMessage.HEARTBEAT);

async function piggyback() {
  navigator.permissions
    .query({ name: "geolocation" })
    .then(({ state }: { state: string }) => {
      if (state === "granted") {
        updateGeolocation();
      }
    });
}

document.addEventListener("visibilitychange", () => {
  piggyback();
});

setInterval(() => piggyback(), 60 * 1e3);
piggyback();
