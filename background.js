// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'scanEmail') {
    // Handle email scanning
    sendResponse({status: 'scanning'});
  }
  return true;
});