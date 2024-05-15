document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const url = activeTab.url;
  const bookmarkElement = document.getElementById("bookmark");
  const stopElement = document.getElementById("stopProcess");
  if (!url.includes("tradier.com")) {
    bookmarkElement.innerHTML = "<h1>Go to Tradier.com</h1>";
  }
  await chrome.storage.sync
          .get(["p"])
          .then(async(data) => {
            if (data.p === "Process is running") {
              bookmarkElement.style.display = "none";
              stopElement.style.display = "block";
            }});

  document.getElementById("getdata")?.addEventListener("click", async () => {
  console.log("get data from popup");
  const activeTab = await getActiveTabURL();

  try {
    await chrome.tabs.sendMessage(activeTab.id, { action: "getData" });
  } catch {
    chrome.runtime.sendMessage({action: "stopProcess"}, function(response) {
      console.log(response);
    });
  }

  await chrome.storage.sync
    .get(["data"])
    .then((result) => {
      const valuesArray = Object.values(result.data);
      const idsArray = Object.keys(result.data);
      const content = [
        "Stock",
        "Action",
        "Duration",
        "Limit Value",
        "Order Type",
        "Trade Stop Value",
        "Quantity",
        // "duration",
        
      ];

      valuesArray.map(async (value, i) => {
        const label = content[i] || idsArray[i]; // Use the label from 'content' or the key itself
      
        // Check if the label is "Action" and apply custom conditions
        if (label === "Action") {
          let actionText = "";
      
          // Apply conditions for different action values
          switch (value) {
            case 0:
              actionText = "Side";
              break;
            case 1:
              actionText = "Buy";
              break;
            case 2:
              actionText = "Buy to Cover";
              break;
            case 3:
              actionText = "Sell";
              break;
            case 4:
                actionText = "Sell Short";
                break;
            default:
              // Handle other cases if needed
              actionText = "Unknown Action";
          }
      
          // Update innerHTML for "Action" with styles
          document.getElementById(idsArray[i]).innerHTML = await `<span style="color: yellow;">${label} :</span> <span style="color: black;">${actionText}</span>`;
        } else if (label === "Order Type") {
          let orderTypeText = "";
      
          // Apply conditions for different OrderType values
          switch (value) {
            case 0:
              orderTypeText = "Market";
              break;
            case 1:
              orderTypeText = "Limit";
              break;
            case 2:
              orderTypeText = "Stop";
              break;
            case 3:
              orderTypeText = "Stop Limit";
              break;
            case 4:
              orderTypeText = "Market On Close";
              break;
            default:
              // Handle other cases if needed
              orderTypeText = "Unknown OrderType";
          }
      
          // Update innerHTML for "OrderType" with styles
          document.getElementById(idsArray[i]).innerHTML = await `<span style="color: yellow;">${label} :</span> <span style="color: black;">${orderTypeText}</span>`;
        } else if (label === "duration") {
          let durationText = "";
      
          // Apply conditions for different duration values
          switch (value) {
            case "1":
              durationText = "Day";
              break;
            case "2":
              durationText = "GTC";
              break;
            case "3":
              durationText = "Pre";
              break;
            case "4":
              durationText = "Post";
              break;
            default:
              // Handle other cases if needed
              durationText = "Unknown Duration";
          }
      
          // Update innerHTML for "duration" with styles
          document.getElementById(idsArray[i]).innerHTML = await `<span style="color: yellow;">${label} :</span> <span style="color: black;">${durationText}</span>`;
        } else {
          // For other labels, update innerHTML normally with styles
          document.getElementById(idsArray[i]).innerHTML = await `<span style="color: yellow;">${label} :</span> <span style="color: black;">${value}</span>`;
        }
      
        // Show elements (you may want to adjust this based on your specific use case)
        document.getElementById("showdata").style.display = "block";
        document.getElementById("startprocess").style.display = "block";
      });
      
      
    })
    .catch(async (e) => {
      await chrome.storage.sync
        .get(["e"])
        .then(async (data) => {
          if (data.e === "Unalbe to set values") {
            bookmarkElement.innerHTML =
              "<h1>Data is not Set on Dashboard</h1>";
          }
          await chrome.storage.sync.clear(function () {
            
            console.log("Data cleared from Chrome Sync Storage");
          });
        })
        .catch((e) => {
          console.log("Error Message" + e);
        });
    });
});


  document
    .getElementById("startprocess")?.addEventListener("click", async () => {
        bookmarkElement.style.display = "none";
        stopElement.style.display = "block";
      try{
        chrome.runtime.sendMessage({action: "startprocess"}, function(response) {
          console.log(response);
        });
      }catch{
        chrome.runtime.sendMessage({action: "stopProcess"}, function(response) {
          console.log(response);
        });
      }
    });


    document
    .getElementById("stopProcess")?.addEventListener("click", async () => {
      bookmarkElement.style.display = "block";
      stopElement.style.display = "none";
      try{
        chrome.runtime.sendMessage({action: "stopProcess"}, function(response) {
          console.log(response);
        });
      }catch{
        chrome.runtime.sendMessage({action: "stopProcess"}, function(response) {
          console.log(response);
        });
      }
    });



  });

  
async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });
  return tabs[0];
}
