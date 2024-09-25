// background.js
let selectedText = '';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'textSelected') {
        selectedText = message.text;
        console.log("Text stored in background: ", selectedText);
    }
    
    if (message.type === 'getText') {
        sendResponse({ text: selectedText });
    }

    return true;  
});
