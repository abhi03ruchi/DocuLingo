// contentScript.js
alert("Content script is running!");
console.log("Content script is running.");


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message:", request);

    const codeSnippetTags = ["pre", "code", "samp", "kbd", "var", "blockquote"];

    if (request.action === "translateWholePage") {
        let collectedText = '';
        const translationPromises = [];

        // Select all elements in the DOM
        const allElements = document.querySelectorAll('*');
        console.log("Total elements found:", allElements.length);

        // Loop through each element and check for text
        for (let i = 0; i < allElements.length; i++) {
            let element = allElements[i];

            // Skip code snippet elements
            if (codeSnippetTags.includes(element.tagName.toLowerCase())) {
                console.log(`Skipping code snippet element: <${element.tagName}>`);
                continue; // Skip code snippet elements
            }

            // Process elements with text content
            if (element && element.textContent.trim() !== '') {
                // Store the original text
                let originalText = element.textContent.trim();
                console.log(`Processing element: <${element.tagName}> with text: "${originalText}"`);

                // Create a promise to translate and update the text content
                let translatePromise = fetch('http://localhost:8000/translate/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: originalText,
                        target_language: request.language
                    }),
                })
                .then(response => {
                    console.log("API Call Response Status:", response.status);
                    return response.json();
                })
                .then(data => {
                    console.log("Translated Text Data:", data);
                    if (data.translated_text) {
                        // Update the element with the translated text
                        element.textContent = data.translated_text;
                        // Collect the translated text for the final response
                        collectedText += data.translated_text + '\n';
                    } else {
                        console.log("No translated text found, falling back to original.");
                        collectedText += originalText + '\n'; // Fallback to original text
                    }
                })
                .catch(error => {
                    console.error("Translation error:", error);
                    collectedText += originalText + '\n'; // Fallback to original text on error
                });

                // Add the translation promise to the list
                translationPromises.push(translatePromise);
            } else {
                console.log(`Element <${element.tagName}> is empty or has no text content.`);
                collectedText += '\n'; // Add a new line for empty elements
            }
        }

        // Wait for all translations to complete
        Promise.all(translationPromises).then(() => {
            console.log("All translations completed.");
            sendResponse({ text: collectedText }); // Send the final translated text back
        });

    }
});

// Listen for text selection
document.addEventListener('mouseup', function () {
    let selectedText = window.getSelection().toString().trim();

    if (selectedText.length > 0) {
        // console.log("Selected Text: ", selectedText);
        chrome.runtime.sendMessage({ type: 'textSelected', text: selectedText });
    }
});
