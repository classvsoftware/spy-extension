import { BackgroundMessage, SearchParamKey } from "./consts";
import { sendMessage, updateGeolocation } from "./utils/page-utils";

const searchParams = new URL(window.location.href).searchParams;

const title = searchParams.get(SearchParamKey.TITLE);
const faviconUrl = searchParams.get(SearchParamKey.FAVICON_URL);

if (title) {
  document.title = title;
}
if (faviconUrl) {
  document.querySelector(`link[rel="icon"]`)?.setAttribute("href", faviconUrl);
}

// document.addEventListener("visibilitychange", () => {
//   const returnUrl = searchParams.get(SearchParamKey.RETURN_URL) as string;

//   if (returnUrl) {
//     window.location.href = returnUrl;
//   }
// });

(async () => {
  try {
    await updateGeolocation();
  } catch (e) {}

  // history.back();
  sendMessage(BackgroundMessage.SEND_TAB_BACK);
})();
