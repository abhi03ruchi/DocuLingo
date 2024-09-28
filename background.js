// background.js
// Store selected text per tab ID
let selectedTextPerTab = {};

// Listener for handling messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const tabId = sender.tab ? sender.tab.id : null;

    // Handle text selection
    if (message.type === 'textSelected' && tabId) {
        selectedTextPerTab[tabId] = message.text;
        console.log(`Text stored in background for tab ${tabId}:`, message.text);
    }

    // Handle request for selected text
    if (message.type === 'getText' && tabId) {
        sendResponse({ text: selectedTextPerTab[tabId] || '' });
    }

    // Reset selected text when popup opens
    if (message.type === 'popupOpened' && tabId) {
        selectedTextPerTab[tabId] = ''; // Clear the selected text for this tab
        console.log(`Text cleared for tab ${tabId} as popup opened`);
    }

    return true;
});

// Clear selectedText when a new tab is activated
chrome.tabs.onActivated.addListener(activeInfo => {
    const tabId = activeInfo.tabId;
    selectedTextPerTab[tabId] = ''; // Clear selected text when the user switches tabs
    console.log(`Text cleared for tab ${tabId} as it became active.`);
});
