// contentscript.js
document.addEventListener('mouseup', function () {
    let selectedText = window.getSelection().toString().trim();

    if (selectedText.length > 0) {
        console.log("Selected Text: ", selectedText);
        chrome.runtime.sendMessage({ type: 'textSelected', text: selectedText });
    }
});
