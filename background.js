let activeTabId = null;
let startTime = null;

chrome.tabs.onActivated.addListener(activeInfo => {
  if (startTime && activeTabId) {
    chrome.tabs.get(activeTabId, tab => {
      const timeSpent = (Date.now() - startTime) / 1000;

      fetch('http://localhost:5000/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: tab.url,
          duration: timeSpent,
          category: getCategory(tab.url)
        })
      });
    });
  }
  activeTabId = activeInfo.tabId;
  startTime = Date.now();
});

function getCategory(url) {
  if (url.includes("github") || url.includes("leetcode")) return "productive";
  if (url.includes("facebook") || url.includes("youtube")) return "unproductive";
  return "neutral";
}
