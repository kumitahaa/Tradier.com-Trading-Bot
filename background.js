// Clear all data from Chrome Sync Storage when the extension loads
chrome.runtime.onInstalled.addListener(async ()=> {
  await chrome.storage.sync.clear(function() {
    console.log("Data cleared from Chrome Sync Storage");
  });
});

chrome.webNavigation.onCommitted.addListener(async (details)=> {
  // Check if the tab is being refreshed
  if (details.transitionType === "reload" && details.url.includes("tradier.com")) {
    await chrome.storage.sync.clear(function() {
      console.log("Data cleared from Chrome Sync Storage");
    });
  }
});