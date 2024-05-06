document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const url = activeTab.url;
  const bookmarkElement = document.getElementById("bookmark");
  if (!url.includes("tradier.com")) {
    bookmarkElement.innerHTML = "<h1>Go to Tradier.com</h1>";
  }
  await chrome.storage.sync
          .get(["p"])
          .then(async(data) => {
            if (data.p === "Process is running") {
              bookmarkElement.innerHTML ="<h1>Process is running <br/>_____________<br/><br/>To Stop The Process, Refresh Tab</h1>";
            }});

  document.getElementById("getdata")?.addEventListener("click", async () => {
  console.log("get data from popup");
  const activeTab = await getActiveTabURL();

  try {
    await chrome.tabs.sendMessage(activeTab.id, { action: "getData" });
  } catch {
    bookmarkElement.innerHTML = "<h1>Please Refresh Web Page</h1>";
  }

  await chrome.storage.sync
    .get(["data"])
    .then((result) => {
      const valuesArray = Object.values(result.data);
      const idsArray = Object.keys(result.data);
      const content = [
        "Stock",
        "Action",
        "duration",
        "Limit Value",
        "Order Type",
        "Quantity",
        "Trade Stop Value",
        "Duration",
        
        
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
        } else if (label === "Duration") {
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
      document.getElementById("showdata").style.display = "none";
      bookmarkElement.innerHTML ="<h1>Process is running <br/>________<br/>To Stop The Process, Refresh Tab</h1>";
      try{
        const activeTab = await getActiveTabURL();
        await chrome.tabs.sendMessage(activeTab.id, { action: "executeFunction" });
      }catch{
        bookmarkElement.innerHTML = "<h1>Please Refresh Web Page</h1>"
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
