(async ()=>{

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
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

  data.totalTradesApplied = 0;
  await chrome.storage.sync.set({data}).then(() => {
    console.log("Value is set");
  }).catch((e)=>{confirm.log(e)});
}catch{
  await chrome.storage.sync.set({e:"Unable to set values"}).then(() => {
    console.log("Error is set");
  }).catch((e)=>{confirm.log(e)});
}
}

const performMagic = async () => {
  var data = {};
  await chrome.storage.sync.get(["data"]).then((result) => {
    data = result.data;
    data.totalTradesApplied = (data.totalTradesApplied || 0) + 1;
  });


  const changeEvent = new Event("change");
  var clickEvent = new Event("click");

  await chrome.storage.sync.set({ p: "Process is running" }).then(() => {
    console.log("Process is running");
    console.log("Current Account is: " + data.totalTradesApplied)
  });


  await sleep(1000)

    var tradeTicket = document.querySelector('[data-automation="trade_ticket"]');
    if (!tradeTicket){
        // If not visible, perform actions to toggle it
        console.log('Trade ticket is not visible on the page, toggling it...');
  
        await sleep(1000)
        
        var toggleButton = document.querySelector('button[data-automation="toggle_trade_ticket_button"]');
        if (toggleButton) {
            toggleButton.click();
            console.log('Trade ticket toggled');
            await sleep(1000)
            tradeTicket = document.querySelector('[data-automation="trade_ticket"]');
        } else {
            console.log('Toggle button not found');
        }
    }
    // Check if the trade ticket element is visible
    if (tradeTicket && tradeTicket.offsetHeight > 0) {
        // If visible, perform desired actions here
        console.log('Trade ticket is visible on the page');
    

    // Set stock value
    const allInputs = document.getElementsByName("trade_module_symbol_search");
    const stockInputTag = allInputs[0];


    // To Simulate key press in Symbol field
    const typeStockInput = (stockInputTag, text) => {
      // stockInputTag.dispatchEvent(new Event('focus'));
      stockInputTag.value = text;
      stockInputTag.dispatchEvent(new Event('input', { bubbles: true }));
      stockInputTag.dispatchEvent(new Event('change', { bubbles: true }));
    };
    typeStockInput(stockInputTag, data.StackValue.toString());
    console.log('=== Stock Input');


    await sleep(1000)
    // Press Search button to get the Symbol
    const searchButton = document.getElementsByClassName("button-outline muted icon-only rounded-l-none rounded-r-md border-l-0 px-4 py-2")[0]
    searchButton.click()
    console.log('=== Search Button');


    await sleep(1000)

     // ============================== Add Values and Submit =====================================
    // set index of selected action
    const actionTag = document.getElementsByName("side")[0];
    actionTag.selectedIndex = data.actionIndex;
    actionTag.dispatchEvent(changeEvent);
    console.log('=== Action Tag');

    await sleep(1000)

    // set Trade Quantity
    const tradeQuantityInputElement = document.getElementsByName("quantity")[0];

      //  Simulate Key Press for Quantity
    const typeQuantity = (tradeQuantityInputElement, text) => {
      tradeQuantityInputElement.dispatchEvent(new Event('focus'));
      tradeQuantityInputElement.value = text;
      tradeQuantityInputElement.dispatchEvent(new Event('input', { bubbles: true }));
      tradeQuantityInputElement.dispatchEvent(new Event('change', { bubbles: true }));
    };

    typeQuantity(tradeQuantityInputElement, data.tradeQuantity.toString());
    console.log('=== Trade Quantity');

    // await sleep(1000)

    const orderType = document.getElementsByName("type")[0];
    orderType.selectedIndex = data.orderTradeIndex;
    orderType.dispatchEvent(changeEvent);
    console.log('=== Order Type');



    if (data.limitValue !== "not selected") {
      const limitTag = document.getElementsByName("price")[0];

      //  Simulate Key Press for Trade Limit Price

      const typeLimitPrice = (limitTag, text) => {
        limitTag.dispatchEvent(new Event('focus'));
        limitTag.value = text;
        limitTag.dispatchEvent(new Event('input', { bubbles: true }));
        limitTag.dispatchEvent(new Event('change', { bubbles: true }));
      };

      typeLimitPrice(limitTag, data.limitValue.toString());
      console.log('=== Limit Price');


      // await sleep(1000)
    }

    if (data.tradeStopValue !== "not selected") {
      const tradeStopTag = document.getElementsByName("stop")[0];
      
      //  Simulate Key Press for Trade Stop Price
      const typeStopPrice = (tradeStopTag, text) => {
        tradeStopTag.dispatchEvent(new Event('focus'));
        tradeStopTag.value = text;
        tradeStopTag.dispatchEvent(new Event('input', { bubbles: true }));
        tradeStopTag.dispatchEvent(new Event('change', { bubbles: true }));
      };

      typeStopPrice(tradeStopTag, data.tradeStopValue.toString());
      console.log('=== Stop Price');

    }
    const tradeDuration = document.getElementsByName("duration")[0];
    tradeDuration.value = data.duration;
    tradeDuration.dispatchEvent(changeEvent);
    console.log('=== Trade Duration');



    try {
      const order_buttons = document.querySelector('button[data-automation="trade_submit_button"]');
      
      await chrome.storage.sync.set({ data })
      console.log("Counter Updated");

      order_buttons.dispatchEvent(clickEvent);
      order_buttons.click();
      console.log("=== Order Placed ===")
      
    await new Promise((resolve) => setTimeout(resolve, 1500));

  }catch {
    console.log("Error occurred while clicking submit button.");
  }
    
      // ============================== Select Next Account =====================================
    var dropdownButton = document.getElementById("headlessui-menu-button-3");
    // If the dropdown button is not found, exit
    if (!dropdownButton) {
      console.log("We can't find the dropDown. Traded: " + data.totalTradesApplied + " accounts.")
      await new Promise((resolve) => setTimeout(resolve, 2000));   
      dropdownButton = document.getElementById("headlessui-menu-button-5");

    }
    if (dropdownButton) {
      dropdownButton.dispatchEvent(new MouseEvent("click"));
      await sleep(1000)

      // Get the selected item
      var selectedItem = document.querySelector("button.bg-gray-200");
      if (!selectedItem) {
        console.log("Selected item not found.");
        await sleep(1000)
        selectedItem = document.querySelector("button.bg-gray-200");
      }
      if(selectedItem){
      console.log("Selected item:", selectedItem.innerText);
    
      const nextItem = selectedItem.nextElementSibling;
      if (nextItem) {
        nextItem.click();
   

      } else {
        // console.log("");
        await chrome.storage.sync.clear(function() {
          console.log("Next item not found. Traded: " + data.totalTradesApplied + " accounts.")
        alert("Next item not found. Traded: " + data.totalTradesApplied + " accounts.")
        stop();
      })
        
      }
    }
    }

    
  } else {
    if (!tradeTicket){
    // If not visible, perform actions to toggle it
    console.log('Trade ticket is not visible on the page, toggling it...');
    toggleButton = document.querySelector('button[data-automation="toggle_trade_ticket_button"]');
    if (toggleButton) {
        toggleButton.click();
        console.log('Trade ticket toggled');
        await sleep(1000)
    } else {
        console.log('Toggle button not found');
    }
}
  }


};



chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {
  if (message.action === 'performMagic') {
    // Execute the function when the message is received
    await performMagic();
  }
  if (message.action === 'getData') {
    // Execute the function when the message is received
    await getData();
    }
});


function stop(){
  chrome.runtime.sendMessage({action: "stopProcess"}, function(response) {
    console.log(response);
    // document.getElementById("stopprocess").click()
  });
}

})();
