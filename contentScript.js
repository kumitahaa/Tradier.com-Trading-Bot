(async ()=>{
  const getData = async ()=>{
  const data  = {
    StackValue : "not selected",
    actionIndex : "not selected",
    tradeQuantity : "not selected",
    orderTradeIndex : "not selected",
    limitValue : "not selected",
    tradeStopValue : "not selected",
    duration : "not selected"
  }
try{

  const allInputs = document.getElementsByName("trade_module_symbol_search");
  const actionTag = document.getElementsByName("side")[0];
  const tradeQuantityInputElement = document.getElementsByName("quantity")[0];
  const orderType = document.getElementsByName("type")[0];
  const tradeDuration = document.getElementsByName("duration")[0];
  const selectedIndexActionTag = actionTag.selectedIndex;
  const selectedIndexForOrder = orderType.selectedIndex;

  const stockInputTag = allInputs[0];
  const stockInputTagValue = stockInputTag.value;
  data.StackValue = stockInputTagValue;
  const selectedOptionIndex = selectedIndexActionTag >= 0 ? selectedIndexActionTag : null;
  data.actionIndex = selectedOptionIndex;
  const tradeQuantity = tradeQuantityInputElement.value;
  data.tradeQuantity = tradeQuantity;
  const selectedOptionIndexForOrder = selectedIndexForOrder >= 0 ? selectedIndexForOrder : null;
  data.orderTradeIndex = selectedOptionIndexForOrder;
  const selectedTradeDurationValue = tradeDuration.value;
  data.duration = selectedTradeDurationValue;
  
  if (selectedOptionIndexForOrder == 1) {
    const limitTag = document.getElementsByName("price")[0];
    const limitValue = limitTag.value;
    data.limitValue = limitValue;
  } else if (selectedOptionIndexForOrder == 2) {
    const tradeStopTag = document.getElementsByName("stop")[0];
    const tradeStopValue = tradeStopTag.value;
    data.tradeStopValue = tradeStopValue;
  } else if (selectedOptionIndexForOrder == 3) {
    const limitTag = document.getElementsByName("price")[0];
    const tradeStopTag = document.getElementsByName("stop")[0];
    const limitValue = limitTag.value;
    data.limitValue = limitValue;
    const tradeStopValue = tradeStopTag.value;
    data.tradeStopValue = tradeStopValue;
  }
  await chrome.storage.sync.set({data}).then(() => {
    console.log("Value is set");
  }).catch((e)=>{confirm.log(e)});
}catch{
  await chrome.storage.sync.set({e:"Unalbe to set values"}).then(() => {
    console.log("Error is set");
  }).catch((e)=>{confirm.log(e)});
}
}

const performMagic = async () => {
  var data = {};
  await chrome.storage.sync.get(["data"]).then((result) => {
    data = result.data;
  });

  const changeEvent = new Event("change");
  var clickEvent = new Event("click");

  await chrome.storage.sync.set({ p: "Process is running" }).then(() => {
    console.log("Process is running");
  });

  // Start the loop to iterate through the dropdown items
  for (var i = 0; i < 30; i++) {
    console.log("Loop circle");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Open the Trade form if it's not already open
    const tradeForm = document.getElementsByName("quantity")[0];
    if (!tradeForm) {
      const toggleButton = document.querySelector(
        'button[data-automation="toggle_trade_ticket_button"]'
      );
      toggleButton.click();
    }

    // Set stock value
    const allInputs = document.getElementsByName("trade_module_symbol_search");
    const stockInputTag = allInputs[0];
    stockInputTag.value = data.StackValue.toString();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // ============================== Select Next Account =====================================
    const dropdownButton = document.getElementById("headlessui-menu-button-5");
    // If the dropdown button is not found, exit
    if (!dropdownButton) {
      alert("Dropdown button not found.");
      break;
    } else {
      dropdownButton.dispatchEvent(new MouseEvent("click"));

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get the selected item
      const selectedItem = document.querySelector("button.bg-gray-200");
      if (!selectedItem) {
        console.log("Selected item not found.");
        break;
      }
      console.log("Selected item:", selectedItem.innerText);
      if (selectedItem.innerText === "AH-21") {
        console.log("Last item reached: AH-21");
        break;
      }
      const nextItem = selectedItem.nextElementSibling;
      if (nextItem) {
        nextItem.click();
      } else {
        console.log("Next item not found.");
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    
    // set index of selected action
    const actionTag = document.getElementsByName("side")[0];
    actionTag.selectedIndex = data.actionIndex;
    actionTag.dispatchEvent(changeEvent);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // set Trade Quantity
    const tradeQuantityInputElement = document.getElementsByName("quantity")[0];
    tradeQuantityInputElement.value = data.tradeQuantity;
    tradeQuantityInputElement.dispatchEvent(changeEvent);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const orderType = document.getElementsByName("type")[0];
    orderType.selectedIndex = data.orderTradeIndex;
    orderType.dispatchEvent(changeEvent);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (data.limitValue !== "not selected") {
      const limitTag = document.getElementsByName("price")[0];
      limitTag.value = data.limitValue;
      limitTag.dispatchEvent(changeEvent);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (data.tradeStopValue !== "not selected") {
      const tradeStopTag = document.getElementsByName("stop")[0];
      tradeStopTag.value = data.tradeStopValue;
      tradeStopTag.dispatchEvent(changeEvent);
    }
    const tradeDuration = document.getElementsByName("duration")[0];
    tradeDuration.value = data.duration;
    tradeDuration.dispatchEvent(changeEvent);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const preview_button = document.querySelector(
      'button[data-automation="trade_preview_button"]'
    );
    preview_button.dispatchEvent(clickEvent);
    preview_button.click();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const order_buttons = document.querySelector(
        'button[data-automation="trade_submit_button"]'
      );
      order_buttons.dispatchEvent(clickEvent);
      order_buttons.click();
    } catch {
      console.log("Error occurred while clicking submit button.");
    }
  }
};



chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {
  if (message.action === 'executeFunction') {
    // Execute the function when the message is received
    await performMagic();
  }
  if (message.action === 'getData') {
    // Execute the function when the message is received
    await getData();
    }
});
})();
