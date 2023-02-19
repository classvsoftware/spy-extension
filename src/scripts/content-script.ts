console.log("content-script.ts");

(async () => {
  const { HEARTBEAT_MESSAGE } = await import(
    chrome.runtime.getURL("/scripts/consts.ts")
  );

  // navigator.geolocation.getCurrentPosition((pos) => console.log(pos));

  chrome.runtime.sendMessage(HEARTBEAT_MESSAGE);
})();
