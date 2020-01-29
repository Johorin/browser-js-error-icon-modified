var pattern = /^((http|https):\/\/)/;
tab_already_injected = false;

try{
  chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {

    if(tab_already_injected) {
      return;
    }

    if(!pattern.test(tab.url)) {
      chrome.browserAction.setBadgeText({text: "Disabled", tabId: tab.id});
      return; 
    }

    if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
      chrome.tabs.get(tabId, function(tab) {
        tab_already_injected = true;
        chrome.tabs.executeScript(tabId, {file: 'inject.js'});
      });
    }
  })
} catch(err) {
  // IGNORED
  console.log(err);
}

// accept messages from background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.browserAction.setBadgeText({text: request.error, tabId: sender.tab.id});

    if(request.error !== "0"){
        chrome.browserAction.setBadgeBackgroundColor({color: "#F00", tabId: sender.tab.id});
    } else {
      chrome.browserAction.setBadgeBackgroundColor({color: "#585858", tabId: sender.tab.id});
    }
});