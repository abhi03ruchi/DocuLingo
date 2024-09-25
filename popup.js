// popup.js
document.addEventListener('DOMContentLoaded', function () {
    // Fetch the selected text from the background script
    chrome.runtime.sendMessage({ type: 'getText' }, function (response) {
        if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
            document.getElementById('output').innerText = 'No text selected.';
            return;
        }

        // Display the selected text in the "output" box
        const outputElement = document.getElementById('output');
        if (response && response.text) {
            outputElement.innerText = response.text;
        } else {
            outputElement.innerText = 'No text selected.';
        }
    });

    // Handle the translation when the button is clicked
    document.getElementById('translateButton').addEventListener('click', function () {
        const textToTranslate = document.getElementById('output').innerText;

        if (textToTranslate && textToTranslate !== 'No text selected.') {
            // Call the translation API
            fetch('https://your-translation-api-endpoint.com/translate', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer your-api-key'  // Your API key here
                },
                body: JSON.stringify({
                    text: textToTranslate,
                    targetLanguage: 'fr'  // Example: translate to French
                })
            })
                .then(response => response.json())
                .then(data => {
                    // Assuming the translated text is in the 'translatedText' field of the response
                    document.getElementById('to').innerText = data.translatedText || 'Translation failed.';
                })
                .catch(error => {
                    console.error('Error during translation:', error);
                    document.getElementById('to').innerText = 'Error occurred during translation.';
                });
        } else {
            document.getElementById('to').innerText = 'No text to translate.';
        }
    });
});
