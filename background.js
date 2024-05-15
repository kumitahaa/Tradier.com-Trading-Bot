
chrome.runtime.onInstalled.addListener(async ()=> {
  await chrome.storage.sync.clear(function() {
    console.log("Data cleared from Chrome Sync Storage");
  });
});


async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });
  return tabs[0];
}

let isExecuting = false; 

const startExecutionLoop = async () => {
  if (!isExecuting) {

    isExecuting = true; 
    while (isExecuting) {
        const activeTab = await getActiveTabURL();
        await chrome.tabs.sendMessage(activeTab.id, { action: "performMagic" });
        await new Promise((resolve) => setTimeout(resolve, 13000));   
    
      
    }

  }
};



  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

    if (message.action === 'startprocess') {
      console.log("startprocess received from popup.js");
      await startExecutionLoop(); // Set flag to false to stop the execution loop
    }
  
    if (message.action === 'stopProcess') {
      console.log("stopProcess received from popup.js");
      isExecuting = false; // Set flag to false to stop the execution loop
      await chrome.storage.sync.clear(function() {
              console.log("Data cleared from Chrome Sync Storage");
      });
    }
  })