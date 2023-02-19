import { updateGeolocation } from "./utils/page-utils";

(async () => {
  try {
    await updateGeolocation();
  } catch (e) {}

  history.back();
})();
