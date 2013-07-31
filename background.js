chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
    if (tab.url.indexOf("opera://") == -1){
        chrome.pageAction.show(tabID);
    }
});
